
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types.ts';

interface InfoSection {
  title: string;
  icon: string;
  color: string;
  items: { label: string; description: string }[];
}

const SECTIONS: InfoSection[] = [
  {
    title: 'Nossos Direitos',
    icon: '⚖️',
    color: 'bg-blue-500',
    items: [
      { label: 'Lei Berenice Piana', description: 'Garante o autista como pessoa com deficiência para todos os fins legais.' },
      { label: 'Prioridade', description: 'Atendimento prioritário em filas, hospitais e órgãos públicos.' },
      { label: 'Educação Inclusiva', description: 'Direito a mediador escolar e adaptação de materiais sem custos extras.' },
      { label: 'CIPTEA', description: 'Carteira de Identificação que facilita o acesso a direitos e serviços.' }
    ]
  },
  {
    title: 'Nossos Deveres',
    icon: '🤝',
    color: 'bg-amber-500',
    items: [
      { label: 'Respeito Mútuo', description: 'Direito de ser respeitado e o dever de respeitar os limites do coletivo.' },
      { label: 'Participação', description: 'Engajar-se nas terapias e processos de aprendizagem conforme suas capacidades.' },
      { label: 'Colaboração', description: 'Cuidadores têm o dever de informar a escola/médicos sobre necessidades específicas.' },
      { label: 'Atualização', description: 'Manter laudos e documentações atualizados para garantir o acesso a benefícios.' }
    ]
  },
  {
    title: 'Cuidados Essenciais',
    icon: '🧘',
    color: 'bg-emerald-500',
    items: [
      { label: 'Gestão Sensorial', description: 'Identificar gatilhos (luz, som) e usar ferramentas de regulação.' },
      { label: 'Rotina Estável', description: 'Previsibilidade reduz ansiedade. Use cronogramas visuais.' },
      { label: 'Apoio Emocional', description: 'Terapias ocupacionais e psicológicas são fundamentais para o desenvolvimento.' },
      { label: 'Autocuidado', description: 'Incentivar a higiene e alimentação de forma lúdica e gradual.' }
    ]
  }
];

export const AutismInfo: React.FC<{ lang: Language }> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [{
            text: `Você é um guia jurídico e de saúde especializado em autismo no Brasil. 
            Responda de forma curta, acolhedora e direta em português. 
            A pergunta é: ${query}`
          }]
        }]
      });
      setAiResponse(response.text);
    } catch (error) {
      setAiResponse("Desculpe, não consegui consultar as leis agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">
          Manual do <span className="text-blue-600">Conhecimento</span> 🧩
        </h2>
        <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto">
          Tudo o que você precisa saber sobre leis, responsabilidades e bem-estar em um só lugar.
        </p>
      </div>

      {/* AI Search Bar */}
      <div className="clay-card p-10 bg-[#1E293B] text-white">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Dúvida específica sobre Direitos?</h3>
            <p className="text-slate-400 font-medium">Pergunte para nossa IA Jurídica e receba apoio imediato.</p>
          </div>
          <div className="w-full md:w-auto flex gap-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Como tirar passe livre?"
              className="flex-1 md:w-80 bg-white/10 p-5 rounded-2xl border border-white/20 outline-none text-white font-bold placeholder-slate-500 focus:border-blue-400 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && askGemini()}
            />
            <button 
              onClick={askGemini}
              disabled={loading || !query.trim()}
              className="clay-btn px-10 py-5 font-black uppercase text-xs tracking-widest disabled:opacity-50"
            >
              {loading ? 'Consultando...' : 'Perguntar ✨'}
            </button>
          </div>
        </div>

        {aiResponse && (
          <div className="mt-8 bg-white/5 p-8 rounded-3xl border border-white/10 animate-fade-in">
             <div className="flex items-start gap-4">
                <span className="text-3xl">🤖</span>
                <p className="text-lg font-bold leading-relaxed text-blue-100">{aiResponse}</p>
             </div>
             <button 
              onClick={() => setAiResponse(null)} 
              className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
             >
               Limpar resposta
             </button>
          </div>
        )}
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-6">
             <div className="flex items-center gap-4 px-4">
                <div className={`w-12 h-12 ${section.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                   {section.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{section.title}</h3>
             </div>
             
             <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="clay-card p-8 group hover:scale-[1.03]">
                     <h4 className="text-lg font-black text-slate-900 mb-2 transition-colors group-hover:text-blue-600">
                        {item.label}
                     </h4>
                     <p className="text-sm font-bold text-slate-500 leading-relaxed">
                        {item.description}
                     </p>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-12 rounded-[4rem] text-center border-2 border-slate-100">
         <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter">Informação é Poder! ✊</h3>
         <p className="text-slate-500 font-bold max-w-xl mx-auto leading-relaxed">
           Este guia é baseado na legislação brasileira (Lei 12.764/12). Para casos específicos, sempre consulte um advogado especializado ou a defensoria pública.
         </p>
         <div className="mt-10 flex justify-center gap-6">
            <a 
              href="https://bibliotecadigital.mdh.gov.br/jspui/bitstream/192/13567/1/Cartilha-do-Autista-Atualizada-1.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Baixar Guia PDF
            </a>
            <div className="w-px h-4 bg-slate-200"></div>
            <a 
              href="https://www.mpgo.mp.br/portal/arquivos/2024/02/08/14_33_22_339_Guia_Pr_tico_Autismo_vers_o_2.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Ver Leis na Íntegra
            </a>
         </div>
      </div>
    </div>
  );
};
