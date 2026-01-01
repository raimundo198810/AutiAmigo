
import React from 'react';
import { AppTab } from '../types.ts';

interface SitemapProps {
  onNavigate: (tab: AppTab) => void;
}

export const Sitemap: React.FC<SitemapProps> = ({ onNavigate }) => {
  const categories = [
    {
      title: 'Comunicação',
      icon: '💬',
      links: [
        { id: 'board', label: 'Quadro de Voz' },
        { id: 'signs', label: 'Voz em Texto / Libras' },
        { id: 'gallery', label: 'Galeria de Conceitos' },
      ]
    },
    {
      title: 'Rotina e Foco',
      icon: '📅',
      links: [
        { id: 'routine', label: 'Minha Rotina' },
        { id: 'clock', label: 'Relógio e Alarme' },
        { id: 'stepbystep', label: 'Guia de Tarefas' },
        { id: 'noise', label: 'Monitor Sensorial' },
        { id: 'tracker', label: 'Meu Diário' },
      ]
    },
    {
      title: 'Bem-estar',
      icon: '🧘',
      links: [
        { id: 'calm', label: 'Mixer Calm' },
        { id: 'sos', label: 'Cartão SOS' },
      ]
    },
    {
      title: 'Aprendizado',
      icon: '🎓',
      links: [
        { id: 'courses', label: 'Cursos de Vida' },
        { id: 'games', label: 'PlayZone (Jogos)' },
        { id: 'study', label: 'Aula Visual' },
        { id: 'incentives', label: 'Centro de Prêmios' },
      ]
    },
    {
      title: 'Comunidade',
      icon: '🌟',
      links: [
        { id: 'community', label: 'Avaliações e Status' },
        { id: 'about', label: 'Sobre Nós' },
        { id: 'contact', label: 'Fale Conosco' },
      ]
    },
    {
      title: 'Info e Suporte',
      icon: '📚',
      links: [
        { id: 'consultant', label: 'Manual de Apoio' },
        { id: 'autism_info', label: 'Guia de Direitos' },
      ]
    },
    {
      title: 'Sistema',
      icon: '⚙️',
      links: [
        { id: 'settings', label: 'Ajustes' },
        { id: 'privacy', label: 'Privacidade' },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20 px-4">
      <div className="text-center">
        <h2 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase mb-2">Mapa do Site 🗺️</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Navegue rapidamente por todas as nossas ferramentas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.title} className="clay-card p-10 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-3xl p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-inner">{cat.icon}</div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">{cat.title}</h3>
            </div>
            <ul className="space-y-4">
              {cat.links.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id as AppTab)}
                    className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
