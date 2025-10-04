// javascript/perfil.js

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAKTwMCe5sUPoZz5jwSYV1WiNmGjGxNxY8",
    authDomain: "tcciwill.firebaseapp.com",
    projectId: "tcciwill",
    storageBucket: "tcciwill.appspot.com",
    messagingSenderId: "35460029082",
    appId: "1:35460029082:web:90ae52ac65ff355d8f9d23"
};

// Inicialização dos serviços Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTOS DO DOM ---
    const editModal = document.getElementById('editModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const editNameInput = document.getElementById('editName');
    const editPhoneInput = document.getElementById('editPhone');
    const editClassInput = document.getElementById('editClass');
    
    const profileImageInput = document.getElementById('profileImageInput');
    const profilePic = document.getElementById('profilePic');

    let currentUser = null;

    // --- FUNÇÕES DE CONTROLE DO MODAL ---
    const openModal = () => editModal.classList.add('show');
    const closeModal = () => editModal.classList.remove('show');
    editProfileBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    editModal.addEventListener('click', (event) => {
        if (event.target === editModal) closeModal();
    });

    // --- FUNÇÃO PRINCIPAL DE CARREGAMENTO ---
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            try {
                const userDoc = await db.collection("vendedores").doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    
                    // ✅ CORRIGIDO: Usando os IDs corretos do seu HTML original
                    document.getElementById('userName').textContent = userData.nome || "Não informado";
                    document.getElementById('userEmail').textContent = user.email;
                    document.getElementById('userEmail2').textContent = user.email;
                    document.getElementById('userPhone').textContent = userData.telefone || "Não informado";
                    document.getElementById('userClass').textContent = userData.turma || "Não informada";
                    
                    if (userData.imagemPerfil) {
                        profilePic.src = userData.imagemPerfil;
                    }
                    
                    editNameInput.value = userData.nome || "";
                    editPhoneInput.value = userData.telefone || "";
                    editClassInput.value = userData.turma || "";
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                showToast("Erro ao carregar perfil.", "error");
            }
        } else {
            window.location.href = "login.html";
        }
    });

    // ✅ CORRIGIDO: Função para salvar alterações de texto (agora com utils.js)
    saveChangesBtn.addEventListener('click', async () => {
        if (!currentUser) return;

        const dataToUpdate = {
            nome: editNameInput.value.trim(),
            telefone: editPhoneInput.value.trim(),
            turma: editClassInput.value.trim()
        };

        toggleLoading(true);
        try {
            await db.collection("vendedores").doc(currentUser.uid).update(dataToUpdate);

            // ✅ CORRIGIDO: Atualizando os elementos corretos na página
            document.getElementById('userName').textContent = dataToUpdate.nome;
            document.getElementById('userPhone').textContent = dataToUpdate.telefone;
            document.getElementById('userClass').textContent = dataToUpdate.turma;
            
            showToast("Perfil atualizado com sucesso!", "success");
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error);
            showToast("Ocorreu um erro ao salvar.", "error");
        } finally {
            toggleLoading(false);
        }
    });

    // ✅ CORRIGIDO: Função para atualizar a foto de perfil (agora com redimensionamento)
    profileImageInput.addEventListener('change', async (event) => {
        if (!currentUser) return;
        const file = event.target.files[0];
        if (!file) return;

        toggleLoading(true);
        try {
            const originalBase64 = await convertImageToBase64(file);
            const resizedBase64 = await resizeImage(originalBase64);

            profilePic.src = resizedBase64; // Atualiza na tela
            
            await db.collection("vendedores").doc(currentUser.uid).update({
                imagemPerfil: resizedBase64 // Salva no Firebase
            });

            showToast('Foto de perfil atualizada!', 'success');
        } catch (error) {
            console.error("Erro ao atualizar foto:", error);
            showToast('Não foi possível atualizar a foto.', 'error');
            // Recarrega os dados antigos em caso de erro
            auth.onAuthStateChanged(user => loadUserProfile(user.uid));
        } finally {
            toggleLoading(false);
        }
    });
    
    // --- FUNÇÕES AUXILIARES ---
    function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function resizeImage(base64Str, maxWidth = 400, maxHeight = 400) {
        return new Promise((resolve) => {
            let img = new Image();
            img.src = base64Str;
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
        });
    }
});