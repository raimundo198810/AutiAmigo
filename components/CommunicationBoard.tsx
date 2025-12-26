
import React, { useState, useEffect } from 'react';
import { CommunicationCard } from '../types';

const DEFAULT_CARDS: CommunicationCard[] = [
  { id: '1', label: 'Água', icon: '💧', color: 'bg-blue-100', category: 'necessidades' },
  { id: '2', label: 'Comida', icon: '🍎', color: 'bg-green-100', category: 'necessidades' },
  { id: '3', label: 'Banheiro', icon: '🚻', color: 'bg-yellow-100', category: 'necessidades' },
  { id: '4', label: 'Ajuda', icon: '🆘', color: 'bg-red-100', category: 'necessidades' },
  { id: '5', label: 'Feliz', icon: '😊', color: 'bg-pink-100', category: 'sentimentos' },
  { id: '6', label: 'Triste', icon: '😢', color: 'bg-indigo-100', category: 'sentimentos' },
  { id: '7', label: 'Cansado', icon: '😴', color: 'bg-purple-100', category: 'sentimentos' },
  { id: '8', label: 'Barulho', icon: '🎧', color: 'bg-orange-100', category: 'sentimentos' },
  { id: '9', label: 'Brincar', icon: '🧸', color: 'bg-teal-100', category: 'atividades' },
  { id: '10', label: 'Ler', icon: '📚', color: 'bg-amber-100', category: 'atividades' },
  { id: '11', label: 'Sair', icon: '🚶', color: 'bg-lime-100', category: 'atividades' },
  { id: '12', label: 'Música', icon: '🎵', color: 'bg-cyan-100', category: 'atividades' },
];

export const CommunicationBoard: React.FC = () => {
  const [cards, setCards] = useState<CommunicationCard[]>(() => {
    const saved = localStorage.getItem('autiamigo_custom_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newCategory, setNewCategory] = useState<CommunicationCard['category']>('necessidades');

  useEffect(() => {
    localStorage.setItem('autiamigo_custom_cards', JSON.stringify(cards));
  }, [cards]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newIcon) return;

    const categoryColors = {
      necessidades: 'bg-blue-100',
      sentimentos: 'bg-pink-100',
      atividades: 'bg-teal-100',
    };

    const newCard: CommunicationCard = {
      id: Date.now().toString(),
      label: newLabel,
      icon: newIcon,
      color: categoryColors[newCategory],
      category: newCategory,
    };

    setCards([...cards, newCard]);
    setNewLabel('');
    setNewIcon('');
    setIsAdding(false);
  };

  const removeCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja remover este cartão?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Eu quero / Eu sinto...</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            isAdding ? 'bg-slate-200 text-slate-600' : 'bg-blue-500 text-white'
          }`}
        >
          {isAdding ? 'Cancelar' : '+ Novo Cartão'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCard} className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">O que dizer?</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Ex: Maçã, Abraço..."
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Ícone / Emoji</label>
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="Cole um emoji aqui"
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400 text-center text-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="necessidades">Necessidades (Azul)</option>
                <option value="sentimentos">Sentimentos (Rosa)</option>
                <option value="atividades">Atividades (Verde)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-100"
          >
            Adicionar ao Quadro
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="relative group">
            <button
              onClick={() => speak(card.label)}
              className={`${card.color} w-full p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center border-4 border-transparent active:border-blue-400 active:scale-95`}
            >
              <span className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">{card.icon}</span>
              <span className="text-lg font-bold text-slate-700">{card.label}</span>
            </button>
            
            {/* Botão de excluir para cartões não-padrão ou todos se desejar */}
            <button
              onClick={(e) => removeCard(card.id, e)}
              className="absolute -top-2 -right-2 bg-white text-red-400 w-8 h-8 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-red-50 hover:bg-red-50"
              title="Remover cartão"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Nenhum cartão no momento. Adicione um acima!</p>
        </div>
      )}
    </div>
  );
};
