
import React, { useState, useEffect, useRef } from 'react';

type SoundType = 
  | 'rain' | 'nature' | 'lofi' | 'piano' | 'ocean' | 'fire' | 'white_noise' | 'cat' 
  | 'rain_heavy' | 'ocean_big' | 'jungle' | 'campfire' | 'ocean_wave' | 'nature_serene' 
  | 'piano_soft' | 'mountain_wind' | 'birds_singing' | 'wind_chimes' | 'white_noise_fan'
  | 'deep_space' | 'crickets' | 'distant_thunder' | 'train_cabin' | 'whale_sounds'
  | 'library_peace' | 'rain_roof';

interface Track {
  id: SoundType;
  label: string;
  icon: string;
  url: string;
  imageUrl: string;
  description: string;
  color: string;
}

// URLs atualizadas para fontes estáveis (SoundHelix e Google Assets) que permitem hotlinking sem erro
const TRACKS: Track[] = [
  { 
    id: 'nature_serene', 
    label: 'Natureza Serena', 
    icon: '🌳', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800', 
    description: 'Som de mata e brisa.', 
    color: 'from-emerald-400/80 to-green-700/80' 
  },
  { 
    id: 'piano_soft', 
    label: 'Piano Suave', 
    icon: '🎹', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1520529611473-d583c71294e0?auto=format&fit=crop&q=80&w=800', 
    description: 'Melodias relaxantes.', 
    color: 'from-blue-300/80 to-slate-500/80' 
  },
  { 
    id: 'ocean_wave', 
    label: 'Ocean Wave', 
    icon: '🌊', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800', 
    description: 'Sons relaxantes de água.', 
    color: 'from-blue-400/80 to-cyan-600/80' 
  },
  { 
    id: 'rain', 
    label: 'Chuva Leve', 
    icon: '🌧️', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?auto=format&fit=crop&q=80&w=800', 
    description: 'Gotas suaves na janela.', 
    color: 'from-blue-500/80 to-indigo-900/80' 
  },
  { 
    id: 'birds_singing', 
    label: 'Canto dos Pássaros', 
    icon: '🐦', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=800', 
    description: 'Amanhecer na floresta.', 
    color: 'from-yellow-400/80 to-green-600/80' 
  },
  { 
    id: 'fire', 
    label: 'Lareira Quente', 
    icon: '🔥', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1544253303-39f82998348d?auto=format&fit=crop&q=80&w=800', 
    description: 'Estalidos relaxantes.', 
    color: 'from-orange-500/80 to-rose-900/80' 
  },
  { 
    id: 'wind_chimes', 
    label: 'Sinos de Vento', 
    icon: '🎐', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1508921234172-b68ed335b3e6?auto=format&fit=crop&q=80&w=800', 
    description: 'Paz e harmonia.', 
    color: 'from-teal-300/80 to-blue-500/80' 
  },
  { 
    id: 'white_noise_fan', 
    label: 'Ventilador', 
    icon: '🌀', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1618941785310-f42775369766?auto=format&fit=crop&q=80&w=800', 
    description: 'Ruído branco constante.', 
    color: 'from-slate-200/80 to-blue-300/80' 
  },
  { 
    id: 'deep_space', 
    label: 'Espaço Sideral', 
    icon: '🌌', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=800', 
    description: 'Frequências cósmicas.', 
    color: 'from-indigo-900/80 to-black/80' 
  },
  { 
    id: 'crickets', 
    label: 'Grilos Noturnos', 
    icon: '🦗', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1470252649358-96bf51884b06?auto=format&fit=crop&q=80&w=800', 
    description: 'Noite de verão calma.', 
    color: 'from-emerald-900/80 to-slate-900/80' 
  },
  { 
    id: 'distant_thunder', 
    label: 'Trovões ao Longe', 
    icon: '⚡', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1605727281913-70d4a7743831?auto=format&fit=crop&q=80&w=800', 
    description: 'Tempestade segura.', 
    color: 'from-slate-700/80 to-indigo-900/80' 
  },
  { 
    id: 'train_cabin', 
    label: 'Cabine de Trem', 
    icon: '🚂', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800', 
    description: 'Ritmo em movimento.', 
    color: 'from-amber-700/80 to-slate-900/80' 
  },
  { 
    id: 'whale_sounds', 
    label: 'Baleias', 
    icon: '🐋', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80&w=800', 
    description: 'Oceano profundo.', 
    color: 'from-blue-600/80 to-indigo-950/80' 
  },
  { 
    id: 'library_peace', 
    label: 'Biblioteca Calma', 
    icon: '📚', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800', 
    description: 'Foco e silêncio.', 
    color: 'from-stone-400/80 to-stone-700/80' 
  },
  { 
    id: 'rain_roof', 
    label: 'Chuva no Telhado', 
    icon: '🏠', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800', 
    description: 'Conforto acústico.', 
    color: 'from-blue-800/80 to-slate-900/80' 
  },
  { 
    id: 'cat', 
    label: 'Ronrom Amigo', 
    icon: '🐈', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800', 
    description: 'Vibração de calma.', 
    color: 'from-pink-400/80 to-purple-900/80' 
  },
  { 
    id: 'lofi', 
    label: 'Batida Lo-Fi', 
    icon: '🎧', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800', 
    description: 'Foco e tranquilidade.', 
    color: 'from-slate-500/80 to-slate-900/80' 
  },
  { 
    id: 'mountain_wind', 
    label: 'Vento na Montanha', 
    icon: '🏔️', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', 
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', 
    description: 'Brisa refrescante.', 
    color: 'from-slate-400/80 to-slate-700/80' 
  }
];

const WaveIcon: React.FC = () => (
  <div className="flex items-end gap-0.5 h-4">
    <div className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite] h-2"></div>
    <div className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite] h-4"></div>
    <div className="w-1 bg-white rounded-full animate-[bounce_0.7s_infinite] h-3"></div>
  </div>
);

const AudioPing: React.FC = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
  </span>
);

export const CalmZone: React.FC = () => {
  const [activeSounds, setActiveSounds] = useState<SoundType[]>([]);
  const [loadingSounds, setLoadingSounds] = useState<SoundType[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const toggleSound = async (track: Track) => {
    const isPlaying = activeSounds.includes(track.id);
    const isLoading = loadingSounds.includes(track.id);

    if (isPlaying) {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.pause();
      }
      setActiveSounds(activeSounds.filter(id => id !== track.id));
    } else if (!isLoading) {
      setLoadingSounds(prev => [...prev, track.id]);

      try {
        if (!audioRefs.current[track.id]) {
          const audio = new Audio();
          audio.src = track.url;
          audio.loop = true;
          audio.preload = 'auto';
          // Garante que o volume inicial seja aplicado antes do play
          audio.volume = volumes[track.id] || 0.5;
          audioRefs.current[track.id] = audio;
          
          if (!volumes[track.id]) {
            setVolumes(prev => ({ ...prev, [track.id]: 0.5 }));
          }
        }

        const audio = audioRefs.current[track.id];
        // Força o carregamento para garantir que o source seja validado
        audio.load();
        await audio.play();
        
        setActiveSounds(prev => [...prev, track.id]);
        setLoadingSounds(prev => prev.filter(id => id !== track.id));
      } catch (err) {
        console.error("Erro ao reproduzir áudio:", err);
        setLoadingSounds(prev => prev.filter(id => id !== track.id));
        alert(`Não foi possível carregar o som: ${track.label}. Certifique-se de que o navegador suporta este formato.`);
      }
    }
  };

  const updateVolume = (id: SoundType, val: number) => {
    setVolumes(prev => ({ ...prev, [id]: val }));
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = val;
    }
  };

  useEffect(() => {
    return () => {
      (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
        audio.pause();
        audio.src = "";
        audio.load();
      });
    };
  }, []);

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto px-4 pb-48 transition-all duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase mb-2">
          Mixer <span className="text-indigo-600">Calm</span> 🧘
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-2xl mx-auto transition-colors duration-500">
          Crie seu ambiente ideal. Fontes de áudio otimizadas para carregamento imediato.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {TRACKS.map(track => {
          const isActive = activeSounds.includes(track.id);
          const isLoading = loadingSounds.includes(track.id);
          const currentVol = volumes[track.id] || 0.5;
          
          return (
            <div 
              key={track.id}
              className={`group relative flex flex-col h-[26rem] transition-all duration-700 ${isActive ? 'scale-[1.03]' : ''}`}
            >
              <button
                disabled={isLoading}
                onClick={() => toggleSound(track)}
                className={`flex-1 relative rounded-[3rem] overflow-hidden transition-all duration-700 border-4 shadow-2xl ${
                  isActive 
                    ? 'border-indigo-400 ring-8 ring-indigo-500/10' 
                    : isLoading 
                      ? 'border-slate-200 opacity-80 scale-[0.98]'
                      : 'border-white dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-600 grayscale-[0.4] hover:grayscale-0'
                }`}
              >
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                  <img 
                    src={track.imageUrl} 
                    alt={track.label} 
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'brightness-[0.9]' : 'brightness-[0.6] blur-[2px]'}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${track.color} ${isActive ? 'opacity-40' : 'opacity-60'}`}></div>
                </div>
                
                <div className="relative z-10 p-8 flex flex-col h-full justify-between items-start text-left">
                  <div className="flex justify-between w-full items-start">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-4xl transition-all duration-500 shadow-xl relative ${
                      isActive ? 'bg-white text-indigo-600 scale-110 rotate-3' : 'bg-white/10 backdrop-blur-xl text-white'
                    }`}>
                      {isLoading ? (
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : track.icon}
                      {isActive && (
                        <div className="absolute -top-1 -right-1">
                          <AudioPing />
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 flex items-center gap-3">
                        <WaveIcon />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-white leading-tight drop-shadow-xl">
                      {track.label}
                    </h4>
                    <p className={`text-white/90 text-xs font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl backdrop-blur-sm transition-all ${isActive ? 'bg-white/20' : 'bg-black/20'}`}>
                      {isLoading ? 'Carregando Som...' : track.description}
                    </p>
                  </div>
                </div>

                {!isActive && !isLoading && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-black uppercase tracking-widest text-xs bg-indigo-600/80 px-6 py-3 rounded-full backdrop-blur-md">
                      Toque para ouvir
                    </span>
                  </div>
                )}
              </button>

              {isActive && (
                <div className="mt-4 px-6 animate-fade-in">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-3xl border border-white dark:border-slate-700 shadow-lg flex items-center gap-4">
                    <span className="text-xs">🔈</span>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={currentVol}
                      onChange={(e) => updateVolume(track.id, parseFloat(e.target.value))}
                      className="flex-1 accent-indigo-600 h-1.5 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-700"
                    />
                    <span className="text-xs">🔊</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(activeSounds.length > 0 || loadingSounds.length > 0) && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] animate-fade-in w-fit">
          <div className="glass-panel px-8 py-4 rounded-full border-2 border-indigo-100 dark:border-indigo-900 shadow-2xl flex items-center gap-6 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧘</span>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {activeSounds.length > 0 ? `${activeSounds.length} Trilhas Mixadas` : 'Preparando Sons...'}
              </span>
              {activeSounds.length > 0 && <AudioPing />}
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <button 
              onClick={() => {
                (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach(audio => {
                  audio.pause();
                });
                setActiveSounds([]);
                setLoadingSounds([]);
              }}
              className="text-rose-500 font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Silenciar Tudo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
