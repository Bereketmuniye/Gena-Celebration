
import React, { useState, useEffect } from 'react';
import CultureChat from './components/CultureChat';
import Visualizer from './components/Visualizer';
import RecipeHub from './components/RecipeHub';
import GennaCelebration from './components/GennaCelebration';
import FestiveOverlay from './components/FestiveOverlay';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CHAT);

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CHAT: return <CultureChat />;
      case Tab.VISUALS: return <Visualizer />;
      case Tab.GASTRONOMY: return <RecipeHub />;
      case Tab.GENNA: return <GennaCelebration />;
      case Tab.COFFEE: return (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center border border-amber-500/30">
            <span className="text-4xl">☕</span>
          </div>
          <h2 className="text-3xl font-serif text-amber-400">The Buna Ceremony</h2>
          <p className="max-w-xl text-stone-400 leading-relaxed">
            The Ethiopian coffee ceremony is more than a drink; it is a ritual of peace, social grace, and hospitality.
            It involves roasting the beans, the fragrant smoke of incense, and three rounds of serving: Abol, Tona, and Baraka.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mt-8">
            <div className="p-4 bg-stone-900/50 rounded-xl border border-stone-800">
              <h4 className="text-amber-500 font-bold mb-2">Abol</h4>
              <p className="text-xs text-stone-500 italic">The First Round - Strength</p>
            </div>
            <div className="p-4 bg-stone-900/50 rounded-xl border border-stone-800">
              <h4 className="text-amber-500 font-bold mb-2">Tona</h4>
              <p className="text-xs text-stone-500 italic">The Second Round - Transformation</p>
            </div>
            <div className="p-4 bg-stone-900/50 rounded-xl border border-stone-800">
              <h4 className="text-amber-500 font-bold mb-2">Baraka</h4>
              <p className="text-xs text-stone-500 italic">The Third Round - Blessing</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(Tab.CHAT)}
            className="mt-8 text-amber-500 hover:text-amber-400 flex items-center space-x-2 transition-colors"
          >
            <span>Ask the Chronicler more about Coffee</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30">
      <FestiveOverlay activeTab={activeTab} />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] ethiopian-gradient blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900 blur-[100px] rounded-full"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between glass-card border-none rounded-none">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 ethiopian-gradient rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-serif text-xl font-bold">A</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-stone-100 tracking-tight leading-none">Habesha Charisma</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 font-bold">The Eternal Heart of Africa</p>
          </div>
        </div>

        <div className="hidden md:flex space-x-8">
          {[
            { id: Tab.CHAT, label: 'Chronicle' },
            { id: Tab.GENNA, label: 'Genna' },
            { id: Tab.VISUALS, label: 'Visions' },
            { id: Tab.GASTRONOMY, label: 'Tastes' },
            { id: Tab.COFFEE, label: 'Rituals' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`text-xs uppercase tracking-widest font-bold transition-all ${activeTab === item.id ? 'text-amber-400 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-300'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">AI Active</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-4 py-3 rounded-2xl flex space-x-6 shadow-2xl">
        {[
          { id: Tab.CHAT, icon: '📜' },
          { id: Tab.GENNA, icon: '⭐' },
          { id: Tab.VISUALS, icon: '🖼️' },
          { id: Tab.GASTRONOMY, icon: '🍲' },
          { id: Tab.COFFEE, icon: '☕' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`text-xl p-2 rounded-lg transition-all ${activeTab === item.id ? 'bg-amber-500/20 scale-110' : 'opacity-50'
              }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <footer className="relative z-10 py-6 text-center text-stone-600 text-[10px] uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Habesha Charisma &bull; Crafted with Eternal Spirit
      </footer>
    </div>
  );
};

export default App;
