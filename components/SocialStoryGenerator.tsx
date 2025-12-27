
import React, { useState } from 'react';
import { generateSocialStory } from '../services/geminiService.ts';
import { Language } from '../types.ts';

// Added lang prop to interface
interface SocialStoryGeneratorProps {
  lang: Language;
}

export const SocialStoryGenerator: React.FC<SocialStoryGeneratorProps> = ({ lang }) => {
  const [situation, setSituation] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Updated handleGenerate to pass lang to generateSocialStory
  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setStory(null);
    try {
      const result = await generateSocialStory(situation, lang);
      setStory(result);
    } catch (err) {
      setStory("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block relative mb-6">
          <img 
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400" 
            className="w-48 h-48 rounded-3xl object-cover shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            alt="Livros ilustrados"
          />
          <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-3 rounded-2xl shadow-lg">📖</div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Histórias Sociais com IA</h2>
        <p className="text-slate-500">Transforme situações desconhecidas em roteiros previsíveis e tranquilos.</p>
      </div>

      <div className="bg-purple-50/30 p-8 rounded-[2rem] border-2 border-dashed border-purple-100 mb-8 transition-all hover:border-purple-200 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800" 
          className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
          alt=""
        />
        <div className="flex flex-col gap-4 relative z-10">
          <label className="text-sm font-bold text-purple-600 ml-2">Qual situação você quer preparar?</label>
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Ex: Primeira vez no cinema, festa na escola..."
            className="w-full p-5 rounded-2xl border-2 border-white shadow-sm focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg bg-white/90"
            aria-label="Situação para história social"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !situation.trim()}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
              loading 
                ? 'bg-purple-400 text-purple-100 cursor-not-allowed animate-pulse' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
            } disabled:opacity-50`}
          >
            {loading ? (
              <>
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                Construindo seu guia...
              </>
            ) : (
              <>
                <span>✨</span> Criar Meu Guia Visual
              </>
            )}
          </button>
        </div>
      </div>

      {loading && !story && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-purple-50 space-y-4 animate-pulse">
          <div className="h-8 bg-purple-100 rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-4/6"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
          </div>
        </div>
      )}

      {story && !loading && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-purple-100 animate-fade-in hover:shadow-2xl transition-shadow duration-500 overflow-hidden relative">
          {/* Decoração Visual da História */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[4rem] -mr-8 -mt-8 flex items-center justify-center p-8">
            <span className="text-4xl">🌟</span>
          </div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-2xl font-black text-purple-900">Como vai ser:</h3>
            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Guia Personalizado</span>
          </div>
          
          <div className="prose prose-purple max-w-none relative z-10">
            <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
              {story}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-50 flex flex-wrap gap-4 relative z-10">
            <button 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(story);
                utterance.lang = 'pt-BR';
                window.speechSynthesis.speak(utterance);
              }}
              className="flex items-center gap-3 bg-purple-50 text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-100 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="text-xl">🔊</span> Ouvir Agora
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-3 bg-slate-50 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="text-xl">🖨️</span> Imprimir Roteiro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
