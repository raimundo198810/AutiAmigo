
import React, { useState, useEffect, useRef } from 'react';

interface Sign {
  label: string;
  icon: string;
  description: string;
  imageUrl: string;
  bgColor: string;
}

const BASIC_SIGNS: Sign[] = [
  { label: 'Oi / Olá', icon: '👋', description: 'Mão balançando lateralmente.', imageUrl: 'https://images.unsplash.com/photo-1549213821-4708d624e1d1?auto=format&fit=crop&q=80&w=400', bgColor: 'bg-blue-50' },
  { label: 'Obrigado', icon: '🙏', description: 'Mão tocando a testa e saindo para frente.', imageUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&q=80&w=400', bgColor: 'bg-green-50' },
  { label: 'Por favor', icon: '✨', description: 'Mão aberta em círculo no peito.', imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=400', bgColor: 'bg-amber-50' },
  { label: 'Comer', icon: '🍎', description: 'Dedos unidos tocando a boca.', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', bgColor: 'bg-orange-50' },
];

export const LibrasHelper: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
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
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Recognition start error:', e);
        recognitionRef.current.stop();
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-3d mb-4 uppercase tracking-tighter">Ouvir com os Olhos 👂✨</h2>
        <p className="text-slate-600 font-bold text-xl">Transforme voz em texto gigante para facilitar a leitura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="clay-card p-10 flex flex-col gap-8 min-h-[500px]">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-blue-600 uppercase tracking-tighter">Transcrição ao Vivo</h3>
            {isListening && <div className="pulse-3d w-4 h-4 bg-blue-600 rounded-full"></div>}
          </div>
          
          <div className="flex-1 inner-depth rounded-[3rem] p-10 flex items-center justify-center text-center overflow-y-auto">
            {transcript ? (
              <p className="text-5xl font-black text-black leading-tight break-words text-3d">
                {transcript}
              </p>
            ) : (
              <div className="opacity-40">
                <span className="text-8xl block mb-4">{isListening ? '🎤' : '🤫'}</span>
                <p className="text-2xl font-black text-slate-500 uppercase">{isListening ? 'Escutando você...' : 'Aperte o botão abaixo'}</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleListening}
            className={`w-full py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 transition-all clay-button shadow-xl ${
              isListening ? 'bg-rose-600 text-white shadow-rose-200 border-none' : 'bg-white text-blue-600'
            }`}
          >
            <span>{isListening ? '🛑 PARAR AGORA' : '🎤 ATIVAR MICROFONE'}</span>
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-4">Sinais Rápidos (LIBRAS)</h3>
          <div className="grid grid-cols-1 gap-6 overflow-y-auto max-h-[600px] pr-4 no-scrollbar">
            {BASIC_SIGNS.map((sign) => (
              <div key={sign.label} className="clay-card p-6 flex items-center gap-6 group hover:scale-[1.02] bg-white border border-slate-100">
                <div className={`w-28 h-28 rounded-3xl overflow-hidden shadow-inner ${sign.bgColor} flex-shrink-0 flex items-center justify-center`}>
                  {imageErrors[sign.label] ? (
                    <span className="text-5xl">{sign.icon}</span>
                  ) : (
                    <img 
                      src={sign.imageUrl} 
                      className="w-full h-full object-cover p-1 rounded-3xl" 
                      alt={sign.label} 
                      onError={() => setImageErrors(prev => ({...prev, [sign.label]: true}))}
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-3xl font-black text-3d mb-1">{sign.label}</h4>
                  <p className="text-slate-500 font-bold text-lg leading-snug">{sign.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
