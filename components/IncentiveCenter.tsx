
import React, { useState, useEffect } from 'react';
import { generateDailyIncentive } from '../services/geminiService.ts';

interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  description: string;
  color: string;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Explorador', icon: '🧭', unlocked: true, description: 'Abriu o app pela primeira vez!', color: 'bg-blue-500' },
  { id: '2', title: 'Mestre da Calma', icon: '🧘', unlocked: false, description: 'Usou a respiração guiada.', color: 'bg-purple-500' },
  { id: '3', title: 'Super Estudante', icon: '📚', unlocked: false, description: 'Criou um material educativo.', color: 'bg-indigo-500' },
  { id: '4', title: 'Comunicador', icon: '🗣️', unlocked: false, description: 'Usou o quadro de voz.', color: 'bg-green-500' },
  { id: '5', title: 'Focado', icon: '⏱️', unlocked: false, description: 'Completou um cronômetro.', color: 'bg-amber-500' },
  { id: '6', title: 'Amigo das Libras', icon: '🤟', unlocked: false, description: 'Viu os sinais de inclusão.', color: 'bg-teal-500' },
];

export const IncentiveCenter: React.FC = () => {
  const [dailyMission, setDailyMission] = useState('Buscando uma missão especial para você...');
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('autiamigo_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch (e) {
      return INITIAL_ACHIEVEMENTS;
    }
  });
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const mission = await generateDailyIncentive();
        setDailyMission(mission);
      } catch (e) {
        setDailyMission("Missão de hoje: Espalhar sorrisos! 😊");
      }
    };
    fetchMission();
  }, []);

  useEffect(() => {
    localStorage.setItem('autiamigo_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const unlockAchievement = (id: string) => {
    const updated = achievements.map(a => {
      if (a.id === id && !a.unlocked) {
        speak(`Parabéns! Você desbloqueou a conquista: ${a.title}. ${a.description}`);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
        return { ...a, unlocked: true };
      }
      return a;
    });
    setAchievements(updated);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Cursinho de Incentivos 🏆</h2>
        <p className="text-slate-500 font-medium">Cada pequeno passo é uma grande vitória!</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[3rem] p-8 text-white shadow-2xl mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white/30 rounded-3xl flex items-center justify-center text-5xl shadow-lg animate-bounce shrink-0">
            🌟
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">Missão de Hoje</span>
            <h3 className="text-2xl font-black leading-tight mb-2">{dailyMission}</h3>
            <p className="text-orange-100 font-bold">Você consegue! Vamos tentar?</p>
          </div>
          <button 
            onClick={() => speak(dailyMission)}
            className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform active:scale-95 shrink-0"
          >
            OUVIR MISSÃO 🔊
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-blue-50 p-8 flex flex-col items-center">
          <div className="relative mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle 
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * unlockedCount / achievements.length)}
                className="text-blue-500 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800">{unlockedCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conquistas</span>
            </div>
          </div>
          <h4 className="text-xl font-black text-slate-800 mb-1">Seu Progresso</h4>
          <p className="text-slate-500 text-sm font-medium mb-6">Continue brilhando!</p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Álbum de Figurinhas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <button
                key={a.id}
                onClick={() => !a.unlocked && unlockAchievement(a.id)}
                className={`relative p-6 rounded-[2rem] border-4 transition-all duration-500 flex flex-col items-center text-center group overflow-hidden ${
                  a.unlocked 
                    ? `bg-white border-slate-100 shadow-md` 
                    : 'bg-slate-50 border-dashed border-slate-200 opacity-60 grayscale hover:grayscale-0 hover:bg-white hover:border-blue-100'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 transition-transform group-hover:scale-110 ${
                  a.unlocked ? `${a.color} text-white shadow-lg` : 'bg-slate-200 text-slate-400'
                }`}>
                  {a.unlocked ? a.icon : '🔒'}
                </div>
                <h5 className={`font-black text-sm mb-1 ${a.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{a.title}</h5>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">{a.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none animate-fade-in bg-white/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-8 border-yellow-400 flex flex-col items-center animate-bounce">
            <span className="text-8xl mb-4">🏆</span>
            <h2 className="text-3xl font-black text-slate-800">NOVA CONQUISTA!</h2>
            <p className="text-slate-500 font-bold">Você é maravilhoso!</p>
          </div>
        </div>
      )}
    </div>
  );
};
