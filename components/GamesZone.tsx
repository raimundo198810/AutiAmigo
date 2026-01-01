
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DatabaseService, GameStats } from '../services/databaseService.ts';

type GameType = 'menu' | 'memory' | 'popit' | 'wordsearch' | 'simon' | 'emotions' | 'sorting' | 'zen' | 'balloons' | 'piano' | 'shadows' | 'colors' | 'breathe' | 'trace' | 'sounds' | 'puzzle';

export const GamesZone: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');
  const [records, setRecords] = useState<GameStats>(DatabaseService.getGameStats());

  const updateRecord = (newStats: Partial<GameStats>) => {
    const current = DatabaseService.getGameStats();
    const updated = { ...current, ...newStats };
    DatabaseService.saveGameStats(updated);
    setRecords(updated);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto h-full min-h-[70vh] flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">PlayZone 🎮</h2>
        <p className="text-slate-500 font-bold text-lg">15 jogos divertidos e estáveis!</p>
      </div>

      {activeGame === 'menu' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
          <GameMenuCard icon="🧠" title="Memória" color="bg-blue-50" border="border-blue-200" onClick={() => setActiveGame('memory')} />
          <GameMenuCard icon="🫧" title="Pop-It" color="bg-purple-50" border="border-purple-200" onClick={() => setActiveGame('popit')} />
          <GameMenuCard icon="🔴" title="Gênio" color="bg-rose-50" border="border-rose-200" onClick={() => setActiveGame('simon')} />
          <GameMenuCard icon="🎈" title="Balões" color="bg-pink-50" border="border-pink-200" onClick={() => setActiveGame('balloons')} />
          <GameMenuCard icon="🎹" title="Piano" color="bg-indigo-50" border="border-indigo-200" onClick={() => setActiveGame('piano')} />
          
          <GameMenuCard icon="🔍" title="Busca" color="bg-slate-50" border="border-slate-200" onClick={() => setActiveGame('wordsearch')} />
          <GameMenuCard icon="👤" title="Sombras" color="bg-slate-200" border="border-slate-300" onClick={() => setActiveGame('shadows')} />
          <GameMenuCard icon="🌈" title="Cores" color="bg-orange-50" border="border-orange-200" onClick={() => setActiveGame('colors')} />
          <GameMenuCard icon="🎨" title="Desenho" color="bg-cyan-50" border="border-cyan-200" onClick={() => setActiveGame('zen')} />
          <GameMenuCard icon="📦" title="Organizar" color="bg-amber-50" border="border-amber-200" onClick={() => setActiveGame('sorting')} />
          
          <GameMenuCard icon="🎭" title="Emoções" color="bg-emerald-50" border="border-emerald-200" onClick={() => setActiveGame('emotions')} />
          <GameMenuCard icon="🌬️" title="Respirar" color="bg-teal-50" border="border-teal-200" onClick={() => setActiveGame('breathe')} />
          <GameMenuCard icon="✏️" title="Traçado" color="bg-lime-50" border="border-lime-200" onClick={() => setActiveGame('trace')} />
          <GameMenuCard icon="🦁" title="Sons" color="bg-yellow-50" border="border-yellow-200" onClick={() => setActiveGame('sounds')} />
          <GameMenuCard icon="🧩" title="Puzzle" color="bg-violet-50" border="border-violet-200" onClick={() => setActiveGame('puzzle')} />
        </div>
      )}

      {activeGame !== 'menu' && (
        <div className="flex-1 flex flex-col items-center w-full">
           <button 
             onClick={() => setActiveGame('menu')} 
             className="mb-8 font-black text-slate-400 uppercase text-[10px] tracking-widest hover:text-slate-900 self-start bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm"
           >
             ← Voltar para o Menu
           </button>
           
           <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border-4 border-slate-50 dark:border-slate-700 relative overflow-hidden transition-colors">
             {activeGame === 'memory' && <MemoryGame records={records} onRecordUpdate={updateRecord} />}
             {activeGame === 'popit' && <PopItGame />}
             {activeGame === 'simon' && <SimonGame records={records} onRecordUpdate={updateRecord} />}
             {activeGame === 'balloons' && <BalloonPop records={records} onRecordUpdate={updateRecord} />}
             {activeGame === 'piano' && <PianoGame />}
             {activeGame === 'wordsearch' && <WordSearchGame />}
             {activeGame === 'shadows' && <ShadowMatchGame />}
             {activeGame === 'colors' && <ColorMatchGame />}
             {activeGame === 'zen' && <ZenDrawing />}
             {activeGame === 'sorting' && <SortingGame />}
             {activeGame === 'emotions' && <EmotionsGame />}
             {activeGame === 'breathe' && <BreathingExercise />}
             {activeGame === 'trace' && <TracingGame />}
             {activeGame === 'sounds' && <SoundMatchGame />}
             {activeGame === 'puzzle' && <SimplePuzzleGame />}
           </div>
        </div>
      )}
    </div>
  );
};

const GameMenuCard: React.FC<{ icon: string, title: string, color: string, border: string, onClick: () => void }> = ({ icon, title, color, border, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-3xl flex flex-col items-center text-center group border-2 ${border} ${color} dark:bg-slate-700 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600 transition-all shadow-sm hover:shadow-md active:scale-95`}
  >
    <div className="text-4xl mb-2 transition-transform group-hover:scale-110">
      {icon}
    </div>
    <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">{title}</h3>
  </button>
);

// --- 1. Memory Game (Bug-Free Version) ---
const MemoryGame: React.FC<{ records: GameStats, onRecordUpdate: (s: Partial<GameStats>) => void }> = ({ records, onRecordUpdate }) => {
  const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  const [cards, setCards] = useState<{id: number, icon: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = useCallback(() => {
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
  }, []);

  useEffect(() => initGame(), [initGame]);

  const handleFlip = (idx: number) => {
    if (flippedIndices.length >= 2 || cards[idx].flipped || cards[idx].matched) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, matched: true } : c));
          setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        {cards.map((c, i) => (
          <button 
            key={i} 
            onClick={() => handleFlip(i)} 
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${c.flipped || c.matched ? 'bg-white border-blue-400 rotate-y-180' : 'bg-slate-100 border-transparent dark:bg-slate-700'}`}
          >
            {(c.flipped || c.matched) ? c.icon : '?'}
          </button>
        ))}
      </div>
      <p className="mt-6 font-black text-slate-400 uppercase text-[10px]">Movimentos: {moves}</p>
      <button onClick={initGame} className="mt-4 text-blue-500 font-bold uppercase text-[10px]">Reiniciar Jogo</button>
    </div>
  );
};

// --- 2. Pop-It Game (Haptic-style) ---
const PopItGame = () => {
  const [pops, setPops] = useState(Array(25).fill(false));
  const colors = ['bg-rose-400', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400'];
  return (
    <div className="grid grid-cols-5 gap-4 p-4 place-items-center">
      {pops.map((p, i) => (
        <button 
          key={i} 
          onClick={() => { const n = [...pops]; n[i] = !n[i]; setPops(n); }}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-b-4 transition-all ${p ? 'bg-slate-100 border-slate-200 translate-y-1 shadow-inner' : `${colors[i % 5]} border-black/10 shadow-lg active:scale-90`}`}
        />
      ))}
      <button onClick={() => setPops(Array(25).fill(false))} className="col-span-5 mt-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Resetar Bolhas</button>
    </div>
  );
};

// --- 3. Simon Game (Stable Sequence with Error Flash) ---
const SimonGame: React.FC<{ records: GameStats, onRecordUpdate: (s: Partial<GameStats>) => void }> = ({ records, onRecordUpdate }) => {
  const [seq, setSeq] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];

  const playSequence = async (sequence: number[]) => {
    setIsPlayingSeq(true);
    for (const i of sequence) {
      await new Promise(r => setTimeout(r, 600));
      setActiveBtn(i);
      await new Promise(r => setTimeout(r, 400));
      setActiveBtn(null);
    }
    setIsPlayingSeq(false);
  };

  const start = () => {
    const first = Math.floor(Math.random() * 4);
    setSeq([first]);
    setUserSeq([]);
    setShowError(false);
    playSequence([first]);
  };

  const handleBtn = (idx: number) => {
    if (isPlayingSeq || seq.length === 0 || showError) return;
    
    const nextUserSeq = [...userSeq, idx];
    setUserSeq(nextUserSeq);

    if (idx !== seq[nextUserSeq.length - 1]) {
      // Errou a sequência
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSeq([]);
        setUserSeq([]);
      }, 800);
      return;
    }

    if (nextUserSeq.length === seq.length) {
      if (seq.length > records.simonMaxLevel) onRecordUpdate({ simonMaxLevel: seq.length });
      const nextFullSeq = [...seq, Math.floor(Math.random() * 4)];
      setSeq(nextFullSeq);
      setUserSeq([]);
      setTimeout(() => playSequence(nextFullSeq), 1000);
    }
  };

  return (
    <div className={`flex flex-col items-center transition-colors duration-300 relative rounded-[2rem] p-4 ${showError ? 'bg-rose-500/20' : ''}`}>
      {showError && (
        <div className="absolute inset-0 bg-rose-600/40 animate-pulse rounded-[2rem] z-50 flex items-center justify-center">
           <span className="text-white font-black text-4xl drop-shadow-lg uppercase tracking-widest">ERROU! ❌</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {colors.map((c, i) => (
          <button 
            key={i} 
            onClick={() => handleBtn(i)} 
            className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl border-b-8 border-black/20 transition-all ${c} ${activeBtn === i ? 'brightness-150 scale-105' : 'brightness-90 active:scale-95 active:translate-y-1'}`} 
          />
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center">
        <h4 className="font-black text-xl text-slate-700 dark:text-white uppercase tracking-tighter">Nível: {seq.length}</h4>
        <button onClick={start} className="mt-4 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95">Começar</button>
      </div>
    </div>
  );
};

// --- 4. Balloon Pop (Unique IDs) ---
const BalloonPop: React.FC<{ records: GameStats, onRecordUpdate: (s: Partial<GameStats>) => void }> = ({ records, onRecordUpdate }) => {
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<{id: string, x: number, y: number, color: string}[]>([]);
  const colors = ['bg-rose-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400', 'bg-emerald-400'];

  useEffect(() => {
    const genInterval = setInterval(() => {
      setBalloons(prev => [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        x: Math.random() * 80 + 10, 
        y: 110, 
        color: colors[Math.floor(Math.random() * colors.length)] 
      }]);
    }, 1500);

    const moveInterval = setInterval(() => {
      setBalloons(prev => prev.map(b => ({ ...b, y: b.y - 1.5 })).filter(b => b.y > -20));
    }, 40);

    return () => { clearInterval(genInterval); clearInterval(moveInterval); };
  }, []);

  const pop = (id: string) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div className="h-[400px] bg-sky-50 dark:bg-slate-900/50 rounded-3xl relative overflow-hidden cursor-crosshair">
      <div className="absolute top-4 left-4 z-20 font-black text-blue-600 dark:text-blue-400 text-xl">SCORE: {score}</div>
      {balloons.map(b => (
        <button 
          key={b.id} 
          onClick={() => pop(b.id)} 
          className={`absolute w-14 h-20 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] ${b.color} shadow-lg flex items-center justify-center animate-pulse transition-transform active:scale-150 active:opacity-0`} 
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
        >
           <div className="w-0.5 h-6 bg-white/20 absolute -bottom-4 left-1/2"></div>
        </button>
      ))}
    </div>
  );
};

// --- 5. Piano (Better Audio Feedback) ---
const PianoGame = () => {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const colors = ['bg-rose-500', 'bg-orange-500', 'bg-yellow-400', 'bg-emerald-500', 'bg-blue-500', 'bg-indigo-600', 'bg-purple-600'];
  const play = (n: string) => {
    const s = window.speechSynthesis;
    s.cancel(); // Parar fala anterior para evitar sobreposição
    const u = new SpeechSynthesisUtterance(n); u.pitch = 1.5; u.rate = 1.5; s.speak(u);
  };
  return (
    <div className="flex gap-1.5 h-64 bg-slate-900 p-4 rounded-3xl overflow-x-auto no-scrollbar">
      {notes.map((n, i) => (
        <button 
          key={n} 
          onClick={() => play(n)} 
          className={`flex-1 min-w-[50px] ${colors[i]} rounded-xl active:translate-y-4 transition-all border-b-[12px] border-black/30 flex items-end justify-center pb-6 text-white font-black text-xl`}
        >
          {n}
        </button>
      ))}
    </div>
  );
};

// --- 6. Word Search (Advanced Version) ---
const WordSearchGame = () => {
  const words = ["FOCO", "AMOR", "PAZ", "BEM", "LUZ"];
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  
  // Grade 8x8 fixa para o exemplo
  const grid = [
    'F','O','C','O','X','A','M','O',
    'R','L','U','Z','Y','P','A','Z',
    'A','M','O','R','K','W','B','E',
    'B','E','M','Q','V','A','X','S',
    'D','G','H','J','L','K','Z','M',
    'P','A','Z','T','U','I','O','P',
    'A','B','C','D','E','F','G','H',
    'F','O','C','O','W','O','R','D'
  ];

  const handleCellClick = (idx: number) => {
    const nextSelected = selectedCells.includes(idx) 
      ? selectedCells.filter(i => i !== idx) 
      : [...selectedCells, idx];
    
    setSelectedCells(nextSelected);
    
    // Verificar se a combinação atual forma alguma palavra
    const currentWord = nextSelected.map(i => grid[i]).join("");
    if (words.includes(currentWord) && !foundWords.includes(currentWord)) {
      setFoundWords([...foundWords, currentWord]);
      setSelectedCells([]);
      if (foundWords.length + 1 === words.length) {
        alert("Parabéns! Você encontrou todas as palavras! 🌟");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest mb-2">Caça-Palavras</h4>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {words.map(w => (
            <span key={w} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${foundWords.includes(w) ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              {w} {foundWords.includes(w) ? '✓' : ''}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-100 dark:bg-slate-700 rounded-[2rem] shadow-inner">
        {grid.map((char, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-black text-sm md:text-base transition-all ${
              selectedCells.includes(i) 
                ? 'bg-blue-500 text-white scale-90 shadow-lg' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm active:scale-95'
            }`}
          >
            {char}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => {setFoundWords([]); setSelectedCells([]);}} 
        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
      >
        Reiniciar Grade
      </button>
    </div>
  );
};

// --- 7. Shadows Game ---
const ShadowMatchGame = () => {
  const items = [{ i: '🍎', l: 'Maçã' }, { i: '🐘', l: 'Elefante' }, { i: '✈️', l: 'Avião' }, { i: '🦒', l: 'Girafa' }];
  const [targetIdx, setTargetIdx] = useState(0);
  const [success, setSuccess] = useState(false);

  const check = (idx: number) => {
    if (idx === targetIdx) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setTargetIdx((targetIdx + 1) % items.length); }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className={`w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-7xl transition-all grayscale brightness-0 opacity-20 ${success ? 'brightness-100 opacity-100 grayscale-0 scale-110' : ''}`}>
        {items[targetIdx].i}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((it, idx) => (
          <button key={idx} onClick={() => check(idx)} className="w-16 h-16 bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-2xl text-4xl shadow-md hover:scale-105 transition-transform">{it.i}</button>
        ))}
      </div>
      {success && <p className="font-black text-emerald-500 uppercase animate-bounce">Acertou! 🌟</p>}
    </div>
  );
};

// --- 8. Colors Game ---
const ColorMatchGame = () => {
  const colors = [
    { n: 'VERMELHO', c: 'bg-rose-500' }, 
    { n: 'AZUL', c: 'bg-blue-500' }, 
    { n: 'VERDE', c: 'bg-emerald-500' },
    { n: 'AMARELO', c: 'bg-yellow-400' }
  ];
  const [target, setTarget] = useState(colors[0]);

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <h4 className="text-2xl font-black text-slate-800 dark:text-white text-center">Toque na cor <br/> <span className="text-blue-600 uppercase tracking-widest">{target.n}</span></h4>
      <div className="grid grid-cols-2 gap-4">
        {colors.map((col, idx) => (
          <button 
            key={idx} 
            onClick={() => col.n === target.n ? setTarget(colors[Math.floor(Math.random() * colors.length)]) : null} 
            className={`w-24 h-24 rounded-full shadow-lg ${col.c} border-8 border-white dark:border-slate-700 active:scale-95 transition-transform`} 
          />
        ))}
      </div>
    </div>
  );
};

// --- 9. Zen Drawing (Full Support) ---
const ZenDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#3b82f6');
  const [isDrawing, setIsDrawing] = useState(false);

  const startDraw = (e: any) => {
    setIsDrawing(true);
    draw(e);
  };
  const stopDraw = () => setIsDrawing(false);

  const draw = (e: any) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect!.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect!.top;
    if (ctx) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas 
        ref={canvasRef} 
        width={300} height={300} 
        onMouseDown={startDraw} onMouseUp={stopDraw} onMouseMove={draw}
        onTouchStart={startDraw} onTouchEnd={stopDraw} onTouchMove={draw}
        className="bg-slate-50 dark:bg-slate-900 rounded-3xl border-4 border-slate-100 dark:border-slate-700 cursor-crosshair touch-none shadow-inner" 
      />
      <div className="flex flex-wrap justify-center gap-3">
        {['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#000000'].map(c => (
          <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-4 ${color === c ? 'border-white scale-125' : 'border-transparent'}`} style={{ background: c }} />
        ))}
        <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,300,300)} className="bg-slate-100 dark:bg-slate-700 text-[10px] font-black uppercase text-slate-500 px-4 py-2 rounded-xl ml-2">Limpar</button>
      </div>
    </div>
  );
};

// --- 10. Sorting Game ---
const SortingGame = () => {
  const items = [{ i: '🍎', c: 'F' }, { i: '🧸', c: 'B' }, { i: '🍌', c: 'F' }, { i: '🚗', c: 'B' }, { i: '🍇', c: 'F' }];
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSort = (cat: string) => {
    if (items[current].c === cat) {
      setFeedback('Boa! ✨');
      setTimeout(() => { setFeedback(null); setCurrent((current + 1) % items.length); }, 800);
    } else {
      setFeedback('Tente outra vez! ❌');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="text-9xl animate-bounce drop-shadow-2xl">{items[current].i}</div>
      <div className="flex gap-6 w-full max-w-sm">
        <button onClick={() => handleSort('F')} className="flex-1 bg-emerald-100 text-emerald-700 p-6 rounded-[2rem] font-black uppercase text-xs border-b-4 border-emerald-300 active:translate-y-1 active:border-b-0 transition-all">FRUTA 🍎</button>
        <button onClick={() => handleSort('B')} className="flex-1 bg-blue-100 text-blue-700 p-6 rounded-[2rem] font-black uppercase text-xs border-b-4 border-blue-300 active:translate-y-1 active:border-b-0 transition-all">BRINQUEDO 🧸</button>
      </div>
      {feedback && <p className={`font-black uppercase tracking-widest ${feedback.includes('Boa') ? 'text-emerald-500' : 'text-rose-500'}`}>{feedback}</p>}
    </div>
  );
};

// --- 11. Emotions Game ---
const EmotionsGame = () => {
  const emotions = [{ e: '😊', l: 'Feliz' }, { e: '😢', l: 'Triste' }, { e: '😡', l: 'Bravo' }, { e: '😮', l: 'Surpreso' }];
  const [targetIdx, setTargetIdx] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <h4 className="text-2xl font-black text-slate-800 dark:text-white">Qual rosto está <br/><span className="text-emerald-500 uppercase tracking-tighter">{emotions[targetIdx].l}</span>?</h4>
      <div className="grid grid-cols-2 gap-4">
        {emotions.map((em, idx) => (
          <button 
            key={idx} 
            onClick={() => idx === targetIdx ? setTargetIdx(Math.floor(Math.random() * emotions.length)) : null} 
            className="text-6xl p-6 bg-slate-50 dark:bg-slate-700 rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-600 border-4 border-transparent hover:border-emerald-100 transition-all shadow-sm"
          >
            {em.e}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- 12. Breathe Exercise (Visual Circle) ---
const BreathingExercise = () => {
  const [phase, setPhase] = useState('Inspirar');
  useEffect(() => {
    const timer = setInterval(() => setPhase(p => p === 'Inspirar' ? 'Expirar' : 'Inspirar'), 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex flex-col items-center py-12">
      <div className={`w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-[4000ms] border-[12px] border-white dark:border-slate-700 shadow-2xl ${phase === 'Inspirar' ? 'bg-blue-400 scale-125' : 'bg-emerald-400 scale-90'}`}>
        <span className="text-white font-black uppercase tracking-widest text-lg drop-shadow-md">{phase}</span>
      </div>
      <p className="mt-12 text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Acompanhe o movimento</p>
    </div>
  );
};

// --- 13. Tracing Game (Interactive Canvas) ---
const TracingGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);

  const reset = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0,0,300,300);
    ctx.font = "bold 220px Outfit";
    ctx.fillStyle = "#f1f5f9";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("B", 150, 150);
  }, []);

  useEffect(() => reset(), [reset]);

  const handleMove = (e: any) => {
    if (e.buttons !== 1 && !e.touches) return;
    const ctx = canvasRef.current?.getContext('2d');
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect!.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect!.top;
    if (ctx) {
      ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas 
        ref={canvasRef} 
        width={300} height={300} 
        onMouseMove={handleMove} onTouchMove={handleMove}
        className="bg-white rounded-[3rem] border-8 border-slate-50 shadow-xl cursor-crosshair touch-none" 
      />
      <button onClick={reset} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-500">Limpar Letra</button>
    </div>
  );
};

// --- 14. Sound Match (Accessible) ---
const SoundMatchGame = () => {
  const sounds = [
    { i: '🦁', s: 'Leão', audio: 'Leão' }, 
    { i: '🐮', s: 'Vaca', audio: 'Vaca' }, 
    { i: '🐔', s: 'Galinha', audio: 'Galinha' },
    { i: '🐘', s: 'Elefante', audio: 'Elefante' }
  ];
  const [target, setTarget] = useState(sounds[0]);

  const playPrompt = () => {
    const s = window.speechSynthesis;
    s.cancel();
    s.speak(new SpeechSynthesisUtterance(`Quem faz este som? ${target.audio}`));
  };

  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <button onClick={playPrompt} className="w-24 h-24 bg-indigo-500 text-white rounded-full text-4xl shadow-xl animate-pulse hover:scale-110 transition-transform">🔊</button>
      <div className="grid grid-cols-2 gap-4">
        {sounds.map((s, idx) => (
          <button 
            key={idx} 
            onClick={() => s.i === target.i ? setTarget(sounds[Math.floor(Math.random() * sounds.length)]) : null} 
            className="text-5xl p-6 bg-slate-50 dark:bg-slate-700 rounded-3xl border-4 border-transparent hover:border-indigo-100 transition-all shadow-sm"
          >
            {s.i}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- 15. Simple Puzzle (Grid Swap) ---
const SimplePuzzleGame = () => {
  const [tiles, setTiles] = useState(['🧩', '🚀', '⭐', '🎈'].sort(() => Math.random() - 0.5));
  
  const swap = (i: number) => {
    const next = [...tiles];
    const j = (i + 1) % 4;
    [next[i], next[j]] = [next[j], next[i]];
    setTiles(next);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="grid grid-cols-2 gap-4 bg-slate-100 dark:bg-slate-700 p-6 rounded-[3rem] shadow-inner">
        {tiles.map((t, i) => (
          <button 
            key={i} 
            onClick={() => swap(i)} 
            className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] text-5xl flex items-center justify-center shadow-xl border-4 border-white/50 active:scale-90 transition-all"
          >
            {t}
          </button>
        ))}
      </div>
      <p className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Organize os ícones <br/> trocando as posições!</p>
    </div>
  );
};
