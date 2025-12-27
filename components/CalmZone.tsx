
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
  const [activeSounds, setActiveSounds] = useState<SoundType[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>(
    TRACKS.reduce((acc, track) => ({ ...acc, [track.id]: 0.5 }), {})
  );
  
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

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

  const toggleSound = (type: SoundType) => {
    if (type === 'none') return;

    if (activeSounds.includes(type)) {
      // Desativar som
      if (audioRefs.current[type]) {
        audioRefs.current[type].pause();
        delete audioRefs.current[type];
      }
      setActiveSounds(prev => prev.filter(s => s !== type));
    } else {
      // Ativar som
      const track = TRACKS.find(t => t.id === type);
      if (track) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = volumes[type];
        audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
        audioRefs.current[type] = audio;
        setActiveSounds(prev => [...prev, type]);
      }
    }
  };

  const handleVolumeChange = (type: SoundType, newVolume: number) => {
    setVolumes(prev => ({ ...prev, [type]: newVolume }));
    if (audioRefs.current[type]) {
      audioRefs.current[type].volume = newVolume;
    }
  };

  useEffect(() => {
    // Cleanup ao desmontar
    return () => {
      Object.values(audioRefs.current).forEach(audio => audio.pause());
    };
  }, []);

  return (
    <div className="p-4 flex flex-col items-center pb-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Mixer Sensorial</h2>
        <p className="text-slate-500">Misture sons e ajuste volumes individuais para criar seu ambiente perfeito.</p>
      </div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Lado Esquerdo: Respiração */}
        <div className="lg:col-span-4 flex flex-col items-center gap-8 lg:sticky lg:top-24 h-fit">
          <div className="relative flex items-center justify-center">
            <div 
              className={`w-64 h-64 rounded-full border-8 border-blue-200 flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-inner relative z-10 overflow-hidden ${
                isBreathing && (breathText === 'Inspire...' || breathText === 'Segure...') ? 'scale-110 bg-blue-50' : 'scale-100 bg-white'
              }`}
            >
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
            
            {activeSounds.length > 0 && (
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

          {activeSounds.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 w-full text-center">
              <p className="text-blue-600 font-bold text-sm">Mistura Ativa: {activeSounds.length} sons</p>
              <button 
                onClick={() => {
                  Object.values(audioRefs.current).forEach(a => a.pause());
                  audioRefs.current = {};
                  setActiveSounds([]);
                }}
                className="mt-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
              >
                Desligar tudo
              </button>
            </div>
          )}
        </div>

        {/* Lado Direito: Mixer de Cartões */}
        <div className="lg:col-span-8 space-y-12">
          <MixerSection 
            title="Ambiente Natural" 
            tracks={TRACKS.filter(t => t.category === 'ambiente')}
            activeSounds={activeSounds}
            volumes={volumes}
            onToggle={toggleSound}
            onVolumeChange={handleVolumeChange}
          />

          <MixerSection 
            title="Música Relaxante" 
            tracks={TRACKS.filter(t => t.category === 'musica')}
            activeSounds={activeSounds}
            volumes={volumes}
            onToggle={toggleSound}
            onVolumeChange={handleVolumeChange}
          />

          <MixerSection 
            title="Sons Terapêuticos" 
            tracks={TRACKS.filter(t => t.category === 'terapeutico')}
            activeSounds={activeSounds}
            volumes={volumes}
            onToggle={toggleSound}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

const MixerSection: React.FC<{ 
  title: string, 
  tracks: Track[], 
  activeSounds: SoundType[], 
  volumes: Record<string, number>,
  onToggle: (id: SoundType) => void,
  onVolumeChange: (id: SoundType, vol: number) => void
}> = ({ title, tracks, activeSounds, volumes, onToggle, onVolumeChange }) => (
  <section>
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tracks.map(track => (
        <SoundCard 
          key={track.id} 
          track={track} 
          isActive={activeSounds.includes(track.id)} 
          volume={volumes[track.id]}
          onToggle={() => onToggle(track.id)} 
          onVolumeChange={(v) => onVolumeChange(track.id, v)}
        />
      ))}
    </div>
  </section>
);

const SoundCard: React.FC<{ 
  track: Track, 
  isActive: boolean, 
  volume: number,
  onToggle: () => void,
  onVolumeChange: (vol: number) => void
}> = ({ track, isActive, volume, onToggle, onVolumeChange }) => (
  <div
    className={`relative p-6 rounded-[2.5rem] border-2 transition-all flex flex-col gap-4 group overflow-hidden ${
      isActive 
        ? 'bg-white border-blue-500 shadow-xl shadow-blue-100 scale-[1.02]' 
        : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700 shadow-sm'
    }`}
  >
    <div className="flex items-center gap-4 relative z-10">
      <button
        onClick={onToggle}
        className={`text-3xl w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-sm shrink-0 ${
          isActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-50 group-hover:bg-blue-50'
        }`}
      >
        {track.icon}
      </button>
      
      <div className="flex-1">
        <h4 className="font-black text-slate-800">{track.label}</h4>
        <p className={`text-[10px] leading-tight font-medium ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
          {track.description}
        </p>
      </div>

      <button 
        onClick={onToggle}
        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          isActive ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-600'
        }`}
      >
        {isActive ? 'Ligado' : 'Ligar'}
      </button>
    </div>

    {isActive && (
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl animate-fade-in relative z-10">
        <span className="text-sm">🔈</span>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-sm">🔊</span>
      </div>
    )}

    {/* Imagem de Fundo do Card */}
    <img 
      src={track.imageUrl} 
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${isActive ? 'opacity-5' : 'opacity-0'}`} 
      alt="" 
    />
  </div>
);
