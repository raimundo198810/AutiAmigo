
import React, { useState, useEffect } from 'react';
import { CommunicationBoard } from './components/CommunicationBoard.tsx';
import { VisualRoutine } from './components/VisualRoutine.tsx';
import { CalmZone } from './components/CalmZone.tsx';
import { StepByStepTask } from './components/StepByStepTask.tsx';
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
import { DailyTracker } from './components/DailyTracker.tsx';
import { VisualGallery } from './components/VisualGallery.tsx';
import { AboutUs } from './components/AboutUs.tsx';
import { Contact } from './components/Contact.tsx';
import { AutismInfo } from './components/AutismInfo.tsx';
import { PrivacyPolicy } from './components/PrivacyPolicy.tsx';
import { Sitemap } from './components/Sitemap.tsx';
import { CommunityZone } from './components/CommunityZone.tsx';
import { DigitalClock } from './components/DigitalClock.tsx';
import { Logo } from './components/Logo.tsx';
import { AppTab, Language } from './types.ts';
import { DatabaseService } from './services/databaseService.ts';

const TRANSLATIONS: Record<Language, any> = {
  pt: { board: 'Falar', routine: 'Rotina', calm: 'Calma', noise: 'Sons', stepbystep: 'Guias', consultant: 'Suporte', sos: 'SOS', courses: 'Cursos', games: 'Jogos', signs: 'Libras', incentives: 'Prêmios', settings: 'Ajustes', tracker: 'Diário', study: 'Aulas', gallery: 'Visão', about: 'Sobre', contact: 'Falar', autism_info: 'Guia 📚', privacy: 'Privacidade', sitemap: 'Mapa 🗺️', community: 'Comunidade', clock: 'Relógio' },
  en: { board: 'Speak', routine: 'Routine', calm: 'Calm', noise: 'Sounds', stepbystep: 'Guides', consultant: 'Support', sos: 'SOS', courses: 'Courses', games: 'Games', signs: 'Signs', incentives: 'Awards', settings: 'Settings', tracker: 'Diary', study: 'Classes', gallery: 'Vision', about: 'About', contact: 'Contact', autism_info: 'Guide 📚', privacy: 'Privacy', sitemap: 'Sitemap 🗺️', community: 'Community', clock: 'Clock' },
  es: { board: 'Hablar', routine: 'Rutina', calm: 'Calma', noise: 'Sonidos', stepbystep: 'Guías', consultant: 'Soporte', sos: 'SOS', courses: 'Cursos', games: 'Juegos', signs: 'Señas', incentives: 'Premios', settings: 'Ajustes', tracker: 'Diario', study: 'Aulas', gallery: 'Visión', about: 'Acerca', contact: 'Contacto', autism_info: 'Guía 📚', privacy: 'Privacidad', sitemap: 'Mapa 🗺️', community: 'Comunidad', clock: 'Reloj' },
  fr: { board: 'Parler', routine: 'Routine', calm: 'Calme', noise: 'Sons', stepbystep: 'Guides', consultant: 'Support', sos: 'SOS', courses: 'Cours', games: 'Jeux', signs: 'Signes', incentives: 'Prix', settings: 'Réglages', tracker: 'Journal', study: 'Leçons', gallery: 'Vision', about: 'À propos', contact: 'Contact', autism_info: 'Guide 📚', privacy: 'Privacité', sitemap: 'Plan 🗺️', community: 'Communauté', clock: 'Horloge' },
};

export const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState<boolean>(() => localStorage.getItem('ajuda_autista_started') === 'true');
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    return (localStorage.getItem('ajuda_autista_last_tab') as AppTab) || 'board';
  });
  const [language] = useState<Language>('pt');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ajuda_autista_theme') === 'dark';
  });
  const [onlineCount, setOnlineCount] = useState(1234);

  useEffect(() => {
    if (hasStarted) {
      localStorage.setItem('ajuda_autista_last_tab', activeTab);
    }
  }, [activeTab, hasStarted]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ajuda_autista_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ajuda_autista_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { id: 'board', icon: '💬', color: 'blue' },
    { id: 'clock', icon: '🕒', color: 'indigo' },
    { id: 'games', icon: '🎮', color: 'orange' },
    { id: 'community', icon: '🌟', color: 'indigo' },
    { id: 'routine', icon: '📅', color: 'emerald' },
    { id: 'calm', icon: '🧘', color: 'violet' },
    { id: 'sos', icon: '🚨', color: 'rose' },
    { id: 'settings', icon: '⚙️', color: 'slate' },
  ];

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} lang={language} />;
  }

  return (
    <div className={`min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500`}>
      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto glass-card rounded-[2.5rem] px-6 md:px-8 py-4 flex items-center justify-between border border-white/60 shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-6">
            <button onClick={goToHome} className="btn-press">
              <Logo size="md" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{onlineCount} Online</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AppTab)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {TRANSLATIONS[language][item.id]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass-card flex items-center justify-center text-lg md:text-xl hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm border border-white/20"
              title={isDarkMode ? "Modo Dia" : "Modo Noite"}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={goToHome} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass-card flex items-center justify-center text-lg md:text-xl hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm border border-white/20">
              🏠
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full pt-32 pb-40 lg:pb-16 px-4 md:px-6">
        
        {/* Module Dashboard Card */}
        <div className="mb-8 md:mb-12 glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group transition-all duration-500">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400"></div>
           <div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Módulo Ativo</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tighter capitalize transition-colors duration-500">{TRANSLATIONS[language][activeTab]}</h2>
           </div>
           <div className="flex gap-4">
              <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-white/20 flex flex-col items-center">
                 <span className="text-2xl">😊</span>
                 <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase mt-1">Humor</span>
              </div>
              <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-3xl border border-white/20 flex flex-col items-center">
                 <span className="text-2xl">🔋</span>
                 <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase mt-1">Foco</span>
              </div>
           </div>
        </div>

        {/* Content Viewport */}
        <div className="animate-fade-in relative">
          {(() => {
            switch (activeTab) {
              case 'board': return <CommunicationBoard />;
              case 'routine': return <VisualRoutine />;
              case 'calm': return <CalmZone />;
              case 'stepbystep': return <StepByStepTask lang={language} />;
              case 'signs': return <LibrasHelper />;
              case 'study': return <StudyHelper lang={language} />;
              case 'courses': return <CourseCenter lang={language} />;
              case 'games': return <GamesZone />;
              case 'incentives': return <IncentiveCenter lang={language} />;
              case 'sos': return <SOSCard />;
              case 'noise': return <NoiseMonitor />;
              case 'consultant': return <CaregiverAI lang={language} />;
              case 'tracker': return <DailyTracker lang={language} />;
              case 'gallery': return <VisualGallery lang={language} />;
              case 'about': return <AboutUs lang={language} />;
              case 'contact': return <Contact lang={language} />;
              case 'autism_info': return <AutismInfo lang={language} />;
              case 'privacy': return <PrivacyPolicy lang={language} />;
              case 'community': return <CommunityZone lang={language} />;
              case 'clock': return <DigitalClock />;
              case 'sitemap': return <Sitemap onNavigate={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
              case 'settings': return <Settings isDarkMode={isDarkMode} onToggleDarkMode={toggleTheme} />;
              default: return <CommunicationBoard />;
            }
          })()}
        </div>
      </main>

      {/* Modern Footer Nav */}
      <footer className="mt-auto py-12 px-6 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo size="sm" />
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
              <button onClick={() => setActiveTab('about')} className="hover:text-blue-600 transition-colors">Sobre Nós</button>
              <button onClick={() => setActiveTab('contact')} className="hover:text-blue-600 transition-colors">Suporte</button>
              <button onClick={() => setActiveTab('privacy')} className="hover:text-blue-600 transition-colors">Privacidade</button>
              <button onClick={() => setActiveTab('sitemap')} className="hover:text-blue-600 transition-colors">Mapa do Site</button>
              <button onClick={() => setActiveTab('community')} className="hover:text-blue-600 transition-colors">Avaliar</button>
              <button onClick={() => setActiveTab('settings')} className="hover:text-blue-600 transition-colors">Ajustes</button>
            </div>
            <p className="text-[10px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest text-center">
              © 2024 Ajuda Autista. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modern Tab Bar Mobile */}
      <nav className="lg:hidden fixed bottom-6 md:bottom-8 left-4 right-4 md:left-6 md:right-6 z-[100]">
        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-2 flex justify-between gap-1 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] border border-white/80 dark:border-white/10 overflow-x-auto no-scrollbar transition-all duration-500">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`flex-1 min-w-[65px] flex flex-col items-center justify-center py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105' 
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <span className="text-xl md:text-2xl mb-1">{item.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter">
                {TRANSLATIONS[language][item.id].slice(0, 5)}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
