
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types.ts';

export const VisualGallery: React.FC<{ lang: Language }> = ({ lang }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProjectImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A high-end 3D Claymorphism style UI/UX design presentation for an autism support platform called 'Ajuda Autista'. 
      Features a clean, Apple-style minimalist aesthetic with soft pastel gradients (Deep Blue, Emerald, Soft Violet). 
      Showing a 3D tablet mockup with friendly rounded buttons and playful 3D icons like hearts, gears and chat bubbles. 
      Professional studio lighting, soft shadows, high-quality material rendering, 8k resolution, clean neutral background. 
      The interface looks accessible, modern, and extremely high-tech.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            setImage(`data:image/png;base64,${base64Data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setError("O motor criativo está sobrecarregado. Tente novamente em instantes.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o motor criativo. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto flex flex-col items-center">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase transition-colors duration-500">Galeria Visual 🖼️</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xl max-w-2xl mx-auto transition-colors duration-500">
          Visualizamos o futuro da tecnologia inclusiva através de conceitos artísticos modernos e acolhedores.
        </p>
      </div>

      {!image && !loading && (
        <div className="w-full bg-[#F8FAFC] dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[4rem] p-24 flex flex-col items-center justify-center text-center shadow-inner transition-colors duration-500">
          <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-6xl shadow-xl mb-10 animate-bounce">✨</div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">Mural de Inspiração</h3>
          <p className="text-slate-400 font-medium mb-10">Clique abaixo para gerar uma representação visual do nosso compromisso com a acessibilidade.</p>
          <button 
            onClick={generateProjectImage}
            className="bg-blue-600 text-white px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-tighter"
          >
            Gerar Conceito Visual 🚀
          </button>
        </div>
      )}

      {loading && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[4rem] p-32 flex flex-col items-center justify-center text-center shadow-2xl transition-colors duration-500">
          <div className="relative w-40 h-40 mb-12">
             <div className="absolute inset-0 border-[12px] border-blue-50 dark:border-blue-900/30 rounded-full"></div>
             <div className="absolute inset-0 border-[12px] border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Renderizando Visão...</h3>
          <p className="text-slate-400 font-bold mt-4 animate-pulse">Criando iluminação e texturas acolhedoras</p>
        </div>
      )}

      {error && (
        <div className="w-full bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-100 dark:border-rose-900/40 rounded-[3rem] p-12 text-center mb-8">
          <p className="text-rose-600 dark:text-rose-400 font-black text-xl">{error}</p>
          <button onClick={generateProjectImage} className="mt-6 text-rose-500 font-black uppercase text-sm tracking-widest hover:underline">Tentar novamente</button>
        </div>
      )}

      {image && (
        <div className="w-full space-y-10 animate-fade-in">
          <div className="relative group rounded-[4.5rem] overflow-hidden border-[12px] border-white dark:border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-50 dark:bg-slate-900 transition-all duration-500">
             <img src={image} alt="App Render" className="w-full h-auto object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-16 flex items-end justify-center">
                <a 
                  href={image} 
                  download="ajuda-autista-conceito.png"
                  className="bg-white text-slate-900 px-12 py-6 rounded-[2.5rem] font-black uppercase text-sm shadow-2xl hover:scale-105 transition-all"
                >
                  Baixar Imagem 📥
                </a>
             </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm gap-8 transition-colors duration-500">
            <div className="text-center sm:text-left">
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">Conceito de Interface Inclusiva</h4>
              <p className="text-slate-400 font-bold">IA Generativa • Foco em Acessibilidade • Estilo Moderno</p>
            </div>
            <button 
              onClick={generateProjectImage}
              className="px-10 py-5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              Nova Inspiração 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
