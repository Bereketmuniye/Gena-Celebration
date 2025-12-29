
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CultureChat from './components/CultureChat';
import Visualizer from './components/Visualizer';
import RecipeHub from './components/RecipeHub';
import GennaCelebration from './components/GennaCelebration';
import FestiveOverlay from './components/FestiveOverlay';
import BackgroundMusic from './components/BackgroundMusic';
import CelebrationHighlight from './components/CelebrationHighlight';
import GiftGame from './components/GiftGame';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME: return (
        <div className="space-y-16 md:space-y-24 animate-fadeIn">
          {/* Hero Section */}
          <section className="relative">
            <CelebrationHighlight />
            <motion.div
              drag
              dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
              whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative md:absolute -mt-12 md:mt-0 md:-bottom-12 left-1/2 -translate-x-1/2 w-[95%] md:w-[80%] glass-card p-6 md:p-12 rounded-[2rem] border border-white/50 shadow-2xl z-30 cursor-grab active:cursor-grabbing"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                    Experience the <span className="ethiopian-gradient-text italic">Eternal Spirit</span> of Ethiopia
                  </h2>
                  <p className="text-stone-600 text-base md:text-lg font-medium leading-relaxed">
                    A digital odyssey through the rock-hewn heights of Lalibela,
                    the rhythmic pulse of the coffee ceremony, and the vibrant
                    traditions of Genna.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab(Tab.CHAT)}
                    className="shine-effect px-6 md:px-8 py-3 md:py-4 bg-stone-950 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all text-sm md:text-base"
                  >
                    Begin the Journey
                  </button>
                  <button
                    onClick={() => setActiveTab(Tab.GENNA)}
                    className="px-6 md:px-8 py-3 md:py-4 border-2 border-stone-200 text-stone-950 rounded-2xl font-bold hover:bg-stone-50 transition-all text-sm md:text-base"
                  >
                    Explore Traditions
                  </button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Featured Sections */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12">
            {[
              {
                title: 'The Chronicle',
                desc: 'Chat with our AI historian about ancient kings and legends.',
                icon: '📜',
                tab: Tab.CHAT,
                color: 'bg-amber-50'
              },
              {
                title: 'Visions',
                desc: 'Generate breathtaking AI artwork of Abyssinian landscapes.',
                icon: '🖼️',
                tab: Tab.VISUALS,
                color: 'bg-emerald-50'
              },
              {
                title: 'Tastes',
                desc: 'Discover the secrets of Doro Wat and traditional spices.',
                icon: '🍲',
                tab: Tab.GASTRONOMY,
                color: 'bg-red-50'
              }
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => setActiveTab(item.tab)}
                className={`glass-card p-6 md:p-8 rounded-[2rem] cursor-pointer group hover:scale-105 transition-all ${item.color}/30`}
              >
                <div className="text-3xl md:text-4xl mb-4 md:mb-6 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 md:mb-3">{item.title}</h3>
                <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
                <div className="mt-4 md:mt-6 flex items-center text-stone-950 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                  Explore <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </section>

          {/* Quote Section */}
          <section className="text-center py-8 md:py-12">
            <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 px-4">
              <div className="text-4xl md:text-5xl text-stone-200 font-serif italic">"</div>
              <h3 className="text-2xl md:text-4xl font-serif italic text-stone-800 leading-tight">
                "Ethiopia is not just a place, it is a feeling of being at the very beginning of time."
              </h3>
              <div className="w-12 h-1 bg-amber-500 mx-auto"></div>
              <p className="text-stone-400 uppercase tracking-[0.3em] text-[8px] md:text-[10px] font-bold">The Land of Origins</p>
            </div>
          </section>
        </div>
      );
      case Tab.CHAT: return <CultureChat />;
      case Tab.VISUALS: return <Visualizer />;
      case Tab.GASTRONOMY: return <RecipeHub />;
      case Tab.GENNA: return <GennaCelebration />;
      case Tab.COFFEE: return (
        <div className="glass-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 text-center flex flex-col items-center justify-center space-y-6 md:space-y-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-950 rounded-full flex items-center justify-center border border-amber-500/30 shadow-2xl animate-float">
            <span className="text-4xl md:text-5xl">☕</span>
          </div>
          <div className="space-y-3 md:space-y-4 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-950">The Buna Ritual</h2>
            <p className="text-stone-600 leading-relaxed text-base md:text-lg font-medium">
              The Ethiopian coffee ceremony is a sacred ritual of peace and hospitality.
              From the roasting of green beans to the three rounds of serving:
              <span className="text-amber-800 font-bold"> Abol</span>,
              <span className="text-amber-700 font-bold"> Tona</span>, and
              <span className="text-amber-600 font-bold"> Baraka</span>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mt-6 md:mt-8">
            {['Abol', 'Tona', 'Baraka'].map((round, i) => (
              <div key={i} className="p-4 md:p-6 glass-card rounded-2xl border-stone-200/50 text-center">
                <div className="text-amber-800 font-bold text-[10px] uppercase tracking-widest mb-1 md:mb-2">Round {i + 1}</div>
                <h4 className="text-lg md:text-xl font-serif font-bold text-stone-950">{round}</h4>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab(Tab.CHAT)}
            className="mt-6 md:mt-8 text-amber-600 hover:text-amber-500 flex items-center space-x-2 transition-colors font-bold text-sm md:text-base"
          >
            <span>Ask the Chronicler more about Coffee</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      );
      case Tab.GIFT: return <GiftGame />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30">
      <FestiveOverlay activeTab={activeTab} />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-red-100/30 blur-[160px] rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/30 blur-[140px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] bg-amber-100/30 blur-[120px] rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation Header */}
      <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <nav className="glass-card px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl flex items-center justify-between border border-white/40 shadow-2xl">
          <div className="flex items-center space-x-3 md:space-x-4 group cursor-pointer" onClick={() => setActiveTab(Tab.HOME)}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-950 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
              <span className="text-white font-serif text-xl md:text-2xl font-bold">A</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-serif font-bold text-stone-950 tracking-tight leading-none">Ethiopian</h1>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-amber-700 font-bold">Christmas</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1 bg-stone-100/50 p-1.5 rounded-2xl">
            {[
              { id: Tab.HOME, label: 'Home' },
              { id: Tab.CHAT, label: 'Chronicle' },
              { id: Tab.GENNA, label: 'Genna' },
              { id: Tab.VISUALS, label: 'Visions' },
              { id: Tab.GASTRONOMY, label: 'Tastes' },
              { id: Tab.COFFEE, label: 'Rituals' },
              { id: Tab.GIFT, label: 'Gift' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-xl ${activeTab === item.id
                  ? 'bg-white text-stone-950 shadow-sm'
                  : 'text-stone-500 hover:text-stone-950 hover:bg-white/50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[8px] md:text-[10px] text-stone-400 uppercase tracking-widest font-bold">Status</span>
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] md:text-[10px] text-stone-900 font-bold">LIVE</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="relative z-40 flex-1 pt-24 md:pt-32 pb-24 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-5 py-3 rounded-full flex space-x-5 shadow-2xl border border-white/50 max-w-[95vw] overflow-x-auto no-scrollbar">
        {[
          { id: Tab.HOME, icon: '🏠' },
          { id: Tab.CHAT, icon: '📜' },
          { id: Tab.GENNA, icon: '⭐' },
          { id: Tab.VISUALS, icon: '🖼️' },
          { id: Tab.GASTRONOMY, icon: '🍲' },
          { id: Tab.COFFEE, icon: '☕' },
          { id: Tab.GIFT, icon: '🎁' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`text-xl transition-all duration-300 flex-shrink-0 ${activeTab === item.id ? 'scale-125 drop-shadow-lg' : 'opacity-40 grayscale'
              }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <footer className="relative z-10 py-8 md:py-12 text-center">
        <div className="w-16 md:w-24 h-px bg-stone-200 mx-auto mb-4 md:mb-6"></div>
        <p className="text-stone-400 text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold px-4">
          &copy; {new Date().getFullYear()} Ethiopian Christmas &bull; The Eternal Heart of Africa
        </p>
      </footer>

      <BackgroundMusic />
    </div>
  );
};

export default App;
