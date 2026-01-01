
import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';

interface AcademicSign {
  term: string;
  category: 'Matérias' | 'Pessoas' | 'Objetos' | 'Ações';
  icon: string;
  librasDesc: string;
}

interface Flashcard {
  front: string;
  back: string;
  emoji: string;
}

interface VisualGuide {
  id: string;
  title: string;
  icon: string;
  color: string;
  steps: { text: string; sub: string }[];
}

const GLOSSARY_DATA: AcademicSign[] = [
  { term: 'Escola', category: 'Objetos', icon: '🏫', librasDesc: 'Mãos em "L" abrindo como um livro.' },
  { term: 'Professor', category: 'Pessoas', icon: '🧑‍🏫', librasDesc: 'Mão em "P" balançando na têmpora.' },
  { term: 'Livro', category: 'Objetos', icon: '📖', librasDesc: 'Palmas juntas abrindo para os lados.' },
  { term: 'Aprender', category: 'Ações', icon: '🧠', librasDesc: 'Mão na testa fechando como se pegasse algo.' },
  { term: 'Matemática', category: 'Matérias', icon: '➕', librasDesc: 'Dedos em "V" cruzando as mãos.' },
  { term: 'História', category: 'Matérias', icon: '📜', librasDesc: 'Mão em "H" girando para trás (passado).' },
  { term: 'Escrever', category: 'Ações', icon: '✍️', librasDesc: 'Simular escrita na palma da outra mão.' },
  { term: 'Silêncio', category: 'Ações', icon: '🤫', librasDesc: 'Dedo indicador sobre os lábios.' },
  { term: 'Intervalo', category: 'Ações', icon: '🍎', librasDesc: 'Mãos cortando o ar horizontalmente.' },
  { term: 'Cientista', category: 'Pessoas', icon: '🧪', librasDesc: 'Mover mãos como se misturasse líquidos.' },
];

const FLASHCARD_DECKS: Record<string, Flashcard[]> = {
  Matemática: [
    { front: 'Somar (+)', back: 'Juntar quantidades para ter mais.', emoji: '➕' },
    { front: 'Subtrair (-)', back: 'Tirar uma quantidade de outra.', emoji: '➖' },
    { front: 'Igual (=)', back: 'Quando dois lados valem o mesmo.', emoji: '🟰' },
  ],
  Sentimentos: [
    { front: 'Calmo', back: 'Coração batendo devagar e mente em paz.', emoji: '😌' },
    { front: 'Frustrado', back: 'Quando algo não sai como o planejado.', emoji: '😤' },
    { front: 'Focado', back: 'Olhar e atenção em uma única tarefa.', emoji: '🎯' },
  ],
  Escola: [
    { front: 'Mochila', back: 'Lugar de guardar meus materiais.', emoji: '🎒' },
    { front: 'Lápis', back: 'Ferramenta para registrar ideias.', emoji: '✏️' },
    { front: 'Caderno', back: 'Onde faço minhas lições diárias.', emoji: '📓' },
  ]
};

const VISUAL_GUIDES: VisualGuide[] = [
  {
    id: 'guide_1',
    title: 'Ciclo da Água',
    icon: '💧',
    color: 'bg-blue-500',
    steps: [
      { text: 'Evaporação', sub: 'O sol esquenta a água e ela sobe como vapor.' },
      { text: 'Condensação', sub: 'O vapor vira nuvens lá no céu.' },
      { text: 'Precipitação', sub: 'A água cai das nuvens como chuva.' }
    ]
  },
  {
    id: 'guide_2',
    title: 'Sistema Solar',
    icon: '🪐',
    color: 'bg-indigo-600',
    steps: [
      { text: 'Sol', sub: 'A grande estrela de fogo no centro.' },
      { text: 'Planetas', sub: '8 mundos girando ao redor do sol.' },
      { text: 'Terra', sub: 'O nosso planeta azul e verde.' }
    ]
  },
  {
    id: 'guide_3',
    title: 'Adição Simples',
    icon: '🔢',
    color: 'bg-emerald-500',
    steps: [
      { text: 'Primeiro Grupo', sub: 'Conte quantos itens você tem primeiro.' },
      { text: 'Segundo Grupo', sub: 'Conte os novos itens que chegaram.' },
      { text: 'Total', sub: 'Conte todos juntos para saber o resultado.' }
    ]
  }
];

export const StudyHelper: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'glossary' | 'flashcards' | 'guides'>('glossary');
  const [selectedDeck, setSelectedDeck] = useState<string>('Matemática');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Pomodoro
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Aula Visual 🎓</h2>
          <p className="text-slate-500 font-bold text-lg">Apoio escolar acessível e instantâneo.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] shadow-inner">
          <button 
            onClick={() => setActiveTab('glossary')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'glossary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Glossário
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'flashcards' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            Flashcards
          </button>
          <button 
            onClick={() => setActiveTab('guides')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'guides' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Guias Visuais
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Pomodoro (Fixo) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[3rem] p-8 border-4 border-amber-100 shadow-xl flex flex-col items-center">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">Tempo de Estudo</span>
            <div className={`w-36 h-36 rounded-full border-8 flex items-center justify-center mb-6 transition-all ${isActive ? 'border-amber-400 animate-pulse' : 'border-slate-50'}`}>
               <span className="text-3xl font-black text-slate-800">{formatTime(timer)}</span>
            </div>
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-lg ${isActive ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}
            >
              {isActive ? 'PAUSAR' : 'COMEÇAR'}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimer(25 * 60); }}
              className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
            >
              Reiniciar Timer
            </button>
          </div>
        </div>

        {/* Lado Direito: Conteúdo Dinâmico Sem IA */}
        <div className="lg:col-span-9">
          
          {activeTab === 'glossary' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {GLOSSARY_DATA.map((item) => (
                <div key={item.term} className="bg-white p-6 rounded-[2.5rem] border-4 border-slate-50 hover:border-blue-200 transition-all shadow-sm group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-slate-800 leading-none">{item.term}</h4>
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-100">
                    <p className="text-[11px] font-bold text-slate-600 leading-tight">🤟 {item.librasDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {Object.keys(FLASHCARD_DECKS).map(deckName => (
                  <button
                    key={deckName}
                    onClick={() => { setSelectedDeck(deckName); setCurrentCardIndex(0); setIsFlipped(false); }}
                    className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${selectedDeck === deckName ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                  >
                    {deckName}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="w-full max-w-md perspective-1000">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full aspect-[4/3] rounded-[3.5rem] transition-all duration-700 transform-style-3d border-8 shadow-2xl ${isFlipped ? 'rotate-y-180 bg-emerald-50 border-emerald-500' : 'bg-white border-slate-50'}`}
                  >
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-10 backface-hidden ${isFlipped ? 'hidden' : 'block'}`}>
                      <span className="text-8xl mb-6">{FLASHCARD_DECKS[selectedDeck][currentCardIndex].emoji}</span>
                      <h4 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">{FLASHCARD_DECKS[selectedDeck][currentCardIndex].front}</h4>
                      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clique para virar</p>
                    </div>
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-10 backface-hidden rotate-y-180 ${isFlipped ? 'block' : 'hidden'}`}>
                      <p className="text-2xl font-bold text-emerald-800 leading-tight italic">
                        "{FLASHCARD_DECKS[selectedDeck][currentCardIndex].back}"
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-8">
                  <button 
                    disabled={currentCardIndex === 0}
                    onClick={() => { setCurrentCardIndex(prev => prev - 1); setIsFlipped(false); }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 shadow-xl flex items-center justify-center text-2xl disabled:opacity-20"
                  >
                    ⬅️
                  </button>
                  <span className="font-black text-slate-400 text-lg">{currentCardIndex + 1} / {FLASHCARD_DECKS[selectedDeck].length}</span>
                  <button 
                    disabled={currentCardIndex === FLASHCARD_DECKS[selectedDeck].length - 1}
                    onClick={() => { setCurrentCardIndex(prev => prev + 1); setIsFlipped(false); }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 shadow-xl flex items-center justify-center text-2xl disabled:opacity-20"
                  >
                    ➡️
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {VISUAL_GUIDES.map((guide) => (
                <div key={guide.id} className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-lg overflow-hidden flex flex-col">
                  <div className={`${guide.color} p-8 text-white flex items-center gap-4`}>
                    <span className="text-5xl">{guide.icon}</span>
                    <h4 className="text-2xl font-black uppercase tracking-tighter">{guide.title}</h4>
                  </div>
                  <div className="p-8 space-y-6 flex-1">
                    {guide.steps.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 leading-none mb-1">{step.text}</p>
                          <p className="text-sm font-bold text-slate-500 leading-tight">{step.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
