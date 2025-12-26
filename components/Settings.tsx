
import React from 'react';

export const Settings: React.FC = () => {
  const exportData = () => {
    const data = {
      cards: localStorage.getItem('autiamigo_custom_cards'),
      routine: localStorage.getItem('autiamigo_routine')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autiamigo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cards) localStorage.setItem('autiamigo_custom_cards', data.cards);
        if (data.routine) localStorage.setItem('autiamigo_routine', data.routine);
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
      localStorage.removeItem('autiamigo_custom_cards');
      localStorage.removeItem('autiamigo_routine');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurações e Backup</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-2">💾 Backup de Dados</h3>
          <p className="text-slate-500 text-sm mb-6">
            Salve seus cartões e rotinas personalizadas para não perder nada se trocar de dispositivo.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={exportData}
              className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>📥</span> Exportar Dados
            </button>
            
            <label className="bg-white border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 cursor-pointer text-center">
              <span>📤</span> Importar Dados
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
          <h3 className="text-lg font-bold text-red-800 mb-2">🆘 Solução de Problemas</h3>
          <p className="text-red-700 text-sm mb-4">
            Se as imagens padrão não estiverem aparecendo, você pode resetar o aplicativo para os valores originais.
          </p>
          <button 
            onClick={resetToDefaults}
            className="w-full bg-red-500 text-white py-3 rounded-2xl font-bold hover:bg-red-600 transition-colors"
          >
            Resetar Imagens e Cartões
          </button>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h3 className="text-lg font-bold text-amber-800 mb-2">💡 Sobre o AutiAmigo</h3>
          <p className="text-amber-700 text-sm leading-relaxed">
            Este aplicativo foi criado para apoiar a autonomia e a comunicação de pessoas autistas e PCDs. 
            Ele é totalmente gratuito e focado em privacidade: seus dados nunca saem do seu dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
};
