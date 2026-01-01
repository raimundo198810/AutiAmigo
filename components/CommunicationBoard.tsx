
import React, { useState, useCallback } from 'react';
import { CommunicationCard } from '../types.ts';

const QUICK_PHRASES = [
  { text: 'Sim', icon: '✅', color: 'bg-slate-900' },
  { text: 'Não', icon: '❌', color: 'bg-slate-900' },
  { text: 'Oi', icon: '👋', color: 'bg-slate-900' },
  { text: 'Obrigado', icon: '🙏', color: 'bg-slate-900' },
  { text: 'Tchau', icon: '🏠', color: 'bg-slate-900' },
];

const DEFAULT_CARDS: CommunicationCard[] = [
  { id: '1', label: 'Água', icon: '💧', imageUrl: 'https://images.unsplash.com/photo-1548966678-99a0932b7f99?auto=format&fit=crop&q=80&w=400', color: 'bg-blue-50', category: 'necessidades' },
  { id: '2', label: 'Comida', icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', color: 'bg-orange-50', category: 'necessidades' },
  { id: '3', label: 'Banheiro', icon: '🚻', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', color: 'bg-indigo-50', category: 'necessidades' },
  { id: '4', label: 'Ajuda', icon: '🆘', imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=400', color: 'bg-rose-50', category: 'necessidades' },
  { id: '5', label: 'Feliz', icon: '😊', imageUrl: 'https://images.unsplash.com/photo-1494173853739-c21f58b16055?auto=format&fit=crop&q=80&w=400', color: 'bg-amber-50', category: 'sentimentos' },
  { id: '6', label: 'Triste', icon: '😢', imageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=400', color: 'bg-slate-50', category: 'sentimentos' },
  { id: '7', label: 'Estudar', icon: '📖', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400', color: 'bg-emerald-50', category: 'atividades' },
  { id: '8', label: 'Brincar', icon: '🧸', imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=400', color: 'bg-purple-50', category: 'atividades' },
];

export const CommunicationBoard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [typeAndTalkText, setTypeAndTalkText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onstart = () => {
      setIsSpeaking(true);
      setLastSpoken(text);
    };
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleShare = (e: React.MouseEvent, card: CommunicationCard) => {
    e.stopPropagation();
    alert(`Compartilhando cartão: ${card.icon} ${card.label}`);
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      {/* 3D Speech Control Panel */}
      <div className="clay-card p-10 lg:p-14 flex flex-col gap-8 shadow-2xl relative">
        <div className="bg-slate-50 rounded-[2.5rem] p-10 min-h-[160px] flex items-center justify-center relative shadow-inner border-2 border-slate-100/50">
           <span className="text-4xl md:text-6xl font-black text-center text-slate-800 tracking-tighter">
              {isSpeaking ? lastSpoken : (typeAndTalkText || "O que você deseja falar?")}
           </span>
           {isSpeaking && (
             <div className="absolute bottom-6 flex gap-2">
               {[0, 1, 2, 3].map(i => (
                 <div key={i} className="w-2 h-6 bg-blue-500 rounded-full animate-bounce shadow-lg shadow-blue-200" style={{animationDelay: `${i * 0.15}s`}}></div>
               ))}
             </div>
           )}
        </div>

        {/* Quick Phrases Section */}
        <div className="flex flex-wrap justify-center gap-4">
          {QUICK_PHRASES.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => speak(phrase.text)}
              className={`${phrase.color} text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-slate-200`}
            >
              <span className="text-xl">{phrase.icon}</span>
              <span className="text-white">{phrase.text}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={typeAndTalkText}
            onChange={(e) => setTypeAndTalkText(e.target.value)}
            placeholder="Digite algo para falar..."
            className="flex-1 bg-white p-6 rounded-[2rem] text-xl font-black text-slate-700 placeholder-slate-200 outline-none border-4 border-slate-50 shadow-inner focus:border-blue-100 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && speak(typeAndTalkText)}
          />
          <button 
            onClick={() => speak(typeAndTalkText)} 
            disabled={!typeAndTalkText.trim()}
            className="clay-btn px-12 py-6 text-xl font-black tracking-tight flex items-center justify-center gap-4 disabled:opacity-50"
          >
            FALAR 🗣️
          </button>
        </div>
      </div>

      {/* 3D Bento Grid for Cards */}
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className="glass-panel p-2 rounded-[2rem] flex gap-2 shadow-inner border border-white/40">
             {['todos', 'necessidades', 'sentimentos', 'atividades'].map(f => (
               <button 
                key={f} 
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {DEFAULT_CARDS.filter(c => activeFilter === 'todos' || c.category === activeFilter).map((card) => (
            <div
              key={card.id}
              onClick={() => speak(card.label)}
              className="clay-card relative aspect-square p-3 group cursor-pointer"
            >
              <button
                onClick={(e) => handleShare(e, card)}
                className="absolute top-6 right-6 z-30 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600 shadow-lg border border-white/30"
                title="Compartilhar"
              >
                📤
              </button>
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-inner">
                <img 
                  src={card.imageUrl} 
                  alt={card.label} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.85]" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
                  <span className="text-3xl mb-1 drop-shadow-2xl">{card.icon}</span>
                  <span className="text-xl font-black text-white tracking-tighter uppercase drop-shadow-xl">{card.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
