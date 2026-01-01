
import React, { useState, useEffect } from 'react';

interface SOSData {
  condition: string;
  bloodType: string;
  emergencyContact: string;
  phone: string;
  medications: string;
  allergies: string;
  instructions: string;
}

const STORAGE_KEY = 'ajuda_autista_sos_v2';
const SUPPORT_EMAIL = 'mcnmuuaj@ajuda-autista.criarsite.online';

export const SOSCard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<SOSData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      condition: 'Autismo / TEA',
      bloodType: 'A+',
      emergencyContact: 'Mãe / Responsável',
      phone: '',
      medications: '',
      allergies: 'Nenhuma conhecida',
      instructions: 'Em caso de crise sensorial, me leve para um local calmo. Evite toques bruscos.'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`SOS - Emergência: ${data.condition}`);
    const body = encodeURIComponent(
      `CARTÃO DE EMERGÊNCIA\n\n` +
      `Condição: ${data.condition}\n` +
      `Sangue: ${data.bloodType}\n` +
      `Contato: ${data.emergencyContact}\n` +
      `Fone: ${data.phone}\n` +
      `Alergias: ${data.allergies}\n\n` +
      `INSTRUÇÕES:\n${data.instructions}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto h-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Cartão SOS 🚨</h2>
        <p className="text-slate-500 font-bold text-lg">Informações críticas para emergências.</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flat-card p-8 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Condição</label>
              <input 
                type="text" value={data.condition} onChange={e => setData({...data, condition: e.target.value})}
                className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none font-bold text-slate-800 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Sangue</label>
              <input 
                type="text" value={data.bloodType} onChange={e => setData({...data, bloodType: e.target.value})}
                className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none font-bold text-slate-800 focus:border-blue-400"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Contato</label>
              <input 
                type="text" value={data.emergencyContact} onChange={e => setData({...data, emergencyContact: e.target.value})}
                className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none font-bold text-slate-800 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Telefone</label>
              <input 
                type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})}
                className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none font-bold text-slate-800 focus:border-blue-400"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Instruções Vitais</label>
            <textarea 
              value={data.instructions} onChange={e => setData({...data, instructions: e.target.value})}
              className="w-full p-3 rounded-xl border-2 border-slate-100 outline-none font-bold text-slate-800 h-24 focus:border-blue-400"
            />
          </div>

          <button type="submit" className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-black">
            SALVAR CARTÃO
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div 
            className="sos-card-flat p-10 cursor-pointer hover:brightness-105 transition-all" 
            onClick={() => setIsEditing(true)}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="bg-white/20 p-4 rounded-xl">
                <span className="text-4xl">🚨</span>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">CARTÃO DE EMERGÊNCIA</p>
                <h3 className="text-3xl font-black tracking-tighter">{data.condition}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/10 p-4 rounded-xl border border-white/20">
                <p className="text-[9px] font-bold uppercase opacity-60 mb-1">CONTATO</p>
                <p className="text-sm font-bold truncate">{data.emergencyContact}</p>
                <p className="text-lg font-black text-yellow-300">{data.phone || '---'}</p>
              </div>
              <div className="bg-black/10 p-4 rounded-xl border border-white/20 text-center">
                <p className="text-[9px] font-bold uppercase opacity-60 mb-1">SANGUE</p>
                <p className="text-3xl font-black">{data.bloodType}</p>
              </div>
            </div>

            <div className="bg-white/10 p-6 rounded-xl border border-white/30">
              <p className="text-[9px] font-bold uppercase opacity-60 mb-2">INSTRUÇÕES</p>
              <p className="text-lg font-bold leading-snug">
                "{data.instructions}"
              </p>
            </div>
            
            <p className="text-center text-[8px] font-bold uppercase tracking-widest mt-8 opacity-40">TOQUE PARA EDITAR</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={sendEmail}
              className="flex-1 flat-button py-4 border-2 border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              📧 ENVIAR POR E-MAIL
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black"
            >
              🖨️ IMPRIMIR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
