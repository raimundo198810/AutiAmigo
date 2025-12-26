
import React, { useState } from 'react';
import { Task } from '../types';

export const VisualRoutine: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Escovar os dentes', completed: false, time: '08:00' },
    { id: '2', text: 'Tomar café da manhã', completed: false, time: '08:30' },
    { id: '3', text: 'Hora de Estudar/Trabalhar', completed: false, time: '09:00' },
    { id: '4', text: 'Almoço', completed: false, time: '12:00' },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Minha Rotina</h2>
      
      <form onSubmit={addTask} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Adicionar tarefa..."
          className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600">
          +
        </button>
      </form>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
              task.completed ? 'bg-green-100 opacity-60' : 'bg-white shadow-sm border border-slate-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
              }`}>
                {task.completed && <span className="text-white text-sm">✓</span>}
              </div>
              <span className={`text-lg font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                {task.text}
              </span>
            </div>
            {task.time && <span className="text-slate-400 text-sm">{task.time}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
