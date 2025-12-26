
import React, { useState, useEffect, useRef } from 'react';

type SoundType = 'none' | 'rain' | 'nature' | 'lofi' | 'piano' | 'binaural' | 'white_noise';

interface Track {
  id: SoundType;
  label: string;
  icon: string;
  url: string;
  imageUrl: string;
  category: 'ambiente' | 'musica' | 'terapeutico';
  description: string;
}

const TRACKS: Track[] = [
  { 
    id: 'rain', 
    label: 'Chuva Leve', 
    icon: '🌧️', 
    url: 'https://actions.google.com/sounds/v1/weather/light_rain.ogg', 
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=400',
    category: 'ambiente', 
    description: 'Som constante para bloquear ruídos.' 
  },
  { 
    id: 'nature', 
    label: 'Floresta', 
    icon: '🍃', 
    url: 'https://actions.google.com/sounds/v1/ambient/morning_birds.ogg', 
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400',
    category: 'ambiente', 
    description: 'Canto de pássaros e brisa.' 
  },
  { 
    id: 'lofi', 
    label: 'Lofi para Foco', 
    icon: '🎧', 
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=400',
    category: 'musica', 
    description: 'Batidas suaves para concentração.' 
  },
  { 
    id: 'piano', 
    label: 'Piano Calmo', 
    icon: '🎹', 
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73a30.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=400',
    category: 'musica', 
    description: 'Melodias relaxantes para o coração.' 
  },
  { 
    id: 'binaural', 
    label: 'Ondas Alfa', 
    icon: '🧠', 
    url: 'https://actions.google.com/sounds/v1/science_fiction/low_vibrating_hum.ogg', 
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
    category: 'terapeutico', 
    description: 'Frequências para acalmar a mente.' 
  },
  { 
    id: 'white_noise', 
    label: 'Ruído Branco', 
    icon: '📺', 
    url: 'https://actions.google.com/sounds/v1/ambient/white_noise.ogg', 
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    category: 'terapeutico', 
    description: 'Som puro para regulação sensorial.' 
  },
];

export const CalmZone: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Clique para começar');
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: any;
    if (isBreathing) {
      let stage = 0;
      const stages = ['Inspire...', 'Segure...', 'Expire...', 'Aguarde...'];
      setBreathText(stages[0]);
      
      interval = setInterval(() => {
        stage = (stage + 1) % 4;
        setBreathText(stages[stage]);
      }, 4000);
    } else {
      setBreathText('Clique para começar');
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  useEffect(() => {
    if (activeSound !== 'none') {
      const track = TRACKS.find(t => t.id === activeSound);
      if (track) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(track.url);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSound = (type: SoundType) => {
    setActiveSound(prev => prev === type ? 'none' : type);
  };

  const currentTrack = TRACKS.find(t => t.id === activeSound);

  return (
    <div className="p-4 flex flex-col items-center pb-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Central Sensorial</h2>
        <p className="text-slate-500">Sons e ritmos para ajudar no foco e na calma.</p>
      </div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Lado Esquerdo: Player e Respiração */}
        <div className="flex flex-col items-center gap-8">
          {/* Círculo de Respiração */}
          <div className="relative flex items-center justify-center">
            <div 
              className={`w-64 h-64 rounded-full border-8 border-blue-200 flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-inner relative z-10 overflow-hidden ${
                isBreathing && (breathText === 'Inspire...' || breathText === 'Segure...') ? 'scale-110 bg-blue-50' : 'scale-100 bg-white'
              }`}
            >
              {/* Imagem de Fundo para o Círculo */}
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400"
                className={`absolute inset-0 w-full h-full object-cover opacity-10 transition-transform duration-[4000ms] ${isBreathing ? 'scale-150' : 'scale-100'}`}
                alt=""
              />
              <div className="text-center px-6 relative z-10">
                <p className="text-2xl font-black text-blue-600 mb-1 transition-opacity duration-500">
                  {breathText}
                </p>
                {isBreathing && <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Respiração Guiada</span>}
              </div>
            </div>
            
            {/* Efeito Visual de Ondas quando som está ativo */}
            {activeSound !== 'none' && (
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-blue-300/10 rounded-full animate-pulse scale-150"></div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsBreathing(!isBreathing)}
            className={`px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all active:scale-95 flex items-center gap-3 ${
              isBreathing ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
            }`}
          >
            {isBreathing ? (
              <><span>🛑</span> Parar Guia</>
            ) : (
              <><span>🧘</span> Iniciar Respiração</>
            )}
          </button>

          {/* Player Ativo */}
          {activeSound !== 'none' && currentTrack && (
            <div className="w-full bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl animate-fade-in border-4 border-blue-500/30 overflow-hidden relative">
              <img src={currentTrack.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl animate-bounce">
                    {currentTrack.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Tocando agora</span>
                    <h3 className="text-xl font-black truncate">{currentTrack.label}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveSound('none')}
                    className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">🔈</span>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <span className="text-xl">🔊</span>
                  </div>
                  <div className="flex justify-center gap-1 h-8 items-end">
                     {[...Array(12)].map((_, i) => (
                       <div 
                        key={i} 
                        className="w-1 bg-blue-400 rounded-full animate-music-bar"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                       ></div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Seleção de Sons */}
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Ambiente Natural</h3>
            <div className="grid grid-cols-2 gap-4">
              {TRACKS.filter(t => t.category === 'ambiente').map(track => (
                <SoundCard 
                  key={track.id} 
                  track={track} 
                  isActive={activeSound === track.id} 
                  onToggle={() => toggleSound(track.id)} 
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Música Calma</h3>
            <div className="grid grid-cols-2 gap-4">
              {TRACKS.filter(t => t.category === 'musica').map(track => (
                <SoundCard 
                  key={track.id} 
                  track={track} 
                  isActive={activeSound === track.id} 
                  onToggle={() => toggleSound(track.id)} 
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Sons Terapêuticos</h3>
            <div className="grid grid-cols-2 gap-4">
              {TRACKS.filter(t => t.category === 'terapeutico').map(track => (
                <SoundCard 
                  key={track.id} 
                  track={track} 
                  isActive={activeSound === track.id} 
                  onToggle={() => toggleSound(track.id)} 
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 10%; }
          50% { height: 100%; }
        }
        .animate-music-bar {
          animation: music-bar 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const SoundCard: React.FC<{ track: Track, isActive: boolean, onToggle: () => void }> = ({ track, isActive, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 group overflow-hidden ${
      isActive 
        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]' 
        : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700 shadow-sm'
    }`}
  >
    {/* Imagem de Fundo do Card */}
    <img 
      src={track.imageUrl} 
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'}`} 
      alt="" 
    />
    
    <div className="relative z-10">
      <div className={`text-3xl mb-1 w-12 h-12 flex items-center justify-center rounded-2xl transition-colors ${
        isActive ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'
      }`}>
        {track.icon}
      </div>
      <div>
        <h4 className="font-black text-sm">{track.label}</h4>
        <p className={`text-[10px] leading-tight font-medium ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
          {track.description}
        </p>
      </div>
    </div>
  </button>
);
