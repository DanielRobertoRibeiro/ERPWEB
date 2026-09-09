from Backend.banco import conectar_banco, fechar_banco
# ============================================================
# SISTEMA DE RELATÓRIOS - PROTÓTIPO ERP
# ============================================================
# Projeto desenvolvido para simular uma automação de ERP.
#
# Funcionalidades:
# 1 - Cadastrar usuário
# 2 - Visualizar usuários
# 3 - Cadastrar produto
# 4 - Visualizar produtos
# 5 - Escolher formato do relatório
# 6 - Gerar relatório em Word
# 0 - Encerrar programa
# ============================================================


# ------------------------------------------------------------
# DADOS DO SISTEMA
# ------------------------------------------------------------

usuarios = [
    {
        "id": 1,
        "nome": "Carlos Almeida",
        "email": "carlos@empresa.com",
        "telefone": "11999990001",
        "cpf": "123.456.789-00",
        "endereco": "Rua das Flores, 123 - São Paulo/SP",
        "empresa": "Pinturas Carlos Ltda",
        "cnpj": "12.345.678/0001-90",
        "quantidade_tintas": 50
    },
    {
        "id": 2,
        "nome": "Mariana Souza",
        "email": "mariana@empresa.com",
        "telefone": "11999990002",
        "cpf": "987.654.321-00",
        "endereco": "Av. Principal, 456 - Rio de Janeiro/RJ",
        "empresa": "Souza Decorações ME",
        "cnpj": "98.765.432/0001-10",
        "quantidade_tintas": 120
    }
]


produtos = [
    {
        "id": 1,
        "nome": "Tinta Acrílica Premium",
        "categoria": "Tintas",
        "preco": 189.90,
        "estoque": 50,
        "marca": "Coral",
        "cor": "Branco Neve",
        "volume_litros": 18
    },
    {
        "id": 2,
        "nome": "Verniz Marítimo",
        "categoria": "Vernizes",
        "preco": 145.50,
        "estoque": 30,
        "marca": "Suvinil",
        "cor": "Incolor",
        "volume_litros": 3.6
    },
    {
        "id": 3,
        "nome": "Tinta Esmalte Sintético",
        "categoria": "Tintas",
        "preco": 89.90,
        "estoque": 75,
        "marca": "Sherwin-Williams",
        "cor": "Preto Fosco",
        "volume_litros": 3.6
    },
    {
        "id": 4,
        "nome": "Verniz Acrílico",
        "categoria": "Vernizes",
        "preco": 79.90,
        "estoque": 40,
        "marca": "Coral",
        "cor": "Brilhante",
        "volume_litros": 1.0
    },
    {
        "id": 5,
        "nome": "Tinta Epóxi",
        "categoria": "Tintas",
        "preco": 220.00,
        "estoque": 25,
        "marca": "Montana",
        "cor": "Cinza Claro",
        "volume_litros": 3.6
    }
]


# ------------------------------------------------------------
# 1. PAINEL DO MENU
# ------------------------------------------------------------

def painel_menu_terminal():
    """Exibe o menu principal do sistema."""
    print("\n" + "=" * 50)
    print("             SISTEMA ERP")
    print("=" * 50)

    print("1 - Cadastrar usuário")
    print("2 - Dados dos usuários")
    print("3 - Cadastrar produto")
    print("4 - Dados dos produtos")
    print("5 - Formato dos relatórios")
    print("6 - Gerar relatório")
    print("0 - Sair")

    print("=" * 50)


# ------------------------------------------------------------
# 2. CADASTRAR USUÁRIO
# ------------------------------------------------------------

def validar_email(email):
    """Valida se o e-mail tem formato básico válido."""
    return "@" in email and "." in email.split("@")[-1]


def validar_cpf(cpf):
    """Valida se o CPF tem formato básico (11 dígitos)."""
    # Remove caracteres especiais
    cpf_limpo = cpf.replace(".", "").replace("-", "").strip()
    return len(cpf_limpo) == 11 and cpf_limpo.isdigit()


def validar_cnpj(cnpj):
    """Valida se o CNPJ tem formato básico (14 dígitos)."""
    # Remove caracteres especiais
    cnpj_limpo = cnpj.replace(".", "").replace("/", "").replace("-", "").strip()
    return len(cnpj_limpo) == 14 and cnpj_limpo.isdigit()


def cadastrar_usuario():
    """Cadastra um novo usuário no sistema."""
    print("\n===== CADASTRAR USUÁRIO =====")

    # Dados básicos
    nome = input("Nome: ").strip()
    
    # Validação do nome
    if not nome:
        print("Nome não pode ser vazio.")
        return
    
    # Validação do e-mail
    while True:
        email = input("E-mail: ").strip()
        if validar_email(email):
            break
        print("E-mail inválido. Digite um e-mail válido (exemplo: nome@dominio.com).")
    
    telefone = input("Telefone: ").strip()
    
    # Validação do CPF
    while True:
        cpf = input("CPF (somente números): ").strip()
        if validar_cpf(cpf):
            # Formata o CPF
            cpf_formatado = f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"
            break
        print("CPF inválido. Digite 11 números (exemplo: 12345678900).")
    
    # Endereço
    endereco = input("Endereço completo: ").strip()
    if not endereco:
        print("Endereço não pode ser vazio.")
        return
    
    # Dados da empresa
    empresa = input("Nome da empresa: ").strip()
    if not empresa:
        print("Nome da empresa não pode ser vazio.")
        return
    
    # Validação do CNPJ
    while True:
        cnpj = input("CNPJ (somente números): ").strip()
        if validar_cnpj(cnpj):
            # Formata o CNPJ
            cnpj_formatado = f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"
            break
        print("CNPJ inválido. Digite 14 números (exemplo: 12345678000190).")
    
    # Quantidade de tintas compradas
    while True:
        try:
            quantidade_tintas = int(input("Quantidade de tintas compradas: "))
            if quantidade_tintas < 0:
                print("A quantidade não pode ser negativa.")
                continue
            break
        except ValueError:
            print("Digite uma quantidade válida (número inteiro).")
    
    # Gera novo ID baseado no maior ID existente
    if usuarios:
        novo_id = max(usuario["id"] for usuario in usuarios) + 1
    else:
        novo_id = 1

    novo_usuario = {
        "id": novo_id,
        "nome": nome,
        "email": email,
        "telefone": telefone,
        "cpf": cpf_formatado,
        "endereco": endereco,
        "empresa": empresa,
        "cnpj": cnpj_formatado,
        "quantidade_tintas": quantidade_tintas
    }

    usuarios.append(novo_usuario)

    print(f"\nUsuário '{nome}' cadastrado com sucesso!")
    print(f"ID atribuído: {novo_id}")


# ------------------------------------------------------------
# 3. DADOS DOS USUÁRIOS
# ------------------------------------------------------------

def dados_usuarios():

    """Exibe os clientes cadastrados no MySQL."""

    print("\n===== DADOS DOS CLIENTES =====")

    conexao = conectar_banco()

    if not conexao:
        return

    cursor = conexao.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT *
            FROM clientes
            ORDER BY id
        """)

        clientes = cursor.fetchall()

        if not clientes:

            print("Nenhum cliente cadastrado.")

            return

        print(f"\nTotal de clientes: {len(clientes)}")

        for cliente in clientes:

            print("\n" + "=" * 60)

            print(f"ID: {cliente['id']}")
            print(f"CNPJ: {cliente['cnpj']}")
            print(f"CPF: {cliente['cpf']}")
            print(
                f"Inscrição Estadual: "
                f"{cliente['inscricao_estadual']}"
            )
            print(f"Data de cadastro: {cliente['data_cadastro']}")
            print(f"Status: {cliente['status']}")
            print(f"Razão Social: {cliente['razao_social']}")
            print(
                f"Inscrição Municipal: "
                f"{cliente['inscricao_municipal']}"
            )
            print(f"Nome Fantasia: {cliente['nome_fantasia']}")
            print(f"Estado: {cliente['estado']}")
            print(f"CEP: {cliente['cep']}")
            print(f"Endereço: {cliente['endereco']}")
            print(f"Bairro: {cliente['bairro']}")
            print(f"Cidade: {cliente['cidade']}")
            print(
                f"Referência: "
                f"{cliente['referencia_endereco']}"
            )
            print(f"Região: {cliente['regiao']}")
            print(
                f"Transportadora: "
                f"{cliente['transportadora']}"
            )
            print(
                f"Faturamento: "
                f"R$ {cliente['faturamento']:.2f}"
            )
            print(f"Telefone 1: {cliente['telefone_1']}")
            print(f"Telefone 2: {cliente['telefone_2']}")
            print(f"Desconto: {cliente['desconto']:.2f}%")
            print(f"E-mail: {cliente['email']}")
            print(f"Home Page: {cliente['home_page']}")
            print(f"Contato: {cliente['contato']}")
            print(
                f"Distância: "
                f"{cliente['distancia']:.2f} km"
            )
            print(
                f"Crédito: "
                f"R$ {cliente['credito']:.2f}"
            )
            print(
                f"Crédito usado: "
                f"R$ {cliente['credito_usado']:.2f}"
            )
            print(
                f"Crédito disponível: "
                f"R$ {cliente['credito_disponivel']:.2f}"
            )
            print(
                f"Vendedor/Representante: "
                f"{cliente['vendedor_representante']}"
            )
            print(f"Comissão: {cliente['comissao']:.2f}%")
            print(
                f"Ramo/Atividade: "
                f"{cliente['ramo_atividade']}"
            )
            print(f"Frete: {cliente['frete']}")
            print(
                f"Como conheceu a empresa: "
                f"{cliente['como_conheceu']}"
            )

            print("=" * 60)

    except Error as erro:

        print(f"Erro ao consultar clientes: {erro}")

    finally:

        cursor.close()
        fechar_banco(conexao)



# ------------------------------------------------------------
# 4. CADASTRAR PRODUTO
# ------------------------------------------------------------

def cadastrar_produtos():
    """Cadastra um novo produto (tinta ou verniz) no sistema."""
    print("\n===== CADASTRAR PRODUTO =====")

    nome = input("Nome do produto: ").strip()
    
    # Validação do nome
    if not nome:
        print("Nome do produto não pode ser vazio.")
        return
    
    # Seleção da categoria
    print("\nCategorias disponíveis:")
    print("1 - Tintas")
    print("2 - Vernizes")
    
    while True:
        opcao_categoria = input("Escolha a categoria (1 ou 2): ").strip()
        if opcao_categoria == "1":
            categoria = "Tintas"
            break
        elif opcao_categoria == "2":
            categoria = "Vernizes"
            break
        else:
            print("Opção inválida. Escolha 1 ou 2.")
    
    # Marca
    marca = input("Marca: ").strip()
    if not marca:
        print("Marca não pode ser vazia.")
        return
    
    # Cor
    cor = input("Cor: ").strip()
    if not cor:
        print("Cor não pode ser vazia.")
        return
    
    # Volume em litros
    while True:
        try:
            volume_litros = float(input("Volume (litros): ").replace(",", "."))
            if volume_litros <= 0:
                print("O volume deve ser maior que zero.")
                continue
            break
        except ValueError:
            print("Digite um volume válido (exemplo: 3.6 ou 18).")
    
    # Validação do preço
    while True:
        try:
            preco = float(input("Preço: R$ ").replace(",", "."))
            if preco < 0:
                print("O preço não pode ser negativo.")
                continue
            break
        except ValueError:
            print("Digite um preço válido (exemplo: 150.50 ou 150,50).")

    # Validação do estoque
    while True:
        try:
            estoque = int(input("Quantidade em estoque: "))
            if estoque < 0:
                print("O estoque não pode ser negativo.")
                continue
            break
        except ValueError:
            print("Digite uma quantidade válida (número inteiro).")

    # Gera novo ID baseado no maior ID existente
    if produtos:
        novo_id = max(produto["id"] for produto in produtos) + 1
    else:
        novo_id = 1

    novo_produto = {
        "id": novo_id,
        "nome": nome,
        "categoria": categoria,
        "marca": marca,
        "cor": cor,
        "volume_litros": volume_litros,
        "preco": preco,
        "estoque": estoque
    }

    produtos.append(novo_produto)

    print(f"\nProduto '{nome}' cadastrado com sucesso!")
    print(f"ID atribuído: {novo_id}")


# ------------------------------------------------------------
# 5. DADOS DOS PRODUTOS
# ------------------------------------------------------------

def dados_produtos():
    """Exibe todos os produtos cadastrados."""
    print("\n===== DADOS DOS PRODUTOS =====")

    if not produtos:
        print("Nenhum produto cadastrado.")
        return

    print(f"\nTotal de produtos: {len(produtos)}")
    
    for produto in produtos:
        print("\n" + "=" * 40)
        print(f"ID: {produto['id']}")
        print(f"Nome: {produto['nome']}")
        print(f"Categoria: {produto['categoria']}")
        print(f"Marca: {produto['marca']}")
        print(f"Cor: {produto['cor']}")
        print(f"Volume: {produto['volume_litros']:.1f} litros")
        print(f"Preço: R$ {produto['preco']:.2f}")
        print(f"Estoque: {produto['estoque']} unidades")
        print("=" * 40)


# ------------------------------------------------------------
# 6. FORMATO DOS RELATÓRIOS
# ------------------------------------------------------------

def formato_relatorios():
    """Solicita ao usuário o tipo de relatório desejado."""
    print("\n===== FORMATO DOS RELATÓRIOS =====")

    print("1 - Relatório de usuários")
    print("2 - Relatório de produtos")
    print("3 - Relatório completo")

    while True:
        opcao = input("\nEscolha o tipo de relatório: ").strip()

        if opcao == "1":
            print("Formato selecionado: Relatório de usuários")
            return "usuarios"
        elif opcao == "2":
            print("Formato selecionado: Relatório de produtos")
            return "produtos"
        elif opcao == "3":
            print("Formato selecionado: Relatório completo")
            return "completo"
        else:
            print("Opção inválida. Escolha 1, 2 ou 3.")


# ------------------------------------------------------------
# 7. GERAR RELATÓRIOS EM PDF
# ------------------------------------------------------------

def gerar_relatorios():
    """Gera relatório em formato PDF."""

    print("\n===== GERAR RELATÓRIO =====")

    tipo_relatorio = formato_relatorios()

    # Define o nome do arquivo baseado no tipo
    if tipo_relatorio == "usuarios":
        nome_arquivo = "relatorio_usuarios.pdf"
    elif tipo_relatorio == "produtos":
        nome_arquivo = "relatorio_produtos.pdf"
    else:
        nome_arquivo = "relatorio_completo.pdf"

    # Importa as ferramentas do ReportLab
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER
        from reportlab.platypus import (
            SimpleDocTemplate,
            Paragraph,
            Spacer,
            Table,
            TableStyle,
            PageBreak
        )
    except ImportError:
        print("\nA biblioteca ReportLab não está instalada.")
        print("Instale utilizando:")
        print("pip install reportlab")
        return

    # --------------------------------------------------------
    # CONFIGURAÇÃO DO DOCUMENTO
    # --------------------------------------------------------

    # Como algumas tabelas possuem muitas colunas,
    # utilizamos orientação horizontal.
    documento = SimpleDocTemplate(
        nome_arquivo,
        pagesize=landscape(A4),
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )

    # Estilos prontos do ReportLab
    estilos = getSampleStyleSheet()

    estilo_titulo = ParagraphStyle(
        "Titulo",
        parent=estilos["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=15
    )

    estilo_subtitulo = ParagraphStyle(
        "Subtitulo",
        parent=estilos["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        spaceAfter=20
    )

    estilo_secao = ParagraphStyle(
        "Secao",
        parent=estilos["Heading1"],
        fontSize=15,
        spaceBefore=10,
        spaceAfter=10
    )

    estilo_normal = ParagraphStyle(
        "NormalPersonalizado",
        parent=estilos["Normal"],
        fontSize=9,
        leading=12
    )

    # Lista que armazenará todo o conteúdo do PDF
    elementos = []

    # --------------------------------------------------------
    # CABEÇALHO
    # --------------------------------------------------------

    elementos.append(
        Paragraph(
            "RELATÓRIO DO SISTEMA ERP",
            estilo_titulo
        )
    )

    elementos.append(
        Paragraph(
            "Relatório gerado automaticamente pelo sistema.",
            estilo_subtitulo
        )
    )

    # --------------------------------------------------------
    # RELATÓRIO DE USUÁRIOS
    # --------------------------------------------------------

    if tipo_relatorio in ["usuarios", "completo"]:

        elementos.append(
            Paragraph(
                "Dados dos Usuários",
                estilo_secao
            )
        )

        elementos.append(
            Paragraph(
                f"Total de usuários cadastrados: {len(usuarios)}",
                estilo_normal
            )
        )

        elementos.append(Spacer(1, 10))

        dados_usuarios_pdf = [
            [
                "ID",
                "Nome",
                "E-mail",
                "Telefone",
                "CPF",
                "Endereço",
                "Empresa",
                "CNPJ",
                "Qtd. Tintas"
            ]
        ]

        for usuario in usuarios:

            dados_usuarios_pdf.append(
                [
                    str(usuario["id"]),
                    usuario["nome"],
                    usuario["email"],
                    usuario["telefone"],
                    usuario["cpf"],
                    usuario["endereco"],
                    usuario["empresa"],
                    usuario["cnpj"],
                    str(usuario["quantidade_tintas"])
                ]
            )

        tabela_usuarios = Table(
            dados_usuarios_pdf,
            repeatRows=1
        )

        tabela_usuarios.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 7),
                    ("ALIGN", (0, 0), (0, -1), "CENTER"),
                    ("ALIGN", (8, 1), (8, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        elementos.append(tabela_usuarios)

        elementos.append(Spacer(1, 20))

    # --------------------------------------------------------
    # RELATÓRIO DE PRODUTOS
    # --------------------------------------------------------

    if tipo_relatorio in ["produtos", "completo"]:

        elementos.append(
            Paragraph(
                "Dados dos Produtos",
                estilo_secao
            )
        )

        elementos.append(
            Paragraph(
                f"Total de produtos cadastrados: {len(produtos)}",
                estilo_normal
            )
        )

        # Calcula o valor estimado do estoque
        valor_estoque = sum(
            produto["preco"] * produto["estoque"]
            for produto in produtos
        )

        elementos.append(
            Paragraph(
                f"Valor total estimado do estoque: "
                f"R$ {valor_estoque:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."),
                estilo_normal
            )
        )

        elementos.append(Spacer(1, 10))

        dados_produtos_pdf = [
            [
                "ID",
                "Nome",
                "Categoria",
                "Marca",
                "Cor",
                "Volume (L)",
                "Preço",
                "Estoque"
            ]
        ]

        for produto in produtos:

            preco_formatado = (
                f"R$ {produto['preco']:,.2f}"
                .replace(",", "X")
                .replace(".", ",")
                .replace("X", ".")
            )

            dados_produtos_pdf.append(
                [
                    str(produto["id"]),
                    produto["nome"],
                    produto["categoria"],
                    produto["marca"],
                    produto["cor"],
                    f"{produto['volume_litros']:.1f}",
                    preco_formatado,
                    str(produto["estoque"])
                ]
            )

        tabela_produtos = Table(
            dados_produtos_pdf,
            repeatRows=1
        )

        tabela_produtos.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("ALIGN", (0, 0), (0, -1), "CENTER"),
                    ("ALIGN", (5, 1), (7, -1), "CENTER"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )

        elementos.append(tabela_produtos)

    # --------------------------------------------------------
    # FINALIZAÇÃO DO PDF
    # --------------------------------------------------------

    documento.build(elementos)

    print("\nRelatório gerado com sucesso!")
    print(f"Arquivo salvo como: {nome_arquivo}")


# ------------------------------------------------------------
# PROGRAMA PRINCIPAL
# ------------------------------------------------------------

def main():
    """Função principal do sistema."""
    print("\nBem-vindo ao Sistema ERP!")
    print("=" * 50)

    while True:
        painel_menu_terminal()
        
        try:
            opcao = input("Escolha uma opção: ").strip()
        except KeyboardInterrupt:
            print("\n\nSistema encerrado pelo usuário.")
            break

        if opcao == "1":
            cadastrar_usuario()
        elif opcao == "2":
            dados_usuarios()
        elif opcao == "3":
            cadastrar_produtos()
        elif opcao == "4":
            dados_produtos()
        elif opcao == "5":
            # Apenas informa o formato selecionado
            formato_relatorios()
        elif opcao == "6":
            gerar_relatorios()
        elif opcao == "0":
            print("\nSistema encerrado.")
            print("Obrigado por usar o Sistema ERP!")
            break
        else:
            print("\nOpção inválida. Digite um número de 0 a 6.")
        
        # Pausa para leitura (opcional)
        if opcao in ["1", "2", "3", "4", "5", "6"]:
            input("\nPressione Enter para continuar...")


# ------------------------------------------------------------
# EXECUÇÃO
# ------------------------------------------------------------

if __name__ == "__main__":
    main()