// javascript/inicio.js

document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================================
    // ================ ELEMENTOS DO DOM ==================
    // ====================================================
    const overlay = document.getElementById('overlay');
    
    // Elementos do Menu Desktop
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    // Elementos do Menu Mobile
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    const mobileNav = document.getElementById('mobileNav');

    // ====================================================
    // ================== MENU MOBILE =====================
    // ====================================================
    if (mobileMenuIcon && mobileNav) {
        mobileMenuIcon.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            overlay.classList.toggle('active');
            const icon = mobileMenuIcon.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        overlay.addEventListener('click', () => {
            if (mobileNav.classList.contains('open')) {
                mobileMenuIcon.click();
            }
        });

        mobileNav.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && mobileNav.classList.contains('open')) {
                 mobileMenuIcon.click();
            }
        });
    }

    // ====================================================
    // =============== LÓGICA DO DROPDOWN (DESKTOP) =======
    // ====================================================
    if (settingsBtn && settingsDropdown) {
        settingsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            settingsDropdown.classList.toggle('show');
        });
    }
    window.addEventListener('click', (event) => {
        if (settingsDropdown && !settingsBtn.contains(event.target) && !settingsDropdown.contains(event.target)) {
            settingsDropdown.classList.remove('show');
        }
    });


    // ====================================================
    // ========= SINCRONIZAÇÃO DO MODO ESCURO =============
    // ====================================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');

    if (darkModeToggle && darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', () => {
            darkModeToggle.click();
        });
    }

    // ====================================================
    // ============== ANIMAÇÃO AO ROLAR (SCROLL) ==========
    // ====================================================
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.about-us-section, .feature-card').forEach(el => observer.observe(el));
    
    // ====================================================
    // ============== LÓGICA DAS TABS 'SOBRE' =============
    // ====================================================
    const aboutTabs = document.querySelectorAll('.about-tab-btn');
    const aboutContentCards = document.querySelectorAll('.about-content-card');
    
    if (aboutTabs.length > 0) {
        aboutTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;
                aboutTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                aboutContentCards.forEach(card => {
                    card.classList.toggle('active', card.id === targetId);
                });
            });
        });
    }
});