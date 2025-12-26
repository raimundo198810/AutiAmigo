
import React, { useState, useEffect } from 'react';

type GameType = 'menu' | 'memory' | 'popit';

export const GamesZone: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  return (
    <div className="p-6 max-w-5xl mx-auto h-full min-h-[60vh] flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">PlayZone 🎮</h2>
        <p className="text-slate-500 font-medium">Jogos divertidos para relaxar e aprender.</p>
      </div>

      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 items-center">
          <button 
            onClick={() => setActiveGame('memory')}
            className="group bg-white p-8 rounded-[3rem] shadow-xl border-4 border-blue-50 hover:border-blue-200 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🧠</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Memória Mágica</h3>
            <p className="text-slate-500 font-bold">Encontre os pares iguais para vencer o desafio.</p>
          </button>

          <button 
            onClick={() => setActiveGame('popit')}
            className="group bg-white p-8 rounded-[3rem] shadow-xl border-4 border-purple-50 hover:border-purple-200 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🫧</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Bolhas Calmas</h3>
            <p className="text-slate-500 font-bold">Estoure as bolhas coloridas para relaxar.</p>
          </button>
        </div>
      )}

      {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'popit' && <PopItGame onBack={() => setActiveGame('menu')} />}
    </div>
  );
};

const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  const [cards, setCards] = useState<{id: number, icon: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleFlip = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isWon = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex justify-between w-full max-w-md items-center">
        <button onClick={onBack} className="text-slate-400 font-bold flex items-center gap-2">← Voltar</button>
        <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full font-black">Jogadas: {moves}</span>
        <button onClick={initGame} className="text-blue-600 font-bold">Reiniciar</button>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all duration-300 shadow-md ${
              card.flipped || card.matched 
                ? 'bg-white border-4 border-blue-400 rotate-0' 
                : 'bg-blue-600 border-4 border-blue-700 -rotate-3 hover:rotate-0'
            }`}
          >
            {(card.flipped || card.matched) ? card.icon : '❓'}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="mt-6 text-center animate-bounce">
          <h4 className="text-3xl font-black text-green-500">Parabéns! 🎉</h4>
          <p className="font-bold text-slate-500">Você completou o desafio!</p>
        </div>
      )}
    </div>
  );
};

const PopItGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [bubbles, setBubbles] = useState<{id: number, popped: boolean, color: string}[]>([]);
  const colors = ['bg-rose-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'];

  const initPopit = () => {
    const grid = Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      popped: false,
      color: colors[i % colors.length]
    }));
    setBubbles(grid);
  };

  useEffect(() => {
    initPopit();
  }, []);

  const pop = (id: number) => {
    const newBubbles = [...bubbles];
    if (newBubbles[id].popped) return;
    
    newBubbles[id].popped = true;
    setBubbles(newBubbles);

    // Som suave (opcional - usando som de clique do sistema)
    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/foley/button_click.ogg');
      audio.volume = 0.2;
      audio.play();
    } catch(e) {}

    // Se todas estourarem, reseta automaticamente após curto tempo
    if (newBubbles.every(b => b.popped)) {
      setTimeout(initPopit, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="flex justify-between w-full max-w-md items-center">
        <button onClick={onBack} className="text-slate-400 font-bold flex items-center gap-2">← Voltar</button>
        <h3 className="font-black text-purple-600">Estoure tudo!</h3>
        <button onClick={initPopit} className="text-purple-600 font-bold">Resetar</button>
      </div>

      <div className="bg-slate-100 p-6 rounded-[3rem] shadow-inner grid grid-cols-6 gap-3">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => pop(b.id)}
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full transition-all duration-200 shadow-lg active:scale-90 ${
              b.popped 
                ? 'bg-slate-200 shadow-inner scale-95 opacity-50' 
                : `${b.color} border-b-4 border-black/10`
            }`}
          />
        ))}
      </div>
      
      <p className="text-slate-400 font-bold text-sm italic">Dica: Um jogo infinito para acalmar a mente.</p>
    </div>
  );
};
