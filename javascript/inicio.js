// javascript/inicio.js - VERSÃO FINAL, COMPLETA E CORRIGIDA

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKTwMCe5sUPoZz5jwSYV1WiNmGjGxNxY8",
    authDomain: "tcciwill.firebaseapp.com",
    projectId: "tcciwill",
    storageBucket: "tcciwill.appspot.com",
    messagingSenderId: "35460029082",
    appId: "1:35460029082:web:90ae52ac65ff355d8f9d23"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const logout = () => {
    auth.signOut().catch(error => console.error("Erro ao fazer logout:", error));
};

document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================================
    // ================ ELEMENTOS DO DOM ==================
    // ====================================================
    const overlay = document.getElementById('overlay');
    const ideaBulb = document.getElementById('idea-bulb');
    const ideaText = document.getElementById('idea-text');
    
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

        // Adiciona evento para fechar o menu ao clicar em um link
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
    // ============= LÓGICA DA LÂMPADA INTERATIVA =========
    // ====================================================
    if (ideaBulb && ideaText) {
        ideaBulb.addEventListener('click', () => {
            ideaBulb.classList.toggle('glow');
            ideaText.classList.toggle('visible');
        });
    }

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
    // ============ LÓGICA DE LOGIN RESTAURADA ============
    // ====================================================
    const checkAdminStatus = async (user) => {
        if (!user) return;
        try {
            const userDoc = await db.collection('vendedores').doc(user.uid).get();
            if (userDoc.exists && userDoc.data().isAdmin === true) {
                const adminLinkContainer = document.getElementById('adminLinkContainer');
                if (adminLinkContainer) adminLinkContainer.style.display = 'block';
            }
        } catch (error) { console.error("Erro ao verificar status de admin:", error); }
    };

    auth.onAuthStateChanged(user => {
        const loggedIn = !!user;

        const updateVisibility = (elementId, show) => {
            const element = document.getElementById(elementId);
            if (element) {
                // 'flex' é usado para links com ícones, 'block' para outros
                const displayStyle = (element.classList.contains('dropdown-link') || element.classList.contains('nav-btn')) ? 'flex' : 'block';
                element.style.display = show ? displayStyle : 'none';
            }
        };

        // Atualiza a visibilidade dos links do DESKTOP
        updateVisibility('loginLinkDesktop', !loggedIn);
        updateVisibility('vendasLinkDesktop', loggedIn);
        updateVisibility('userActionsDesktop', loggedIn);
        updateVisibility('profileLinkDesktop', loggedIn);
        updateVisibility('myServicesLinkDesktop', loggedIn);
        updateVisibility('logoutBtnDesktop', loggedIn);
        updateVisibility('logoutDividerDesktop', loggedIn);

        // O menu mobile agora é estático e não precisa ser alterado aqui,
        // pois ele é focado em usuários não logados, como você pediu.
        
        if (loggedIn) {
            checkAdminStatus(user);
        } else {
            updateVisibility('adminLinkContainer', false);
        }
    });

    const logoutBtnDesktop = document.getElementById('logoutBtnDesktop');
    if(logoutBtnDesktop) logoutBtnDesktop.addEventListener('click', logout);
    
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