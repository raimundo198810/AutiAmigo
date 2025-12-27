
import React, { useState, useEffect } from 'react';

interface SOSData {
  name: string;
  condition: string;
  emergencyContact: string;
  phone: string;
  medications: string;
  allergies: string;
  instructions: string;
}

const STORAGE_KEY = 'ajuda_autista_sos_v1';

export const SOSCard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<SOSData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      name: '',
      condition: 'Autismo / TEA',
      emergencyContact: '',
      phone: '',
      medications: '',
      allergies: '',
      instructions: 'Em caso de crise, mantenha a calma e evite toques físicos bruscos.'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-rose-600 mb-2">Cartão de Emergência 🚨</h2>
        <p className="text-slate-500 font-medium">Informações vitais para mostrar em situações críticas.</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border-4 border-rose-50 shadow-xl space-y-4">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Nome Completo</label>
            <input 
              type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})}
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-rose-200 font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Contato de Emergência</label>
              <input 
                type="text" value={data.emergencyContact} onChange={e => setData({...data, emergencyContact: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-rose-200 font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Telefone</label>
              <input 
                type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-rose-200 font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Medicações em Uso</label>
            <input 
              type="text" value={data.medications} onChange={e => setData({...data, medications: e.target.value})}
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-rose-200 font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Instruções de Crise</label>
            <textarea 
              value={data.instructions} onChange={e => setData({...data, instructions: e.target.value})}
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-rose-200 font-bold h-24"
            />
          </div>
          <button type="submit" className="w-full py-5 rounded-2xl bg-rose-600 text-white font-black text-xl shadow-lg">
            Salvar Cartão
          </button>
        </form>
      ) : (
        <div className="bg-rose-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-4xl font-black mb-1">{data.name || 'NOME DO USUÁRIO'}</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {data.condition}
                </span>
              </div>
              <button onClick={() => setIsEditing(true)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                ✏️
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 p-5 rounded-3xl">
                <p className="text-rose-200 text-[10px] font-black uppercase tracking-widest mb-1">Contato de Emergência</p>
                <p className="text-xl font-bold">{data.emergencyContact || 'Não definido'}</p>
                <p className="text-2xl font-black mt-1">{data.phone || '0000-0000'}</p>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl">
                <p className="text-rose-200 text-[10px] font-black uppercase tracking-widest mb-1">Medicações / Alergias</p>
                <p className="font-bold">{data.medications || 'Nenhuma'}</p>
                <p className="font-bold text-rose-100">{data.allergies}</p>
              </div>
            </div>

            <div className="bg-white text-rose-600 p-6 rounded-[2rem] border-4 border-rose-400/30">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Instruções para terceiros</p>
              <p className="font-bold leading-relaxed italic">"{data.instructions}"</p>
            </div>
            
            <p className="text-center mt-6 text-rose-200 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Mostre este cartão em caso de necessidade.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
        <p className="text-slate-400 font-bold text-sm">
          Este cartão fica salvo apenas no seu navegador. <br/>Dica: Tire um "print" e salve nos seus favoritos.
        </p>
      </div>
    </div>
  );
};
