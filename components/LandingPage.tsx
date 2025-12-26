
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-6xl mx-auto">
        <div className="relative mb-10 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&q=80&w=400&h=400" 
            alt="Criança sorrindo com peças de quebra-cabeça" 
            className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover border-8 border-white shadow-2xl animate-float"
          />
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black text-slate-800 mb-6 leading-tight">
          Inclusão que <span className="text-blue-600">conecta</span> corações.
        </h1>
        <p className="text-lg sm:text-2xl text-slate-600 mb-12 max-w-3xl leading-relaxed">
          O <strong>AutiAmigo</strong> é seu portal visual completo. Ferramentas pensadas para reduzir a ansiedade e promover a independência de forma lúdica e moderna.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <button 
            onClick={onStart}
            className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
          >
            Entrar no Portal ✨
          </button>
          <a 
            href="#recursos"
            className="bg-white text-blue-600 border-2 border-blue-100 px-12 py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-50 transition-all text-center"
          >
            Explorar Recursos
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Desenvolvido para brilhar</h2>
            <p className="text-slate-500 text-lg">Unimos design centrado no usuário com apoio terapêutico.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              img="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600"
              icon="💬" 
              title="Quadro de Comunicação" 
              desc="Transforme pensamentos em palavras. Use cartões com áudio para uma comunicação sem barreiras."
              color="bg-blue-50"
            />
            <FeatureCard 
              img="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=600"
              icon="📅" 
              title="Rotinas Visuais" 
              desc="O que vem depois? Reduza o estresse do desconhecido com cronogramas visuais claros."
              color="bg-green-50"
            />
            <FeatureCard 
              img="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
              icon="🧘" 
              title="Regulação Emocional" 
              desc="Espaço de calma com exercícios de respiração e sons ambientes para momentos de sobrecarga."
              color="bg-purple-50"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧩</span>
            <div>
              <span className="font-black text-2xl block">AutiAmigo</span>
              <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Portal de Apoio</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm text-center max-w-sm leading-relaxed">
            Nossa missão é usar a tecnologia para criar um mundo onde todos possam se expressar e florescer.
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

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; color: string; img: string }> = ({ icon, title, desc, color, img }) => (
  <div className={`${color} overflow-hidden rounded-[3rem] border border-transparent hover:border-blue-200 transition-all hover:shadow-2xl group`}>
    <img src={img} alt={title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="p-8">
      <div className="text-4xl mb-4 bg-white w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm">{icon}</div>
      <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);
