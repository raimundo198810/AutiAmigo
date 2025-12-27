
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CommunicationCard } from '../types.ts';

const DEFAULT_CARDS: CommunicationCard[] = [
  { id: '1', label: 'Água', icon: '💧', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400', color: 'bg-blue-100', category: 'necessidades' },
  { id: '2', label: 'Comida', icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', color: 'bg-green-100', category: 'necessidades' },
  { id: '3', label: 'Banheiro', icon: '🚻', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', color: 'bg-yellow-100', category: 'necessidades' },
  { id: '4', label: 'Ajuda', icon: '🆘', imageUrl: 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=400', color: 'bg-red-100', category: 'necessidades' },
  { id: '5', label: 'Feliz', icon: '😊', imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400', color: 'bg-pink-100', category: 'sentimentos' },
  { id: '6', label: 'Triste', icon: '😢', imageUrl: 'https://images.unsplash.com/photo-1516589174184-e678201f4961?auto=format&fit=crop&q=80&w=400', color: 'bg-indigo-100', category: 'sentimentos' },
];

const QUICK_PHRASES = [
  { label: 'Oi', icon: '👋' },
  { label: 'Tudo bem?', icon: '❓' },
  { label: 'Sim', icon: '✅' },
  { label: 'Não', icon: '❌' },
  { label: 'Por favor', icon: '🙏' },
  { label: 'Obrigado', icon: '💖' },
  { label: 'Quero sair', icon: '🚶' },
  { label: 'Estou cansado', icon: '😴' },
];

const COLOR_OPTIONS = [
  { name: 'Azul', class: 'bg-blue-100' },
  { name: 'Rosa', class: 'bg-pink-100' },
  { name: 'Verde', class: 'bg-green-100' },
  { name: 'Amarelo', class: 'bg-yellow-100' },
  { name: 'Roxo', class: 'bg-purple-100' },
  { name: 'Laranja', class: 'bg-orange-100' },
  { name: 'Ciano', class: 'bg-cyan-100' },
  { name: 'Vermelho', class: 'bg-red-100' },
];

type VisualTheme = 'claro' | 'escuro' | 'colorido';

export const CommunicationBoard: React.FC = () => {
  const [cards, setCards] = useState<CommunicationCard[]>(() => {
    const saved = localStorage.getItem('ajuda_autista_custom_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [activeTheme, setActiveTheme] = useState<VisualTheme>(() => {
    return (localStorage.getItem('ajuda_autista_board_theme') as VisualTheme) || 'claro';
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingCard, setEditingCard] = useState<CommunicationCard | null>(null);
  const [typeAndTalkText, setTypeAndTalkText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // States for card form (used for add and edit)
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCategory, setNewCategory] = useState<CommunicationCard['category']>('necessidades');
  const [newColor, setNewColor] = useState('bg-blue-100');
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    localStorage.setItem('ajuda_autista_custom_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('ajuda_artista_board_theme', activeTheme);
  }, [activeTheme]);

  const handleCardClick = (card: CommunicationCard) => {
    if (card.audioUrl) {
      const audio = new Audio(card.audioUrl);
      audio.play().catch(e => {
        console.error("Erro ao tocar áudio gravado, usando fallback para TTS", e);
        speak(card.label);
      });
    } else {
      speak(card.label);
    }
  };

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedAudio(reader.result as string);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Permissão de microfone negada. Não é possível gravar áudio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newIcon) return;
    
    if (editingCard) {
      const updatedCards = cards.map(c => 
        c.id === editingCard.id 
          ? { 
              ...c, 
              label: newLabel, 
              icon: newIcon, 
              imageUrl: newImageUrl || undefined, 
              audioUrl: recordedAudio || undefined, 
              color: newColor, 
              category: newCategory 
            }
          : c
      );
      setCards(updatedCards);
    } else {
      const newCard: CommunicationCard = {
        id: Date.now().toString(),
        label: newLabel,
        icon: newIcon,
        imageUrl: newImageUrl || undefined,
        audioUrl: recordedAudio || undefined,
        color: newColor,
        category: newCategory,
      };
      setCards([...cards, newCard]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setNewLabel(''); 
    setNewIcon(''); 
    setNewImageUrl(''); 
    setRecordedAudio(null);
    setNewColor('bg-blue-100');
    setEditingCard(null);
    setIsAdding(false);
  };

  const openEditModal = (card: CommunicationCard, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCard(card);
    setNewLabel(card.label);
    setNewIcon(card.icon);
    setNewImageUrl(card.imageUrl || '');
    setNewCategory(card.category);
    setNewColor(card.color);
    setRecordedAudio(card.audioUrl || null);
    setIsAdding(true);
  };

  const removeCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja remover este cartão?')) setCards(cards.filter(c => c.id !== id));
  };

  const shareCard = (label: string, icon: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`📢 Compartilhando Cartão:\n\n${icon} ${label}`);
  };

  const filteredCards = activeFilter === 'todos' ? cards : cards.filter(card => card.category === activeFilter);

  const themeStyles = {
    claro: {
      bg: 'bg-slate-50',
      text: 'text-slate-800',
      subtext: 'text-slate-500',
      panel: 'bg-white border-blue-50',
      input: 'bg-slate-50/50 border-slate-50 focus:border-blue-200 focus:bg-white',
      phraseBtn: 'bg-white border-slate-100 hover:bg-blue-50 text-slate-600',
      cardHover: 'hover:border-white'
    },
    escuro: {
      bg: 'bg-slate-900',
      text: 'text-white',
      subtext: 'text-slate-400',
      panel: 'bg-slate-800 border-slate-700',
      input: 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500 focus:bg-slate-900 placeholder:text-slate-600',
      phraseBtn: 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-100',
      cardHover: 'hover:border-indigo-400'
    },
    colorido: {
      bg: 'bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50',
      text: 'text-slate-800',
      subtext: 'text-slate-600',
      panel: 'bg-white/70 backdrop-blur-md border-white shadow-xl',
      input: 'bg-white border-pink-100 focus:border-pink-300 focus:bg-white',
      phraseBtn: 'bg-white border-transparent shadow-sm hover:shadow-md hover:bg-pink-50 text-slate-700',
      cardHover: 'hover:border-pink-300'
    }
  };

  const currentStyle = themeStyles[activeTheme];

  return (
    <div className={`p-4 sm:p-8 min-h-full transition-colors duration-500 ${currentStyle.bg}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className={`text-4xl font-black tracking-tight ${currentStyle.text}`}>Quadro de Voz</h2>
          <p className={`${currentStyle.subtext} font-bold`}>Toque nos cartões ou use o teclado abaixo.</p>
        </div>
        
        <div className="flex flex-col gap-3 items-end">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 shadow-inner backdrop-blur-sm">
            {(['claro', 'escuro', 'colorido'] as VisualTheme[]).map(t => (
              <button
                key={t}
                onClick={() => setActiveTheme(t)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTheme === t 
                    ? 'bg-white text-blue-600 shadow-md scale-105' 
                    : 'text-slate-500 hover:bg-white/40'
                }`}
              >
                {t === 'claro' && '☀️ Claro'}
                {t === 'escuro' && '🌙 Escuro'}
                {t === 'colorido' && '🎨 Colorido'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {['todos', 'necessidades', 'sentimentos', 'atividades'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeFilter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white/80 text-slate-400 border border-slate-100 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {f}
              </button>
            ))}
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-green-600 transition-all active:scale-95"
            >
              + Novo
            </button>
          </div>
        </div>
      </div>

      <div className={`${currentStyle.panel} p-6 sm:p-8 rounded-[3rem] border-4 shadow-sm mb-12 relative overflow-hidden transition-all duration-500`}>
        {isSpeaking && (
           <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none"></div>
        )}
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-blue-600 flex items-center gap-2">
              <span className="text-2xl animate-float">⌨️</span> Teclado de Voz
            </h3>
            <div className="flex items-center gap-3">
               {isSpeaking && <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Reproduzindo Áudio...</span>}
               <span className={`text-[10px] font-black uppercase tracking-widest ${activeTheme === 'escuro' ? 'text-slate-500' : 'text-slate-300'}`}>Sua voz digital</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={typeAndTalkText}
                onChange={(e) => setTypeAndTalkText(e.target.value)}
                placeholder="O que você quer dizer?"
                className={`w-full p-6 rounded-[2rem] border-4 outline-none font-bold text-xl transition-all shadow-inner placeholder:text-slate-300 ${currentStyle.input}`}
                onKeyPress={(e) => e.key === 'Enter' && speak(typeAndTalkText)}
              />
              {typeAndTalkText && (
                <button 
                  onClick={() => setTypeAndTalkText('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-500 w-10 h-10 rounded-full hover:bg-slate-300 flex items-center justify-center font-bold transition-transform active:scale-90"
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => speak(typeAndTalkText)}
                disabled={!typeAndTalkText.trim()}
                className={`flex-1 sm:flex-none px-12 py-6 rounded-[2rem] font-black text-xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 ${
                  isSpeaking 
                    ? 'bg-blue-400 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 disabled:opacity-50 disabled:shadow-none'
                }`}
              >
                <span className="text-2xl">{isSpeaking ? '🔊' : '🗣️'}</span>
                {isSpeaking ? 'Falando' : 'Falar'}
              </button>
              
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="bg-rose-500 text-white px-6 py-6 rounded-[2rem] shadow-xl shadow-rose-100 animate-fade-in transition-all active:scale-95 flex items-center justify-center"
                  title="Parar de falar"
                >
                  <span className="text-2xl">🛑</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_PHRASES.map(phrase => (
              <button
                key={phrase.label}
                onClick={() => {
                  setTypeAndTalkText(phrase.label);
                  speak(phrase.label);
                }}
                className={`px-5 py-4 rounded-2xl text-sm font-black transition-all border-2 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 ${currentStyle.phraseBtn}`}
              >
                <span className="text-xl">{phrase.icon}</span> {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`${card.color} group relative p-8 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 overflow-hidden text-center ${currentStyle.cardHover} ${activeTheme === 'escuro' ? 'opacity-90 hover:opacity-100 border-slate-700' : 'border-transparent'}`}
          >
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button 
                onClick={(e) => openEditModal(card, e)}
                title="Editar Cartão"
                className="bg-white/70 hover:bg-white text-slate-500 hover:text-blue-500 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-75 opacity-60 sm:opacity-0 group-hover:opacity-100"
              >
                <span className="text-lg">✏️</span>
              </button>
              <button 
                onClick={(e) => shareCard(card.label, card.icon, e)}
                title="Compartilhar Cartão"
                className="bg-white/70 hover:bg-white text-slate-500 hover:text-blue-500 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-75 opacity-60 sm:opacity-0 group-hover:opacity-100"
              >
                <span className="text-lg">📤</span>
              </button>
              <button 
                onClick={(e) => removeCard(card.id, e)}
                title="Remover Cartão"
                className="bg-white/70 hover:bg-white text-slate-500 hover:text-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-75 opacity-60 sm:opacity-0 group-hover:opacity-100"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="mb-4 relative flex justify-center">
              <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-sm flex items-center justify-center text-6xl overflow-hidden mb-2 relative z-10">
                {card.imageUrl && !imageErrors[card.id] ? (
                  <img 
                    src={card.imageUrl} 
                    alt={card.label} 
                    className="w-full h-full object-cover" 
                    onError={() => setImageErrors(prev => ({ ...prev, [card.id]: true }))}
                  />
                ) : (
                  <span className="group-hover:scale-125 transition-transform">{card.icon}</span>
                )}
                {card.audioUrl && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[10px]">🎙️</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 -z-0"></div>
            </div>
            
            <span className="text-2xl font-black text-slate-700 block tracking-tight">{card.label}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{card.category}</span>
          </button>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
          <form onSubmit={handleSaveCard} className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl border-8 border-white my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800">{editingCard ? 'Editar Cartão' : 'Novo Cartão'}</h3>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600 text-2xl p-2">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Objeto</label>
                <input 
                  autoFocus
                  type="text" placeholder="Ex: Maçã" value={newLabel} onChange={e => setNewLabel(e.target.value)}
                  className="w-full p-4 rounded-2xl border-4 border-slate-50 outline-none focus:border-blue-200 font-bold"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="w-24 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Emoji</label>
                  <input 
                    type="text" placeholder="🍎" value={newIcon} onChange={e => setNewIcon(e.target.value)}
                    className="w-full p-4 rounded-2xl border-4 border-slate-50 outline-none focus:border-blue-200 font-bold text-center text-2xl"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoria</label>
                  <select 
                    value={newCategory} onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-4 rounded-2xl border-4 border-slate-50 outline-none focus:border-blue-200 font-bold bg-white h-[60px]"
                  >
                    <option value="necessidades">Necessidades</option>
                    <option value="sentimentos">Sentimentos</option>
                    <option value="atividades">Atividades</option>
                  </select>
                </div>
              </div>

              {/* COLOR SELECTION SECTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cor do Cartão</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 px-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.class}
                      type="button"
                      onClick={() => setNewColor(color.class)}
                      className={`w-full aspect-square rounded-full border-4 transition-all ${color.class} ${newColor === color.class ? 'border-slate-800 scale-110' : 'border-white hover:scale-105'}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Link da Foto (Opcional)</label>
                <input 
                  type="url" placeholder="https://..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                  className="w-full p-4 rounded-2xl border-4 border-slate-50 outline-none focus:border-blue-200 font-bold"
                />
              </div>

              {/* RECORDING SECTION */}
              <div className="bg-blue-50/50 p-6 rounded-3xl border-2 border-dashed border-blue-100">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 block text-center">Gravar Voz Personalizada (Opcional)</label>
                <div className="flex flex-col items-center gap-4">
                  {!recordedAudio ? (
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${
                        isRecording ? 'bg-rose-500 animate-pulse text-white' : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {isRecording ? '🛑' : '🎤'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          const audio = new Audio(recordedAudio);
                          audio.play();
                        }}
                        className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex-1 shadow-md active:scale-95"
                      >
                        ▶️ Ouvir Gravação
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordedAudio(null)}
                        className="bg-slate-200 text-slate-600 px-4 py-3 rounded-xl font-bold shadow-sm"
                        title="Limpar Gravação"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {isRecording ? 'Gravando agora...' : recordedAudio ? 'Áudio pronto!' : 'Toque para gravar sua voz'}
                  </p>
                </div>
              </div>
              
              <button type="submit" className="w-full py-5 rounded-[2rem] bg-blue-600 text-white font-black text-xl shadow-xl shadow-blue-100 mt-6 hover:bg-blue-700 transition-all active:scale-95">
                {editingCard ? 'Salvar Alterações ✨' : 'Criar Cartão ✨'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
