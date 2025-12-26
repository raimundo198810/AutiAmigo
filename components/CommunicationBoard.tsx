
import React, { useState, useEffect } from 'react';
import { CommunicationCard } from '../types.ts';

const DEFAULT_CARDS: CommunicationCard[] = [
  { id: '1', label: 'Água', icon: '💧', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400', color: 'bg-blue-100', category: 'necessidades' },
  { id: '2', label: 'Comida', icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', color: 'bg-green-100', category: 'necessidades' },
  { id: '3', label: 'Banheiro', icon: '🚻', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', color: 'bg-yellow-100', category: 'necessidades' },
  { id: '4', label: 'Ajuda', icon: '🆘', imageUrl: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=400', color: 'bg-red-100', category: 'necessidades' },
  { id: '5', label: 'Feliz', icon: '😊', imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400', color: 'bg-pink-100', category: 'sentimentos' },
  { id: '6', label: 'Triste', icon: '😢', imageUrl: 'https://images.unsplash.com/photo-1516589174184-e678201f4961?auto=format&fit=crop&q=80&w=400', color: 'bg-indigo-100', category: 'sentimentos' },
];

export const CommunicationBoard: React.FC = () => {
  const [cards, setCards] = useState<CommunicationCard[]>(() => {
    const saved = localStorage.getItem('autiamigo_custom_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [isAdding, setIsAdding] = useState(false);
  const [typeAndTalkText, setTypeAndTalkText] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCategory, setNewCategory] = useState<CommunicationCard['category']>('necessidades');

  useEffect(() => {
    localStorage.setItem('autiamigo_custom_cards', JSON.stringify(cards));
  }, [cards]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newIcon) return;
    const categoryColors = { necessidades: 'bg-blue-100', sentimentos: 'bg-pink-100', atividades: 'bg-teal-100' };
    const newCard: CommunicationCard = {
      id: Date.now().toString(),
      label: newLabel,
      icon: newIcon,
      imageUrl: newImageUrl || undefined,
      color: categoryColors[newCategory],
      category: newCategory,
    };
    setCards([...cards, newCard]);
    setNewLabel(''); setNewIcon(''); setNewImageUrl(''); setIsAdding(false);
  };

  const removeCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja remover este cartão?')) setCards(cards.filter(c => c.id !== id));
  };

  const filteredCards = activeFilter === 'todos' ? cards : cards.filter(card => card.category === activeFilter);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Teclado de Voz */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">
            <span>🗣️</span> Teclado de Voz
          </h3>
          <form onSubmit={(e) => { e.preventDefault(); speak(typeAndTalkText); setTypeAndTalkText(''); }} className="flex gap-3">
            <input 
              type="text"
              value={typeAndTalkText}
              onChange={(e) => setTypeAndTalkText(e.target.value)}
              placeholder="Digite o que quer que o app fale..."
              className="flex-1 p-5 rounded-2xl border-none outline-none font-bold text-lg shadow-inner bg-white/95 text-slate-800"
            />
            <button 
              type="submit"
              className="bg-yellow-400 text-slate-900 px-8 rounded-2xl font-black hover:bg-yellow-300 transition-all active:scale-95 shadow-lg"
            >
              FALAR
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Comunicação Visual</h2>
          <p className="text-slate-500 text-sm font-bold">Toque nos cartões para ouvir.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
              isAdding ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAdding ? '✕ Fechar' : '+ Adicionar Card'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['todos', 'necessidades', 'sentimentos', 'atividades'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${
              activeFilter === f ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-100 text-slate-500'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleAddCard} className="bg-white p-8 rounded-[2rem] shadow-xl border border-blue-100 mb-10 animate-fade-in relative overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              <input type="text" placeholder="Nome" value={newLabel} onChange={e => setNewLabel(e.target.value)} className="p-4 rounded-xl border bg-slate-50 outline-none font-bold" required />
              <input type="text" placeholder="Emoji" value={newIcon} onChange={e => setNewIcon(e.target.value)} className="p-4 rounded-xl border bg-slate-50 outline-none text-center text-2xl" required />
              <input type="url" placeholder="Imagem URL" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="p-4 rounded-xl border bg-slate-50 outline-none" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value as any)} className="p-4 rounded-xl border bg-slate-50 outline-none font-bold">
                <option value="necessidades">Necessidades</option>
                <option value="sentimentos">Sentimentos</option>
                <option value="atividades">Atividades</option>
              </select>
           </div>
           <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-4 rounded-xl font-black relative z-10">Criar Novo Card</button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => speak(card.label)}
            className={`relative group aspect-square p-2 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all flex flex-col items-center justify-center border-4 overflow-hidden active:scale-95 ${card.color} border-transparent`}
          >
            {card.imageUrl && !imageErrors[card.id] ? (
              <div className="w-full h-full relative">
                <img 
                  src={card.imageUrl} 
                  alt={card.label}
                  className="w-full h-full object-cover rounded-[2rem]"
                  onError={() => setImageErrors(p => ({ ...p, [card.id]: true }))} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
                  <span className="text-white font-black text-lg">{card.label}</span>
                </div>
              </div>
            ) : (
              <>
                <span className="text-6xl mb-2">{card.icon}</span>
                <span className="text-lg font-black text-slate-700">{card.label}</span>
              </>
            )}
            <button onClick={(e) => removeCard(card.id, e)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </button>
        ))}
      </div>
    </div>
  );
};
