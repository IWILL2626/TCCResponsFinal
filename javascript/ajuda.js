// javascript/ajuda.js - VERSÃO FINAL COMPLETA

const firebaseConfig = {
    apiKey: "AIzaSyAKTwMCe5sUPoZz5jwSYV1WiNmGjGxNxY8",
    authDomain: "tcciwill.firebaseapp.com",
    databaseURL: "https://tcciwill-default-rtdb.firebaseio.com",
    projectId: "tcciwill",
    storageBucket: "tcciwill.appspot.com",
    messagingSenderId: "35460029082",
    appId: "1:35460029082:web:90ae52ac65ff355d8f9d23",
    measurementId: "G-YHPBHZQJBW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

let currentUser = null;

// Função global para alternar entre as abas 'Tutoriais' e 'Denúncias'
function showInfo(id) {
    document.querySelectorAll('.info-content').forEach(div => {
        div.style.display = 'none';
    });
    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const divToShow = document.getElementById(id);
    const btnToActivate = document.querySelector(`.info-btn[onclick="showInfo('${id}')"]`);
    if (divToShow) {
        divToShow.style.display = 'block';
    }
    if (btnToActivate) {
        btnToActivate.classList.add('active');
    }
}

// Executa o código principal após o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Mostra a aba de tutoriais por padrão
    showInfo('tutoriais');

    // LÓGICA DO MENU SANFONA (FAQ)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

            // Fecha todos os outros para criar um efeito 'accordion'
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('open');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                }
            });

            // Alterna o estado do item clicado
            question.classList.toggle('open', !isOpen);
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // LÓGICA DO FORMULÁRIO DE DENÚNCIA
    const formDenuncia = document.getElementById('form-denuncia');
    const loginNecessarioContainer = document.getElementById('login-necessario-container');
    const btnEnviar = document.getElementById('btn-enviar-denuncia');
    const btnText = btnEnviar.querySelector('.btn-text');
    const btnSpinner = btnEnviar.querySelector('.btn-spinner');
    const feedbackDiv = document.getElementById('feedback');

    auth.onAuthStateChanged(user => {
        currentUser = user;
        // Verifica qual aba está ativa para mostrar a mensagem de login apenas na aba de denúncias
        if(document.getElementById('denuncias').style.display === 'block') {
            toggleDenunciaFormVisibility(user);
        }
    });

    // Adiciona listener à função showInfo para verificar o login ao trocar de aba
    window.originalShowInfo = showInfo;
    showInfo = function(id) {
        window.originalShowInfo(id);
        if (id === 'denuncias') {
            toggleDenunciaFormVisibility(currentUser);
        }
    }
    
    formDenuncia.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!currentUser) {
            showFeedback('Você precisa estar logado para enviar uma denúncia.', 'error');
            return;
        }
        setLoading(true);

        const denunciado = document.getElementById('denunciado').value;
        const motivo = document.getElementById('motivo').value;
        const descricao = document.getElementById('descricao').value;
        const provasFile = document.getElementById('provas').files[0];
        let provasUrl = null;

        try {
            if (provasFile) {
                if (provasFile.size > 5 * 1024 * 1024) {
                    throw new Error('O arquivo de prova não pode exceder 5MB.');
                }
                const storageRef = storage.ref(`denuncias/${Date.now()}_${provasFile.name}`);
                const uploadTask = await storageRef.put(provasFile);
                provasUrl = await uploadTask.ref.getDownloadURL();
            }

            const denuncia = {
                denuncianteId: currentUser.uid,
                denunciado: denunciado,
                motivo: motivo,
                descricao: descricao,
                provaUrl: provasUrl,
                data: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pendente'
            };

            await db.collection('denuncias').add(denuncia);
            showFeedback('Denúncia enviada com sucesso! Nossa equipe irá analisar o caso.', 'success');
            formDenuncia.reset();

        } catch (error) {
            console.error("Erro ao enviar denúncia: ", error);
            showFeedback(`Erro ao enviar denúncia: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    });

    function toggleDenunciaFormVisibility(user) {
        if (user) {
            loginNecessarioContainer.style.display = 'none';
            formDenuncia.style.display = 'block';
        } else {
            loginNecessarioContainer.style.display = 'block';
            formDenuncia.style.display = 'none';
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            btnEnviar.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'inline-block';
        } else {
            btnEnviar.disabled = false;
            btnText.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
        }
    }

    function showFeedback(message, type) {
        feedbackDiv.className = `feedback-message ${type}`;
        feedbackDiv.textContent = message;
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 7000);
    }
});