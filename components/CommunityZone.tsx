
import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService.ts';
import { Review, Language } from '../types.ts';

export const CommunityZone: React.FC<{ lang: Language }> = ({ lang }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(1234);

  useEffect(() => {
    setReviews(DatabaseService.getReviews());
    // Simulando flutuação de usuários online
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userName: name,
      rating: rating,
      comment: comment,
      timestamp: Date.now(),
      avatar: ['🧒', '👧', '🧑', '👱', '👨‍🦱', '👩‍🦰'][Math.floor(Math.random() * 6)]
    };

    DatabaseService.saveReview(newReview);
    setReviews([newReview, ...reviews]);
    setComment('');
    setName('');
    alert('Obrigado pela sua avaliação! ✨');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20 px-4">
      {/* Community Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="clay-card p-10 bg-blue-600 text-white shadow-2xl overflow-hidden relative group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Comunidade Ativa</span>
            </div>
            <h3 className="text-5xl font-black tracking-tighter">{onlineUsers.toLocaleString()}</h3>
            <p className="text-lg font-bold opacity-80">Usuários online agora apoiando a inclusão.</p>
          </div>
        </div>

        <div className="clay-card p-10 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 flex flex-col justify-center text-center md:text-left">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter mb-2">Avalie o App ⭐️</h3>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Sua opinião ajuda outras famílias a encontrar este suporte.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmitReview} className="clay-card p-10 bg-slate-50 dark:bg-slate-900 border-4 border-white dark:border-slate-800 sticky top-32">
            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest">Sua Avaliação</h4>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Seu Nome</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-400 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nota</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-all ${rating >= star ? 'scale-125 grayscale-0' : 'grayscale opacity-30'}`}
                    >
                      ⭐️
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Comentário</label>
                <textarea 
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Conte sua experiência..."
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-400 font-bold h-32 resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
              >
                Publicar Review ✨
              </button>
            </div>
          </form>
        </div>

        {/* Reviews List Column */}
        <div className="lg:col-span-8 space-y-6">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] px-4">O que dizem sobre nós</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map(rev => (
              <div key={rev.id} className="clay-card p-8 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    {rev.avatar}
                  </div>
                  <div>
                    <h5 className="font-black text-slate-800 dark:text-slate-100 leading-none mb-1">{rev.userName}</h5>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-[10px] ${i < rev.rating ? 'grayscale-0' : 'grayscale opacity-30'}`}>⭐️</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mt-4">
                  {new Date(rev.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
