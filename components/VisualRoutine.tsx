
import React, { useState, useEffect } from 'react';
import { Task } from '../types.ts';

const INITIAL_TASKS: Task[] = [
  { id: '1', text: 'Escovar os dentes', completed: false, time: '08:00', imageUrl: 'https://images.unsplash.com/photo-1559599242-49452f36093f?auto=format&fit=crop&q=80&w=150' },
  { id: '2', text: 'Tomar café da manhã', completed: false, time: '08:30', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=150' },
  { id: '3', text: 'Hora de Estudar/Trabalhar', completed: false, time: '09:00', imageUrl: 'https://images.unsplash.com/photo-1434031215662-8a2111ca770f?auto=format&fit=crop&q=80&w=150' },
  { id: '4', text: 'Almoço', completed: false, time: '12:00', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150' },
];

export const VisualRoutine: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('autiamigo_routine');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

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
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black text-slate-800 mb-8">Minha Rotina Visual</h2>
      
      <form onSubmit={addTask} className="mb-10 bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="O que vamos fazer?"
            className="flex-1 p-4 rounded-2xl border-2 border-slate-50 focus:border-blue-300 outline-none bg-slate-50/50 font-bold"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="p-4 rounded-2xl border-2 border-slate-50 focus:border-blue-300 outline-none bg-slate-50/50 font-bold w-full sm:w-32"
          />
        </div>
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="URL da Imagem (opcional)"
          className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-blue-300 outline-none bg-slate-50/50 font-bold"
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
            className={`group p-4 rounded-[2.5rem] flex items-center justify-between cursor-pointer transition-all border-2 ${
              task.completed 
                ? 'bg-green-50 border-green-100 opacity-70 scale-95' 
                : 'bg-white shadow-md border-transparent hover:border-blue-100'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                {task.imageUrl ? (
                  <img src={task.imageUrl} alt={task.text} className={`w-16 h-16 rounded-2xl object-cover border-2 ${task.completed ? 'border-green-300 grayscale' : 'border-blue-100'}`} />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${task.completed ? 'bg-green-200' : 'bg-blue-50'}`}>
                    📅
                  </div>
                )}
                {task.completed && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg font-black text-xs">
                    ✓
                  </div>
                )}
              </div>
              
              <div>
                <span className={`text-xl font-black block leading-none mb-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.text}
                </span>
                {task.time && <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${task.completed ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>{task.time}</span>}
              </div>
            </div>
            
            <button 
              onClick={(e) => deleteTask(task.id, e)}
              className="text-slate-300 hover:text-red-400 p-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Nenhuma tarefa agendada para hoje.</p>
        </div>
      )}
    </div>
  );
};
