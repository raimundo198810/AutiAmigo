
import React, { useState } from 'react';
import { generateSocialStory } from '../services/geminiService.ts';
import { Language } from '../types.ts';

interface SocialStoryGeneratorProps {
  lang: Language;
}

export const SocialStoryGenerator: React.FC<SocialStoryGeneratorProps> = ({ lang }) => {
  const [situation, setSituation] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setStory(null);
    setErrorMessage(null);
    try {
      const result = await generateSocialStory(situation, lang);
      if (result.startsWith("Erro")) {
        setErrorMessage(result);
      } else {
        setStory(result);
      }
    } catch (err) {
      setErrorMessage("Erro ao conectar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Histórias Sociais ✨</h2>
        <p className="text-slate-500 font-bold text-lg">Prepare-se para novas situações com roteiros visuais.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 mb-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <label className="text-[10px] font-bold text-purple-600 ml-1 uppercase tracking-widest">O que vai acontecer?</label>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Ex: Ir ao médico, festa na escola..."
            className="w-full p-4 rounded-xl border-2 border-slate-100 outline-none text-lg font-bold bg-slate-50 text-slate-800 focus:border-purple-400"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !situation.trim()}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${
              loading 
                ? 'bg-purple-200 text-purple-600' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {loading ? 'GERANDO...' : 'CRIAR GUIA VISUAL'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-xl text-center mb-8">
          <p className="text-rose-700 font-bold">{errorMessage}</p>
        </div>
      )}

      {story && (
        <div className="bg-white p-8 rounded-3xl border-2 border-purple-100 animate-fade-in shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-purple-900 uppercase tracking-widest">Seu Roteiro</h3>
            <button 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(story);
                utterance.lang = 'pt-BR';
                window.speechSynthesis.speak(utterance);
              }}
              className="bg-purple-50 p-3 rounded-xl hover:bg-purple-100 text-purple-600 font-bold text-xs"
            >
              🔊 OUVIR
            </button>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-100 mb-6">
            <p className="text-xl font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
              {story}
            </p>
          </div>

          <button 
            onClick={() => window.print()}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black"
          >
            🖨️ IMPRIMIR
          </button>
        </div>
      )}
    </div>
  );
};
