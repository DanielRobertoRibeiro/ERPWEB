/* ============================================================
   ERP WEB
   Frontend 1.0
   HTML + CSS + JavaScript
============================================================ */


/* ============================================================
   DADOS INICIAIS
============================================================ */

let clients = [
    {
        id: 1,
        company: "Carlos Almeida Tintas Ltda",
        name: "Tintas Carlos",
        state: "SP",
        status: "Ativo",
        revenue: 185000
    },

    {
        id: 2,
        company: "Souza Decorações ME",
        name: "Souza Decorações",
        state: "RJ",
        status: "Ativo",
        revenue: 92000
    },

    {
        id: 3,
        company: "Pintura Nova Comércio Ltda",
        name: "Pintura Nova",
        state: "MG",
        status: "Ativo",
        revenue: 245000
    },

    {
        id: 4,
        company: "Casa das Cores Ltda",
        name: "Casa das Cores",
        state: "PR",
        status: "Ativo",
        revenue: 130000
    },

    {
        id: 5,
        company: "Constrular Materiais Ltda",
        name: "Constrular",
        state: "SP",
        status: "Inativo",
        revenue: 76000
    }
];


let products = [
    {
        id: 1,
        name: "Tinta Acrílica Premium",
        category: "Tintas",
        brand: "Coral",
        stock: 50,
        price: 189.90
    },

    {
        id: 2,
        name: "Verniz Marítimo",
        category: "Vernizes",
        brand: "Suvinil",
        stock: 30,
        price: 145.50
    },

    {
        id: 3,
        name: "Tinta Esmalte Sintético",
        category: "Tintas",
        brand: "Sherwin-Williams",
        stock: 75,
        price: 89.90
    },

    {
        id: 4,
        name: "Verniz Acrílico",
        category: "Vernizes",
        brand: "Coral",
        stock: 40,
        price: 79.90
    },

    {
        id: 5,
        name: "Tinta Epóxi",
        category: "Tintas",
        brand: "Montana",
        stock: 8,
        price: 220
    }
];


/* ============================================================
   ESTADO DA APLICAÇÃO
============================================================ */

let currentEntity = null;

let editingId = null;


/* ============================================================
   ELEMENTOS
============================================================ */

const modalOverlay =
    document.querySelector("#modal-overlay");

const modalTitle =
    document.querySelector("#modal-title");

const entityForm =
    document.querySelector("#entity-form");

const clientFields =
    document.querySelector("#client-fields");

const productFields =
    document.querySelector("#product-fields");

const toast =
    document.querySelector("#toast");

const toastMessage =
    document.querySelector("#toast-message");


/* ============================================================
   CAMPOS DO CLIENTE
============================================================ */

const clientCompany =
    document.querySelector("#client-company");

const clientName =
    document.querySelector("#client-name");

const clientState =
    document.querySelector("#client-state");

const clientStatus =
    document.querySelector("#client-status");

const clientRevenue =
    document.querySelector("#client-revenue");


/* ============================================================
   CAMPOS DO PRODUTO
============================================================ */

const productName =
    document.querySelector("#product-name");

const productCategory =
    document.querySelector("#product-category");

const productBrand =
    document.querySelector("#product-brand");

const productStock =
    document.querySelector("#product-stock");

const productPrice =
    document.querySelector("#product-price");


/* ============================================================
   CONFIGURAÇÃO DO FORMULÁRIO
============================================================ */

/*
    Ativa apenas os campos correspondentes
    à entidade que está sendo cadastrada/editada.

    Isso evita o erro:

    "An invalid form control with name='' is not focusable."

    Campos desabilitados não participam da validação HTML.
*/

function setFormMode(mode) {

    const isClient =
        mode === "client";

    const clientInputFields = [
        clientCompany,
        clientName,
        clientState,
        clientStatus,
        clientRevenue
    ];

    const productInputFields = [
        productName,
        productCategory,
        productBrand,
        productStock,
        productPrice
    ];


    clientInputFields.forEach(field => {

        if (!field) return;

        field.disabled = !isClient;

        field.required = isClient;

    });


    productInputFields.forEach(field => {

        if (!field) return;

        field.disabled = isClient;

        field.required = !isClient;

    });

}


/* ============================================================
   FORMATAÇÃO
============================================================ */

function formatCurrency(value) {

    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ============================================================
   DASHBOARD
============================================================ */

function updateDashboard() {

    const totalRevenue =
        clients.reduce(
            (total, client) =>
                total + Number(client.revenue || 0),
            0
        );


    const totalStock =
        products.reduce(
            (total, product) =>
                total + Number(product.stock || 0),
            0
        );


    const lowStock =
        products.filter(
            product => Number(product.stock) <= 10
        ).length;


    const dashboardClients =
        document.querySelector("#dashboard-clients");

    const dashboardProducts =
        document.querySelector("#dashboard-products");

    const dashboardRevenue =
        document.querySelector("#dashboard-revenue");

    const dashboardStock =
        document.querySelector("#dashboard-stock");

    const activityClients =
        document.querySelector("#activity-clients");

    const activityProducts =
        document.querySelector("#activity-products");

    const activityStock =
        document.querySelector("#activity-stock");


    if (dashboardClients)
        dashboardClients.textContent = clients.length;


    if (dashboardProducts)
        dashboardProducts.textContent = products.length;


    if (dashboardRevenue)
        dashboardRevenue.textContent =
            formatCurrency(totalRevenue);


    if (dashboardStock)
        dashboardStock.textContent = totalStock;


    if (activityClients)
        activityClients.textContent =
            `${clients.length} registros disponíveis`;


    if (activityProducts)
        activityProducts.textContent =
            `${products.length} registros disponíveis`;


    if (activityStock)
        activityStock.textContent =
            lowStock > 0
                ? `${lowStock} produto(s) com estoque baixo`
                : "Nenhum alerta";
}


/* ============================================================
   CLIENTES
============================================================ */

function renderClients(list = clients) {

    const tbody =
        document.querySelector("#clients-body");

    const count =
        document.querySelector("#client-count");


    if (!tbody) return;


    if (count) {

        count.textContent =
            `${list.length} registro${list.length !== 1 ? "s" : ""}`;

    }


    if (list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Nenhum cliente encontrado.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML = list.map(client => {

        const statusClass =
            client.status === "Ativo"
                ? ""
                : "inactive";


        return `
            <tr>

                <td>
                    <strong>
                        ${client.company}
                    </strong>
                </td>

                <td>
                    ${client.name}
                </td>

                <td>
                    ${client.state}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${client.status}
                    </span>
                </td>

                <td>
                    ${formatCurrency(client.revenue)}
                </td>

                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="action-btn"
                            onclick="editClient(${client.id})">

                            Editar

                        </button>

                        <button
                            type="button"
                            class="action-btn delete"
                            onclick="deleteClient(${client.id})">

                            Excluir

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");

}


/* ============================================================
   PRODUTOS
============================================================ */

function renderProducts(list = products) {

    const tbody =
        document.querySelector("#products-body");

    const count =
        document.querySelector("#product-count");


    if (!tbody) return;


    if (count) {

        count.textContent =
            `${list.length} registro${list.length !== 1 ? "s" : ""}`;

    }


    if (list.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML = list.map(product => {

        let stockClass = "";


        if (product.stock <= 5) {

            stockClass = "stock-critical";

        } else if (product.stock <= 10) {

            stockClass = "stock-low";

        }


        return `
            <tr>

                <td>
                    <strong>
                        ${product.name}
                    </strong>
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ${product.brand}
                </td>

                <td class="${stockClass}">
                    ${product.stock}
                </td>

                <td>
                    ${formatCurrency(product.price)}
                </td>

                <td>

                    <div class="table-actions">

                        <button
                            type="button"
                            class="action-btn"
                            onclick="editProduct(${product.id})">

                            Editar

                        </button>

                        <button
                            type="button"
                            class="action-btn delete"
                            onclick="deleteProduct(${product.id})">

                            Excluir

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");

}


/* ============================================================
   NAVEGAÇÃO
============================================================ */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active-page");

        });


    const selectedPage =
        document.querySelector(`#${page}`);


    if (!selectedPage) return;


    selectedPage.classList.add("active-page");


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    const titles = {

        dashboard: "Dashboard",
        clientes: "Clientes",
        produtos: "Produtos",
        relatorios: "Relatórios"

    };


    const pageTitle =
        document.querySelector("#page-title");


    if (pageTitle) {

        pageTitle.textContent =
            titles[page] || "";

    }


    const sidebar =
        document.querySelector("#sidebar");


    if (sidebar) {

        sidebar.classList.remove("open");

    }

}


/* MENU LATERAL */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => showPage(button.dataset.page)
        );

    });


/* LINKS INTERNOS */

document
    .querySelectorAll("[data-page-link]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () =>
                showPage(
                    button.dataset.pageLink
                )
        );

    });


/* MENU MOBILE */

const mobileMenu =
    document.querySelector("#mobile-menu");


if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            const sidebar =
                document.querySelector("#sidebar");

            if (sidebar) {

                sidebar.classList.toggle("open");

            }

        }
    );

}


/* ============================================================
   MODAL
============================================================ */

function openModal(entity, id = null) {

    currentEntity = entity;

    editingId = id;


    /*
        Primeiro define o modo correto.
        Isso evita que campos ocultos continuem
        participando da validação.
    */

    setFormMode(entity);


    entityForm.reset();


    clientFields.classList.toggle(
        "hidden",
        entity !== "client"
    );


    productFields.classList.toggle(
        "hidden",
        entity !== "product"
    );


    if (entity === "client") {

        modalTitle.textContent =
            id
                ? "Editar cliente"
                : "Novo cliente";


        if (id) {

            const client =
                clients.find(
                    item => item.id === id
                );


            if (!client) return;


            clientCompany.value =
                client.company;

            clientName.value =
                client.name;

            clientState.value =
                client.state;

            clientStatus.value =
                client.status;

            clientRevenue.value =
                client.revenue;

        }

    }


    if (entity === "product") {

        modalTitle.textContent =
            id
                ? "Editar produto"
                : "Novo produto";


        if (id) {

            const product =
                products.find(
                    item => item.id === id
                );


            if (!product) return;


            productName.value =
                product.name;

            productCategory.value =
                product.category;

            productBrand.value =
                product.brand;

            productStock.value =
                product.stock;

            productPrice.value =
                product.price;

        }

    }


    modalOverlay.classList.add("active");

}


/* ============================================================
   FECHAR MODAL
============================================================ */

function closeModal() {

    modalOverlay.classList.remove("active");

    currentEntity = null;

    editingId = null;

}


/* BOTÃO X */

const modalClose =
    document.querySelector("#modal-close");


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeModal
    );

}


/* BOTÃO CANCELAR */

const modalCancel =
    document.querySelector("#modal-cancel");


if (modalCancel) {

    modalCancel.addEventListener(
        "click",
        closeModal
    );

}


/* CLIQUE FORA DO MODAL */

modalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === modalOverlay
        ) {

            closeModal();

        }

    }
);


/* ESC */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


/* ============================================================
   NOVO CLIENTE
============================================================ */

const newClient =
    document.querySelector("#new-client");


if (newClient) {

    newClient.addEventListener(
        "click",
        () => openModal("client")
    );

}


/* ============================================================
   NOVO PRODUTO
============================================================ */

const newProduct =
    document.querySelector("#new-product");


if (newProduct) {

    newProduct.addEventListener(
        "click",
        () => openModal("product")
    );

}


/* ============================================================
   SALVAR
============================================================ */

entityForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (currentEntity === "client") {

            saveClient();

            return;

        }


        if (currentEntity === "product") {

            saveProduct();

            return;

        }

    }
);


/* ============================================================
   SALVAR CLIENTE
============================================================ */

function saveClient() {

    const clientData = {

        company:
            clientCompany.value.trim(),

        name:
            clientName.value.trim(),

        state:
            clientState.value,

        status:
            clientStatus.value,

        revenue:
            Number(
                clientRevenue.value
            ) || 0

    };


    if (editingId) {

        const index =
            clients.findIndex(
                client =>
                    client.id === editingId
            );


        if (index === -1) return;


        clients[index] = {

            id: editingId,

            ...clientData

        };


        showToast(
            "Cliente atualizado com sucesso."
        );

    } else {

        clients.push({

            id: Date.now(),

            ...clientData

        });


        showToast(
            "Cliente cadastrado com sucesso."
        );

    }


    renderClients();

    updateDashboard();

    closeModal();

}


/* ============================================================
   SALVAR PRODUTO
============================================================ */

function saveProduct() {

    const productData = {

        name:
            productName.value.trim(),

        category:
            productCategory.value.trim(),

        brand:
            productBrand.value.trim(),

        stock:
            Number(
                productStock.value
            ) || 0,

        price:
            Number(
                productPrice.value
            ) || 0

    };


    if (editingId) {

        const index =
            products.findIndex(
                product =>
                    product.id === editingId
            );


        if (index === -1) return;


        products[index] = {

            id: editingId,

            ...productData

        };


        showToast(
            "Produto atualizado com sucesso."
        );

    } else {

        products.push({

            id: Date.now(),

            ...productData

        });


        showToast(
            "Produto cadastrado com sucesso."
        );

    }


    renderProducts();

    updateDashboard();

    closeModal();

}


/* ============================================================
   EDITAR CLIENTE
============================================================ */

function editClient(id) {

    openModal(
        "client",
        id
    );

}


/* ============================================================
   EDITAR PRODUTO
============================================================ */

function editProduct(id) {

    openModal(
        "product",
        id
    );

}


/* ============================================================
   EXCLUIR CLIENTE
============================================================ */

function deleteClient(id) {

    const client =
        clients.find(
            item => item.id === id
        );


    if (!client) return;


    const confirmed =
        confirm(
            `Deseja realmente excluir o cliente "${client.name}"?`
        );


    if (!confirmed) return;


    clients =
        clients.filter(
            item => item.id !== id
        );


    renderClients();

    updateDashboard();


    showToast(
        "Cliente excluído com sucesso."
    );

}


/* ============================================================
   EXCLUIR PRODUTO
============================================================ */

function deleteProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    const confirmed =
        confirm(
            `Deseja realmente excluir o produto "${product.name}"?`
        );


    if (!confirmed) return;


    products =
        products.filter(
            item => item.id !== id
        );


    renderProducts();

    updateDashboard();


    showToast(
        "Produto excluído com sucesso."
    );

}


/* ============================================================
   BUSCA CLIENTES
============================================================ */

const clientSearch =
    document.querySelector("#client-search");


if (clientSearch) {

    clientSearch.addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .toLowerCase()
                    .trim();


            const filtered =
                clients.filter(client =>

                    Object.values(client)
                        .join(" ")
                        .toLowerCase()
                        .includes(query)

                );


            renderClients(filtered);

        }
    );

}


/* ============================================================
   BUSCA PRODUTOS
============================================================ */

const productSearch =
    document.querySelector("#product-search");


if (productSearch) {

    productSearch.addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .toLowerCase()
                    .trim();


            const filtered =
                products.filter(product =>

                    Object.values(product)
                        .join(" ")
                        .toLowerCase()
                        .includes(query)

                );


            renderProducts(filtered);

        }
    );

}


/* ============================================================
   RELATÓRIOS
============================================================ */

document
    .querySelectorAll("[data-report]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const report =
                    button.dataset.report;


                if (report === "clientes") {

                    downloadClientsReport();

                }


                if (report === "produtos") {

                    downloadProductsReport();

                }


                if (report === "financeiro") {

                    downloadFinancialReport();

                }

            }
        );

    });


/* ============================================================
   DOWNLOAD CSV
============================================================ */

function downloadCSV(
    content,
    filename
) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


/* ============================================================
   RELATÓRIO CLIENTES
============================================================ */

function downloadClientsReport() {

    let csv =
        "Razão Social;Nome Fantasia;Estado;Status;Faturamento\n";


    clients.forEach(client => {

        csv +=
            `"${client.company}";"${client.name}";"${client.state}";"${client.status}";"${formatCurrency(client.revenue)}"\n`;

    });


    downloadCSV(
        csv,
        "relatorio-clientes.csv"
    );


    showToast(
        "Relatório de clientes gerado."
    );

}


/* ============================================================
   RELATÓRIO PRODUTOS
============================================================ */

function downloadProductsReport() {

    let csv =
        "Produto;Categoria;Marca;Estoque;Preço\n";


    products.forEach(product => {

        csv +=
            `"${product.name}";"${product.category}";"${product.brand}";"${product.stock}";"${formatCurrency(product.price)}"\n`;

    });


    downloadCSV(
        csv,
        "relatorio-produtos.csv"
    );


    showToast(
        "Relatório de produtos gerado."
    );

}


/* ============================================================
   RELATÓRIO FINANCEIRO
============================================================ */

function downloadFinancialReport() {

    const revenue =
        clients.reduce(
            (total, client) =>
                total + Number(client.revenue || 0),
            0
        );


    const stock =
        products.reduce(
            (total, product) =>
                total + Number(product.stock || 0),
            0
        );


    const csv =

        "Indicador;Valor\n" +

        `Clientes;${clients.length}\n` +

        `Produtos;${products.length}\n` +

        `Faturamento;${formatCurrency(revenue)}\n` +

        `Estoque;${stock} unidades\n`;


    downloadCSV(
        csv,
        "relatorio-financeiro.csv"
    );


    showToast(
        "Relatório financeiro gerado."
    );

}


/* ============================================================
   INICIALIZAÇÃO
============================================================ */

/*
    Nenhum modo é definido inicialmente.
    Portanto, todos os campos ficam desabilitados
    até o usuário abrir um cadastro/edição.
*/

setFormMode(null);

renderClients();

renderProducts();

updateDashboard();