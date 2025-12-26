
import React, { useState, useEffect } from 'react';
// Fix: Removido import inexistente simplifyStudyTopic do geminiService.ts
import { createEducationalMaterial } from '../services/geminiService.ts';

export const StudyHelper: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Reconhecimento de Voz
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'pt-BR';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTopic(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
  }

  const startListening = () => {
    if (!recognition) return alert('Seu navegador não suporta voz.');
    setIsListening(true);
    recognition.start();
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play();
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateMaterial = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setExplanation(null);
    const result = await createEducationalMaterial(topic);
    setExplanation(result);
    setLoading(false);
  };

  const speak = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Cantinho de Estudo Interativo</h2>
        <p className="text-slate-500 font-medium">Crie seus próprios materiais apenas falando!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Temporizador Pomodoro */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] shadow-xl border-4 border-amber-50 p-8 flex flex-col items-center">
          <h3 className="text-xl font-black text-amber-600 mb-6 flex items-center gap-2">
            <span>⏱️</span> Cronômetro de Foco
          </h3>
          
          <div className={`w-40 h-40 rounded-full border-8 flex items-center justify-center mb-8 transition-all duration-500 ${isActive ? 'border-amber-400 bg-amber-50 shadow-2xl shadow-amber-100 scale-105' : 'border-slate-100 bg-slate-50'}`}>
            <span className="text-4xl font-black text-slate-700">{formatTime(timer)}</span>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 ${isActive ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-amber-500 text-white shadow-amber-200'}`}
            >
              {isActive ? 'Pausar' : 'Começar Agora'}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimer(25 * 60); }}
              className="w-full py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Criador de Material por Voz */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                <span>🎙️</span> Criar Material com Voz
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="O que você quer aprender hoje?"
                    className="w-full p-5 rounded-2xl border-none outline-none text-slate-800 font-bold shadow-inner pr-14"
                  />
                  <button 
                    onClick={startListening}
                    className={`absolute right-2 top-2 bottom-2 w-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}
                  >
                    {isListening ? '●' : '🎤'}
                  </button>
                </div>
                <button 
                  onClick={handleCreateMaterial}
                  disabled={loading || !topic.trim()}
                  className="bg-yellow-400 text-indigo-900 px-8 py-5 rounded-2xl font-black hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'GERANDO...' : 'CRIAR GUIA'}
                </button>
              </div>
              <p className="text-indigo-200 text-[10px] mt-3 font-bold uppercase tracking-widest">Dica: "Me fale sobre o sistema solar" ou "Quem descobriu o Brasil?"</p>
            </div>
          </div>

          {explanation && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-2 border-indigo-50 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full opacity-30"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
                <h4 className="text-indigo-600 font-black uppercase text-xs tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">Material Gerado</h4>
                <button 
                  onClick={() => speak(explanation)}
                  className="bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-green-600 transition-all shadow-lg active:scale-95"
                >
                  <span className="text-xl">🔊</span> OUVIR LIÇÃO
                </button>
              </div>

              <div className="prose prose-indigo max-w-none relative z-10">
                <div className="text-slate-700 font-bold text-lg leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {explanation}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => window.print()} className="text-slate-400 font-bold text-xs hover:text-indigo-500 transition-colors">
                  🖨️ Imprimir para estudar no papel
                </button>
              </div>
            </div>
          )}

          {!explanation && !loading && (
            <div className="bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-100 p-12 text-center">
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400" className="w-32 h-32 object-cover rounded-3xl mx-auto mb-6 opacity-40 grayscale" alt="" />
              <p className="text-slate-400 font-bold">Dite ou digite um assunto acima para começar seu estudo personalizado.</p>
            </div>
          )}
          
          {loading && (
            <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-inner border border-indigo-50">
              <div className="w-16 h-16 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-indigo-600 font-black text-xl">Seu tutor IA está escrevendo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
