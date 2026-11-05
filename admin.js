
const supabase = window.supabaseClient;

// ELEMENTOS
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const logoutButton = document.getElementById("logout-button");

// MOSTRAR LOGIN
function mostrarLogin() {
    dashboardSection.hidden = true;
    loginSection.hidden = false;
}

// MOSTRAR PAINEL
function mostrarPainel() {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
}

// VERIFICAR SE É ADMINISTRADOR
async function verificarAdministrador() {
    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
        console.error("Erro ao verificar administrador:", error);
        loginMessage.textContent = "Erro ao verificar permissões.";
        await supabase.auth.signOut();
        mostrarLogin();
        return false;
    }

    if (data !== true) {
        loginMessage.textContent = "Você não tem permissão para acessar este painel.";
        await supabase.auth.signOut();
        mostrarLogin();
        return false;
    }

    loginMessage.textContent = "";
    mostrarPainel();
    return true;
}

// VERIFICAR SESSÃO
async function verificarSessao() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        mostrarLogin();
        return;
    }

    await verificarAdministrador();
}

// REALIZAR LOGIN
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Verificando acesso...";

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("Erro no login:", error);
        loginMessage.textContent = "E-mail ou senha incorretos.";
        return;
    }

    if (data.session) {
        loginMessage.textContent = "Verificando permissões...";
        loginForm.reset();
        await verificarAdministrador();
    }
});

// SAIR DA CONTA
logoutButton.addEventListener("click", async function() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert("Não foi possível sair da conta.");
        return;
    }

    loginMessage.textContent = "";
    mostrarLogin();
});

// NAVEGAÇÃO ENTRE ABAS
const adminTabs = document.querySelectorAll(".admin-tab");
const adminContents = document.querySelectorAll(".admin-content");

adminTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
        const target = tab.dataset.tab;

        adminTabs.forEach(item => item.classList.remove("active"));
        adminContents.forEach(content => content.classList.remove("active"));

        tab.classList.add("active");

        const selectedContent = document.getElementById(target);

        if (selectedContent) {
            selectedContent.classList.add("active");
        }
    });
});

// INICIAR
verificarSessao();
