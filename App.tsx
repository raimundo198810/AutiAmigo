
import React, { useState, useEffect } from 'react';
import { CommunicationBoard } from './components/CommunicationBoard.tsx';
import { VisualRoutine } from './components/VisualRoutine.tsx';
import { CalmZone } from './components/CalmZone.tsx';
import { SocialStoryGenerator } from './components/SocialStoryGenerator.tsx';
import { LibrasHelper } from './components/LibrasHelper.tsx';
import { StudyHelper } from './components/StudyHelper.tsx';
import { CourseCenter } from './components/CourseCenter.tsx';
import { GamesZone } from './components/GamesZone.tsx';
import { IncentiveCenter } from './components/IncentiveCenter.tsx';
import { Settings } from './components/Settings.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { SOSCard } from './components/SOSCard.tsx';
import { NoiseMonitor } from './components/NoiseMonitor.tsx';
import { CaregiverAI } from './components/CaregiverAI.tsx';
import { Logo } from './components/Logo.tsx';
import { AppTab, Language } from './types.ts';

const TRANSLATIONS: Record<Language, any> = {
  pt: { board: 'Quadro', routine: 'Rotina', calm: 'Calma', noise: 'Ruído', stories: 'IA Histórias', consultant: 'IA Cuidador', sos: 'SOS', courses: 'Cursos', games: 'Jogos', signs: 'Libras', incentives: 'Prêmios', settings: 'Ajustes' },
  en: { board: 'Board', routine: 'Routine', calm: 'Calm', noise: 'Noise', stories: 'AI Stories', consultant: 'AI Caregiver', sos: 'SOS', courses: 'Courses', games: 'Games', signs: 'Signs', incentives: 'Awards', settings: 'Settings' },
  es: { board: 'Tablero', routine: 'Rutina', calm: 'Calma', noise: 'Ruido', stories: 'IA Historias', consultant: 'IA Cuidador', sos: 'SOS', courses: 'Cursos', games: 'Juegos', signs: 'Señas', incentives: 'Premios', settings: 'Ajustes' },
  fr: { board: 'Tableau', routine: 'Routine', calm: 'Calme', noise: 'Bruit', stories: 'IA Histoires', consultant: 'IA Aidant', sos: 'SOS', courses: 'Cours', games: 'Jeux', signs: 'Signes', incentives: 'Prix', settings: 'Réglages' }
};

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem('ajuda_autista_started') === 'true';
  });
  const [activeTab, setActiveTab] = useState<AppTab>('board');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('ajuda_autista_lang') as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('ajuda_autista_lang', language);
  }, [language]);

  const handleStart = (tab?: AppTab) => {
    localStorage.setItem('ajuda_autista_started', 'true');
    setHasStarted(true);
    if (tab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setHasStarted(false);
    localStorage.setItem('ajuda_autista_started', 'false');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'board': return <CommunicationBoard />;
      case 'routine': return <VisualRoutine />;
      case 'calm': return <CalmZone />;
      case 'stories': return <SocialStoryGenerator lang={language} />;
      case 'signs': return <LibrasHelper />;
      case 'study': return <StudyHelper lang={language} />;
      case 'courses': return <CourseCenter lang={language} />;
      case 'games': return <GamesZone />;
      case 'incentives': return <IncentiveCenter lang={language} />;
      case 'sos': return <SOSCard />;
      case 'noise': return <NoiseMonitor />;
      case 'consultant': return <CaregiverAI lang={language} />;
      case 'settings': return <Settings />;
      default: return <CommunicationBoard />;
    }
  };

  const navItems = [
    { id: 'board', icon: '💬' },
    { id: 'routine', icon: '📅' },
    { id: 'calm', icon: '🧘' },
    { id: 'noise', icon: '👂' },
    { id: 'signs', icon: '🤟' },
    { id: 'stories', icon: '📖' },
    { id: 'sos', icon: '🚨' },
    { id: 'games', icon: '🎮' },
    { id: 'settings', icon: '⚙️' },
  ];

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} lang={language} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative pb-24 lg:pb-0 bg-slate-200">
      <header className="bg-white/95 backdrop-blur-md shadow-xl p-4 sticky top-0 z-50 border-b-2 border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 group outline-none" onClick={goToHome}>
            <Logo size="sm" />
          </button>
          
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all uppercase tracking-tighter whitespace-nowrap clay-button ${
                  activeTab === item.id ? 'bg-black text-white' : 'text-slate-500'
                }`}
              >
                {TRANSLATIONS[language][item.id]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <button onClick={goToHome} className="bg-white text-slate-600 p-3 rounded-2xl clay-button shadow-md">
                🏠
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full py-10 px-4">
        <div className="clay-card min-h-[70vh] overflow-hidden bg-white/80 backdrop-blur-sm border-white border-2">
          {renderContent()}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl border-4 border-white rounded-[3rem] shadow-2xl z-50 overflow-x-auto no-scrollbar">
        <div className="flex justify-start p-3 gap-3 min-w-max px-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`flex flex-col items-center p-3 rounded-[2.5rem] transition-all min-w-[75px] ${
                activeTab === item.id ? 'bg-black text-white shadow-lg' : 'text-slate-400'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[9px] font-black uppercase text-center tracking-tighter">{TRANSLATIONS[language][item.id]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
