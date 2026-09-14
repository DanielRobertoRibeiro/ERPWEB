/* ============================================================
   ERP WEB
   Frontend 1.0
   HTML + CSS + JavaScript
============================================================ */


/* ============================================================
   DADOS DA API
============================================================ */

const API_BASE_URL =
    window.ERP_CONFIG?.apiBaseUrl ||
    "http://127.0.0.1:5000/api";

let clients = [];
let products = [];
let isLoading = true;
let dataLoadError = "";


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

const systemStatusDot =
    document.querySelector("#system-status-dot");

const systemStatusText =
    document.querySelector("#system-status-text");


/* ============================================================
   CAMPOS DO CLIENTE
============================================================ */

const clientCompany =
    document.querySelector("#client-company");

const clientCnpj =
    document.querySelector("#client-cnpj");

const clientName =
    document.querySelector("#client-name");

const clientState =
    document.querySelector("#client-state");

const clientStatus =
    document.querySelector("#client-status");

const clientRevenue =
    document.querySelector("#client-revenue");

const modalSubmit =
    document.querySelector("#modal-submit");


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
        clientCnpj,
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
   COMUNICAÇÃO COM A API
============================================================ */

async function apiRequest(path, options = {}) {

    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok || !body.success) {
        throw new Error(body.message || "Não foi possível concluir a requisição.");
    }

    return body;

}


function setSaving(isSaving) {

    if (!modalSubmit) return;

    modalSubmit.disabled = isSaving;
    modalSubmit.textContent = isSaving ? "Salvando..." : "Salvar";

}


function setSystemStatus(status, message) {

    if (systemStatusDot) {
        systemStatusDot.classList.toggle("loading", status === "loading");
        systemStatusDot.classList.toggle("error", status === "error");
    }

    if (systemStatusText) {
        systemStatusText.textContent = message;
    }

}


async function loadInitialData() {

    isLoading = true;
    dataLoadError = "";
    setSystemStatus("loading", "Conectando ao servidor...");
    renderClients();
    renderProducts();

    try {

        const [clientsResponse, productsResponse] = await Promise.all([
            apiRequest("/clientes"),
            apiRequest("/produtos")
        ]);

        clients = clientsResponse.data;
        products = productsResponse.data;
        setSystemStatus("online", "Sistema online");

    } catch (error) {

        console.error(error);
        dataLoadError = error instanceof TypeError
            ? "Não foi possível acessar a API. Verifique se o servidor Flask está em execução."
            : error.message;
        setSystemStatus("error", "Sistema indisponível");
        showToast(dataLoadError);

    } finally {

        isLoading = false;
        renderClients();
        renderProducts();
        updateDashboard();

    }

}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

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

    if (isLoading) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">Carregando clientes...</td>
            </tr>
        `;
        return;

    }

    if (dataLoadError) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">${escapeHtml(dataLoadError)}</td>
            </tr>
        `;
        return;

    }


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
                        ${escapeHtml(client.company)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(client.name)}
                </td>

                <td>
                    ${escapeHtml(client.state)}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${escapeHtml(client.status)}
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

    if (isLoading) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">Carregando produtos...</td>
            </tr>
        `;
        return;

    }

    if (dataLoadError) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">${escapeHtml(dataLoadError)}</td>
            </tr>
        `;
        return;

    }


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
                        ${escapeHtml(product.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(product.category)}
                </td>

                <td>
                    ${escapeHtml(product.brand)}
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

            clientCnpj.value =
                client.cnpj;

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

async function saveClient() {

    const clientData = {

        company:
            clientCompany.value.trim(),

        cnpj:
            clientCnpj.value.trim(),

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


    try {

        setSaving(true);

        const response = await apiRequest(
            editingId ? `/clientes/${editingId}` : "/clientes",
            {
                method: editingId ? "PUT" : "POST",
                body: JSON.stringify(clientData)
            }
        );

        if (editingId) {

            clients = clients.map(client =>
                client.id === editingId ? response.data : client
            );

        } else {

            clients.push(response.data);

        }

        renderClients();
        updateDashboard();
        closeModal();
        showToast(response.message);

    } catch (error) {

        console.error(error);
        showToast(error.message);

    } finally {

        setSaving(false);

    }

}


/* ============================================================
   SALVAR PRODUTO
============================================================ */

async function saveProduct() {

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


    try {

        setSaving(true);

        const response = await apiRequest(
            editingId ? `/produtos/${editingId}` : "/produtos",
            {
                method: editingId ? "PUT" : "POST",
                body: JSON.stringify(productData)
            }
        );

        if (editingId) {

            products = products.map(product =>
                product.id === editingId ? response.data : product
            );

        } else {

            products.push(response.data);

        }

        renderProducts();
        updateDashboard();
        closeModal();
        showToast(response.message);

    } catch (error) {

        console.error(error);
        showToast(error.message);

    } finally {

        setSaving(false);

    }

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

async function deleteClient(id) {

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


    try {

        const response = await apiRequest(`/clientes/${id}`, {
            method: "DELETE"
        });

        clients = clients.filter(item => item.id !== id);
        renderClients();
        updateDashboard();
        showToast(response.message);

    } catch (error) {

        console.error(error);
        showToast(error.message);

    }

}


/* ============================================================
   EXCLUIR PRODUTO
============================================================ */

async function deleteProduct(id) {

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


    try {

        const response = await apiRequest(`/produtos/${id}`, {
            method: "DELETE"
        });

        products = products.filter(item => item.id !== id);
        renderProducts();
        updateDashboard();
        showToast(response.message);

    } catch (error) {

        console.error(error);
        showToast(error.message);

    }

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

loadInitialData();
