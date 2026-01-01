
import React, { useState, useEffect } from 'react';
import { Language } from '../types.ts';
import { DatabaseService } from '../services/databaseService.ts';

interface Step {
  text: string;
  emoji: string;
  completed?: boolean;
}

interface TaskTemplate {
  id: string;
  title: string;
  icon: string;
  steps: Step[];
}

const TASK_LIBRARY: TaskTemplate[] = [
  {
    id: 'banho',
    title: 'Tomar Banho',
    icon: '🚿',
    steps: [
      { text: 'Entrar no box e ligar o chuveiro', emoji: '🚿' },
      { text: 'Molhar todo o corpo', emoji: '💧' },
      { text: 'Passar sabonete no corpo', emoji: '🧼' },
      { text: 'Lavar o cabelo com shampoo', emoji: '🧴' },
      { text: 'Enxaguar todo o sabão', emoji: '🌊' },
      { text: 'Desligar o chuveiro e se secar', emoji: '🧖' }
    ]
  },
  {
    id: 'dentes',
    title: 'Escovar os Dentes',
    icon: '🪟',
    steps: [
      { text: 'Pegar a escova e a pasta', emoji: '🪥' },
      { text: 'Colocar um pouco de pasta', emoji: '🧪' },
      { text: 'Escovar em cima e embaixo', emoji: '🦷' },
      { text: 'Escovar a língua', emoji: '👅' },
      { text: 'Enxaguar a boca com água', emoji: '🚰' }
    ]
  },
  {
    id: 'mochila',
    title: 'Arrumar a Mochila',
    icon: '🎒',
    steps: [
      { text: 'Pegar o estojo com lápis', emoji: '✏️' },
      { text: 'Colocar os cadernos do dia', emoji: '📓' },
      { text: 'Verificar se pegou o lanche', emoji: '🍎' },
      { text: 'Guardar a garrafa de água', emoji: '🍼' },
      { text: 'Fechar todos os zíperes', emoji: '🤐' }
    ]
  },
  {
    id: 'dormir',
    title: 'Preparar para Dormir',
    icon: '🌙',
    steps: [
      { text: 'Vestir o pijama confortável', emoji: '👕' },
      { text: 'Ir ao banheiro', emoji: '🚽' },
      { text: 'Apagar as luzes fortes', emoji: '💡' },
      { text: 'Deitar e cobrir com a manta', emoji: '🛌' },
      { text: 'Fechar os olhos e relaxar', emoji: '😴' }
    ]
  }
];

export const StepByStepTask: React.FC<{ lang: Language }> = ({ lang }) => {
  const [selectedTask, setSelectedTask] = useState<TaskTemplate | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  // Carrega progresso salvo quando uma tarefa é selecionada
  useEffect(() => {
    if (selectedTask) {
      const savedSteps = DatabaseService.getCollection<Step[]>(`step_progress_${selectedTask.id}`, selectedTask.steps);
      setSteps(savedSteps);
    }
  }, [selectedTask]);

  // Salva progresso sempre que um passo mudar
  useEffect(() => {
    if (selectedTask && steps.length > 0) {
      DatabaseService.saveCollection(`step_progress_${selectedTask.id}`, steps);
    }
  }, [steps, selectedTask]);

  const handleSelectTask = (task: TaskTemplate) => {
    setSelectedTask(task);
  };

  const toggleStep = (index: number) => {
    const newSteps = [...steps];
    newSteps[index].completed = !newSteps[index].completed;
    setSteps(newSteps);
    
    if (newSteps[index].completed) {
      DatabaseService.logActivity('task_complete', `Passo concluído no guia: ${selectedTask?.title}`);
    }
  };

  const resetProgress = () => {
    if (selectedTask) {
      const reset = selectedTask.steps.map(s => ({ ...s, completed: false }));
      setSteps(reset);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Guia de Tarefas 🧩</h2>
        <p className="text-slate-500 font-bold text-lg">Passo a passo visual para autonomia diária.</p>
      </div>

      {!selectedTask ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
          {TASK_LIBRARY.map(task => (
            <button
              key={task.id}
              onClick={() => handleSelectTask(task)}
              className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 hover:border-indigo-100 transition-all shadow-sm flex items-center gap-6 group"
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                {task.icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-slate-800 leading-tight">{task.title}</h3>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{task.steps.length} Passos</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => setSelectedTask(null)}
              className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-800 flex items-center gap-2"
            >
              ← Voltar ao Catálogo
            </button>
            <div className="flex gap-4">
              <button onClick={resetProgress} className="text-[9px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600">
                Reiniciar
              </button>
              <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-black text-[10px] uppercase">
                {steps.filter(s => s.completed).length} de {steps.length} feitos
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-black text-slate-800 text-center mb-8 uppercase tracking-tighter">
            {selectedTask.icon} {selectedTask.title}
          </h3>
          
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`w-full p-6 rounded-[2.5rem] flex items-center gap-6 text-left transition-all border-4 ${
                  step.completed 
                    ? 'bg-slate-50 border-slate-100 opacity-50' 
                    : 'bg-white border-white shadow-xl hover:border-indigo-50'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                  step.completed ? 'bg-emerald-500 text-white' : 'bg-indigo-50 border border-indigo-100'
                }`}>
                  {step.completed ? '✓' : step.emoji}
                </div>
                <span className={`text-xl font-bold flex-1 ${
                  step.completed ? 'line-through text-slate-400' : 'text-slate-700'
                }`}>
                  {step.text}
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => window.print()}
            className="w-full mt-12 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all"
          >
            🖨️ Imprimir Roteiro Visual
          </button>
        </div>
      )}
    </div>
  );
};
