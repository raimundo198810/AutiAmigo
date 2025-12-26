
import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService.ts';
import { UserProfile } from '../types.ts';

export const ProfileManager: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🧒');

  const avatars = ['🧒', '👧', '🧑', '👱', '👨‍🦱', '👩‍🦰', '🦸', '🦁', '🐼'];

  useEffect(() => {
    setProfiles(DatabaseService.getProfiles());
    setActiveId(DatabaseService.getActiveProfileId());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: newName,
      avatar: selectedAvatar,
      themeColor: 'blue',
      createdAt: Date.now()
    };
    DatabaseService.saveProfile(newProfile);
    setProfiles(DatabaseService.getProfiles());
    setIsCreating(false);
    setNewName('');
    if (profiles.length === 0) selectProfile(newProfile.id);
  };

  const selectProfile = (id: string) => {
    DatabaseService.setActiveProfile(id);
    setActiveId(id);
    window.location.reload(); // Recarrega para aplicar o contexto do banco de dados
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Banco de Perfis 📁</h2>
        <p className="text-slate-500 font-medium">Gerencie quem está usando o AutiAmigo.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => selectProfile(p.id)}
            className={`p-8 rounded-[3rem] border-4 transition-all flex flex-col items-center group relative overflow-hidden ${
              activeId === p.id 
                ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-200' 
                : 'bg-white border-slate-100 hover:border-blue-100 shadow-sm text-slate-700'
            }`}
          >
            <div className={`text-6xl mb-4 p-4 rounded-3xl transition-transform group-hover:scale-110 ${activeId === p.id ? 'bg-white/20' : 'bg-slate-50'}`}>
              {p.avatar}
            </div>
            <span className="text-xl font-black truncate w-full">{p.name}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${activeId === p.id ? 'text-blue-200' : 'text-slate-400'}`}>
              {activeId === p.id ? 'ATIVO NO BANCO' : 'CLIQUE PARA ENTRAR'}
            </span>
          </button>
        ))}

        <button 
          onClick={() => setIsCreating(true)}
          className="p-8 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group"
        >
          <span className="text-4xl mb-2 group-hover:rotate-90 transition-transform">➕</span>
          <span className="font-black">Novo Usuário</span>
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={handleCreate} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-black text-slate-800 mb-6">Cadastrar no Banco</h3>
            
            <div className="mb-6">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Seu Nome</label>
              <input 
                autoFocus
                type="text" 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Como quer ser chamado?"
                className="w-full p-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-blue-400 font-bold"
              />
            </div>

            <div className="mb-8">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-4 block">Escolha um Avatar</label>
              <div className="grid grid-cols-5 gap-3">
                {avatars.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setSelectedAvatar(a)}
                    className={`text-2xl p-2 rounded-xl border-2 transition-all ${selectedAvatar === a ? 'bg-blue-50 border-blue-400 scale-110' : 'border-slate-50'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-200"
              >
                Criar Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Histórico de Uso do Banco */}
      <div className="mt-16 bg-slate-50 rounded-[3rem] p-8 border-2 border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
           <span>📊</span> Atividades Recentes
        </h3>
        <div className="space-y-3">
          {DatabaseService.getLogs().length > 0 ? DatabaseService.getLogs().map(log => (
            <div key={log.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xl">
                  {log.type === 'card_click' ? '💬' : log.type === 'task_complete' ? '✅' : '🧘'}
                </span>
                <div>
                  <p className="font-bold text-slate-700">{log.detail}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-center text-slate-400 py-8 font-medium">Nenhum registro no banco de dados ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};
