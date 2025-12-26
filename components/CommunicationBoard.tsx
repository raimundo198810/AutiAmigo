
import React from 'react';
import { CommunicationCard } from '../types';

const CARDS: CommunicationCard[] = [
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
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Eu quero / Eu sinto...</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => speak(card.label)}
            className={`${card.color} p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center border-2 border-transparent active:border-blue-400`}
          >
            <span className="text-5xl mb-2">{card.icon}</span>
            <span className="text-lg font-semibold text-slate-700">{card.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
