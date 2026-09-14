# Guia de execução e uso do ERP Web

Este guia mostra o necessário para configurar e executar o projeto no Windows.
As etapas de banco e instalação são feitas apenas na primeira vez; depois, use
a seção **Execução diária**.

> Nunca coloque senhas reais no código, no `.env.example` ou no GitHub. Use
> somente `Backend/.env`, que está ignorado pelo Git.

## 1. Preparar o MySQL — primeira execução

Verifique se o serviço está ativo:

```powershell
Get-Service MySQL80
```

Se estiver parado, abra o PowerShell como Administrador:

```powershell
Start-Service MySQL80
```

O serviço precisa estar ativo porque a API salva e consulta os dados no MySQL.

Entre no MySQL como administrador:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

Digite a senha de `root`. Nada aparece durante a digitação; isso é normal.

Crie as tabelas e os dados fictícios:

```sql
SOURCE C:/Users/danie/OneDrive/Área de Trabalho/VINILAK/Backend/banco.sql;
```

O arquivo cria o banco `erp_pai`, as tabelas `clientes` e `produtos` e cinco
registros de exemplo em cada tabela. Não repita os `INSERT`, pois os CNPJs são
únicos.

Crie um usuário exclusivo para a aplicação:

```sql
CREATE USER IF NOT EXISTS 'erpweb_app'@'localhost'
IDENTIFIED BY 'ESCOLHA_UMA_SENHA_FORTE';

ALTER USER 'erpweb_app'@'localhost'
IDENTIFIED BY 'ESCOLHA_A_MESMA_SENHA_FORTE';

GRANT SELECT, INSERT, UPDATE, DELETE
ON erp_pai.* TO 'erpweb_app'@'localhost';

FLUSH PRIVILEGES;
exit;
```

Esse usuário possui apenas as permissões exigidas pelo ERP. Usar `root` na
aplicação daria acesso desnecessário a todo o servidor.

## 2. Configurar o `.env` — primeira execução

Entre na pasta do backend:

```powershell
cd "C:\Users\danie\OneDrive\Área de Trabalho\VINILAK\Backend"
```

Crie o arquivo local a partir do modelo:

```powershell
Copy-Item .env.example .env
```

No Git Bash, use `cp .env.example .env` no lugar de `Copy-Item`.

Preencha `Backend/.env`:

```env
DB_HOST=localhost
DB_USER=erpweb_app
DB_PASSWORD=A_SENHA_CRIADA_NO_MYSQL
DB_NAME=erp_pai
```

A senha precisa ser a mesma configurada no comando `CREATE USER`. Alterar
somente o `.env` não modifica a senha existente no MySQL.

## 3. Preparar o Python — primeira execução

Ainda dentro de `Backend`, crie o ambiente isolado:

```powershell
python -m venv .venv
```

Ative-o no PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

No Git Bash, use:

```bash
source .venv/Scripts/activate
```

Instale as dependências:

```powershell
python -m pip install -r requirements.txt
```

O ambiente virtual impede que Flask, MySQL Connector e `python-dotenv` entrem
em conflito com bibliotecas de outros projetos.

Teste a instalação:

```powershell
python -m unittest test_api.py
```

O resultado esperado é `Ran 3 tests` e `OK`.

## 4. Executar o projeto

Use apenas um terminal para a API:

```powershell
cd "C:\Users\danie\OneDrive\Área de Trabalho\VINILAK\Backend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
python api.py
```

Mantenha o terminal aberto. A mensagem esperada é:

```text
Running on http://127.0.0.1:5000
```

Teste a conexão completa entre Flask e MySQL:

[http://127.0.0.1:5000/api/health](http://127.0.0.1:5000/api/health)

O resultado deve conter `"status": "online"`.

Depois, no VS Code:

1. Abra `Frontend/index.html`.
2. Clique com o botão direito.
3. Escolha **Open with Live Server**.
4. Se a página já estava aberta, pressione `Ctrl+F5`.

O Live Server serve a interface por HTTP. O frontend chama a API configurada
em `Frontend/config.js`: `http://127.0.0.1:5000/api`.

## 5. Usar o sistema

- **Dashboard:** mostra totais de clientes, produtos, faturamento e estoque.
- **Clientes:** permite pesquisar, cadastrar, editar e excluir. O CNPJ precisa
  conter 14 dígitos e não pode estar repetido.
- **Produtos:** permite pesquisar, cadastrar, editar e excluir; preço e estoque
  não aceitam valores negativos.
- **Relatórios:** gera arquivos CSV usando os dados carregados do MySQL.

Depois de cadastrar ou editar, atualize a página. Se o registro continuar
visível, a persistência no MySQL está funcionando.

## 6. Execução diária

Depois da configuração inicial, faça somente isto:

1. Confirme que o serviço `MySQL80` está ativo.
2. Abra um PowerShell em `Backend`.
3. Ative `.venv`.
4. Execute `python api.py` e deixe o terminal aberto.
5. Abra `Frontend/index.html` com Live Server.
6. Ao terminar, pressione `Ctrl+C` no terminal da API.

Não recrie o banco, o usuário, o `.env` ou o ambiente virtual a cada execução.

## 7. Erros mais comuns

### “Não foi possível acessar a API”

O Flask não está rodando. Execute `python api.py` e mantenha o terminal aberto.

### `1045 Access denied`

O usuário ou a senha do `.env` não corresponde ao MySQL. Teste diretamente:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" `
    -u erpweb_app -p -D erp_pai
```

### `Unknown database 'erp_pai'`

O `banco.sql` ainda não foi executado ou `DB_NAME` está incorreto.

### `ModuleNotFoundError: No module named 'flask'`

Ative `.venv` e execute `python -m pip install -r requirements.txt`.

### `Copy-Item: command not found`

Você está no Git Bash. Use `cp .env.example .env`.

### `Address already in use`

Outra API já ocupa a porta 5000. Volte ao terminal anterior e pressione
`Ctrl+C`. Não execute `api.py` simultaneamente no Bash e no PowerShell.

### Alterei o `.env`, mas o erro continua

Pare a API com `Ctrl+C` e inicie novamente; o `.env` é carregado na inicialização.

## Checklist

- [ ] `MySQL80` está ativo.
- [ ] `erp_pai` contém `clientes` e `produtos`.
- [ ] `Backend/.env` possui a credencial correta de `erpweb_app`.
- [ ] `.venv` está ativo e os testes retornam `OK`.
- [ ] `/api/health` retorna `online`.
- [ ] `index.html` está aberto com Live Server.
- [ ] Cadastros permanecem depois de atualizar a página.

Com esses itens confirmados, o fluxo está completo: frontend → API Flask →
MySQL.
