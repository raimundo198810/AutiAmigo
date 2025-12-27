
import React, { useState } from 'react';
import { askCaregiverExpert } from '../services/geminiService.ts';
import { Language } from '../types.ts';

// Added lang prop to interface
interface CaregiverAIProps {
  lang: Language;
}

export const CaregiverAI: React.FC<CaregiverAIProps> = ({ lang }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Updated handleAsk to pass lang to askCaregiverExpert
  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const result = await askCaregiverExpert(question, lang);
    setAnswer(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block relative mb-6">
          <img 
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400" 
            className="w-48 h-48 rounded-3xl object-cover shadow-2xl"
            alt="Especialista"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg">👩‍⚕️</div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Especialista de Apoio IA</h2>
        <p className="text-slate-500 font-medium">Dúvidas sobre comportamento, inclusão e suporte para cuidadores.</p>
      </div>

      <div className="bg-blue-50/50 p-8 rounded-[3rem] border-4 border-blue-50 mb-8">
        <div className="flex flex-col gap-4">
          <label className="text-xs font-black text-blue-600 ml-2 uppercase tracking-widest">Sua dúvida ou situação:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Como lidar com seletividade alimentar? / Sugestão de atividade sensorial para casa."
            className="w-full p-6 rounded-[2rem] border-none shadow-inner focus:ring-4 ring-blue-100 outline-none font-bold text-slate-700 h-32"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Consultando especialista...' : 'Pedir Orientação ✨'}
          </button>
        </div>
      </div>

      {answer && (
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-blue-50 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-green-100 text-green-600 p-2 rounded-xl text-xs font-black uppercase tracking-widest">Dicas da Especialista IA</span>
          </div>
          <div className="prose prose-blue max-w-none">
            <p className="text-slate-700 font-bold whitespace-pre-wrap leading-relaxed text-lg">
              {answer}
            </p>
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-[10px] text-slate-400 font-bold uppercase text-center">
            Nota: Esta é uma ferramenta de apoio. Consulte sempre profissionais de saúde e terapeutas.
          </div>
        </div>
      )}
    </div>
  );
};
