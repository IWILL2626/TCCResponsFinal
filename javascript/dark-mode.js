document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const profileLink = document.getElementById('profileLink');
    const myProductsLink = document.getElementById('myProductsLink');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const body = document.body;

    // ====================================================
    // ============== LÓGICA DO MODO ESCURO ===============
    // ====================================================
    const updateDarkModeState = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '☀️ Modo Claro';
            }
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '🌙 Modo Escuro';
            }
        }
    };

    // Aplica o tema salvo no localStorage imediatamente ao carregar
    const isDarkModeSaved = localStorage.getItem('darkMode') === 'true';
    updateDarkModeState(isDarkModeSaved);

    // Evento de clique para alternar o modo (se o botão existir)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', !isCurrentlyDark);
            updateDarkModeState(!isCurrentlyDark);
        });
    }

    // ====================================================
    // =============== LÓGICA DO DROPDOWN =================
    // ====================================================
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (settingsDropdown) {
                settingsDropdown.classList.toggle('show');
            }
        });
    }

    // Fecha o dropdown se o usuário clicar fora dele
    window.addEventListener('click', (event) => {
        if (settingsDropdown && !settingsDropdown.contains(event.target) && settingsDropdown.classList.contains('show')) {
            settingsDropdown.classList.remove('show');
        }
    });

    // ====================================================
    // ================ VERIFICAÇÃO DE LOGIN ================
    // ====================================================
    // Lógica para mostrar/esconder links com base no status do usuário
    // A implementação real deve usar o estado de autenticação do Firebase.
    function checkLoginStatus() {
        // Exemplo simples com localStorage. Substitua pela lógica real do Firebase
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
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
            window.location.href = 'login.html';
        });
    }

    checkLoginStatus();
});