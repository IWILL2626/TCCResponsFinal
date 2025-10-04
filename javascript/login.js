// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
    apiKey: "AIzaSyAKTwMCe5sUPoZz5jwSYV1WiNmGjGxNxY8",
    authDomain: "tcciwill.firebaseapp.com",
    databaseURL: "https://tcciwill-default-rtdb.firebaseio.com",
    projectId: "tcciwill",
    storageBucket: "tcciwill.firebasestorage.app",
    messagingSenderId: "35460029082",
    appId: "1:35460029082:web:90ae52ac65ff355d8f9d23",
    measurementId: "G-YHPBHZQJBW"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // Adiciona o Firestore

/**
 * Função para checar se o usuário aceitou os termos e redirecionar
 * @param {firebase.User} user - O objeto do usuário autenticado
 */
const checkTermsAndRedirect = async (user) => {
    if (!user) return; // Se não há usuário, não faz nada

    const userDocRef = db.collection('vendedores').doc(user.uid);
    const userDoc = await userDocRef.get();

    if (userDoc.exists && userDoc.data().termsAccepted === true) {
        // Se já aceitou os termos, vai para a página principal
        // O arquivo que você forneceu como "termos.html" era um dashboard.
        // Vou usar o nome dele, mas o ideal é renomeá-lo para dashboard.html e usar vendas.html como a página principal.
        window.location.href = "vendas.html"; // << MUDE AQUI para sua página principal
    } else {
        // Se não aceitou (ou o campo não existe), vai para a página de termos
        window.location.href = "termos.html";
    }
};

// Login com e-mail/senha
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "none";

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Após o login, chama a função de verificação
            checkTermsAndRedirect(userCredential.user);
        })
        .catch((error) => {
            errorMessage.textContent = "E-mail ou senha incorretos. Por favor, tente novamente.";
            errorMessage.style.display = "block";
        });
});

// Login com Google
document.getElementById("googleLogin").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(async (result) => {
            const user = result.user;
            const userDocRef = db.collection('vendedores').doc(user.uid);

            // Se for um novo usuário via Google, cria o documento dele no Firestore
            if (result.additionalUserInfo.isNewUser) {
                await userDocRef.set({
                    nome: user.displayName,
                    email: user.email,
                    createdAt: new Date(),
                    termsAccepted: false // Começa como falso
                }, { merge: true });
            }
            
            // Após o login, chama a função de verificação
            checkTermsAndRedirect(user);
        })
        .catch((error) => {
            console.error("Erro detalhado:", error);
            document.getElementById("errorMessage").textContent = "Erro ao conectar com Google.";
        });
});

// Verifica se o usuário já está logado ao carregar a página de login
auth.onAuthStateChanged((user) => {
    if (user) {
        // Se já estiver logado, faz a verificação para garantir que não pule os termos
        checkTermsAndRedirect(user);
    }
});

// Recuperação de senha (sem alterações)
document.getElementById("forgotPassword").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("passwordResetModal").style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("passwordResetModal").style.display = "none";
});

document.getElementById("passwordResetForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;
    const errorMessage = document.getElementById("resetErrorMessage");
    errorMessage.style.display = "none";

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
            document.getElementById("passwordResetModal").style.display = "none";
        })
        .catch((error) => {
            errorMessage.textContent = "Erro ao enviar e-mail. Verifique se o e-mail está correto.";
            errorMessage.style.display = "block";
        });
});