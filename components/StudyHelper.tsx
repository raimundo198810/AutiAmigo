
import React, { useState, useEffect } from 'react';
import { createEducationalMaterial } from '../services/geminiService.ts';
import { Language } from '../types.ts';

interface AcademicSign {
  term: string;
  category: string;
  icon: string;
  librasDesc: string;
}

const ACADEMIC_GLOSSARY: AcademicSign[] = [
  { term: 'Escola', category: 'Lugar', icon: '🏫', librasDesc: 'Mãos em "L" se tocando pelas palmas, como um livro abrindo.' },
  { term: 'Professor', category: 'Pessoas', icon: '🧑‍🏫', librasDesc: 'Dedo indicador e médio em "P" balançando próximo à têmpora.' },
  { term: 'Livro', category: 'Objeto', icon: '📖', librasDesc: 'Palmas das mãos juntas abrindo como se estivesse lendo.' },
  { term: 'Aprender', category: 'Ação', icon: '🧠', librasDesc: 'Mão aberta na testa, fechando como se estiver pegando algo.' },
  { term: 'Matemática', category: 'Matéria', icon: '➕', librasDesc: 'Dedos em "V" cruzando as mãos repetidamente.' },
  { term: 'Ciências', category: 'Matéria', icon: '🧪', librasDesc: 'Mãos imitando o movimento de misturar líquidos em tubos.' },
  { term: 'História', category: 'Matéria', icon: '📜', librasDesc: 'Mão em "H" fazendo movimentos circulares para trás (passado).' },
  { term: 'Escrever', category: 'Ação', icon: '✍️', librasDesc: 'Uma mão plana e a outra "segurando uma caneta" riscando a palma.' },
];

// Added lang prop to interface
interface StudyHelperProps {
  lang: Language;
}

export const StudyHelper: React.FC<StudyHelperProps> = ({ lang }) => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'glossary'>('glossary');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      // Notificação visual em vez de apenas áudio
      if (Notification.permission === "granted") {
        new Notification("Tempo de Estudo Concluído! 🌟");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Updated handleCreateMaterial to pass lang to createEducationalMaterial
  const handleCreateMaterial = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setExplanation(null);
    // Prompt otimizado para o Gemini focado em autistas surdos/mudos
    const customPrompt = `Explique "${topic}" para um estudante autista e surdo. Use frases extremamente curtas, tópicos com muitos emojis e foque no visual. Explique como se estivesse desenhando conceitos.`;
    const result = await createEducationalMaterial(customPrompt, lang);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 mb-1">Sala de Aula Visual 🎓</h2>
          <p className="text-slate-500 font-bold">Estudos adaptados para Autistas Surdos e Mudos.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
          <button 
            onClick={() => setActiveTab('glossary')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'glossary' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}
          >
            Vocabulário LIBRAS
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'ai' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
          >
            Tutor IA Visual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Pomodoro (Visual) */}
        <div className="lg:col-span-3 bg-white rounded-[3rem] shadow-xl border-4 border-amber-50 p-8 flex flex-col items-center">
          <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-6">Tempo de Foco</h3>
          
          <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6 transition-all duration-1000 ${isActive ? 'border-amber-400 animate-pulse scale-105' : 'border-slate-100'}`}>
             <div className="text-center">
                <span className="text-2xl font-black text-slate-700 block">{formatTime(timer)}</span>
                {isActive && <span className="text-[10px] font-black text-amber-400 animate-bounce">ESTUDANDO</span>}
             </div>
          </div>

          <div className="space-y-3 w-full">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${isActive ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-amber-500 text-white shadow-amber-200'}`}
            >
              {isActive ? 'PARAR' : 'COMEÇAR'}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimer(25 * 60); }}
              className="w-full py-2 text-slate-400 font-bold text-xs"
            >
              REINICIAR
            </button>
          </div>
        </div>

        {/* Lado Direito: Conteúdo */}
        <div className="lg:col-span-9">
          {activeTab === 'glossary' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {ACADEMIC_GLOSSARY.map((item) => (
                <div key={item.term} className="bg-white p-6 rounded-[2.5rem] border-4 border-slate-50 hover:border-blue-100 transition-all group shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-slate-800 leading-none">{item.term}</h4>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-100">
                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                      🤟 {item.librasDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                    <span>✨</span> O que vamos aprender?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ex: Água, Animais, Espaço..."
                      className="flex-1 p-5 rounded-2xl border-none outline-none text-slate-800 font-bold shadow-inner"
                    />
                    <button 
                      onClick={handleCreateMaterial}
                      disabled={loading || !topic.trim()}
                      className="bg-yellow-400 text-indigo-900 px-8 py-5 rounded-2xl font-black hover:bg-yellow-300 transition-all active:scale-95 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? 'CRIANDO...' : 'CRIAR LIÇÃO VISUAL'}
                    </button>
                  </div>
                </div>
              </div>

              {explanation ? (
                <div className="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-indigo-50 animate-fade-in">
                  <div className="prose prose-indigo max-w-none">
                    <div className="text-slate-700 font-bold text-xl leading-relaxed whitespace-pre-wrap bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
                      {explanation}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-300 uppercase">Gerado por IA para Suporte Visual</span>
                     <button onClick={() => window.print()} className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
                       🖨️ IMPRIMIR PARA ESTUDAR
                     </button>
                  </div>
                </div>
              ) : !loading && (
                <div className="bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 p-16 text-center">
                  <span className="text-6xl mb-4 block">👩‍🏫</span>
                  <p className="text-slate-400 font-black text-lg">Digite um assunto acima para eu explicar com imagens e sinais!</p>
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-[3rem] p-16 text-center shadow-xl border-4 border-indigo-50">
                  <div className="w-16 h-16 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-indigo-600 font-black text-xl">Montando sua lição visual...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
