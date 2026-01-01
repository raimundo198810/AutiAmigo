
import React, { useState } from 'react';
import { Language } from '../types.ts';

interface Strategy {
  question: string;
  answer: string;
  category: 'Sensorial' | 'Rotina' | 'Social' | 'Alimentação';
}

const STRATEGIES: Strategy[] = [
  {
    category: 'Sensorial',
    question: 'O que fazer em caso de sobrecarga sonora?',
    answer: '1. Leve a pessoa para um local calmo.\n2. Ofereça protetores auriculares ou fones.\n3. Evite falar muito ou dar ordens complexas.\n4. Use luzes baixas se possível.'
  },
  {
    category: 'Sensorial',
    question: 'Dicas para crises em locais públicos',
    answer: 'Identifique sinais precoces (agitação, tapar ouvidos). Tenha um "kit de calma" (fidget toys, mordedores). Procure a saída mais próxima ou um canto reservado.'
  },
  {
    category: 'Rotina',
    question: 'Como facilitar transições entre atividades?',
    answer: 'Use avisos visuais (cronômetros). Avise 5 minutos antes de acabar. Use a técnica do "Primeiro... Depois...". Ex: "Primeiro guardamos os brinquedos, depois vamos lanchar".'
  },
  {
    category: 'Alimentação',
    question: 'Lidando com a seletividade alimentar',
    answer: 'Introduza novos alimentos sem pressão. Foque na textura e cor primeiro. Permita que a pessoa explore o alimento com as mãos antes de provar. Mantenha o ambiente do almoço calmo.'
  },
  {
    category: 'Social',
    question: 'Preparando para visitas ou festas',
    answer: 'Use Histórias Sociais para explicar quem estará lá e o que vai acontecer. Defina um "espaço de escape" onde a pessoa possa ficar sozinha se cansar da interação.'
  }
];

export const CaregiverAI: React.FC<{ lang: Language }> = ({ lang }) => {
  const [filter, setFilter] = useState<string>('Todas');
  const categories = ['Todas', 'Sensorial', 'Rotina', 'Social', 'Alimentação'];

  const filtered = filter === 'Todas' ? STRATEGIES : STRATEGIES.filter(s => s.category === filter);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Manual de Apoio 📖</h2>
        <p className="text-slate-600 font-bold text-lg">Estratégias práticas para o dia a dia.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6 animate-fade-in">
        {filtered.map((strategy, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 shadow-sm hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                {strategy.category}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight">{strategy.question}</h3>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
              <p className="text-lg font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                {strategy.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
