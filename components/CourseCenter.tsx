
import React, { useState, useEffect } from 'react';
import { Course, Lesson, Language } from '../types.ts';
import { generateCourseContent } from '../services/geminiService.ts';

const PRESET_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Higiene Pessoal',
    category: 'Vida Diária',
    icon: '🧼',
    color: 'bg-blue-500',
    lessons: [
      { id: 'l1', title: 'Lavar as Mãos', icon: '🤲', content: '1. Molhe as mãos.\n2. Use sabão.\n3. Esfregue bem.\n4. Enxágue.\n5. Seque.', completed: false },
      { id: 'l2', title: 'Escovar Dentes', icon: '🪥', content: '1. Coloque pasta.\n2. Escove em círculos.\n3. Escove a língua.\n4. Enxágue a boca.', completed: false },
      { id: 'l3', title: 'Tomar Banho', icon: '🚿', content: '1. Ligue o chuveiro.\n2. Lave o cabelo.\n3. Lave o corpo.\n4. Seque-se.', completed: false },
    ]
  },
  {
    id: 'c2',
    title: 'Indo à Padaria',
    category: 'Autonomia',
    icon: '🥖',
    color: 'bg-orange-500',
    lessons: [
      { id: 'l4', title: 'Pedir o Pão', icon: '💬', content: '1. Diga "Oi".\n2. Peça o pão.\n3. Espere o pão.', completed: false },
      { id: 'l5', title: 'Pagar', icon: '💰', content: '1. Dê o dinheiro.\n2. Espere o troco.\n3. Guarde o troco.', completed: false },
      { id: 'l6', title: 'Agradecer', icon: '💖', content: '1. Diga "Obrigado".\n2. Tchau!', completed: false },
    ]
  }
];

// Added lang prop to interface
interface CourseCenterProps {
  lang: Language;
}

export const CourseCenter: React.FC<CourseCenterProps> = ({ lang }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ajuda_autista_courses');
    return saved ? JSON.parse(saved) : PRESET_COURSES;
  });
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');

  useEffect(() => {
    localStorage.setItem('ajuda_autista_courses', JSON.stringify(courses));
  }, [courses]);

  // Updated handleCreateAICourse to pass lang to generateCourseContent
  const handleCreateAICourse = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    const result = await generateCourseContent(aiTopic, lang);
    if (result) {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: result.title,
        category: 'Personalizado',
        icon: '✨',
        color: 'bg-indigo-500',
        lessons: result.lessons.map((l: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: l.title,
          icon: l.icon || '📖',
          content: l.content,
          completed: false
        }))
      };
      setCourses([newCourse, ...courses]);
      setAiTopic('');
    }
    setIsGenerating(false);
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          lessons: c.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l)
        };
      }
      return c;
    });
    setCourses(updated);
    
    // Update local references
    const course = updated.find(c => c.id === courseId);
    if (course) {
      setActiveCourse(course);
      const lesson = course.lessons.find(l => l.id === lessonId);
      if (lesson) setActiveLesson(lesson);
    }
  };

  const calculateProgress = (course: Course) => {
    const completed = course.lessons.filter(l => l.completed).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800">Meus Cursinhos 🎓</h2>
          <p className="text-slate-500 font-bold">Aprenda novas habilidades passo a passo.</p>
        </div>
        <div className="flex gap-3 bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100">
           <input 
             type="text" 
             placeholder="Criar curso sobre..." 
             className="px-4 py-2 outline-none font-bold text-slate-700"
             value={aiTopic}
             onChange={e => setAiTopic(e.target.value)}
           />
           <button 
             onClick={handleCreateAICourse}
             disabled={isGenerating || !aiTopic.trim()}
             className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase disabled:opacity-50"
           >
             {isGenerating ? 'Criando...' : 'Pedir IA ✨'}
           </button>
        </div>
      </div>

      {!activeCourse ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {courses.map(course => {
            const progress = calculateProgress(course);
            return (
              <button
                key={course.id}
                onClick={() => setActiveCourse(course)}
                className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 hover:border-indigo-100 transition-all text-left shadow-sm group hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${course.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-indigo-100`}>
                  {course.icon}
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">{course.category}</span>
                <h3 className="text-2xl font-black text-slate-800 mb-4">{course.title}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-500">
                    <span>PROGRESSO</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="animate-fade-in">
          <button 
            onClick={() => { setActiveCourse(null); setActiveLesson(null); }}
            className="text-slate-400 font-black mb-6 hover:text-slate-600 flex items-center gap-2"
          >
            ← Voltar para todos os cursos
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
               <div className={`${activeCourse.color} p-8 rounded-[3rem] text-white shadow-xl mb-6`}>
                  <h3 className="text-3xl font-black mb-2">{activeCourse.title}</h3>
                  <p className="font-bold opacity-80">{activeCourse.lessons.length} Lições Disponíveis</p>
               </div>
               
               <div className="bg-white rounded-[3rem] border-4 border-slate-50 p-6 space-y-2">
                  {activeCourse.lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        activeLesson?.id === lesson.id ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-slate-50 border-2 border-transparent'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${lesson.completed ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>
                        {lesson.completed ? '✓' : idx + 1}
                      </div>
                      <span className={`font-black ${lesson.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{lesson.title}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-8">
              {activeLesson ? (
                <div className="bg-white rounded-[3rem] border-4 border-indigo-50 p-10 shadow-xl animate-fade-in">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-6xl">{activeLesson.icon}</div>
                    <h4 className="text-4xl font-black text-slate-800">{activeLesson.title}</h4>
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 mb-8">
                    <p className="text-2xl font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {activeLesson.content}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleLesson(activeCourse.id, activeLesson.id)}
                    className={`w-full py-6 rounded-[2rem] font-black text-2xl transition-all shadow-xl active:scale-95 ${
                      activeLesson.completed 
                        ? 'bg-slate-200 text-slate-500' 
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-green-100'
                    }`}
                  >
                    {activeLesson.completed ? 'Desmarcar Concluída' : 'Marcar como Concluída! 🌟'}
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 p-20 text-center">
                   <span className="text-6xl mb-6 block">👈</span>
                   <p className="text-slate-400 font-black text-2xl">Escolha uma lição ao lado para começar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
