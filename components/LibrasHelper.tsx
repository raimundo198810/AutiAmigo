
import React, { useState, useEffect, useRef } from 'react';

interface Sign {
  label: string;
  icon: string;
  description: string;
  imageUrl: string;
  bgColor: string;
}

const BASIC_SIGNS: Sign[] = [
  { 
    label: 'Oi / Olá', 
    icon: '👋', 
    description: 'Mão balançando lateralmente.', 
    imageUrl: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&w=400', 
    bgColor: 'bg-blue-50' 
  },
  { 
    label: 'Obrigado', 
    icon: '🙏', 
    description: 'Mão tocando a testa e saindo para frente.', 
    imageUrl: 'https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?auto=format&fit=crop&q=80&w=400', 
    bgColor: 'bg-green-50' 
  },
  { 
    label: 'Por favor', 
    icon: '✨', 
    description: 'Mão aberta em círculo no peito.', 
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=400', 
    bgColor: 'bg-amber-50' 
  },
  { 
    label: 'Comer', 
    icon: '🍎', 
    description: 'Dedos unidos tocando a boca.', 
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', 
    bgColor: 'bg-orange-50' 
  },
];

export const LibrasHelper: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const current = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        setTranscript(current);
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Navegador incompatível.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Voz em Texto 👂</h2>
        <p className="text-slate-500 font-bold text-lg">Apoio visual em 2D para comunicação imediata.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 flex flex-col gap-6 min-h-[450px] shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Transcrição Viva</h3>
            {isListening && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>}
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-[2.5rem] p-8 flex items-center justify-center text-center overflow-y-auto border-2 border-slate-100">
            {transcript ? (
              <p className="text-4xl font-bold text-slate-900 leading-tight break-words">
                {transcript}
              </p>
            ) : (
              <div className="opacity-40">
                <span className="text-6xl block mb-4">{isListening ? '🎤' : '🤫'}</span>
                <p className="text-lg font-bold text-slate-400 uppercase">{isListening ? 'Escutando...' : 'Clique no botão'}</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleListening}
            className={`w-full py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-lg ${
              isListening ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            {isListening ? 'PARAR' : 'ATIVAR MICROFONE'}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Sinais de Apoio (2D)</h3>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] no-scrollbar pr-2">
            {BASIC_SIGNS.map((sign) => (
              <div key={sign.label} className="bg-white p-6 rounded-[2rem] flex items-center gap-6 border-4 border-white shadow-sm hover:border-blue-100 transition-all">
                <div className={`w-20 h-20 rounded-2xl overflow-hidden ${sign.bgColor} flex-shrink-0 flex items-center justify-center border-2 border-white shadow-inner`}>
                   <img 
                    src={sign.imageUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    alt={sign.label} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=400';
                    }}
                   />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-1">{sign.label}</h4>
                  <p className="text-slate-500 font-medium text-sm leading-snug">{sign.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
