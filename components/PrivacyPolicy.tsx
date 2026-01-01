
import React from 'react';
import { Language } from '../types.ts';

export const PrivacyPolicy: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="text-center">
        <h2 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase mb-4">Privacidade 🛡️</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Sua segurança e a proteção de seus dados são nossa prioridade máxima.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="clay-card p-10 bg-white dark:bg-slate-800 border-4 border-blue-50 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-2xl">📱</div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Armazenamento Local</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
            O <strong>Ajuda Autista</strong> foi projetado para ser um ambiente seguro. A maioria absoluta dos seus dados (como cartões personalizados, rotinas e conquistas) é armazenada exclusivamente no <strong>seu dispositivo</strong> através do <i>LocalStorage</i>.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-bold">
              ✨ Isso significa que nós não temos acesso às suas rotinas pessoais nem aos seus nomes. Tudo fica com você.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="clay-card p-8 bg-white dark:bg-slate-800 border-4 border-emerald-50 dark:border-slate-700">
            <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-tighter">IA Ética</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              As consultas realizadas à nossa Inteligência Artificial (Gemini API) são processadas de forma anônima. Não enviamos dados de identificação pessoal para os motores de IA.
            </p>
          </div>
          <div className="clay-card p-8 bg-white dark:bg-slate-800 border-4 border-amber-50 dark:border-slate-700">
            <h4 className="text-xl font-black text-amber-600 dark:text-amber-400 mb-4 uppercase tracking-tighter">Coleta Mínima</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Não exigimos criação de conta ou login para as funções básicas. Seu direito ao anonimato é respeitado desde o primeiro clique.
            </p>
          </div>
        </div>

        <div className="clay-card p-10 bg-slate-900 text-white shadow-2xl">
          <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">Seus Direitos (LGPD)</h3>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="text-blue-400 text-xl">✔</span>
              <p className="text-slate-300 font-medium"><strong>Exclusão:</strong> Você pode apagar todos os dados do app a qualquer momento na aba "Ajustes".</p>
            </li>
            <li className="flex gap-4">
              <span className="text-blue-400 text-xl">✔</span>
              <p className="text-slate-300 font-medium"><strong>Portabilidade:</strong> Use a função de Exportar para levar seus dados para outro dispositivo.</p>
            </li>
            <li className="flex gap-4">
              <span className="text-blue-400 text-xl">✔</span>
              <p className="text-slate-300 font-medium"><strong>Transparência:</strong> Nosso código e processos visam sempre a clareza total sobre o uso de dados.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">
          Última atualização: Fevereiro de 2024
        </p>
      </div>
    </div>
  );
};
