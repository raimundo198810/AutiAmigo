
import React, { useState, useEffect } from 'react';

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
    description: 'Mão aberta balançando lateralmente ou em "O" e depois levanta o dedo mínimo.', 
    imageUrl: 'https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=400',
    bgColor: 'bg-blue-50'
  },
  { 
    label: 'Obrigado', 
    icon: '🙏', 
    description: 'Mão aberta tocando a testa e saindo para frente em direção à pessoa.', 
    imageUrl: 'https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?auto=format&fit=crop&q=80&w=400',
    bgColor: 'bg-green-50'
  },
  { 
    label: 'Por favor', 
    icon: '✨', 
    description: 'Mão aberta descrevendo um círculo suave no centro do peito.', 
    imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=400',
    bgColor: 'bg-amber-50'
  },
  { 
    label: 'Desculpa', 
    icon: '😔', 
    description: 'Mão fechada em "Y" (dedo polegar e mínimo abertos) circulando o peito.', 
    imageUrl: 'https://images.unsplash.com/photo-1541178735463-ad79929255a2?auto=format&fit=crop&q=80&w=400',
    bgColor: 'bg-rose-50'
  },
  { 
    label: 'Comer', 
    icon: '🍎', 
    description: 'Ponta dos dedos unidas tocando a boca repetidamente.', 
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    bgColor: 'bg-orange-50'
  },
  { 
    label: 'Água', 
    icon: '💧', 
    description: 'Dedo indicador, médio e anelar abertos em "W", tocando o queixo.', 
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400',
    bgColor: 'bg-cyan-50'
  },
];

export const LibrasHelper: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'pt-BR';
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      setTranscript('');
      recognition?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Apoio a Surdos e Mudos</h2>
        <p className="text-slate-500 font-medium">Língua Brasileira de Sinais e Tradução de Voz.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bloco de Transcrição */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-blue-50 p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 flex items-center justify-center p-8 opacity-20">
            <span className="text-4xl">👂</span>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xl font-black text-blue-600 flex items-center gap-2">
               Ouvir com os Olhos
            </h3>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Voz para Texto</span>
          </div>
          
          <div className={`flex-1 min-h-[250px] p-8 rounded-[2rem] border-4 border-dashed flex items-center justify-center text-center transition-all duration-500 relative z-10 ${
            isListening ? 'bg-blue-50 border-blue-300 shadow-inner' : 'bg-slate-50 border-slate-100'
          }`}>
            {transcript ? (
              <p className="text-3xl font-black text-slate-800 leading-tight animate-fade-in">{transcript}</p>
            ) : (
              <div className="space-y-4">
                <span className={`text-5xl block transition-transform duration-500 ${isListening ? 'scale-125' : ''}`}>
                  {isListening ? '🎙️' : '🤫'}
                </span>
                <p className="text-slate-400 font-bold italic max-w-xs mx-auto">
                  {isListening ? 'Fale agora...' : 'Toque no botão para transformar a voz em texto gigante.'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={toggleListening}
            className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl relative z-10 ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span className="text-3xl">{isListening ? '🛑' : '🎤'}</span>
            {isListening ? 'Parar' : 'Ativar Microfone'}
          </button>
        </div>

        {/* Guia de LIBRAS Rápido */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sinais Fundamentais</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {BASIC_SIGNS.map((sign) => (
              <div key={sign.label} className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all hover:shadow-md animate-fade-in">
                <div className={`w-28 h-28 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 relative ${sign.bgColor}`}>
                  {!imageErrors[sign.label] ? (
                    <img 
                      src={sign.imageUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={sign.label}
                      onError={() => setImageErrors(prev => ({ ...prev, [sign.label]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-black opacity-50">
                      {sign.icon}
                    </div>
                  )}
                  {/* Overlay de Emoji Permanente */}
                  <div className="absolute top-1 right-1 bg-white/80 rounded-lg p-1 text-sm shadow-sm z-20">
                    {sign.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-xl text-slate-800 mb-1">{sign.label}</h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{sign.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};
