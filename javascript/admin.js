// javascript/admin.js - VERSÃO 2.0 CORRIGIDA

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // 1. CONFIGURAÇÃO DO FIREBASE (COM A CHAVE CORRETA)
    // ===================================================================
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKTwMCe5sUPoZz5jwSYV1WiNmGjGxNxY8",
  authDomain: "tcciwill.firebaseapp.com",
  databaseURL: "https://tcciwill-default-rtdb.firebaseio.com",
  projectId: "tcciwill",
  storageBucket: "tcciwill.firebasestorage.app",
  messagingSenderId: "35460029082",
  appId: "1:35460029082:web:2b0f014e6df1ffe58f9d23",
  measurementId: "G-9T1Z90PPRG"
};
    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ===================================================================
    // 2. SELETORES DE ELEMENTOS DA PÁGINA (UI)
    // ===================================================================
    const ui = {
        loader: document.getElementById('loader'),
        servicesGrid: document.getElementById('servicesGrid'),
        logoutBtn: document.getElementById('logoutBtn'),
        modal: document.getElementById('detailsModal'),
        modalBody: document.getElementById('modalBody'),
        modalCloseBtn: document.getElementById('modalCloseBtn'),
    };

    let allServices = []; 

    // ===================================================================
    // 3. O GUARDIÃO: VERIFICAÇÃO DE ACESSO E PERMISSÕES
    // ===================================================================
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('vendedores').doc(user.uid).get();
                if (!userDoc.exists || !userDoc.data().isAdmin) {
                    console.warn("Acesso negado. Este usuário não é um administrador.");
                    alert("Acesso negado. Esta é uma área restrita para administradores.");
                    window.location.href = 'vendas.html';
                } else {
                    console.log("Acesso de administrador concedido para:", user.email);
                    loadAllServices();
                }
            } catch (error) {
                console.error("Erro ao verificar permissões de administrador:", error);
                alert("Ocorreu um erro ao verificar suas permissões.");
                window.location.href = 'vendas.html';
            }
        } else {
            console.log("Nenhum usuário logado. Redirecionando para login.");
            window.location.href = 'login.html';
        }
    });

    // ===================================================================
    // 4. O COLETOR DE DADOS: BUSCA TODOS OS SERVIÇOS
    // ===================================================================
    const loadAllServices = async () => {
        ui.loader.style.display = 'flex';
        ui.servicesGrid.innerHTML = '';
        try {
            const snapshot = await db.collection('produtos').orderBy('criadoEm', 'desc').get();
            if (snapshot.empty) {
                ui.servicesGrid.innerHTML = '<p>Nenhum serviço encontrado na plataforma.</p>';
            } else {
                allServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderCards(allServices);
            }
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
            ui.servicesGrid.innerHTML = '<p>Ocorreu um erro ao carregar os serviços.</p>';
        } finally {
            ui.loader.style.display = 'none';
        }
    };

    // ===================================================================
    // 5. O CONSTRUTOR DE CARDS (Com animação)
    // ===================================================================
    const renderCards = (services) => {
        ui.servicesGrid.innerHTML = ''; 
        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.dataset.id = service.id;

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${service.imagem || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}" alt="${service.nome}" class="card-image">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${service.nome || 'Serviço sem título'}</h3>
                    <p class="card-seller-info">
                        <i class="fas fa-user-circle"></i>
                        <span>${service.vendedor || 'Vendedor não informado'}</span>
                    </p>
                </div>
            `;
            
            card.addEventListener('click', () => showModal(service));
            ui.servicesGrid.appendChild(card);
            
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    };

    // ===================================================================
    // 6. LÓGICA DO MODAL
    // ===================================================================
    const showModal = (service) => {
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.preco);
        const createdDate = service.criadoEm ? service.criadoEm.toDate().toLocaleDateString('pt-BR') : 'N/A';
        ui.modalBody.innerHTML = `
            <div class="modal-image-container">
                <img src="${service.imagem || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}" class="modal-image" alt="${service.nome}">
            </div>
            <div class="modal-details">
                <h2 class="modal-title">${service.nome}</h2>
                <p><strong>Vendedor:</strong> ${service.vendedor}</p>
                <p><strong>Preço:</strong> ${price}</p>
                <p><strong>Prazo:</strong> ${service.prazo || 'Não informado'}</p>
                <p><strong>Data de Criação:</strong> ${createdDate}</p>
                <p class="modal-description"><strong>Descrição:</strong><br>${service.descricao || 'Nenhuma descrição fornecida.'}</p>
            </div>
            <div class="modal-actions">
                <button class="btn-delete" data-id="${service.id}">
                    <i class="fas fa-trash"></i> Excluir Permanentemente
                </button>
            </div>
        `;
        ui.modal.classList.add('show');
        ui.modal.querySelector('.btn-delete').addEventListener('click', handleDeleteService);
    };

    const closeModal = () => { ui.modal.classList.remove('show'); };
    ui.modalCloseBtn.addEventListener('click', closeModal);
    ui.modal.addEventListener('click', (event) => { if (event.target === ui.modal) { closeModal(); } });

    // ===================================================================
    // 7. AÇÃO DE EXCLUIR
    // ===================================================================
    const handleDeleteService = async (event) => {
        const button = event.currentTarget;
        const serviceId = button.dataset.id;
        if (!confirm("Tem certeza que deseja excluir PERMANENTEMENTE este serviço?\nEsta ação não pode ser desfeita.")) { return; }
        try {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';
            await db.collection('produtos').doc(serviceId).delete();
            alert("Serviço excluído com sucesso!");
            closeModal();
            loadAllServices();
        } catch (error) {
            console.error("Erro ao excluir serviço:", error);
            alert("Ocorreu um erro ao excluir o serviço.");
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-trash"></i> Excluir Permanentemente';
        }
    };

    // ===================================================================
    // 8. LOGOUT
    // ===================================================================
    ui.logoutBtn.addEventListener('click', () => { auth.signOut().then(() => { window.location.href = 'index.html'; }); });
});