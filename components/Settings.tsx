
import React from 'react';

const SUPPORT_EMAIL = 'contato@ajudaautista.online';

interface SettingsProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const exportData = () => {
    const data = {
      cards: localStorage.getItem('ajuda_autista_custom_cards'),
      routine: localStorage.getItem('ajuda_autista_routine')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ajuda-autista-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cards) localStorage.setItem('ajuda_autista_custom_cards', data.cards);
        if (data.routine) localStorage.setItem('ajuda_autista_routine', data.routine);
        alert('Dados importados com sucesso! O aplicativo irá recarregar.');
        window.location.reload();
      } catch (err) {
        alert('Erro ao importar arquivo. Verifique se o formato está correto.');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    if (confirm('Isso apagará seus cartões personalizados e voltará para o padrão original. Continuar?')) {
      localStorage.removeItem('ajuda_autista_custom_cards');
      localStorage.removeItem('ajuda_autista_routine');
      window.location.reload();
    }
  };

  const contactSupport = () => {
    const subject = encodeURIComponent('Suporte/Feedback - Ajuda Autista');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2 transition-colors duration-500">Ajustes</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold">Personalize e proteja sua experiência.</p>
      </div>
      
      <div className="space-y-8">
        {/* Tema */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border-4 border-blue-50 dark:border-slate-700 shadow-sm transition-all duration-500">
          <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span>🌓</span> Visual do Aplicativo
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-6">
            Escolha entre o modo claro para o dia ou escuro para maior conforto visual.
          </p>
          <button
            onClick={onToggleDarkMode}
            className="w-full bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl flex items-center justify-between group hover:scale-[1.02] transition-all"
          >
            <span className="font-black text-slate-700 dark:text-slate-200 uppercase text-xs tracking-widest">
              {isDarkMode ? 'Ativar Modo Dia ☀️' : 'Ativar Modo Noite 🌙'}
            </span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </button>
        </div>

        {/* Suporte */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border-4 border-blue-50 dark:border-slate-700 shadow-sm transition-all duration-500">
          <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span>📩</span> Suporte e Sugestões
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-6">
            Teve algum problema ou tem uma ideia incrível? Mande um e-mail para nossa equipe.
          </p>
          <button
            onClick={contactSupport}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Falar com a Equipe 🚀
          </button>
          <p className="text-center text-[10px] font-black text-slate-300 dark:text-slate-500 mt-4 uppercase tracking-widest">
            {SUPPORT_EMAIL}
          </p>
        </div>

        {/* Backup */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border-2 border-slate-100 dark:border-slate-700 transition-all duration-500">
          <h3 className="text-xl font-black text-slate-700 dark:text-slate-200 mb-2">💾 Backup de Dados</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-6">
            Salve seus cartões e rotinas personalizadas para não perder nada.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={exportData}
              className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-4 rounded-2xl font-black hover:bg-black dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>📥</span> Exportar
            </button>
            
            <label className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-6 py-4 rounded-2xl font-black hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-center shadow-lg">
              <span>📤</span> Importar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>

        {/* Perigo */}
        <div className="bg-rose-50 dark:bg-rose-900/20 p-8 rounded-[3rem] border-2 border-rose-100 dark:border-rose-900/40 transition-all duration-500">
          <h3 className="text-xl font-black text-rose-800 dark:text-rose-400 mb-2">🆘 Zona de Perigo</h3>
          <p className="text-rose-700 dark:text-rose-500 text-sm font-bold mb-6">
            Se algo estiver errado, você pode resetar o app para os valores de fábrica.
          </p>
          <button 
            onClick={resetToDefaults}
            className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100 dark:shadow-rose-900/20"
          >
            Resetar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};
