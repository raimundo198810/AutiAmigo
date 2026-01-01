
import React, { useState } from 'react';
import { AppTab, Language } from '../types.ts';
import { Logo } from './Logo.tsx';

interface LandingPageProps {
  onStart: (tab?: AppTab) => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, lang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-['Outfit'] selection:bg-blue-100 selection:text-blue-900 overflow-hidden dark:bg-slate-950">
      {/* 3D Dock Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-6xl">
        <div className="glass-panel px-6 md:px-10 py-4 rounded-[2.5rem] flex items-center justify-between border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:border-white/10">
          <Logo size="md" />
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={() => onStart('about')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">Sobre</button>
            <button onClick={() => onStart('contact')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors">Suporte</button>
            <button 
              onClick={() => onStart('board')}
              className="clay-btn px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Acessar Aplicativo
            </button>
          </div>

          {/* Mobile Quick Action */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl shadow-inner"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
            <button 
              onClick={() => onStart('board')}
              className="clay-btn px-5 py-3 text-[9px] font-black uppercase tracking-widest"
            >
              Entrar
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 dark:border-white/10 shadow-2xl animate-fade-in">
            <div className="flex flex-col gap-6">
              <button onClick={() => onStart('about')} className="flex items-center gap-4 text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                <span className="text-2xl">🧩</span> Sobre Nós
              </button>
              <button onClick={() => onStart('contact')} className="flex items-center gap-4 text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                <span className="text-2xl">📞</span> Suporte Técnico
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-2"></div>
              <button onClick={() => onStart('games')} className="flex items-center gap-4 text-lg font-black text-orange-500 uppercase tracking-tighter">
                <span className="text-2xl">🎮</span> PlayZone (Jogos)
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto w-full relative">
        {/* Background Decorative 3D Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -mr-48 -mt-24 floating-3d"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-[100px] -ml-32 -mb-24 floating-3d" style={{animationDelay: '-2s'}}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch perspective-1000">
          
          {/* Hero Content Area */}
          <div className="lg:col-span-8 clay-card p-10 lg:p-20 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 shadow-inner transition-colors">
                Apoio ao Desenvolvimento
              </span>
              <h1 className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter mb-10 transition-colors">
                O apoio que seu mundo <span className="text-blue-600 dark:text-blue-400">precisa.</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-lg transition-colors">
                Ferramentas sensoriais e de comunicação com interface tátil e amigável.
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <button 
                  onClick={() => onStart('board')}
                  className="clay-btn px-10 py-5 lg:px-12 lg:py-6 text-lg font-black tracking-tight"
                >
                  Começar Agora ✨
                </button>
                <button 
                  onClick={() => onStart('games')}
                  className="bg-white dark:bg-slate-800 px-10 py-5 lg:px-12 lg:py-6 rounded-[2rem] font-black text-lg text-orange-500 border-2 border-orange-50 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all shadow-sm flex items-center gap-4"
                >
                  Jogar Agora 🎮
                </button>
              </div>
            </div>
          </div>

          {/* AI Feature Box 3D */}
          <div className="lg:col-span-4 clay-card bg-[#0F172A] p-10 lg:p-12 text-white flex flex-col justify-between group">
            <div className="relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-3xl lg:text-4xl mb-10 shadow-[0_20px_40px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-500">
                🤖
              </div>
              <h3 className="text-3xl lg:text-4xl font-black leading-tight mb-6">Assistente AutiAmigo</h3>
              <p className="text-slate-400 font-medium text-lg">Inteligência artificial para guiar sua rotina e tirar dúvidas.</p>
            </div>
            <button 
              onClick={() => onStart('contact')}
              className="mt-12 py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Falar com a IA
            </button>
          </div>

          {/* Bento Boxes Row */}
          <div className="lg:col-span-4 clay-card bg-orange-50/50 dark:bg-orange-900/10 p-8 border-orange-100 dark:border-orange-900/20 group cursor-pointer" onClick={() => onStart('games')}>
            <div className="text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">🎮</div>
            <h4 className="text-2xl font-black text-orange-900 dark:text-orange-300 mb-2">PlayZone</h4>
            <p className="text-orange-700/60 dark:text-orange-400/60 font-bold text-sm leading-relaxed">15 jogos locais para diversão e aprendizado offline.</p>
          </div>

          <div className="lg:col-span-4 clay-card bg-emerald-50/50 dark:bg-emerald-900/10 p-8 border-emerald-100 dark:border-emerald-900/20 group cursor-pointer" onClick={() => onStart('about')}>
            <div className="text-5xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">🧩</div>
            <h4 className="text-2xl font-black text-emerald-900 dark:text-emerald-300 mb-2">Sobre Nós</h4>
            <p className="text-emerald-700/60 dark:text-emerald-400/60 font-bold text-sm leading-relaxed">Conheça nossa missão e visão de um mundo inclusivo.</p>
          </div>

          <div className="lg:col-span-4 clay-card bg-blue-600 p-8 text-white shadow-2xl shadow-blue-200 dark:shadow-none group cursor-pointer" onClick={() => onStart('contact')}>
            <div className="flex justify-between items-start h-full flex-col">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📞</div>
              <div>
                <h4 className="text-2xl font-black mb-1">Suporte</h4>
                <p className="text-blue-100/70 font-bold text-sm">Estamos aqui para ajudar em qualquer momento.</p>
              </div>
            </div>
          </div>

          {/* Secondary Bento Row */}
          <div className="lg:col-span-6 clay-card bg-violet-50/50 dark:bg-violet-900/10 p-8 border-violet-100 dark:border-violet-900/20 group cursor-pointer" onClick={() => onStart('autism_info')}>
            <div className="flex items-center gap-6">
              <div className="text-5xl group-hover:rotate-12 transition-transform">📚</div>
              <div>
                <h4 className="text-2xl font-black text-violet-900 dark:text-violet-300">Guia de Direitos</h4>
                <p className="text-violet-700/60 dark:text-violet-400/60 font-bold text-sm">Tudo sobre leis e inclusão no Brasil.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 clay-card bg-amber-50/50 dark:bg-amber-900/10 p-8 border-amber-100 dark:border-amber-900/20 group cursor-pointer" onClick={() => onStart('study')}>
            <div className="flex items-center gap-6">
              <div className="text-5xl group-hover:-rotate-12 transition-transform">🎓</div>
              <div>
                <h4 className="text-2xl font-black text-amber-900 dark:text-amber-300">Educação Visual</h4>
                <p className="text-amber-700/60 dark:text-amber-400/60 font-bold text-sm">Materiais escolares adaptados para autistas.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-auto py-20 px-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo size="md" />
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <button onClick={() => onStart('about')} className="hover:text-blue-600 transition-colors">Sobre Nós</button>
              <button onClick={() => onStart('contact')} className="hover:text-blue-600 transition-colors">Suporte</button>
              <button onClick={() => onStart('privacy')} className="hover:text-blue-600 transition-colors">Privacidade</button>
              <button onClick={() => onStart('sitemap')} className="hover:text-blue-600 transition-colors">Mapa do Site</button>
            </div>
            <p className="text-[10px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">
              © 2024 Ajuda Autista. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
