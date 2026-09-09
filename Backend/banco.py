# ============================================================
# CONEXÃO COM O BANCO DE DADOS
# ============================================================

import mysql.connector
from mysql.connector import Error


def conectar_banco():
    """
    Cria uma conexão com o banco de dados MySQL.
    """

    try:

        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Dani1107@",
            database="erp_pai"
        )

        if conexao.is_connected():
            print("Conexão com MySQL estabelecida.")

            return conexao

    except Error as erro:

        print(f"Erro ao conectar ao MySQL: {erro}")

        return None


def fechar_banco(conexao):

    """
    Fecha a conexão com o banco.
    """

    if conexao and conexao.is_connected():

        conexao.close()

        print("Conexão com MySQL encerrada.")