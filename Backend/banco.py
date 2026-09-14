# ============================================================
# CONEXÃO COM O BANCO DE DADOS
# ============================================================

import os

import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def conectar_banco():
    """
    Cria uma conexão com o banco de dados MySQL.
    """

    try:

        configuracao = {
            "host": os.getenv("DB_HOST", "localhost"),
            "user": os.getenv("DB_USER", "root"),
            "password": os.getenv("DB_PASSWORD"),
            "database": os.getenv("DB_NAME", "erp_pai"),
        }

        if not configuracao["password"]:
            print(
                "DB_PASSWORD não foi configurada. "
                "Defina as variáveis de ambiente antes de iniciar o sistema."
            )
            return None

        conexao = mysql.connector.connect(**configuracao)

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
