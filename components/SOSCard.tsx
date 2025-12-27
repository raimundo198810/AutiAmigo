
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
      instructions: 'Em caso de crise sensorial, me leve para um local calmo. Evite toques bruscos e sons altos.'
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
    <div className="p-8 max-w-2xl mx-auto h-full">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black text-3d mb-2">Cartão de Emergência 🚨</h2>
        <p className="text-slate-600 font-bold text-lg">Informações críticas para salvaguardar sua vida.</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="clay-card p-10 space-y-5 animate-fade-in">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Condição Principal</label>
              <input 
                type="text" value={data.condition} onChange={e => setData({...data, condition: e.target.value})}
                className="w-full p-4 rounded-2xl inner-depth outline-none font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Tipo Sanguíneo</label>
              <input 
                type="text" value={data.bloodType} onChange={e => setData({...data, bloodType: e.target.value})}
                className="w-full p-4 rounded-2xl inner-depth outline-none font-bold text-slate-800"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Contato Emergência</label>
              <input 
                type="text" value={data.emergencyContact} onChange={e => setData({...data, emergencyContact: e.target.value})}
                className="w-full p-4 rounded-2xl inner-depth outline-none font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Telefone</label>
              <input 
                type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})}
                className="w-full p-4 rounded-2xl inner-depth outline-none font-bold text-slate-800"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Alergias Graves</label>
            <input 
              type="text" value={data.allergies} onChange={e => setData({...data, allergies: e.target.value})}
              className="w-full p-4 rounded-2xl inner-depth outline-none font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Instruções Vitais</label>
            <textarea 
              value={data.instructions} onChange={e => setData({...data, instructions: e.target.value})}
              className="w-full p-4 rounded-2xl inner-depth outline-none font-bold text-slate-800 h-28"
            />
          </div>

          <button type="submit" className="w-full py-6 rounded-3xl bg-black text-white font-black text-xl clay-button shadow-2xl">
            SALVAR NO DISPOSITIVO 💾
          </button>
        </form>
      ) : (
        <div 
          className="sos-card-3d p-12 text-white relative overflow-hidden cursor-pointer group hover:rotate-2 transition-all duration-500 shadow-2xl" 
          onClick={() => setIsEditing(true)}
        >
          {/* Decoração Estilo Cartão Magnético */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute top-10 right-10 w-24 h-16 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md border border-white/40 shadow-xl">
                <span className="text-5xl">🚨</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-1">PROTOCOLO DE SEGURANÇA</p>
                <h3 className="text-4xl font-black tracking-tighter drop-shadow-lg">{data.condition}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="bg-black/30 p-6 rounded-[2rem] backdrop-blur-sm border border-white/10 shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">CONTATO PRIORITÁRIO</p>
                <p className="text-xl font-bold leading-tight mb-2 truncate">{data.emergencyContact}</p>
                <p className="text-2xl font-black text-yellow-300 tracking-tight">{data.phone || 'NÃO DEFINIDO'}</p>
              </div>
              <div className="bg-black/30 p-6 rounded-[2rem] backdrop-blur-sm border border-white/10 shadow-inner text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">SANGUE / ALERGIAS</p>
                <p className="text-4xl font-black mb-2 text-white drop-shadow-lg">{data.bloodType}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-200">{data.allergies}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] text-rose-700 shadow-2xl transform hover:scale-[1.02] transition-transform">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">COMO ME AJUDAR EM CRISE</p>
              <p className="text-2xl font-black leading-tight tracking-tight">
                "{data.instructions}"
              </p>
            </div>

            <div className="mt-12 flex justify-between items-end opacity-50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest block">AJUDA AUTISTA SOS v2.0</span>
                <span className="text-[10px] font-medium italic">VÁLIDO EM TODO TERRITÓRIO</span>
              </div>
              <span className="text-sm font-black">✏️ TOQUE PARA ATUALIZAR</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 clay-card p-8 text-center bg-slate-50 border-dashed border-2 border-slate-300">
        <p className="text-slate-600 font-bold text-sm leading-relaxed">
          Este cartão é salvo apenas no seu navegador. <br/>
          <strong>Dica:</strong> Tire um print desta tela e coloque como papel de parede para emergências.
        </p>
      </div>
    </div>
  );
};
