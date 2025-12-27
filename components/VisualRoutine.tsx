
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
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800">Minha Rotina Visual 📅</h2>
        <p className="text-slate-500 font-bold">Acompanhe suas atividades do dia.</p>
      </div>
      
      <form onSubmit={addTask} className="mb-10 bg-white p-6 rounded-[2rem] shadow-lg border-4 border-blue-50 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="O que vamos fazer?"
            className="flex-1 p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-300 outline-none bg-slate-50/50 font-bold"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-300 outline-none bg-slate-50/50 font-bold w-full sm:w-32"
          />
        </div>
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Link da imagem (opcional)"
          className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-300 outline-none bg-slate-50/50 font-bold"
        />
        <button type="submit" className="bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
          + Adicionar à Rotina
        </button>
      </form>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`group p-4 rounded-[2.5rem] flex items-center justify-between cursor-pointer transition-all border-4 ${
              task.completed 
                ? 'bg-slate-50 border-slate-100 opacity-60 scale-95' 
                : 'bg-white shadow-md border-transparent hover:border-blue-100 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                {task.imageUrl && !imageErrors[task.id] ? (
                  <img 
                    src={task.imageUrl} 
                    alt={task.text} 
                    className={`w-20 h-20 rounded-[1.5rem] object-cover border-4 ${task.completed ? 'border-slate-200 grayscale' : 'border-blue-50'}`} 
                    onError={() => setImageErrors(prev => ({ ...prev, [task.id]: true }))}
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl ${task.completed ? 'bg-slate-200' : 'bg-blue-50 text-blue-400'}`}>
                    {task.text.toLowerCase().includes('comer') || task.text.toLowerCase().includes('café') || task.text.toLowerCase().includes('almoço') ? '🍱' : 
                     task.text.toLowerCase().includes('dente') ? '🪥' :
                     task.text.toLowerCase().includes('estuda') ? '📚' : '📅'}
                  </div>
                )}
                {task.completed && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg font-black text-sm border-4 border-white">
                    ✓
                  </div>
                )}
              </div>
              
              <div>
                <span className={`text-xl font-black block leading-none mb-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {task.text}
                </span>
                {task.time && (
                  <span className={`font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${task.completed ? 'bg-slate-200 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                    ⏰ {task.time}
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={(e) => deleteTask(task.id, e)}
              className="text-slate-200 hover:text-rose-500 p-4 transition-colors opacity-0 group-hover:opacity-100"
              title="Remover"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <span className="text-6xl mb-4 block">✨</span>
          <p className="text-slate-400 font-black">Nenhuma tarefa agendada para hoje.</p>
        </div>
      )}
    </div>
  );
};
