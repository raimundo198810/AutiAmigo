
import React, { useState, useEffect, useRef } from 'react';

export const NoiseMonitor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startMonitor = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsActive(true);
      updateVolume();
    } catch (err) {
      alert('Permissão de microfone necessária para o monitor sensorial.');
    }
  };

  const stopMonitor = () => {
    setIsActive(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setVolume(0);
  };

  const updateVolume = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    setVolume(average);
    
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const getStatus = () => {
    if (volume < 30) return { label: 'Silencioso', color: 'bg-green-500', icon: '✅' };
    if (volume < 60) return { label: 'Confortável', color: 'bg-blue-500', icon: '🎧' };
    if (volume < 90) return { label: 'Barulhento', color: 'bg-orange-500', icon: '⚠️' };
    return { label: 'MUITO ALTO', color: 'bg-rose-600', icon: '🚨' };
  };

  const status = getStatus();

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Monitor Sensorial 👂</h2>
        <p className="text-slate-500 font-medium">Veja o barulho do ambiente para evitar sobrecarga.</p>
      </div>

      <div className={`w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl border-8 ${
        isActive ? 'scale-105 border-white shadow-blue-200' : 'border-slate-100 opacity-50'
      } ${isActive ? status.color : 'bg-slate-100'}`}>
        <span className="text-7xl mb-2">{isActive ? status.icon : '💤'}</span>
        <span className={`text-xl font-black ${isActive ? 'text-white' : 'text-slate-400'}`}>
          {isActive ? status.label : 'Inativo'}
        </span>
      </div>

      <div className="w-full mt-12 space-y-4">
        <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
          <div 
            className={`h-full transition-all duration-100 ${status.color}`}
            style={{ width: `${Math.min(volume * 1.5, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Calmo</span>
          <span>Atenção</span>
          <span>Perigo Sensorial</span>
        </div>
      </div>

      <button
        onClick={isActive ? stopMonitor : startMonitor}
        className={`mt-12 px-12 py-6 rounded-[2rem] font-black text-2xl transition-all active:scale-95 shadow-xl ${
          isActive ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {isActive ? 'Parar Monitor' : 'Iniciar Monitor'}
      </button>

      {isActive && status.label === 'MUITO ALTO' && (
        <div className="mt-8 p-6 bg-rose-50 border-2 border-rose-200 rounded-[2rem] animate-bounce text-center">
          <p className="text-rose-600 font-black">Sobrecarga Sensorial Detectada! 🚨</p>
          <p className="text-rose-500 text-sm font-bold">Considere usar protetores ou ir para um lugar calmo.</p>
        </div>
      )}
    </div>
  );
};
