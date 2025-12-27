
import React, { useState, useEffect } from 'react';
import { Task } from '../types.ts';

const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Escovar os dentes', completed: false, time: '08:00', imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=200' },
  { id: '2', text: 'Tomar café da manhã', completed: false, time: '08:30', imageUrl: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&q=80&w=200' },
  { id: '3', text: 'Hora de Estudar', completed: false, time: '09:00', imageUrl: 'https://images.unsplash.com/photo-1454165833767-023000b953d1?auto=format&fit=crop&q=80&w=200' },
  { id: '4', text: 'Almoço', completed: false, time: '12:00', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200' },
];

export const VisualRoutine: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('autiamigo_routine');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem('autiamigo_routine', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { 
      id: Date.now().toString(), 
      text: newTask, 
      completed: false, 
      time: newTime || undefined,
      imageUrl: newImageUrl || undefined
    }]);
    setNewTask('');
    setNewTime('');
    setNewImageUrl('');
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja remover este item da rotina?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-black text-3d">Minha Rotina 3D</h2>
        <p className="text-slate-600 font-bold">Acompanhe suas atividades do dia.</p>
      </div>
      
      <form onSubmit={addTask} className="mb-10 bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-200 flex flex-col gap-4 clay-button">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="O que vamos fazer?"
            className="flex-1 p-5 rounded-2xl border-none inner-depth outline-none bg-slate-100 font-bold"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="p-5 rounded-2xl border-none inner-depth outline-none bg-slate-100 font-bold w-full sm:w-36"
          />
        </div>
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Link da imagem (opcional)"
          className="w-full p-5 rounded-2xl border-none inner-depth outline-none bg-slate-100 font-bold"
        />
        <button type="submit" className="bg-black text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-900 shadow-xl transition-all clay-button">
          + Adicionar à Rotina
        </button>
      </form>

      <div className="space-y-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`group p-6 rounded-[3rem] flex items-center justify-between cursor-pointer transition-all border-2 ${
              task.completed 
                ? 'bg-slate-100 border-slate-200 opacity-60 scale-95' 
                : 'bg-white shadow-xl border-white hover:border-slate-200 clay-button'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                {task.imageUrl && !imageErrors[task.id] ? (
                  <img 
                    src={task.imageUrl} 
                    alt={task.text} 
                    className={`w-24 h-24 rounded-[2rem] object-cover border-4 ${task.completed ? 'border-slate-300 grayscale' : 'border-white shadow-sm'}`} 
                    onError={() => setImageErrors(prev => ({ ...prev, [task.id]: true }))}
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl ${task.completed ? 'bg-slate-200' : 'bg-slate-100 text-slate-500 shadow-inner'}`}>
                    {task.text.toLowerCase().includes('comer') || task.text.toLowerCase().includes('café') || task.text.toLowerCase().includes('almoço') ? '🍱' : 
                     task.text.toLowerCase().includes('dente') ? '🪥' :
                     task.text.toLowerCase().includes('estuda') ? '📚' : '📅'}
                  </div>
                )}
                {task.completed && (
                  <div className="absolute -top-3 -right-3 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl font-black text-sm border-4 border-white">
                    ✓
                  </div>
                )}
              </div>
              
              <div>
                <span className={`text-2xl font-black block leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-3d'}`}>
                  {task.text}
                </span>
                {task.time && (
                  <span className={`font-black px-4 py-1.5 rounded-full text-[11px] uppercase tracking-widest mt-2 inline-block ${task.completed ? 'bg-slate-200 text-slate-400' : 'bg-black text-white'}`}>
                    ⏰ {task.time}
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={(e) => deleteTask(task.id, e)}
              className="text-slate-300 hover:text-black p-4 transition-colors opacity-0 group-hover:opacity-100"
              title="Remover"
            >
              <span className="text-3xl font-black">✕</span>
            </button>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-20 bg-slate-100 rounded-[4rem] border-4 border-dashed border-slate-200">
          <span className="text-7xl mb-6 block">✨</span>
          <p className="text-slate-400 font-black text-xl">Nenhuma tarefa agendada.</p>
        </div>
      )}
    </div>
  );
};
