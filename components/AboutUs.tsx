
import React from 'react';
import { Language } from '../types.ts';

export const AboutUs: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center">
        <h2 className="text-5xl font-black text-[#1E293B] tracking-tighter uppercase mb-4">Sobre Nós 🧩</h2>
        <p className="text-lg text-slate-500 font-medium">Nossa missão é transformar a jornada da neurodiversidade em uma experiência de conexão e autonomia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
            <h3 className="text-2xl font-black text-[#3B82F6] mb-3">Nossa Visão</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Acreditamos que cada pessoa autista possui uma forma única de ver e interagir com o mundo. O Portal Ajuda Autista nasceu para ser a ponte tecnológica que facilita essa comunicação, rotina e aprendizado.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-2xl font-black text-[#1E293B] mb-3">Tecnologia Humana</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Utilizamos IA e design centrado no usuário para criar ferramentas que respeitam o ritmo de cada indivíduo, desde quadros de comunicação alternativa até guias visuais de tarefas diárias.
            </p>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=800" 
            alt="Inclusão e Conexão" 
            className="rounded-[3.5rem] shadow-2xl border-8 border-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-100">
             <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">✨</div>
             <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Impacto</p>
                <p className="text-lg font-black text-slate-800">100% Inclusivo</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter">O Que Nos Move</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-3xl">❤️</div>
            <h4 className="font-black text-lg">Acolhimento</h4>
            <p className="text-slate-400 text-sm font-medium">Suporte para famílias e cuidadores em cada passo.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🚀</div>
            <h4 className="font-black text-lg">Autonomia</h4>
            <p className="text-slate-400 text-sm font-medium">Ferramentas que capacitam o indivíduo no dia a dia.</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🌍</div>
            <h4 className="font-black text-lg">Inclusão</h4>
            <p className="text-slate-400 text-sm font-medium">Lutando por um mundo mais acessível e informado.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
