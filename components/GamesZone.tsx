
import React, { useState, useEffect } from 'react';

type GameType = 'menu' | 'memory' | 'popit' | 'wordsearch';

export const GamesZone: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  return (
    <div className="p-6 max-w-5xl mx-auto h-full min-h-[60vh] flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">PlayZone 🎮</h2>
        <p className="text-slate-500 font-medium">Jogos divertidos para relaxar e aprender.</p>
      </div>

      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
          <button 
            onClick={() => setActiveGame('memory')}
            className="group bg-white p-6 rounded-[3rem] shadow-xl border-4 border-blue-50 hover:border-blue-200 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
            <h3 className="text-xl font-black text-slate-800 mb-1">Memória Mágica</h3>
            <p className="text-slate-500 text-sm font-bold">Encontre os pares iguais.</p>
          </button>

          <button 
            onClick={() => setActiveGame('popit')}
            className="group bg-white p-6 rounded-[3rem] shadow-xl border-4 border-purple-50 hover:border-purple-200 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🫧</div>
            <h3 className="text-xl font-black text-slate-800 mb-1">Bolhas Calmas</h3>
            <p className="text-slate-500 text-sm font-bold">Estoure para relaxar.</p>
          </button>

          <button 
            onClick={() => setActiveGame('wordsearch')}
            className="group bg-white p-6 rounded-[3rem] shadow-xl border-4 border-indigo-50 hover:border-indigo-200 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="text-xl font-black text-slate-800 mb-1">Caça-Palavras</h3>
            <p className="text-slate-500 text-sm font-bold">Encontre as palavras ocultas.</p>
          </button>
        </div>
      )}

      {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'popit' && <PopItGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'wordsearch' && <WordSearchGame onBack={() => setActiveGame('menu')} />}
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

    try {
      const audio = new Audio('https://actions.google.com/sounds/v1/foley/button_click.ogg');
      audio.volume = 0.2;
      audio.play();
    } catch(e) {}

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

const WordSearchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const WORDS = ['AMIGO', 'AJUDA', 'CALMA', 'FOCO', 'PAZ', 'FELIZ'];
  const GRID_SIZE = 10;
  
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{r: number, c: number}[]>([]);
  
  const initGame = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Fill with words
    WORDS.forEach(word => {
      let placed = false;
      while (!placed) {
        const isHorizontal = Math.random() > 0.5;
        const r = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE : GRID_SIZE - word.length));
        const c = Math.floor(Math.random() * (isHorizontal ? GRID_SIZE - word.length : GRID_SIZE));
        
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const char = isHorizontal ? newGrid[r][c+i] : newGrid[r+i][c];
          if (char !== '' && char !== word[i]) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            if (isHorizontal) newGrid[r][c+i] = word[i];
            else newGrid[r+i][c] = word[i];
          }
          placed = true;
        }
      }
    });
    
    // Fill remaining with random letters
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
    
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCellClick = (r: number, c: number) => {
    // Check if cell already selected
    const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
    
    let newSelection = [];
    if (isSelected) {
      newSelection = selectedCells.filter(cell => !(cell.r === r && cell.c === c));
    } else {
      newSelection = [...selectedCells, {r, c}];
    }
    
    setSelectedCells(newSelection);
    
    // Check if the current selection forms a word
    const currentString = newSelection.map(cell => grid[cell.r][cell.c]).join('');
    const currentStringReversed = currentString.split('').reverse().join('');
    
    if (WORDS.includes(currentString) && !foundWords.includes(currentString)) {
      setFoundWords([...foundWords, currentString]);
      setSelectedCells([]);
      // Highlight sound or effect could be here
    } else if (WORDS.includes(currentStringReversed) && !foundWords.includes(currentStringReversed)) {
        setFoundWords([...foundWords, currentStringReversed]);
        setSelectedCells([]);
    }
  };

  const isCellSelected = (r: number, c: number) => selectedCells.some(cell => cell.r === r && cell.c === c);
  
  // Logic to show found words on grid (this is a simplified version)
  // In a real app, we'd store the positions of placed words.
  // For now, let's just use the selected state for game flow.

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 animate-fade-in w-full">
      <div className="flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="text-slate-400 font-bold flex items-center gap-2">← Voltar</button>
          <button onClick={initGame} className="text-indigo-600 font-bold">Novo Jogo</button>
        </div>
        
        <div className="grid grid-cols-10 gap-1 bg-white p-2 rounded-2xl shadow-xl border-4 border-indigo-50">
          {grid.map((row, r) => (
            row.map((char, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`aspect-square flex items-center justify-center font-black text-xs sm:text-sm rounded-md transition-all ${
                  isCellSelected(r, c) 
                    ? 'bg-indigo-600 text-white scale-110 z-10' 
                    : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                {char}
              </button>
            ))
          ))}
        </div>
      </div>

      <div className="w-full lg:w-64 bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-indigo-50">
        <h3 className="font-black text-indigo-600 mb-4 flex items-center gap-2">
          <span>📝</span> Lista de Palavras
        </h3>
        <div className="space-y-2">
          {WORDS.map(word => (
            <div 
              key={word} 
              className={`flex items-center justify-between p-3 rounded-xl font-bold transition-all ${
                foundWords.includes(word) 
                  ? 'bg-green-100 text-green-600 scale-95 opacity-70' 
                  : 'bg-slate-50 text-slate-400'
              }`}
            >
              <span>{word}</span>
              {foundWords.includes(word) && <span>✅</span>}
            </div>
          ))}
        </div>
        
        {foundWords.length === WORDS.length && (
          <div className="mt-6 p-4 bg-green-500 text-white rounded-2xl text-center animate-bounce font-black">
            VOCÊ VENCEU! 🎉
          </div>
        )}
      </div>
    </div>
  );
};
