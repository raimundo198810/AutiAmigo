
import React, { useState, useEffect, useRef } from 'react';

type GameType = 'menu' | 'memory' | 'popit' | 'wordsearch' | 'simon' | 'emotions' | 'sorting' | 'zen' | 'balloons';

export const GamesZone: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  return (
    <div className="p-6 max-w-6xl mx-auto h-full min-h-[70vh] flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black text-3d mb-2 uppercase tracking-tighter">PlayZone 3D 🎮</h2>
        <p className="text-slate-500 font-bold text-xl">Aprender brincando é muito melhor!</p>
      </div>

      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-start">
          {/* Removed unused 'id' prop from GameMenuCard calls to resolve TypeScript errors */}
          <GameMenuCard 
            icon="🧠" title="Memória" desc="Pares iguais" color="bg-blue-50" border="border-blue-200"
            onClick={() => setActiveGame('memory')}
          />
          <GameMenuCard 
            icon="🫧" title="Pop-It" desc="Anti-estresse" color="bg-purple-50" border="border-purple-200"
            onClick={() => setActiveGame('popit')}
          />
          <GameMenuCard 
            icon="🔍" title="Busca" desc="Ache as palavras" color="bg-indigo-50" border="border-indigo-200"
            onClick={() => setActiveGame('wordsearch')}
          />
          <GameMenuCard 
            icon="🔴" title="Gênio" desc="Repita a luz" color="bg-rose-50" border="border-rose-200"
            onClick={() => setActiveGame('simon')}
          />
          <GameMenuCard 
            icon="🎭" title="Emoções" desc="Qual é o rosto?" color="bg-emerald-50" border="border-emerald-200"
            onClick={() => setActiveGame('emotions')}
          />
          <GameMenuCard 
            icon="📦" title="Organizar" desc="Cada um no seu lugar" color="bg-amber-50" border="border-amber-200"
            onClick={() => setActiveGame('sorting')}
          />
          <GameMenuCard 
            icon="🎨" title="Desenho" desc="Arte livre" color="bg-cyan-50" border="border-cyan-200"
            onClick={() => setActiveGame('zen')}
          />
          <GameMenuCard 
            icon="🎈" title="Balões" desc="Estoure rápido" color="bg-pink-50" border="border-pink-200"
            onClick={() => setActiveGame('balloons')}
          />
        </div>
      )}

      {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'popit' && <PopItGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'wordsearch' && <WordSearchGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'simon' && <SimonGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'emotions' && <EmotionsGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'sorting' && <SortingGame onBack={() => setActiveGame('menu')} />}
      {activeGame === 'zen' && <ZenDrawing onBack={() => setActiveGame('menu')} />}
      {activeGame === 'balloons' && <BalloonPop onBack={() => setActiveGame('menu')} />}
    </div>
  );
};

const GameMenuCard: React.FC<{ icon: string, title: string, desc: string, color: string, border: string, onClick: () => void }> = ({ icon, title, desc, color, border, onClick }) => (
  <button 
    onClick={onClick}
    className={`clay-card group p-6 flex flex-col items-center text-center transition-all border-2 border-white hover:${border} hover:-translate-y-2`}
  >
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform ${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-3d mb-1">{title}</h3>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{desc}</p>
  </button>
);

/* --- COMPONENTES DOS JOGOS EXISTENTES (Simplificados para manter o arquivo limpo) --- */

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

  useEffect(() => initGame(), []);

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

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex justify-between w-full max-w-md items-center mb-4">
        <button onClick={onBack} className="text-3d font-black uppercase text-xs">← Voltar</button>
        <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-xs">JOGADAS: {moves}</span>
        <button onClick={initGame} className="text-blue-600 font-black text-xs uppercase underline">Reiniciar</button>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full max-w-md">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-[2rem] text-4xl flex items-center justify-center transition-all duration-300 clay-button ${
              card.flipped || card.matched ? 'bg-white' : 'bg-blue-600 text-white'
            }`}
          >
            {(card.flipped || card.matched) ? card.icon : '🧩'}
          </button>
        ))}
      </div>
    </div>
  );
};

const PopItGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [bubbles, setBubbles] = useState<{id: number, popped: boolean, color: string}[]>([]);
  const colors = ['bg-rose-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'];

  const initPopit = () => {
    const grid = Array.from({ length: 36 }).map((_, i) => ({
      id: i, popped: false, color: colors[i % colors.length]
    }));
    setBubbles(grid);
  };

  useEffect(() => initPopit(), []);

  const pop = (id: number) => {
    if (bubbles[id].popped) return;
    const newBubbles = [...bubbles];
    newBubbles[id].popped = true;
    setBubbles(newBubbles);
    if (newBubbles.every(b => b.popped)) setTimeout(initPopit, 800);
  };

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="flex justify-between w-full max-w-md items-center">
        <button onClick={onBack} className="text-3d font-black uppercase text-xs">← Voltar</button>
        <button onClick={initPopit} className="text-purple-600 font-black text-xs uppercase underline">Resetar</button>
      </div>
      <div className="bg-slate-100 p-8 rounded-[4rem] shadow-inner grid grid-cols-6 gap-4">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => pop(b.id)}
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-all duration-200 shadow-lg active:scale-90 ${
              b.popped ? 'bg-slate-300 shadow-inner scale-95' : `${b.color} border-b-8 border-black/10`
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const WordSearchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const WORDS = ['AMIGO', 'AJUDA', 'CALMA', 'FOCO', 'PAZ'];
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<{r: number, c: number}[]>([]);

  const initGame = () => {
    const newGrid = Array(8).fill(null).map(() => Array(8).fill('X'));
    // Simplificação para exibição: Preenchendo com letras aleatórias
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) newGrid[r][c] = letters[Math.floor(Math.random()*26)];
    setGrid(newGrid);
    setFoundWords([]);
    setSelected([]);
  };

  useEffect(() => initGame(), []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-4">
          <button onClick={onBack} className="text-3d font-black text-xs uppercase">← Voltar</button>
          <button onClick={initGame} className="text-indigo-600 font-black text-xs uppercase underline">Novo Jogo</button>
        </div>
        <div className="grid grid-cols-8 gap-2 bg-white p-4 rounded-3xl shadow-xl">
          {grid.map((row, r) => row.map((char, c) => (
            <button key={`${r}-${c}`} className="aspect-square bg-indigo-50 rounded-xl font-black text-sm text-indigo-900">{char}</button>
          )))}
        </div>
      </div>
      <div className="w-full lg:w-48 bg-white p-6 rounded-3xl shadow-lg border-2 border-indigo-100">
        <h4 className="font-black text-3d mb-4 text-xs">ENCONTRE:</h4>
        {WORDS.map(w => <div key={w} className="text-slate-400 font-black text-sm mb-2">{w}</div>)}
      </div>
    </div>
  );
};

/* --- NOVOS JOGOS --- */

const SimonGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

  const addToSequence = () => {
    const next = Math.floor(Math.random() * 4);
    const newSeq = [...sequence, next];
    setSequence(newSeq);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActiveButton(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveButton(null);
    }
    setIsPlaying(false);
    setUserSequence([]);
  };

  const handlePress = (idx: number) => {
    if (isPlaying) return;
    const nextUserSeq = [...userSequence, idx];
    setUserSequence(nextUserSeq);
    
    if (idx !== sequence[nextUserSeq.length - 1]) {
      alert("Ah não! Tente novamente.");
      setSequence([]);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      setTimeout(addToSequence, 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <button onClick={onBack} className="text-3d font-black uppercase text-xs self-start">← Voltar</button>
      <div className="grid grid-cols-2 gap-6 p-10 bg-slate-900 rounded-[5rem] shadow-2xl">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => handlePress(i)}
            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl transition-all duration-200 ${
              activeButton === i ? 'scale-110 brightness-150' : 'opacity-40'
            } ${color} shadow-[0_10px_0_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none`}
          />
        ))}
      </div>
      <button 
        onClick={addToSequence} 
        disabled={sequence.length > 0}
        className="px-10 py-5 bg-black text-white rounded-3xl font-black text-xl clay-button"
      >
        {sequence.length === 0 ? 'COMEÇAR' : `NÍVEL: ${sequence.length}`}
      </button>
    </div>
  );
};

const EmotionsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const emotions = [
    { label: 'FELIZ', icon: '😊' },
    { label: 'TRISTE', icon: '😢' },
    { label: 'RAIVA', icon: '😡' },
    { label: 'MEDO', icon: '😨' },
    { label: 'SURPRESA', icon: '😲' },
    { label: 'SONO', icon: '😴' }
  ];
  const [target, setTarget] = useState(emotions[0]);
  const [options, setOptions] = useState<typeof emotions>([]);

  const nextRound = () => {
    const next = emotions[Math.floor(Math.random() * emotions.length)];
    setTarget(next);
    setOptions([...emotions].sort(() => Math.random() - 0.5));
  };

  useEffect(() => nextRound(), []);

  return (
    <div className="flex flex-col items-center gap-10 animate-fade-in">
      <button onClick={onBack} className="text-3d font-black uppercase text-xs self-start">← Voltar</button>
      <div className="text-center">
        <div className="text-9xl mb-4 p-10 bg-white rounded-[4rem] shadow-xl inline-block border-8 border-emerald-100">
          {target.icon}
        </div>
        <h3 className="text-4xl font-black text-3d mt-4">QUAL É O SENTIMENTO?</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => opt.label === target.label ? nextRound() : alert("Tente outra vez!")}
            className="p-6 bg-white rounded-3xl font-black text-2xl text-3d clay-button hover:bg-emerald-500 hover:text-white transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const SortingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const items = [
    { id: '1', label: '🍎', cat: 'COMER' },
    { id: '2', label: '🚗', cat: 'DIRIGIR' },
    { id: '3', label: '🍌', cat: 'COMER' },
    { id: '4', label: '🚌', cat: 'DIRIGIR' },
    { id: '5', label: '🍕', cat: 'COMER' },
    { id: '6', label: '🚲', cat: 'DIRIGIR' },
  ];
  const [currentItem, setCurrentItem] = useState(items[0]);

  const sort = (cat: string) => {
    if (cat === currentItem.cat) {
      const nextIdx = Math.floor(Math.random() * items.length);
      setCurrentItem(items[nextIdx]);
    } else {
      alert("Pense bem! Onde isso se encaixa?");
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 animate-fade-in">
      <button onClick={onBack} className="text-3d font-black uppercase text-xs self-start">← Voltar</button>
      <div className="text-9xl p-12 bg-white rounded-[3.5rem] shadow-2xl animate-bounce">
        {currentItem.label}
      </div>
      <div className="grid grid-cols-2 gap-10 w-full max-w-2xl">
        <button 
          onClick={() => sort('COMER')}
          className="p-10 bg-amber-400 rounded-[3rem] text-white font-black text-3xl clay-button flex flex-col items-center gap-2"
        >
          <span>🍏</span>
          COMER
        </button>
        <button 
          onClick={() => sort('DIRIGIR')}
          className="p-10 bg-blue-500 rounded-[3rem] text-white font-black text-3xl clay-button flex flex-col items-center gap-2"
        >
          <span>🚜</span>
          VEÍCULOS
        </button>
      </div>
    </div>
  );
};

const ZenDrawing: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: any) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in h-full">
      <div className="flex justify-between w-full items-center">
        <button onClick={onBack} className="text-3d font-black uppercase text-xs">← Voltar</button>
        <div className="flex gap-2">
          {['#000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b'].map(c => (
            <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-full border-2 border-white" style={{backgroundColor: c}} />
          ))}
        </div>
        <button onClick={clear} className="text-rose-600 font-black text-xs uppercase underline">Limpar Tela</button>
      </div>
      <canvas 
        ref={canvasRef}
        width={800} height={500}
        className="w-full h-[50vh] bg-white rounded-[3rem] shadow-inner border-4 border-cyan-100 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={() => setIsDrawing(false)}
      />
    </div>
  );
};

const BalloonPop: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [balloons, setBalloons] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const colors = ['bg-rose-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-pink-400'];

  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons(prev => [
        ...prev.map(b => ({ ...b, y: b.y - 2 })),
        { id: Date.now(), x: Math.random() * 80 + 10, y: 110, color: colors[Math.floor(Math.random() * 5)] }
      ].filter(b => b.y > -20));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-sky-50 rounded-[4rem] border-4 border-white shadow-inner animate-fade-in">
      <button onClick={onBack} className="absolute top-6 left-6 z-20 text-3d font-black uppercase text-xs">← Voltar</button>
      {balloons.map(b => (
        <button
          key={b.id}
          onClick={() => setBalloons(prev => prev.filter(ball => ball.id !== b.id))}
          className={`absolute w-16 h-20 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-lg transition-transform active:scale-150 ${b.color}`}
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
        >
          <div className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-black/10 -translate-x-1/2 translate-y-full"></div>
        </button>
      ))}
    </div>
  );
};
