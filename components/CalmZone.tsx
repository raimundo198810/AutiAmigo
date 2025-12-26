
import React, { useState, useEffect, useRef } from 'react';

type SoundType = 'none' | 'rain' | 'nature';

export const CalmZone: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Clique para começar');
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [rainVolume, setRainVolume] = useState(0.5);
  const [natureVolume, setNatureVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sounds = {
    rain: 'https://actions.google.com/sounds/v1/weather/light_rain.ogg',
    nature: 'https://actions.google.com/sounds/v1/ambient/morning_birds.ogg'
  };

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

  // Gerenciamento da troca de sons
  useEffect(() => {
    if (activeSound !== 'none') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(sounds[activeSound as keyof typeof sounds]);
      audioRef.current.loop = true;
      audioRef.current.volume = activeSound === 'rain' ? rainVolume : natureVolume;
      audioRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
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

  // Atualização dinâmica do volume sem reiniciar o áudio
  useEffect(() => {
    if (audioRef.current) {
      if (activeSound === 'rain') {
        audioRef.current.volume = rainVolume;
      } else if (activeSound === 'nature') {
        audioRef.current.volume = natureVolume;
      }
    }
  }, [rainVolume, natureVolume, activeSound]);

  const toggleSound = (type: SoundType) => {
    setActiveSound(prev => prev === type ? 'none' : type);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[75vh]">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Espaço de Calma</h2>
      
      {/* Controles de Som e Volume */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10 w-full max-w-md">
        {/* Controle Chuva */}
        <div className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => toggleSound('rain')}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all shadow-sm border-2 w-full ${
              activeSound === 'rain' 
                ? 'bg-blue-100 border-blue-400 scale-105' 
                : 'bg-white border-transparent hover:bg-slate-50'
            }`}
          >
            <span className="text-3xl mb-1">🌧️</span>
            <span className="text-xs font-bold text-slate-600">Chuva</span>
          </button>
          <div className="px-2">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rainVolume}
              onChange={(e) => setRainVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              aria-label="Volume da chuva"
            />
          </div>
        </div>
        
        {/* Controle Natureza */}
        <div className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => toggleSound('nature')}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all shadow-sm border-2 w-full ${
              activeSound === 'nature' 
                ? 'bg-green-100 border-green-400 scale-105' 
                : 'bg-white border-transparent hover:bg-slate-50'
            }`}
          >
            <span className="text-3xl mb-1">🍃</span>
            <span className="text-xs font-bold text-slate-600">Natureza</span>
          </button>
          <div className="px-2">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={natureVolume}
              onChange={(e) => setNatureVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              aria-label="Volume da natureza"
            />
          </div>
        </div>
      </div>

      {/* Círculo de Respiração */}
      <div className="relative flex items-center justify-center">
        <div 
          className={`w-64 h-64 rounded-full border-8 border-blue-200 flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-inner ${
            isBreathing && (breathText === 'Inspire...' || breathText === 'Segure...') ? 'scale-125 bg-blue-50' : 'scale-100 bg-white'
          }`}
        >
          <p className="text-xl font-bold text-blue-600 text-center px-4 transition-opacity duration-500">
            {breathText}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsBreathing(!isBreathing)}
        className={`mt-12 px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all active:scale-95 ${
          isBreathing ? 'bg-red-400 text-white hover:bg-red-500' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isBreathing ? 'Parar Respiração' : 'Iniciar Respiração Guiada'}
      </button>

      <div className="mt-8 space-y-2 text-center max-w-xs">
        <p className="text-slate-500 text-sm">
          Acompanhe o círculo: ele aumenta quando você inspira e diminui quando expira.
        </p>
        {activeSound !== 'none' && (
          <p className="text-blue-400 text-xs font-medium animate-pulse">
            Som de {activeSound === 'rain' ? 'chuva' : 'natureza'} ativo ({Math.round((activeSound === 'rain' ? rainVolume : natureVolume) * 100)}%)
          </p>
        )}
      </div>
    </div>
  );
};
