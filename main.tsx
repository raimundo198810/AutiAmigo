
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Shim para garantir que process.env funcione em ambientes de hospedagem estática
// Fix: Use any cast on window to avoid TypeScript property error for 'process'
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Não foi possível encontrar o elemento root no HTML.");
}
