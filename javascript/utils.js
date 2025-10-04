'use strict';

/**
 * Exibe uma notificação flutuante (toast) na tela com animação.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} [type='success'] - O tipo de toast ('success' ou 'error').
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.error('O elemento #toast-container não foi encontrado no HTML.');
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Adiciona a classe 'show' para iniciar a animação de entrada
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Remove o toast após 5 segundos
  setTimeout(() => {
    toast.classList.remove('show');
    // Espera a animação de saída terminar para remover o elemento
    setTimeout(() => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 500);
  }, 5000);
}

/**
 * Mostra ou esconde a tela de carregamento (loading overlay).
 * @param {boolean} isLoading - `true` para mostrar, `false` para esconder.
 */
function toggleLoading(isLoading) {
    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        // Usa a classe 'visible' para controlar a exibição, como no seu arquivo
        loadingOverlay.classList.toggle('visible', isLoading);
    }
}