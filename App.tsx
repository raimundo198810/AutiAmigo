
import React, { useState } from 'react';
import { CommunicationBoard } from './components/CommunicationBoard.tsx';
import { VisualRoutine } from './components/VisualRoutine.tsx';
import { CalmZone } from './components/CalmZone.tsx';
import { SocialStoryGenerator } from './components/SocialStoryGenerator.tsx';
import { LibrasHelper } from './components/LibrasHelper.tsx';
import { StudyHelper } from './components/StudyHelper.tsx';
import { GamesZone } from './components/GamesZone.tsx';
import { IncentiveCenter } from './components/IncentiveCenter.tsx';
import { Settings } from './components/Settings.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AppTab } from './types.ts';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem('autiamigo_started') === 'true';
  });
  const [activeTab, setActiveTab] = useState<AppTab>('board');

  const handleStart = () => {
    localStorage.setItem('autiamigo_started', 'true');
    setHasStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setHasStarted(false);
    localStorage.setItem('autiamigo_started', 'false');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'board': return <CommunicationBoard />;
      case 'routine': return <VisualRoutine />;
      case 'calm': return <CalmZone />;
      case 'stories': return <SocialStoryGenerator />;
      case 'signs': return <LibrasHelper />;
      case 'study': return <StudyHelper />;
      case 'games': return <GamesZone />;
      case 'incentives': return <IncentiveCenter />;
      case 'settings': return <Settings />;
      default: return <CommunicationBoard />;
    }
  };

  const navItems = [
    { id: 'board', label: 'Quadro', icon: '💬' },
    { id: 'routine', label: 'Rotina', icon: '📅' },
    { id: 'calm', label: 'Calma', icon: '🧘' },
    { id: 'incentives', label: 'Prêmios', icon: '🏆' },
    { id: 'stories', label: 'Histórias', icon: '📖' },
    { id: 'games', label: 'Jogos', icon: '🎮' },
    { id: 'study', label: 'Estudo', icon: '🎓' },
    { id: 'signs', label: 'Libras', icon: '🤟' },
    { id: 'settings', label: 'Ajustes', icon: '⚙️' },
  ];

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden pb-20 lg:pb-0">
      <header className="bg-white/90 backdrop-blur-md shadow-sm p-4 sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={goToHome}>
            <span className="text-3xl group-hover:scale-110 transition-transform">🧩</span>
            <div>
              <h1 className="text-xl font-black text-blue-600 tracking-tight leading-none">AutiAmigo</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Apoio Inclusivo</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Seguro & Local</span>
            <button onClick={goToHome} className="text-slate-300 hover:text-slate-500 text-sm font-bold px-2">Sair</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full py-6 px-4 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 min-h-[60vh] border border-blue-50 overflow-hidden">
          {renderContent()}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around p-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all min-w-[50px] ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[9px] font-bold truncate w-full text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
