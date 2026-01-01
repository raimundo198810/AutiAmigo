
import React, { useState, useEffect } from 'react';
import { Task } from '../types.ts';
import { DatabaseService } from '../services/databaseService.ts';

const INITIAL_TASKS: Task[] = [
  { 
    id: '1', 
    text: 'Escovar os dentes', 
    completed: false, 
    time: '08:00', 
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '2', 
    text: 'Café da Manhã', 
    completed: false, 
    time: '08:30', 
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '3', 
    text: 'Hora da Escola', 
    completed: false, 
    time: '09:00', 
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '4', 
    text: 'Lanche Saudável', 
    completed: false, 
    time: '10:30', 
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=400' 
  },
];

export const VisualRoutine: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    return DatabaseService.getCollection<Task[]>('visual_routine', INITIAL_TASKS);
  });

  useEffect(() => {
    DatabaseService.saveCollection('visual_routine', tasks);
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    DatabaseService.logActivity('task_complete', `Tarefa atualizada: ${id}`);
  };

  const progress = (tasks.filter(t => t.completed).length / tasks.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in">
      {/* Header Bento Card */}
      <div className="glass-card p-12 rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">Meu Dia 📅</h2>
          <p className="text-slate-400 font-bold">Organização visual para uma jornada tranquila.</p>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center relative">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress / 100)} className="transition-all duration-1000 ease-out" />
             </svg>
             <span className="text-xl font-black text-blue-600">{Math.round(progress)}%</span>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Concluído</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative space-y-8 before:absolute before:left-12 before:top-0 before:bottom-0 before:w-1 before:bg-slate-100 before:rounded-full">
        {tasks.map((task, idx) => (
          <div key={task.id} className="relative flex items-center gap-10 group">
            {/* Timeline Marker */}
            <div className={`z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl transition-all duration-500 border-4 ${
              task.completed ? 'bg-emerald-500 border-emerald-100 scale-90 rotate-12' : 'bg-white border-slate-50 shadow-xl'
            }`}>
              {task.completed ? '✨' : task.time?.split(':')[0]}
            </div>

            {/* Task Card */}
            <button 
              onClick={() => toggleTask(task.id)}
              className={`flex-1 p-8 rounded-[3rem] text-left transition-all duration-500 flex items-center gap-8 ${
                task.completed 
                ? 'bg-slate-50 opacity-40 grayscale blur-[0.5px]' 
                : 'glass-card border-white shadow-xl hover:shadow-2xl hover:scale-[1.02]'
              }`}
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                <img 
                  src={task.imageUrl} 
                  alt={task.text} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=400';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Rotina</span>
                  <div className="h-px w-8 bg-slate-200"></div>
                </div>
                <h4 className={`text-2xl font-black ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.text}
                </h4>
                <p className="text-slate-400 font-bold text-sm">Às {task.time}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                task.completed ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-100 text-transparent'
              }`}>
                ✓
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
