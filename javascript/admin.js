// javascript/admin.js

document.addEventListener('DOMContentLoaded', () => {

    // Configuração do Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAKTwMCe5sUPoZz5jwSYV1WiNmGjGxNxY8",
      authDomain: "tcciwill.firebaseapp.com",
      projectId: "tcciwill",
      storageBucket: "tcciwill.appspot.com",
      messagingSenderId: "35460029082",
      appId: "1:35460029082:web:90ae52ac65ff355d8f9d23"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Seletores de elementos da página
    const ui = {
        loader: document.getElementById('loader'),
        servicesGrid: document.getElementById('servicesGrid'),
        logoutBtn: document.getElementById('logoutBtn'),
        modal: document.getElementById('detailsModal'),
        modalBody: document.getElementById('modalBody'),
        modalCloseBtn: document.getElementById('modalCloseBtn'),
        denunciasLoader: document.getElementById('denunciasLoader'),
        denunciasTableBody: document.getElementById('denunciasTableBody'),
    };

    let allServices = [];
    let allDenuncias = [];

    // Verificação de Acesso
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('vendedores').doc(user.uid).get();
                if (!userDoc.exists || !userDoc.data().isAdmin) {
                    alert("Acesso negado. Esta é uma área restrita para administradores.");
                    window.location.href = 'vendas.html';
                } else {
                    console.log("Acesso de administrador concedido para:", user.email);
                    loadAllServices();
                    loadDenuncias();
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

    // ==========================================================
    // ========= FUNÇÕES DE GERENCIAMENTO DE SERVIÇOS =========
    // ==========================================================

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
            card.addEventListener('click', () => showServiceModal(service));
            ui.servicesGrid.appendChild(card);
            setTimeout(() => { card.classList.add('visible'); }, index * 50);
        });
    };
    
    const showServiceModal = (service) => {
        ui.modalBody.className = 'modal-body-grid';
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
    
    const closeModal = () => { ui.modal.classList.remove('show'); };
    ui.modalCloseBtn.addEventListener('click', closeModal);
    ui.modal.addEventListener('click', (event) => { if (event.target === ui.modal) closeModal(); });

    // ==========================================================
    // ========= FUNÇÕES PARA GERENCIAR DENÚNCIAS =========
    // ==========================================================
    const loadDenuncias = async () => {
        ui.denunciasLoader.style.display = 'flex';
        ui.denunciasTableBody.innerHTML = '';
        try {
            const snapshot = await db.collection('denuncias').orderBy('data', 'desc').get();
            if (snapshot.empty) {
                ui.denunciasTableBody.innerHTML = '<tr><td colspan="6">Nenhuma denúncia encontrada.</td></tr>';
            } else {
                allDenuncias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderDenuncias(allDenuncias);
            }
        } catch (error) {
            console.error("Erro ao carregar denúncias:", error);
            ui.denunciasTableBody.innerHTML = '<tr><td colspan="6">Ocorreu um erro ao carregar as denúncias.</td></tr>';
        } finally {
            ui.denunciasLoader.style.display = 'none';
        }
    };

    const renderDenuncias = (denuncias) => {
        ui.denunciasTableBody.innerHTML = '';
        denuncias.forEach(denuncia => {
            const row = document.createElement('tr');
            const dataDenuncia = denuncia.data ? denuncia.data.toDate().toLocaleDateString('pt-BR') : 'N/A';
            const linkProva = denuncia.provaUrl ? `<a href="${denuncia.provaUrl}" target="_blank">Ver anexo</a>` : 'Sem anexo';
            row.innerHTML = `
                <td>${dataDenuncia}</td>
                <td>${denuncia.denunciado}</td>
                <td>${denuncia.motivo}</td>
                <td><span class="status-badge status-${denuncia.status}">${denuncia.status}</span></td>
                <td>${linkProva}</td>
                <td class="table-actions">
                    <button class="action-btn btn-view-details" data-id="${denuncia.id}"><i class="fas fa-eye"></i> Detalhes</button>
                    <button class="action-btn btn-resolve" data-id="${denuncia.id}"><i class="fas fa-check"></i> Resolver</button>
                </td>
            `;
            row.querySelector('.btn-view-details').addEventListener('click', () => showDenunciaModal(denuncia));
            row.querySelector('.btn-resolve').addEventListener('click', () => updateDenunciaStatus(denuncia.id, 'resolvido'));
            ui.denunciasTableBody.appendChild(row);
        });
    };

    const showDenunciaModal = (denuncia) => {
        ui.modalBody.className = '';
        const dataDenuncia = denuncia.data ? denuncia.data.toDate().toLocaleString('pt-BR') : 'N/A';
        const linkProva = denuncia.provaUrl ? `<a href="${denuncia.provaUrl}" target="_blank">Abrir anexo em nova aba</a>` : 'Nenhuma prova anexada.';
        ui.modalBody.innerHTML = `
            <div class="modal-details">
                <h2 class="modal-title">Detalhes da Denúncia</h2>
                <p><strong>Denunciado:</strong> ${denuncia.denunciado}</p>
                <p><strong>Motivo:</strong> ${denuncia.motivo}</p>
                <p><strong>Data:</strong> ${dataDenuncia}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${denuncia.status}">${denuncia.status}</span></p>
                <p><strong>Prova:</strong> ${linkProva}</p>
                <p class="modal-description"><strong>Descrição:</strong><br>${denuncia.descricao || 'Nenhuma descrição fornecida.'}</p>
            </div>
            <div class="modal-actions">
                <button class="btn-delete" data-id="${denuncia.id}"><i class="fas fa-trash"></i> Excluir Denúncia</button>
            </div>
        `;
        ui.modal.classList.add('show');
        ui.modal.querySelector('.btn-delete').addEventListener('click', () => deleteDenuncia(denuncia.id));
    };
    
    window.updateDenunciaStatus = async (denunciaId, novoStatus) => {
        if (!confirm(`Tem certeza que deseja marcar esta denúncia como "${novoStatus}"?`)) return;
        try {
            await db.collection('denuncias').doc(denunciaId).update({ status: novoStatus });
            alert('Status atualizado com sucesso!');
            loadDenuncias();
        } catch (error) { console.error("Erro ao atualizar status:", error); alert('Falha ao atualizar status.'); }
    };

    window.deleteDenuncia = async (denunciaId) => {
        if (!confirm("ATENÇÃO: Deseja excluir esta denúncia permanentemente?")) return;
        try {
            await db.collection('denuncias').doc(denunciaId).delete();
            alert('Denúncia excluída com sucesso!');
            closeModal();
            loadDenuncias();
        } catch (error) { console.error("Erro ao excluir denúncia:", error); alert('Falha ao excluir denúncia.'); }
    };

    // Logout
    ui.logoutBtn.addEventListener('click', () => { auth.signOut().then(() => { window.location.href = 'index.html'; }); });
});