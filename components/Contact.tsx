
import React from 'react';
import { Language } from '../types.ts';

export const Contact: React.FC<{ lang: Language }> = ({ lang }) => {
  const EMAIL = 'contato@ajudaautista.online';
  const PHONE = '(49) 99805-7924';
  const WHATSAPP_LINK = 'https://wa.me/5549998057924';

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center">
        <h2 className="text-5xl font-black text-[#1E293B] tracking-tighter uppercase mb-4">Contato 📞</h2>
        <p className="text-lg text-slate-500 font-medium">Estamos aqui para ouvir, ajudar e crescer juntos. Fale com nossa equipe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card E-mail */}
        <a 
          href={`mailto:${EMAIL}`}
          className="bg-white p-10 rounded-[3rem] border-4 border-slate-50 shadow-sm hover:border-[#3B82F6] transition-all group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
            ✉️
          </div>
          <h3 className="text-2xl font-black text-[#1E293B] mb-2">E-mail</h3>
          <p className="text-slate-400 font-bold mb-4">Mande suas dúvidas e sugestões</p>
          <p className="text-xl font-black text-[#3B82F6]">{EMAIL}</p>
        </a>

        {/* Card WhatsApp */}
        <a 
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-10 rounded-[3rem] border-4 border-slate-50 shadow-sm hover:border-[#10B981] transition-all group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
            📱
          </div>
          <h3 className="text-2xl font-black text-[#1E293B] mb-2">WhatsApp</h3>
          <p className="text-slate-400 font-bold mb-4">Atendimento rápido e humano</p>
          <p className="text-xl font-black text-[#10B981]">{PHONE}</p>
        </a>
      </div>

      <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 text-center">
        <h3 className="text-2xl font-black text-[#1E293B] mb-4">Horário de Atendimento</h3>
        <p className="text-slate-500 font-bold text-lg">Segunda a Sexta: 08:00 às 18:00</p>
        <div className="mt-8 flex justify-center gap-4">
           <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Estamos Online para Ajudar</span>
        </div>
      </div>
    </div>
  );
};
