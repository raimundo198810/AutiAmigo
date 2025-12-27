
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
    // Passamos a linguagem como prop para componentes que usam IA ou textos complexos
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
    { id: 'stories', icon: '📖' },
    { id: 'consultant', icon: '👩‍⚕️' },
    { id: 'sos', icon: '🚨' },
    { id: 'courses', icon: '🎓' },
    { id: 'games', icon: '🎮' },
    { id: 'signs', icon: '🤟' },
    { id: 'incentives', icon: '🏆' },
    { id: 'settings', icon: '⚙️' },
  ];

  const languages: {code: Language, flag: string, name: string}[] = [
    { code: 'pt', flag: '🇧🇷', name: 'Português' },
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' }
  ];

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} lang={language} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden pb-20 lg:pb-0">
      <header className="bg-white/95 backdrop-blur-md shadow-sm p-4 sticky top-0 z-50 border-b border-blue-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 cursor-pointer group outline-none" onClick={goToHome}>
            <Logo size="sm" />
          </button>
          
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[50%]">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-tighter whitespace-nowrap ${
                  activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-blue-50'
                }`}
              >
                {TRANSLATIONS[language][item.id]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Language Picker */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  title={l.name}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${language === l.code ? 'bg-white shadow-sm scale-110' : 'opacity-40 hover:opacity-100'}`}
                >
                  <span className="text-sm">{l.flag}</span>
                </button>
              ))}
            </div>
            
            <button onClick={goToHome} className="bg-slate-100 text-slate-600 p-2 rounded-xl hover:bg-slate-200 transition-colors shadow-sm" title="Home">
              🏠
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full py-6 px-4 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 min-h-[60vh] border border-blue-50 overflow-hidden">
          {renderContent()}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 overflow-x-auto no-scrollbar">
        <div className="flex justify-start p-2 gap-2 min-w-max px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all min-w-[65px] ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[9px] font-black truncate w-full text-center uppercase">{TRANSLATIONS[language][item.id]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
