
import React, { useRef } from 'react';
import { AppTab, Language } from '../types.ts';
import { Logo } from './Logo.tsx';

// Added lang to LandingPageProps interface
interface LandingPageProps {
  onStart: (tab?: AppTab) => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, lang }) => {
  const recursosRef = useRef<HTMLElement>(null);

  const scrollToRecursos = () => {
    recursosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in-down">
          <Logo size="xl" showText={false} className="justify-center" />
        </div>
        
        <h1 className="text-5xl sm:text-8xl font-black text-slate-800 mb-6 leading-[0.9] tracking-tighter">
          Ajuda <span className="text-blue-600">Autista</span>
        </h1>
        <p className="text-lg sm:text-2xl text-slate-600 mb-12 max-w-3xl leading-relaxed font-medium">
          O portal inclusivo que transforma rotinas e facilita a comunicação através da tecnologia e do design acolhedor.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <button 
            onClick={() => onStart()}
            className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            Entrar no Portal ✨
          </button>
          <button 
            onClick={scrollToRecursos}
            className="bg-white text-blue-600 border-2 border-blue-100 px-12 py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-50 transition-all text-center shadow-sm"
          >
            Explorar Recursos
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" ref={recursosRef} className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Desenvolvido para brilhar</h2>
            <p className="text-slate-500 text-lg font-medium">Unimos design centrado no usuário com apoio terapêutico moderno.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              img="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600"
              icon="💬" 
              title="Quadro de Comunicação" 
              desc="Transforme pensamentos em palavras. Use cartões com áudio e cores para uma comunicação sem barreiras."
              color="bg-blue-50"
              onClick={() => onStart('board')}
            />
            <FeatureCard 
              img="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=600"
              icon="📅" 
              title="Rotinas Visuais" 
              desc="O que vem depois? Reduza o estresse do desconhecido com cronogramas visuais claros e personalizáveis."
              color="bg-green-50"
              onClick={() => onStart('routine')}
            />
            <FeatureCard 
              img="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
              icon="🧘" 
              title="Regulação Emocional" 
              desc="Espaço de calma com exercícios de respiração e mixer sensorial para momentos de sobrecarga."
              color="bg-purple-50"
              onClick={() => onStart('calm')}
            />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCardSmall icon="🎧" title="Ruído" color="bg-rose-50" onClick={() => onStart('noise')} />
            <FeatureCardSmall icon="📖" title="IA Histórias" color="bg-purple-50" onClick={() => onStart('stories')} />
            <FeatureCardSmall icon="🎮" title="Jogos" color="bg-blue-50" onClick={() => onStart('games')} />
            <FeatureCardSmall icon="🚨" title="SOS" color="bg-rose-50" onClick={() => onStart('sos')} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo className="brightness-200 grayscale" showText={true} />
          <p className="text-slate-400 text-sm text-center max-w-sm leading-relaxed font-medium">
            Nossa missão é usar a tecnologia para criar um mundo onde todos possam se expressar e florescer em sua plenitude.
          </p>
          <div className="flex gap-8 font-bold">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Sobre Nós</span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">Contato</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; color: string; img: string; onClick: () => void }> = ({ icon, title, desc, color, img, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} overflow-hidden rounded-[3rem] border-4 border-transparent hover:border-blue-300 transition-all hover:shadow-2xl group text-left w-full shadow-sm`}
  >
    <div className="relative">
      <img src={img} alt={title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
         <span className="text-white font-black text-sm uppercase tracking-widest">Abrir Ferramenta ✨</span>
      </div>
    </div>
    <div className="p-8">
      <div className="text-4xl mb-4 bg-white w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm group-hover:rotate-6 transition-transform">{icon}</div>
      <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-bold text-sm">{desc}</p>
    </div>
  </button>
);

const FeatureCardSmall: React.FC<{ icon: string; title: string; color: string; onClick: () => void }> = ({ icon, title, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} p-6 rounded-[2rem] flex items-center gap-4 border-4 border-transparent hover:border-blue-200 hover:shadow-lg transition-all active:scale-95 text-left shadow-sm`}
  >
    <span className="text-3xl">{icon}</span>
    <span className="font-black text-slate-700 uppercase text-[11px] tracking-widest">{title}</span>
  </button>
);
