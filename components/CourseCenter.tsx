
import React, { useState, useEffect, useMemo } from 'react';
import { Course, Lesson, Language } from '../types.ts';
import { generateCourseContent, generateQuiz } from '../services/geminiService.ts';
import { DatabaseService } from '../services/databaseService.ts';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  emoji: string;
}

const COURSE_LIBRARY: Course[] = [
  {
    id: 'lib_higiene',
    title: 'Higiene Total',
    category: 'Vida Diária',
    icon: '🧼',
    color: 'bg-blue-500',
    lessons: [
      { id: 'h1', title: 'Lavar as Mãos', icon: '🤲', content: '1. Molhe as mãos.\n2. Use sabão.\n3. Esfregue as palmas e entre os dedos.\n4. Enxágue bem.\n5. Seque com a toalha.', completed: false },
      { id: 'h2', title: 'Escovar os Dentes', icon: '🪥', content: '1. Coloque pasta na escova.\n2. Escove em círculos na frente.\n3. Escove atrás e a língua.\n4. Enxágue com água.', completed: false },
      { id: 'h3', title: 'Lavar o Cabelo', icon: '🚿', content: '1. Molhe o cabelo.\n2. Coloque um pouco de shampoo.\n3. Massageie a cabeça.\n4. Tire todo o sabão.', completed: false },
    ]
  },
  {
    id: 'lib_social',
    title: 'Amizades na Escola',
    category: 'Social',
    icon: '🏫',
    color: 'bg-indigo-500',
    lessons: [
      { id: 's1', title: 'Dizer Oi', icon: '👋', content: '1. Olhe para a pessoa.\n2. Levante a mão ou acene.\n3. Diga "Oi, tudo bem?".', completed: false },
      { id: 's2', title: 'Pedir para Brincar', icon: '⚽', content: '1. Espere uma pausa na brincadeira.\n2. Pergunte: "Posso brincar com vocês?".\n3. Espere a resposta.', completed: false },
      { id: 's3', title: 'Dividir o Brinquedo', icon: '🧸', content: '1. Brinque um pouco.\n2. Ofereça o brinquedo para o amigo.\n3. Esperar a sua vez de novo.', completed: false },
    ]
  },
  {
    id: 'lib_security',
    title: 'Segurança na Rua',
    category: 'Segurança',
    icon: '🚦',
    color: 'bg-rose-500',
    lessons: [
      { id: 'r1', title: 'Atravessar a Rua', icon: '🚶', content: '1. Pare na calçada.\n2. Olhe para a esquerda.\n3. Olhe para a direita.\n4. Atravesse na faixa.', completed: false },
      { id: 'r2', title: 'Falar com Estranhos', icon: '🚫', content: '1. Se alguém que você não conhece falar com você, não pare.\n2. Procure um adulto de confiança (Mãe, Pai ou Professor).', completed: false },
    ]
  }
];

const FALLBACK_QUIZZES: Record<string, QuizQuestion[]> = {
  'lib_higiene': [
    { question: 'O que usamos para limpar os dentes?', options: ['Escova de dentes', 'Pente', 'Sabonete'], correctIndex: 0, emoji: '🪥' },
    { question: 'Onde lavamos o corpo?', options: ['Na cama', 'No chuveiro', 'No sofá'], correctIndex: 1, emoji: '🚿' }
  ]
};

export const CourseCenter: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'my_courses' | 'explore'>('my_courses');
  const [myCourses, setMyCourses] = useState<Course[]>(() => {
    return DatabaseService.getCollection<Course[]>('my_courses', [COURSE_LIBRARY[0], COURSE_LIBRARY[1]]);
  });
  
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz States
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    DatabaseService.saveCollection('my_courses', myCourses);
  }, [myCourses]);

  const filteredLibrary = useMemo(() => {
    return COURSE_LIBRARY.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAddCourse = (course: Course) => {
    if (myCourses.find(c => c.id === course.id)) {
      alert("Você já tem este curso!");
      return;
    }
    setMyCourses([course, ...myCourses]);
    setActiveTab('my_courses');
  };

  const handleCreateAICourse = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const result = await generateCourseContent(aiTopic, lang);
      if (result && result.lessons) {
        const newCourse: Course = {
          id: `ai_${Date.now()}`,
          title: result.title || aiTopic,
          category: 'Personalizado',
          icon: '✨',
          color: 'bg-indigo-500',
          lessons: result.lessons.map((l: any, idx: number) => ({
            id: `ai-lesson-${Date.now()}-${idx}`,
            title: l.title || 'Lição',
            icon: l.icon || '📖',
            content: l.content || 'Sem conteúdo.',
            completed: false
          }))
        };
        setMyCourses([newCourse, ...myCourses]);
        setAiTopic('');
        setActiveTab('my_courses');
      } else {
        setErrorMsg("Não consegui criar agora.");
      }
    } catch (e) {
      setErrorMsg("Erro na geração.");
    }
    setIsGenerating(false);
  };

  const startQuiz = async () => {
    if (!activeCourse) return;
    setQuizLoading(true);
    setQuizMode(true);
    setQuizFinished(false);
    setCurrentQuizIndex(0);
    setWrongAnswer(null);

    try {
      const result = await generateQuiz(activeCourse.title, lang);
      if (result && result.questions && result.questions.length > 0) {
        setQuizQuestions(result.questions);
      } else {
        const fallback = FALLBACK_QUIZZES[activeCourse.id] || [];
        setQuizQuestions(fallback);
        if (fallback.length === 0) {
           setErrorMsg("Sem exercícios para este tema.");
           setQuizMode(false);
        }
      }
    } catch (e) {
      setQuizQuestions(FALLBACK_QUIZZES[activeCourse.id] || []);
    }
    setQuizLoading(false);
  };

  const handleAnswer = (index: number) => {
    const current = quizQuestions[currentQuizIndex];
    if (index === current.correctIndex) {
      setWrongAnswer(null);
      if (currentQuizIndex < quizQuestions.length - 1) {
        setTimeout(() => setCurrentQuizIndex(prev => prev + 1), 500);
      } else {
        setTimeout(() => setQuizFinished(true), 500);
      }
    } else {
      setWrongAnswer(index);
      setTimeout(() => setWrongAnswer(null), 1000);
    }
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    const updated = myCourses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          lessons: c.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l)
        };
      }
      return c;
    });
    setMyCourses(updated);
    
    const course = updated.find(c => c.id === courseId);
    if (course) {
      setActiveCourse(course);
      const lesson = course.lessons.find(l => l.id === lessonId);
      if (lesson) setActiveLesson(lesson);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-[75vh]">
      {!quizMode ? (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Centro de Aprendizado 🎓</h2>
              <div className="flex gap-4 mt-4 bg-slate-100 p-1 rounded-2xl w-fit mx-auto md:mx-0">
                <button 
                  onClick={() => setActiveTab('my_courses')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'my_courses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Meus Cursos
                </button>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'explore' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Explorar
                </button>
              </div>
            </div>

            <div className="bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100 flex gap-2">
               <input 
                 type="text" 
                 placeholder="Criar curso novo..." 
                 className="px-4 py-2 outline-none font-bold text-slate-700 w-32 sm:w-48 text-sm"
                 value={aiTopic}
                 onChange={e => setAiTopic(e.target.value)}
               />
               <button 
                 onClick={handleCreateAICourse}
                 disabled={isGenerating || !aiTopic.trim()}
                 className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase disabled:opacity-50"
               >
                 {isGenerating ? 'IA...' : 'GERAR ✨'}
               </button>
            </div>
          </div>

          {activeTab === 'my_courses' ? (
            !activeCourse ? (
              myCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {myCourses.map(course => {
                    const completed = course.lessons.filter(l => l.completed).length;
                    const progress = Math.round((completed / course.lessons.length) * 100);
                    return (
                      <button
                        key={course.id}
                        onClick={() => setActiveCourse(course)}
                        className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 hover:border-blue-100 transition-all text-left shadow-sm group"
                      >
                        <div className={`w-14 h-14 ${course.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                          {course.icon}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-4">{course.title}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black text-slate-400">
                            <span>PROGRESSO</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold mb-4">Seus cursos aparecerão aqui.</p>
                  <button onClick={() => setActiveTab('explore')} className="text-blue-600 font-black uppercase text-xs hover:underline">Explorar Biblioteca</button>
                </div>
              )
            ) : (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <button onClick={() => { setActiveCourse(null); setActiveLesson(null); }} className="text-slate-400 font-black text-xs uppercase tracking-widest">← Meus Cursos</button>
                  <button onClick={startQuiz} className="bg-amber-400 text-amber-900 px-8 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-amber-300">🏆 PRATICAR</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 space-y-3">
                    {activeCourse.lessons.map((lesson, idx) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full p-4 rounded-2xl flex items-center gap-4 border-2 transition-all ${activeLesson?.id === lesson.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-50 hover:border-blue-100'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${lesson.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}`}>
                          {lesson.completed ? '✓' : idx + 1}
                        </div>
                        <span className="font-black text-slate-700 text-sm truncate">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                  <div className="lg:col-span-8">
                    {activeLesson ? (
                      <div className="bg-white rounded-[2.5rem] border-4 border-slate-50 p-8 shadow-sm">
                        <div className="text-6xl mb-6">{activeLesson.icon}</div>
                        <h4 className="text-3xl font-black text-slate-800 mb-6 leading-tight">{activeLesson.title}</h4>
                        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border-2 border-slate-100 shadow-inner">
                          <p className="text-xl font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">{activeLesson.content}</p>
                        </div>
                        <button
                          onClick={() => toggleLesson(activeCourse.id, activeLesson.id)}
                          className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-md ${activeLesson.completed ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                        >
                          {activeLesson.completed ? 'Concluída ✓' : 'Concluir Passo! 🌟'}
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-200 py-20 border-4 border-dashed border-slate-50 rounded-[3rem]">
                        <span className="text-7xl mb-4">👈</span>
                        <p className="font-black text-lg">Selecione uma lição</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar curso..."
                  className="w-full p-6 rounded-[2rem] border-4 border-slate-50 outline-none text-xl font-bold bg-white shadow-sm focus:border-emerald-100"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibrary.map(course => (
                  <div key={course.id} className="bg-white p-6 rounded-[3rem] border-4 border-slate-50 shadow-sm flex flex-col items-center text-center group">
                    <div className={`w-20 h-20 ${course.color} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg`}>
                      {course.icon}
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{course.category}</span>
                    <h3 className="text-xl font-black text-slate-800 mb-6">{course.title}</h3>
                    <button 
                      onClick={() => handleAddCourse(course)}
                      className="mt-auto w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-600 hover:text-white transition-all tracking-widest"
                    >
                      Adicionar aos Meus Estudos
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-10 animate-fade-in">
           <button onClick={() => setQuizMode(false)} className="text-slate-400 font-black mb-8 uppercase text-[10px] tracking-widest hover:text-slate-800">← Parar Exercício</button>
           
           {quizLoading ? (
             <div className="text-center py-24 bg-white rounded-[3.5rem] border-4 border-yellow-50 shadow-xl">
               <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
               <p className="font-black text-slate-800 text-xl">Preparando seus desafios...</p>
             </div>
           ) : quizFinished ? (
             <div className="bg-white rounded-[3.5rem] p-16 text-center shadow-2xl animate-bounce-in border-8 border-emerald-50">
               <span className="text-8xl mb-8 block">🏆</span>
               <h3 className="text-4xl font-black text-slate-800 mb-4">Você Conseguiu!</h3>
               <p className="text-xl font-bold text-slate-500 mb-10">Mandou muito bem no teste de {activeCourse?.title}!</p>
               <button 
                 onClick={() => setQuizMode(false)}
                 className="bg-emerald-500 text-white px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-xl hover:bg-emerald-600 transition-all"
               >
                 FINALIZAR 🌟
               </button>
             </div>
           ) : (
             <div className="bg-white rounded-[3.5rem] p-12 border-4 border-yellow-50 shadow-2xl">
               <div className="text-center mb-12">
                 <span className="text-7xl mb-6 block drop-shadow-lg">{quizQuestions[currentQuizIndex]?.emoji}</span>
                 <h4 className="text-3xl font-black text-slate-800 leading-tight">{quizQuestions[currentQuizIndex]?.question}</h4>
               </div>
               <div className="space-y-4">
                 {quizQuestions[currentQuizIndex]?.options.map((opt, i) => (
                   <button
                     key={i}
                     onClick={() => handleAnswer(i)}
                     className={`w-full p-6 rounded-3xl text-xl font-bold transition-all border-4 shadow-sm ${wrongAnswer === i ? 'bg-rose-50 border-rose-400 text-rose-600 scale-95' : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-yellow-400 hover:bg-white hover:scale-[1.02]'}`}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
