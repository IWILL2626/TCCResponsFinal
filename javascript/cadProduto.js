'use strict';

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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof showToast === 'undefined' || typeof toggleLoading === 'undefined') {
        console.error("utils.js não foi carregado corretamente.");
        return;
    }

    // Verifica se o usuário está logado
    auth.onAuthStateChanged(user => {
        if (!user) {
            showToast("Você precisa estar logado para cadastrar um serviço.", "error");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });

    // Elementos do DOM
    const productName = document.getElementById('productName');
    const deliveryTime = document.getElementById('deliveryTime');
    const price = document.getElementById('price');
    const description = document.getElementById('description');
    const sellerName = document.getElementById('sellerName');
    const categorySelect = document.getElementById('categorySelect');
    const customCategoryGroup = document.querySelector('.custom-category-group');
    const customCategoryInput = document.getElementById('customCategory');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const publishBtn = document.getElementById('publishBtn');

    let uploadedImageBase64 = "";

    // Lógica para categoria e preview da imagem
    categorySelect.addEventListener('change', () => {
        customCategoryGroup.style.display = (categorySelect.value === 'outros') ? 'block' : 'none';
        if (categorySelect.value !== 'outros') customCategoryInput.value = '';
        checkFormValidity();
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadedImageBase64 = e.target.result;
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = "#";
            imagePreview.style.display = 'none';
            uploadedImageBase64 = "";
            checkFormValidity();
        }
    });

    // Função de validação
    const checkFormValidity = () => {
        const areTextFieldsValid = productName.value.trim() !== '' &&
                                 deliveryTime.value.trim() !== '' &&
                                 price.value.trim() !== '' &&
                                 description.value.trim() !== '' &&
                                 sellerName.value.trim() !== '';
        const isCategoryValid = (categorySelect.value !== '') &&
                                (categorySelect.value !== 'outros' || customCategoryInput.value.trim() !== '');
        const isImageUploaded = uploadedImageBase64 !== "";
        publishBtn.disabled = !(areTextFieldsValid && isCategoryValid && isImageUploaded);
    };

    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });
    customCategoryInput.addEventListener('input', checkFormValidity);

    // Ação do botão de publicar
    publishBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
            showToast("Sua sessão expirou. Por favor, faça login novamente.", "error");
            return;
        }

        toggleLoading(true);

        const productCategory = (categorySelect.value === 'outros') ? customCategoryInput.value.trim() : categorySelect.value;
        
        const product = {
            nome: productName.value.trim(),
            prazo: deliveryTime.value.trim(),
            preco: parseFloat(price.value),
            descricao: description.value.trim(),
            vendedor: sellerName.value.trim(),
            imagem: uploadedImageBase64,
            categoria: productCategory,
            vendedorId: user.uid,
            avaliacao: 0,
            criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection('produtos').add(product);
            showToast("Serviço publicado com sucesso!", "success");
            setTimeout(() => {
                window.location.href = 'vendas.html';
            }, 1500);

        } catch (error) {
            console.error("Erro ao salvar no Firestore: ", error);
            showToast("Erro ao publicar o serviço. Tente novamente.", "error");
        } finally {
            toggleLoading(false);
        }
    });

    checkFormValidity();
});