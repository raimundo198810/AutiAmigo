
import React, { useState } from 'react';
import { generateSocialStory } from '../services/geminiService';

export const SocialStoryGenerator: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    const result = await generateSocialStory(situation);
    setStory(result);
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Histórias Sociais</h2>
      <p className="text-slate-600 mb-6">Explique uma situação nova ou difícil para receber um guia simples.</p>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Ex: Ir ao dentista, festa de aniversário..."
            className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-purple-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Criando história...' : 'Gerar História'}
          </button>
        </div>

        {story && (
          <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100 animate-fade-in">
            <h3 className="text-xl font-bold text-purple-800 mb-4">Seu Guia:</h3>
            <div className="prose prose-purple whitespace-pre-wrap text-slate-700 leading-relaxed">
              {story}
            </div>
            <button 
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(story);
                utterance.lang = 'pt-BR';
                window.speechSynthesis.speak(utterance);
              }}
              className="mt-6 flex items-center gap-2 text-purple-600 font-bold hover:underline"
            >
              <span>🔊</span> Ouvir História
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
