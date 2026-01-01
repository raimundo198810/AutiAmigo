
import React, { useState, useEffect, useCallback } from 'react';
import { DatabaseService } from '../services/databaseService.ts';
import { Alarm } from '../types.ts';

export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>(() => DatabaseService.getCollection<Alarm[]>('app_alarms', []));
  const [isAdding, setIsAdding] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('Acordar');
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      checkAlarms(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms]);

  useEffect(() => {
    DatabaseService.saveCollection('app_alarms', alarms);
  }, [alarms]);

  const checkAlarms = (now: Date) => {
    const currentStr = now.toTimeString().slice(0, 5);
    const triggered = alarms.find(a => a.enabled && a.time === currentStr && now.getSeconds() === 0);
    if (triggered) {
      setActiveAlarm(triggered);
      playAlarmSound();
    }
  };

  const playAlarmSound = () => {
    const s = window.speechSynthesis;
    s.cancel();
    const u = new SpeechSynthesisUtterance("Atenção! Hora do seu alarme!");
    u.lang = 'pt-BR';
    s.speak(u);
  };

  const speakTime = useCallback(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const text = `Agora são ${h} horas e ${m} minutos.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [time]);

  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: newAlarmLabel || 'Alarme',
      enabled: true
    };
    setAlarms([...alarms, newAlarm]);
    setIsAdding(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const removeAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20 px-4">
      {/* Visual Clock Display */}
      <div className="clay-card p-12 bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6">Tempo Real</span>
          <div className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span className="text-3xl md:text-4xl text-blue-500/50 ml-2">
              {time.toLocaleTimeString([], { second: '2-digit' })}
            </span>
          </div>
          <p className="mt-6 text-slate-400 font-bold capitalize">
            {time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          
          <button 
            onClick={speakTime}
            className="mt-10 clay-btn bg-white text-blue-600 px-10 py-5 text-xl flex items-center gap-4 group-hover:scale-105 transition-transform"
          >
            <span>🗣️</span> OUVIR HORA
          </button>
        </div>
      </div>

      {/* Alarms Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Meus Despertadores ⏰</h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-all"
          >
            +
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {alarms.map(alarm => (
            <div key={alarm.id} className={`clay-card p-8 flex items-center justify-between transition-all ${alarm.enabled ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900 opacity-60 grayscale'}`}>
              <div className="flex items-center gap-6">
                <div className="text-4xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                  {alarm.time}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-slate-100 leading-none mb-1">{alarm.label}</h4>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Diário</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${alarm.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${alarm.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
                <button onClick={() => removeAlarm(alarm.id)} className="text-rose-400 hover:text-rose-600">✕</button>
              </div>
            </div>
          ))}
          {alarms.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum alarme configurado</p>
            </div>
          )}
        </div>
      </div>

      {/* Trigger Modal */}
      {activeAlarm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in bg-rose-600/20 backdrop-blur-xl">
          <div className="clay-card p-16 bg-white dark:bg-slate-800 flex flex-col items-center text-center max-w-sm animate-bounce">
            <span className="text-8xl mb-8">⏰</span>
            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2 uppercase tracking-tighter">ALERTA!</h2>
            <p className="text-2xl font-bold text-blue-600 mb-10">{activeAlarm.label}</p>
            <button 
              onClick={() => setActiveAlarm(null)}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl"
            >
              DESLIGAR
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="clay-card bg-white dark:bg-slate-800 p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 uppercase tracking-tighter">Novo Alarme ⏰</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Horário</label>
                <input 
                  type="time" 
                  value={newAlarmTime}
                  onChange={e => setNewAlarmTime(e.target.value)}
                  className="w-full p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-400 font-black text-3xl text-center tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lembrete</label>
                <input 
                  type="text" 
                  value={newAlarmLabel}
                  onChange={e => setNewAlarmLabel(e.target.value)}
                  placeholder="Ex: Tomar Remédio"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-400 font-bold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
                <button onClick={addAlarm} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
