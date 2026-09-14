# ERP Web

Sistema ERP web desenvolvido como projeto pessoal de aprendizagem e portfólio.
O projeto reúne uma interface administrativa responsiva, uma API REST em Flask
e persistência de dados em MySQL.

> **Status:** MVP full stack funcional em ambiente local — em desenvolvimento.

O fluxo principal de clientes e produtos está integrado e persistente. O
projeto ainda não está concluído para produção: autenticação, testes de
integração completos, relatórios no backend e deploy permanecem no roadmap.

## Funcionalidades disponíveis

- Dashboard com totais de clientes, produtos, faturamento e estoque.
- CRUD completo de clientes via API e MySQL.
- CRUD completo de produtos via API e MySQL.
- Pesquisa dinâmica nas tabelas.
- Validação no frontend e no backend.
- Tratamento de carregamento, indisponibilidade e erros da API.
- Indicador visual do estado do sistema.
- Destaque para produtos com estoque baixo.
- Relatórios CSV de clientes, produtos e indicadores financeiros.
- Interface responsiva para desktop, tablet e celular.
- Programa original de terminal preservado em `Backend/main.py`.

## Arquitetura

```text
Frontend HTML/CSS/JavaScript
            ↓ HTTP + JSON
         API Flask
            ↓ SQL
           MySQL
```

O navegador nunca acessa o MySQL diretamente. As credenciais são lidas apenas
pelo backend através de variáveis de ambiente.

## Tecnologias

### Frontend

- HTML5
- CSS3
- JavaScript ES6+
- Fetch API

### Backend

- Python
- Flask
- python-dotenv
- MySQL Connector/Python

### Banco e ferramentas

- MySQL 8
- Git e GitHub
- Live Server durante o desenvolvimento local

## Estado do projeto

| Área | Estado |
| --- | --- |
| Interface HTML/CSS/JavaScript | Concluída para o MVP |
| Dashboard integrado | Concluído |
| CRUD de clientes | Concluído |
| CRUD de produtos | Concluído |
| Persistência MySQL | Concluída |
| API REST Flask | Concluída para o MVP |
| Validação e mensagens de erro | Implementadas |
| Testes unitários básicos da API | Implementados |
| Relatórios CSV | Implementados no frontend |
| Autenticação e perfis de acesso | Pendente |
| Relatórios PDF/DOCX no backend | Pendente |
| Migração para React/Vite | Planejada, não iniciada |
| Deploy full stack | Pendente |

## Estrutura principal

```text
ERPWEB/
├── Backend/
│   ├── .env.example
│   ├── api.py
│   ├── banco.py
│   ├── banco.sql
│   ├── main.py
│   ├── requirements.txt
│   └── test_api.py
├── Frontend/
│   ├── config.js
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
├── guia.md
└── README.md
```

## Como executar

O roteiro completo, incluindo preparação do MySQL, criação do usuário da
aplicação, configuração do `.env`, PowerShell, Git Bash e solução de erros está
disponível em:

### [Guia completo de configuração e uso](./guia.md)

Resumo para um ambiente já configurado:

```powershell
cd Backend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
python api.py
```

Com a API aberta, execute `Frontend/index.html` usando Live Server e teste:

```text
http://127.0.0.1:5000/api/health
```

## Endpoints

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/api/health` | Verificar API e banco |
| `GET` | `/api/clientes` | Listar clientes |
| `POST` | `/api/clientes` | Cadastrar cliente |
| `PUT` | `/api/clientes/<id>` | Atualizar cliente |
| `DELETE` | `/api/clientes/<id>` | Excluir cliente |
| `GET` | `/api/produtos` | Listar produtos |
| `POST` | `/api/produtos` | Cadastrar produto |
| `PUT` | `/api/produtos/<id>` | Atualizar produto |
| `DELETE` | `/api/produtos/<id>` | Excluir produto |

As respostas seguem um envelope consistente:

```json
{
  "success": true,
  "message": "Operação concluída com sucesso.",
  "data": {}
}
```

## Testes

Dentro de `Backend`, com o ambiente virtual ativo:

```powershell
python -m unittest test_api.py
```

Os testes atuais verificam validações, respostas HTTP e tratamento de banco
indisponível sem modificar dados reais.

## Segurança

- `Backend/.env` não deve ser enviado ao GitHub.
- `.env.example` contém apenas placeholders.
- A aplicação deve utilizar um usuário MySQL próprio, sem privilégios de
  administrador.
- Senhas já publicadas ou exibidas devem ser trocadas no MySQL.
- O CORS aberto e o servidor de desenvolvimento Flask devem ser endurecidos
  antes de um deploy público.

## Roadmap

1. Ampliar testes para cobrir o CRUD com um banco exclusivo de testes.
2. Implementar autenticação e níveis de acesso.
3. Gerar relatórios PDF e DOCX no backend.
4. Avaliar a migração incremental para React e Vite.
5. Preparar configurações de produção, CORS restrito e servidor WSGI.
6. Publicar frontend, backend e banco em serviços adequados.

## Objetivo educacional

O projeto prioriza código legível, evolução incremental e separação clara de
responsabilidades. A intenção é demonstrar fundamentos de desenvolvimento full
stack sem esconder o funcionamento atrás de abstrações desnecessárias.
