# ERP Web — Frontend

Interface web de um sistema de gestão empresarial (ERP), desenvolvida como projeto de portfólio.

O projeto apresenta uma interface administrativa moderna e responsiva para gerenciamento de clientes, produtos, estoque e relatórios.

> Status: Frontend 1.0 — em desenvolvimento

---

## 📌 Sobre o projeto

Este projeto faz parte de uma iniciativa maior de desenvolvimento de um sistema ERP.

A primeira versão foi desenvolvida utilizando Python e MySQL através de uma aplicação executada pelo terminal.

O segundo projeto tem como objetivo transformar essa solução em uma aplicação web, separando a interface do usuário da camada de backend.

Neste estágio, o Frontend funciona de forma independente utilizando dados armazenados em memória através de JavaScript.

A integração com uma API Python e o banco de dados MySQL será realizada em uma próxima etapa.

---

## 🎯 Objetivos

O Frontend foi desenvolvido com os seguintes objetivos:

- Criar uma interface profissional para um sistema ERP;
- Desenvolver uma experiência de usuário simples e intuitiva;
- Praticar HTML, CSS e JavaScript;
- Implementar operações de CRUD no lado do cliente;
- Criar uma estrutura preparada para integração com uma API;
- Desenvolver um projeto apresentável para portfólio profissional.

---

## 🖥️ Funcionalidades atuais

### Dashboard

O painel principal apresenta:

- Quantidade de clientes;
- Quantidade de produtos;
- Faturamento cadastrado;
- Quantidade total de itens em estoque;
- Resumo das atividades;
- Alertas de estoque baixo.

Os indicadores são calculados dinamicamente a partir dos dados disponíveis no Frontend.

---

### 👥 Clientes

O módulo de clientes permite:

- Visualizar clientes cadastrados;
- Pesquisar clientes;
- Cadastrar novos clientes;
- Editar clientes;
- Excluir clientes;
- Visualizar status;
- Visualizar faturamento individual.

Campos utilizados:

- Razão social;
- Nome fantasia;
- Estado;
- Status;
- Faturamento.

---

### 📦 Produtos

O módulo de produtos permite:

- Visualizar produtos;
- Pesquisar produtos;
- Cadastrar novos produtos;
- Editar produtos;
- Excluir produtos;
- Visualizar estoque;
- Identificar produtos com estoque baixo;
- Visualizar preço dos produtos.

Campos utilizados:

- Produto;
- Categoria;
- Marca;
- Estoque;
- Preço.

---

### 📊 Relatórios

O Frontend possui uma área destinada à geração de relatórios.

Atualmente são disponibilizados relatórios em formato CSV para:

- Clientes;
- Produtos;
- Indicadores financeiros.

A geração de documentos PDF e DOCX será implementada posteriormente através do backend.

---

## 🧩 Tecnologias

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

### Recursos utilizados

- Manipulação do DOM;
- Eventos JavaScript;
- `fetch()` preparado para futura integração;
- Arrays e objetos JavaScript;
- Formulários;
- Modais;
- CRUD;
- Pesquisa dinâmica;
- Responsividade;
- Geração de arquivos CSV.

Nenhum framework frontend é utilizado atualmente.

---

## 📁 Estrutura

```text
Frontend/
│
├── index.html
├── style.css
├── script.js
└── README.md
