"""API REST do ERP Web.

Este módulo é independente do programa de terminal (main.py). Ele expõe os
dados do mesmo MySQL para que o frontend se comunique apenas via HTTP/JSON.
"""

from decimal import Decimal, InvalidOperation
import logging
import re

from flask import Flask, jsonify, request
from mysql.connector import Error

from banco import conectar_banco, fechar_banco


app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
logging.basicConfig(level=logging.INFO)

ESTADOS_VALIDOS = {
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
    "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
    "RR", "SC", "SP", "SE", "TO",
}
STATUS_VALIDOS = {"Ativo", "Inativo"}


@app.after_request
def permitir_cors(resposta):
    """Permite o frontend local durante o desenvolvimento sem expor o banco."""
    resposta.headers["Access-Control-Allow-Origin"] = "*"
    resposta.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resposta.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return resposta


@app.route("/api/<path:_caminho>", methods=["OPTIONS"])
def opcoes(_caminho):
    return "", 204


def resposta_sucesso(data=None, mensagem=None, status=200):
    corpo = {"success": True, "data": data}
    if mensagem:
        corpo["message"] = mensagem
    return jsonify(corpo), status


def resposta_erro(mensagem, status=400):
    return jsonify({"success": False, "message": mensagem}), status


def obter_dados_json():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return None, resposta_erro("Envie um JSON válido no corpo da requisição.")
    return dados, None


def normalizar_numero(valor, campo, inteiro=False):
    try:
        numero = int(valor) if inteiro else Decimal(str(valor))
    except (InvalidOperation, TypeError, ValueError):
        return None, f"{campo} deve ser um número válido."

    if numero < 0:
        return None, f"{campo} não pode ser negativo."
    return numero, None


def validar_cliente(dados):
    cliente = {
        "company": str(dados.get("company", "")).strip(),
        "name": str(dados.get("name", "")).strip(),
        "cnpj": str(dados.get("cnpj", "")).strip(),
        "state": str(dados.get("state", "")).strip().upper(),
        "status": str(dados.get("status", "")).strip(),
    }

    if not cliente["company"]:
        return None, "Razão social é obrigatória."
    if not cliente["name"]:
        return None, "Nome fantasia é obrigatório."

    cnpj_numeros = re.sub(r"\D", "", cliente["cnpj"])
    if len(cnpj_numeros) != 14:
        return None, "CNPJ deve conter 14 dígitos."
    cliente["cnpj"] = (
        f"{cnpj_numeros[:2]}.{cnpj_numeros[2:5]}.{cnpj_numeros[5:8]}/"
        f"{cnpj_numeros[8:12]}-{cnpj_numeros[12:]}"
    )

    if cliente["state"] not in ESTADOS_VALIDOS:
        return None, "Estado inválido."
    if cliente["status"] not in STATUS_VALIDOS:
        return None, "Status inválido."

    cliente["revenue"], erro = normalizar_numero(
        dados.get("revenue", 0), "Faturamento"
    )
    if erro:
        return None, erro
    return cliente, None


def validar_produto(dados):
    produto = {
        "name": str(dados.get("name", "")).strip(),
        "category": str(dados.get("category", "")).strip(),
        "brand": str(dados.get("brand", "")).strip(),
    }
    for campo, rotulo in (("name", "Nome"), ("category", "Categoria"), ("brand", "Marca")):
        if not produto[campo]:
            return None, f"{rotulo} é obrigatório(a)."

    produto["stock"], erro = normalizar_numero(
        dados.get("stock"), "Estoque", inteiro=True
    )
    if erro:
        return None, erro
    produto["price"], erro = normalizar_numero(dados.get("price"), "Preço")
    if erro:
        return None, erro
    return produto, None


def serializar_cliente(linha):
    return {
        "id": linha["id"],
        "cnpj": linha["cnpj"],
        "company": linha["razao_social"],
        "name": linha["nome_fantasia"],
        "state": linha["estado"],
        "status": linha["status"],
        "revenue": float(linha["faturamento"] or 0),
    }


def serializar_produto(linha):
    return {
        "id": linha["id"],
        "name": linha["nome"],
        "category": linha["categoria"],
        "brand": linha["marca"],
        "stock": linha["estoque"],
        "price": float(linha["preco"] or 0),
    }


def consultar_um(cursor, tabela, identificador):
    cursor.execute(f"SELECT * FROM {tabela} WHERE id = %s", (identificador,))
    return cursor.fetchone()


def abrir_conexao():
    conexao = conectar_banco()
    if not conexao:
        return None, resposta_erro("Não foi possível conectar ao banco de dados.", 503)
    return conexao, None


@app.get("/api/health")
def health_check():
    conexao, erro = abrir_conexao()
    if erro:
        return erro
    fechar_banco(conexao)
    return resposta_sucesso({"status": "online"})


@app.get("/api/clientes")
def listar_clientes():
    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM clientes ORDER BY id")
        return resposta_sucesso([serializar_cliente(linha) for linha in cursor.fetchall()])
    except Error:
        app.logger.exception("Erro ao listar clientes")
        return resposta_erro("Não foi possível carregar os clientes.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


@app.post("/api/clientes")
def criar_cliente():
    dados, erro = obter_dados_json()
    if erro:
        return erro
    cliente, erro = validar_cliente(dados)
    if erro:
        return resposta_erro(erro)

    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor(dictionary=True)
    try:
        cursor.execute(
            """INSERT INTO clientes
               (cnpj, data_cadastro, status, razao_social, nome_fantasia, estado, faturamento)
               VALUES (%s, CURDATE(), %s, %s, %s, %s, %s)""",
            (cliente["cnpj"], cliente["status"], cliente["company"], cliente["name"],
             cliente["state"], cliente["revenue"]),
        )
        conexao.commit()
        registro = consultar_um(cursor, "clientes", cursor.lastrowid)
        return resposta_sucesso(serializar_cliente(registro), "Cliente cadastrado com sucesso.", 201)
    except Error as excecao:
        conexao.rollback()
        if getattr(excecao, "errno", None) == 1062:
            return resposta_erro("Já existe um cliente cadastrado com este CNPJ.", 409)
        app.logger.exception("Erro ao criar cliente")
        return resposta_erro("Não foi possível cadastrar o cliente.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


@app.put("/api/clientes/<int:identificador>")
def atualizar_cliente(identificador):
    dados, erro = obter_dados_json()
    if erro:
        return erro
    cliente, erro = validar_cliente(dados)
    if erro:
        return resposta_erro(erro)

    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor(dictionary=True)
    try:
        if not consultar_um(cursor, "clientes", identificador):
            return resposta_erro("Cliente não encontrado.", 404)
        cursor.execute(
            """UPDATE clientes
               SET cnpj = %s, status = %s, razao_social = %s, nome_fantasia = %s,
                   estado = %s, faturamento = %s
               WHERE id = %s""",
            (cliente["cnpj"], cliente["status"], cliente["company"], cliente["name"],
             cliente["state"], cliente["revenue"], identificador),
        )
        conexao.commit()
        return resposta_sucesso(
            serializar_cliente(consultar_um(cursor, "clientes", identificador)),
            "Cliente atualizado com sucesso.",
        )
    except Error as excecao:
        conexao.rollback()
        if getattr(excecao, "errno", None) == 1062:
            return resposta_erro("Já existe um cliente cadastrado com este CNPJ.", 409)
        app.logger.exception("Erro ao atualizar cliente")
        return resposta_erro("Não foi possível atualizar o cliente.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


@app.delete("/api/clientes/<int:identificador>")
def excluir_cliente(identificador):
    return excluir_registro("clientes", identificador, "Cliente")


@app.get("/api/produtos")
def listar_produtos():
    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM produtos ORDER BY id")
        return resposta_sucesso([serializar_produto(linha) for linha in cursor.fetchall()])
    except Error:
        app.logger.exception("Erro ao listar produtos")
        return resposta_erro("Não foi possível carregar os produtos.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


@app.post("/api/produtos")
def criar_produto():
    dados, erro = obter_dados_json()
    if erro:
        return erro
    produto, erro = validar_produto(dados)
    if erro:
        return resposta_erro(erro)

    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor(dictionary=True)
    try:
        cursor.execute(
            """INSERT INTO produtos (nome, categoria, preco, estoque, marca)
               VALUES (%s, %s, %s, %s, %s)""",
            (produto["name"], produto["category"], produto["price"], produto["stock"], produto["brand"]),
        )
        conexao.commit()
        registro = consultar_um(cursor, "produtos", cursor.lastrowid)
        return resposta_sucesso(serializar_produto(registro), "Produto cadastrado com sucesso.", 201)
    except Error:
        conexao.rollback()
        app.logger.exception("Erro ao criar produto")
        return resposta_erro("Não foi possível cadastrar o produto.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


@app.put("/api/produtos/<int:identificador>")
def atualizar_produto(identificador):
    dados, erro = obter_dados_json()
    if erro:
        return erro
    produto, erro = validar_produto(dados)
    if erro:
        return resposta_erro(erro)

    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor(dictionary=True)
    try:
        if not consultar_um(cursor, "produtos", identificador):
            return resposta_erro("Produto não encontrado.", 404)
        cursor.execute(
            """UPDATE produtos
               SET nome = %s, categoria = %s, preco = %s, estoque = %s, marca = %s
               WHERE id = %s""",
            (produto["name"], produto["category"], produto["price"], produto["stock"],
             produto["brand"], identificador),
        )
        conexao.commit()
        return resposta_sucesso(
            serializar_produto(consultar_um(cursor, "produtos", identificador)),
            "Produto atualizado com sucesso.",
        )
    except Error:
        conexao.rollback()
        app.logger.exception("Erro ao atualizar produto")
        return resposta_erro("Não foi possível atualizar o produto.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


@app.delete("/api/produtos/<int:identificador>")
def excluir_produto(identificador):
    return excluir_registro("produtos", identificador, "Produto")


def excluir_registro(tabela, identificador, entidade):
    conexao, erro = abrir_conexao()
    if erro:
        return erro
    cursor = conexao.cursor()
    try:
        cursor.execute(f"DELETE FROM {tabela} WHERE id = %s", (identificador,))
        if cursor.rowcount == 0:
            return resposta_erro(f"{entidade} não encontrado(a).", 404)
        conexao.commit()
        return resposta_sucesso(None, f"{entidade} excluído(a) com sucesso.")
    except Error:
        conexao.rollback()
        app.logger.exception("Erro ao excluir %s", entidade.lower())
        return resposta_erro(f"Não foi possível excluir o(a) {entidade.lower()}.", 500)
    finally:
        cursor.close()
        fechar_banco(conexao)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
