document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
    }
});
// --- Elementos dos Logos ---
const headerLogo = document.getElementById('header-logo');
const footerLogo = document.getElementById('footer-logo');

const updateDarkModeState = (isDark) => {
    body.classList.toggle('dark-mode', isDark);
    if (darkModeToggle) {
        darkModeToggle.innerHTML = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    }

    // --- Lógica para trocar os ícones ---
    if (isDark) {
        // Se o modo escuro estiver ativo, use o ícone branco
        if (headerLogo) headerLogo.src = 'img/icon branco.png';
        if (footerLogo) footerLogo.src = 'img/icon branco.png';
    } else {
        // Se estiver no modo claro, use o ícone normal (escuro)
        if (headerLogo) headerLogo.src = 'img/icon.png';
        if (footerLogo) footerLogo.src = 'img/icon.png'; // <- Corrigido para mostrar o ícone escuro no rodapé claro
    }
};