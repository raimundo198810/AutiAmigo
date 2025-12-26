
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Erro fatal ao renderizar App:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h2 style="color: #ef4444;">Erro de Inicialização</h2>
        <p>Ocorreu um erro ao carregar os componentes. Por favor, limpe o cache e tente novamente.</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">Recarregar</button>
      </div>
    `;
  }
};

// Pequeno atraso para garantir que o DOM e o importmap estejam prontos
if (document.readyState === 'complete') {
  startApp();
} else {
  window.addEventListener('load', startApp);
}
