
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CommunicationCard } from '../types.ts';

const DEFAULT_CARDS: CommunicationCard[] = [
  { id: '1', label: 'Água', icon: '💧', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400', color: 'bg-blue-400', category: 'necessidades' },
  { id: '2', label: 'Comida', icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', color: 'bg-green-400', category: 'necessidades' },
  { id: '3', label: 'Banheiro', icon: '🚻', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', color: 'bg-yellow-400', category: 'necessidades' },
  { id: '4', label: 'Ajuda', icon: '🆘', imageUrl: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=400', color: 'bg-red-400', category: 'necessidades' },
  { id: '5', label: 'Feliz', icon: '😊', imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400', color: 'bg-pink-400', category: 'sentimentos' },
  { id: '6', label: 'Triste', icon: '😢', imageUrl: 'https://images.unsplash.com/photo-1516589174184-e678201f4961?auto=format&fit=crop&q=80&w=400', color: 'bg-indigo-400', category: 'sentimentos' },
];

const QUICK_PHRASES = [
  { label: 'Oi', icon: '👋' },
  { label: 'Tudo bem?', icon: '❓' },
  { label: 'Sim', icon: '✅' },
  { label: 'Não', icon: '❌' },
  { label: 'Por favor', icon: '🙏' },
  { label: 'Obrigado', icon: '💖' },
];

export const CommunicationBoard: React.FC = () => {
  const [cards, setCards] = useState<CommunicationCard[]>(() => {
    const saved = localStorage.getItem('ajuda_autista_custom_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [typeAndTalkText, setTypeAndTalkText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleCardClick = (card: CommunicationCard) => {
    speak(card.label);
  };

  const filteredCards = activeFilter === 'todos' ? cards : cards.filter(card => card.category === activeFilter);

  return (
    <div className="p-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-3d">Quadro de Voz 3D</h2>
          <p className="text-slate-600 font-bold">Cada toque é uma voz que brilha.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {['todos', 'necessidades', 'sentimentos', 'atividades'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all clay-button ${
                activeFilter === f ? 'bg-black text-white' : 'bg-white text-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="clay-card p-10 bg-white/50 backdrop-blur-md relative overflow-hidden group border border-white/50">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-3d">Teclado Mágico</h3>
            {isSpeaking && <span className="animate-pulse text-black font-black">🔊 FALANDO...</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={typeAndTalkText}
              onChange={(e) => setTypeAndTalkText(e.target.value)}
              placeholder="Digite aqui..."
              className="flex-1 p-6 rounded-[2rem] border-none inner-depth outline-none text-2xl font-bold bg-white/80"
              onKeyPress={(e) => e.key === 'Enter' && speak(typeAndTalkText)}
            />
            <button
              onClick={() => speak(typeAndTalkText)}
              className="bg-black text-white px-12 py-6 rounded-[2rem] font-black text-2xl clay-button"
            >
              Falar 🗣️
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {QUICK_PHRASES.map(phrase => (
              <button
                key={phrase.label}
                onClick={() => speak(phrase.label)}
                className="px-6 py-4 rounded-2xl bg-white border border-slate-200 font-black flex items-center gap-2 clay-button"
              >
                <span className="text-2xl">{phrase.icon}</span> 
                <span className="text-3d text-sm">{phrase.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`clay-card p-8 aspect-square flex flex-col items-center justify-center gap-4 group ${card.color} border-4 border-white/40 shadow-xl`}
          >
            <div className="w-32 h-32 bg-white/90 rounded-[2.5rem] shadow-inner flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
              {card.imageUrl && !imageErrors[card.id] ? (
                <img 
                  src={card.imageUrl} 
                  alt={card.label} 
                  className="w-full h-full object-cover rounded-[2rem] p-1" 
                  onError={() => setImageErrors(prev => ({ ...prev, [card.id]: true }))}
                />
              ) : (
                <span>{card.icon}</span>
              )}
            </div>
            <span className="text-2xl font-black text-3d">{card.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
