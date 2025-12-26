
import React, { useState } from 'react';
import { CommunicationBoard } from './components/CommunicationBoard';
import { VisualRoutine } from './components/VisualRoutine';
import { CalmZone } from './components/CalmZone';
import { SocialStoryGenerator } from './components/SocialStoryGenerator';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('board');

  const renderContent = () => {
    switch (activeTab) {
      case 'board': return <CommunicationBoard />;
      case 'routine': return <VisualRoutine />;
      case 'calm': return <CalmZone />;
      case 'stories': return <SocialStoryGenerator />;
      default: return <CommunicationBoard />;
    }
  };

  const navItems = [
    { id: 'board', label: 'Quadro', icon: '💬' },
    { id: 'routine', label: 'Rotina', icon: '📅' },
    { id: 'calm', label: 'Calma', icon: '🧘' },
    { id: 'stories', label: 'Histórias', icon: '📖' },
  ];

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧩</span>
            <h1 className="text-2xl font-black text-blue-600 tracking-tight">AutiAmigo</h1>
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
            Beta
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-6xl mx-auto flex justify-around p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all w-20 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
