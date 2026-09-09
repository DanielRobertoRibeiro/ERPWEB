from Backend.banco import conectar_banco, fechar_banco


conexao = conectar_banco()


if conexao:

    cursor = conexao.cursor(dictionary=True)

    # ========================================================
    # TESTE DE CLIENTES
    # ========================================================

    cursor.execute("SELECT * FROM clientes")

    clientes = cursor.fetchall()

    print("\n===== CLIENTES =====")

    for cliente in clientes:

        print(
            cliente["id"],
            "-",
            cliente["nome_fantasia"]
        )


    # ========================================================
    # TESTE DE PRODUTOS
    # ========================================================

    cursor.execute("SELECT * FROM produtos")

    produtos = cursor.fetchall()

    print("\n===== PRODUTOS =====")

    for produto in produtos:

        print(
            produto["id"],
            "-",
            produto["nome"],
            "- R$",
            produto["preco"],
            "- Estoque:",
            produto["estoque"]
        )


    cursor.close()

    fechar_banco(conexao)