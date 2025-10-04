document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const profileLink = document.getElementById('profileLink');
    const myProductsLink = document.getElementById('myProductsLink');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');

    // ====================================================
    // ============== LÓGICA DO MODO ESCURO ===============
    // ====================================================
    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀️ Modo Claro';
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.innerHTML = '🌙 Modo Escuro';
        }
    };

    // Verifica o estado salvo no localStorage ao carregar a página
    const isDarkModeSaved = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(isDarkModeSaved);

    // Evento de clique para alternar o modo
    darkModeToggle.addEventListener('click', () => {
        const isCurrentlyDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', !isCurrentlyDark);
        applyDarkMode(!isCurrentlyDark);
    });

    // ====================================================
    // =============== LÓGICA DO DROPDOWN =================
    // ====================================================
    settingsBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        settingsDropdown.classList.toggle('show');
    });

    // Fecha o dropdown se o usuário clicar fora dele
    window.addEventListener('click', (event) => {
        if (!settingsBtn.contains(event.target) && !settingsDropdown.contains(event.target)) {
            if (settingsDropdown.classList.contains('show')) {
                settingsDropdown.classList.remove('show');
            }
        }
    });
    
    // ====================================================
    // ================ VERIFICAÇÃO DE LOGIN ================
    // ====================================================
    // Simulação de verificação de login (substituir por lógica Firebase real)
    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Exemplo simples
        if (loggedIn) {
            if (loginLink) loginLink.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (profileLink) profileLink.style.display = 'block';
            if (myProductsLink) myProductsLink.style.display = 'block';
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (profileLink) profileLink.style.display = 'none';
            if (myProductsLink) myProductsLink.style.display = 'none';
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.setItem('isLoggedIn', 'false');
            checkLoginStatus();
            // Redirecionar para a página de login ou inicial
            window.location.href = 'login.html';
        });
    }

    // Aplica o estado inicial de modo escuro e login
    applyDarkMode();
    checkLoginStatus();
});