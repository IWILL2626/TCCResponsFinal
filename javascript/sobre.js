
function showInfo(id) {
    // Esconde todas as divs de conteúdo primeiro
    document.querySelectorAll('.info-content').forEach(div => {
        div.style.display = 'none';
    });
   
    // Mostra apenas a div clicada
    const div = document.getElementById(id);
    if (div) {
        div.style.display = 'block';
       
        // Rolagem suave até o conteúdo
        div.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Controle do botão de acessibilidade
const accessibilityBtn = document.getElementById('accessibilityBtn');
const accessibilityPanel = document.getElementById('accessibilityPanel');

accessibilityBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    accessibilityPanel.style.display = accessibilityPanel.style.display === 'block' ? 'none' : 'block';
});

// Fechar painel ao clicar fora
document.addEventListener('click', function() {
    accessibilityPanel.style.display = 'none';
});

// Prevenir que o clique no painel feche ele
accessibilityPanel.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Funções de acessibilidade
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

function increaseFontSize() {
    const body = document.body;
    if (body.classList.contains('font-size-larger')) {
        body.classList.remove('font-size-larger');
        body.classList.remove('font-size-large');
    } else if (body.classList.contains('font-size-large')) {
        body.classList.add('font-size-larger');
    } else {
        body.classList.add('font-size-large');
    }
}

function resetAccessibility() {
    document.body.classList.remove('high-contrast', 'font-size-large', 'font-size-larger');
}
