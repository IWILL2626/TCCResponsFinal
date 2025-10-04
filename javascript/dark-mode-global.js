document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Seleciona todos os logos que precisam ser trocados
    // Usamos querySelectorAll para pegar múltiplos logos na mesma página (ex: header e card de login)
    const logos = document.querySelectorAll('.logo-to-toggle');

    // --- FUNÇÃO PRINCIPAL DO MODO ESCURO ---
    const updateDarkModeState = (isDark) => {
        // Aplica a classe ao body
        body.classList.toggle('dark-mode', isDark);

        // Atualiza o texto do botão (se existir)
        if (darkModeToggle) {
            darkModeToggle.innerHTML = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
        }

        // --- LÓGICA PARA TROCAR OS ÍCONES ---
        // Itera sobre todos os logos encontrados na página
        logos.forEach(logo => {
            if (isDark) {
                // Se o modo escuro estiver ativo, usa o ícone branco
                logo.src = 'img/icon branco.png';
            } else {
                // Se estiver no modo claro, usa o ícone normal
                logo.src = 'img/icon.png';
            }
        });
    };

    // --- INICIALIZAÇÃO E EVENTOS ---

    // Aplica o tema salvo no localStorage ao carregar a página
    const isDarkModeSaved = localStorage.getItem('darkMode') === 'true';
    updateDarkModeState(isDarkModeSaved);

    // Adiciona o evento de clique ao botão de alternância (se existir)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', !isCurrentlyDark);
            updateDarkModeState(!isCurrentlyDark);
        });
    }
});

// Para páginas que não têm o script principal, esta função aplica o tema imediatamente
// Isso evita o "flash" de tema claro ao carregar a página.
(function() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.documentElement.classList.add('dark-mode-preload');
        document.body.classList.add('dark-mode');
    }
})();