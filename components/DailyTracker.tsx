
import React, { useState } from 'react';
import { Language } from '../types.ts';

const MOODS = [
  { label: 'Calmo', emoji: '😌', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100' },
  { label: 'Feliz', emoji: '😊', color: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100' },
  { label: 'Ansioso', emoji: '😰', color: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100' },
  { label: 'Bravo', emoji: '😡', color: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100' },
  { label: 'Cansado', emoji: '😴', color: 'bg-slate-50 text-slate-600 border-slate-100 shadow-slate-100' },
];

const POSITIVE_THOUGHTS = [
  "Você é único e sua mente é um lugar incrível para explorar! ✨",
  "Cada pequeno passo que você deu hoje é uma grande vitória. 🏆",
  "Tudo bem precisar de uma pausa. Respeite o seu tempo. 🧘",
  "O mundo fica mais colorido com o seu jeito especial de ver as coisas. 🌈",
  "Você tem talentos que só você pode oferecer ao mundo. 🌟",
  "Sua voz e sua forma de se comunicar são importantes e ouvidas. 💬",
  "Respire fundo. Você é capaz de superar os desafios de hoje. 🌬️"
];

export const DailyTracker: React.FC<{ lang: Language }> = ({ lang }) => {
  const [mood, setMood] = useState('😊');
  const [hydration, setHydration] = useState(2);
  const [medsTaken, setMedsTaken] = useState(0);
  const [dailyThought, setDailyThought] = useState(POSITIVE_THOUGHTS[0]);

  const refreshThought = () => {
    const randomIndex = Math.floor(Math.random() * POSITIVE_THOUGHTS.length);
    setDailyThought(POSITIVE_THOUGHTS[randomIndex]);
  };

  const progress = Math.round(((medsTaken / 3) + (hydration / 8)) / 2 * 100);

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">Meu Diário 📊</h2>
        <p className="text-slate-500 font-bold text-lg">Acompanhe seu progresso e seu bem-estar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border-4 border-slate-50 shadow-xl">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Como estou hoje?</h3>
          <div className="grid grid-cols-5 gap-3">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.emoji)}
                className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${
                  mood === m.emoji 
                  ? `${m.color} border-current scale-110 shadow-lg z-10` 
                  : 'bg-white border-slate-50 text-slate-300 opacity-60 grayscale'
                }`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-[10px] font-black uppercase hidden sm:block">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50/50 p-10 rounded-[3rem] border-4 border-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2">Água é Foco 💧</h3>
            <p className="text-blue-900 font-bold text-xl mb-6">Quantos copos hoje?</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <button
                key={i}
                onClick={() => setHydration(i)}
                className={`w-full aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all ${
                  hydration >= i 
                  ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200' 
                  : 'bg-white text-blue-100 hover:text-blue-300'
                }`}
              >
                💧
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-4">
            <h3 className="text-4xl font-black tracking-tighter uppercase">Minha Meta Diária</h3>
            <p className="text-slate-400 font-bold">Você completou <span className="text-indigo-400">{progress}%</span> do planejado para hoje!</p>
            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center">
             <button 
              onClick={refreshThought}
              className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-50 shadow-xl transition-all"
             >
               Mudar Dica ✨
             </button>
          </div>
        </div>

        <div className="mt-12 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 animate-fade-in backdrop-blur-md">
          <p className="text-2xl font-bold italic text-indigo-100 leading-relaxed text-center">"{dailyThought}"</p>
        </div>
      </div>
    </div>
  );
};
