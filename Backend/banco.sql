-- ============================================================
-- BANCO DE DADOS DO SISTEMA ERP
-- ============================================================

CREATE DATABASE IF NOT EXISTS erp_pai;

USE erp_pai;


-- ============================================================
-- TABELA DE CLIENTES
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    cnpj VARCHAR(18) NOT NULL UNIQUE,
    cpf VARCHAR(14),
    inscricao_estadual VARCHAR(20),

    data_cadastro DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'Ativo',

    razao_social VARCHAR(150) NOT NULL,
    inscricao_municipal VARCHAR(30),
    nome_fantasia VARCHAR(150) NOT NULL,

    estado CHAR(2),
    cep VARCHAR(9),

    endereco VARCHAR(200),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    referencia_endereco VARCHAR(200),

    regiao VARCHAR(50),

    transportadora VARCHAR(100),

    faturamento DECIMAL(15,2) DEFAULT 0.00,

    telefone_1 VARCHAR(20),
    telefone_2 VARCHAR(20),

    desconto DECIMAL(5,2) DEFAULT 0.00,

    email VARCHAR(150),
    home_page VARCHAR(200),
    contato VARCHAR(100),

    distancia DECIMAL(10,2) DEFAULT 0.00,

    credito DECIMAL(15,2) DEFAULT 0.00,
    credito_usado DECIMAL(15,2) DEFAULT 0.00,
    credito_disponivel DECIMAL(15,2) DEFAULT 0.00,

    vendedor_representante VARCHAR(150),

    comissao DECIMAL(5,2) DEFAULT 0.00,

    ramo_atividade VARCHAR(150),

    frete VARCHAR(50),

    como_conheceu VARCHAR(100)
);


-- ============================================================
-- DADOS FICTÍCIOS DOS CLIENTES
-- ============================================================

INSERT INTO clientes (
    cnpj,
    cpf,
    inscricao_estadual,
    data_cadastro,
    status,
    razao_social,
    inscricao_municipal,
    nome_fantasia,
    estado,
    cep,
    endereco,
    bairro,
    cidade,
    referencia_endereco,
    regiao,
    transportadora,
    faturamento,
    telefone_1,
    telefone_2,
    desconto,
    email,
    home_page,
    contato,
    distancia,
    credito,
    credito_usado,
    credito_disponivel,
    vendedor_representante,
    comissao,
    ramo_atividade,
    frete,
    como_conheceu
)
VALUES
(
    '00.111.222/0001-01',
    '111.222.333-01',
    '110.222.333.444',
    '2026-01-15',
    'Ativo',
    'Carlos Almeida Tintas Ltda',
    'IM-001234',
    'Tintas Carlos',
    'SP',
    '02010-000',
    'Rua das Flores, 123',
    'Santana',
    'São Paulo',
    'Próximo ao terminal de ônibus',
    'Zona Norte',
    'Transporte Paulista',
    185000.00,
    '(11) 99999-1001',
    '(11) 98888-1001',
    5.00,
    'carlos@tintascarlos.com',
    'https://www.tintascarlos.com',
    'Carlos Almeida',
    12.50,
    50000.00,
    12500.00,
    37500.00,
    'Marcos Silva',
    3.50,
    'Comércio de tintas',
    'CIF',
    'Indicação'
),
(
    '00.111.222/0001-02',
    '111.222.333-02',
    '220.333.444.555',
    '2026-02-03',
    'Ativo',
    'Souza Decorações ME',
    'IM-002345',
    'Souza Decorações',
    'RJ',
    '20010-000',
    'Av. Principal, 456',
    'Centro',
    'Rio de Janeiro',
    'Próximo à praça central',
    'Centro',
    'Rápido Express',
    92000.00,
    '(21) 99999-2002',
    '(21) 98888-2002',
    3.00,
    'mariana@souzadecoracoes.com',
    'https://www.souzadecoracoes.com',
    'Mariana Souza',
    8.30,
    30000.00,
    8500.00,
    21500.00,
    'Fernanda Oliveira',
    4.00,
    'Decoração',
    'FOB',
    'Instagram'
),
(
    '00.111.222/0001-03',
    '111.222.333-03',
    '330.444.555.666',
    '2026-02-18',
    'Ativo',
    'Pintura Nova Comércio Ltda',
    'IM-003456',
    'Pintura Nova',
    'MG',
    '30110-000',
    'Rua Central, 789',
    'Funcionários',
    'Belo Horizonte',
    'Ao lado do shopping',
    'Sudeste',
    'Minas Transporte',
    245000.00,
    '(31) 99999-3003',
    '(31) 98888-3003',
    7.50,
    'contato@pinturanova.com',
    'https://www.pinturanova.com',
    'Roberto Santos',
    15.70,
    70000.00,
    30000.00,
    40000.00,
    'João Mendes',
    3.00,
    'Materiais para pintura',
    'CIF',
    'Google'
),
(
    '00.111.222/0001-04',
    '111.222.333-04',
    '440.555.666.777',
    '2026-03-01',
    'Ativo',
    'Casa das Cores Ltda',
    'IM-004567',
    'Casa das Cores',
    'PR',
    '80010-000',
    'Rua Paraná, 321',
    'Centro',
    'Curitiba',
    'Em frente à farmácia',
    'Sul',
    'Sul Logística',
    130000.00,
    '(41) 99999-4004',
    '(41) 98888-4004',
    4.50,
    'contato@casadascores.com',
    'https://www.casadascores.com',
    'Ana Martins',
    6.20,
    40000.00,
    12000.00,
    28000.00,
    'Paulo Costa',
    3.75,
    'Tintas e vernizes',
    'FOB',
    'Indicação'
),
(
    '00.111.222/0001-05',
    '111.222.333-05',
    '550.666.777.888',
    '2026-03-22',
    'Inativo',
    'Constrular Materiais Ltda',
    'IM-005678',
    'Constrular',
    'SP',
    '13010-000',
    'Av. Brasil, 900',
    'Cambuí',
    'Campinas',
    'Próximo ao supermercado',
    'Interior',
    'Paulista Cargas',
    76000.00,
    '(19) 99999-5005',
    '(19) 98888-5005',
    2.00,
    'contato@constrular.com',
    'https://www.constrular.com',
    'Ricardo Lima',
    18.40,
    20000.00,
    19000.00,
    1000.00,
    'Lucas Ferreira',
    2.50,
    'Materiais de construção',
    'CIF',
    'Feira comercial'
);


-- ============================================================
-- TABELA DE PRODUTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS produtos (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    categoria VARCHAR(100) NOT NULL,

    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    estoque INT NOT NULL DEFAULT 0,

    marca VARCHAR(100) NOT NULL,

    cor VARCHAR(100),

    volume_litros DECIMAL(10,2)

);


-- ============================================================
-- DADOS FICTÍCIOS DOS PRODUTOS
-- ============================================================

INSERT INTO produtos (
    nome,
    categoria,
    preco,
    estoque,
    marca,
    cor,
    volume_litros
)
VALUES
(
    'Tinta Acrílica Premium',
    'Tintas',
    189.90,
    50,
    'Coral',
    'Branco Neve',
    18.00
),
(
    'Verniz Marítimo',
    'Vernizes',
    145.50,
    30,
    'Suvinil',
    'Incolor',
    3.60
),
(
    'Tinta Esmalte Sintético',
    'Tintas',
    89.90,
    75,
    'Sherwin-Williams',
    'Preto Fosco',
    3.60
),
(
    'Verniz Acrílico',
    'Vernizes',
    79.90,
    40,
    'Coral',
    'Brilhante',
    1.00
),
(
    'Tinta Epóxi',
    'Tintas',
    220.00,
    25,
    'Montana',
    'Cinza Claro',
    3.60
);


-- ============================================================
-- TESTES
-- ============================================================

SELECT * FROM clientes;

SELECT * FROM produtos;