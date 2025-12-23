
import React, { useState } from 'react';
import { getAI } from '../services/gemini';

const GennaCelebration: React.FC = () => {
  const [blessing, setBlessing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestBlessing = async () => {
    setLoading(true);
    try {
      // Fixed: Using the centralized getAI helper which now exports correctly from services
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Write a short, poetic Genna (Ethiopian Christmas) blessing in English and Amharic. Mention the star of Bethlehem and the joy of community.",
        config: { temperature: 0.9 }
      });
      setBlessing(response.text);
    } catch (e) {
      setBlessing("May the light of the star guide your home this Genna.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-amber-900/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1543362906-acfc16c623a2?q=80&w=1000&auto=format&fit=crop"
          alt="Festive Ethiopia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center p-6">
          <h2 className="text-4xl md:text-6xl font-serif text-amber-400 mb-2">Melkam Genna!</h2>
          <p className="text-stone-100 text-lg md:text-xl font-light tracking-wide">"For a child is born unto us..."</p>
          <div className="mt-4 flex space-x-2">
            <span className="px-3 py-1 bg-emerald-600/50 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-white border border-emerald-400/30">Peace</span>
            <span className="px-3 py-1 bg-yellow-600/50 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-white border border-yellow-400/30">Unity</span>
            <span className="px-3 py-1 bg-red-600/50 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-white border border-red-400/30">Abundance</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border-amber-500/30 bg-amber-50/30">
          <div className="text-3xl mb-4">🏑</div>
          <h3 className="text-xl font-serif text-amber-800 mb-2 font-bold">Ye-Genna Chewata</h3>
          <p className="text-stone-800 text-sm leading-relaxed font-medium">
            Legend says when the shepherds heard of Jesus' birth, they played this game with their crooks. Today, it remains a spirited holiday tradition for men and boys across the highlands.
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-emerald-500/30 bg-emerald-50/30">
          <div className="text-3xl mb-4">⛪</div>
          <h3 className="text-xl font-serif text-emerald-800 mb-2 font-bold">The Night Vigil</h3>
          <p className="text-stone-800 text-sm leading-relaxed font-medium">
            Clad in white 'Netelas', thousands gather at the rock-hewn churches of Lalibela. The air is thick with the scent of frankincense and the rhythmic chanting of the Ge'ez liturgy.
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-red-500/30 bg-red-50/30">
          <div className="text-3xl mb-4">🍗</div>
          <h3 className="text-xl font-serif text-red-800 mb-2 font-bold">The Christmas Feast</h3>
          <p className="text-stone-800 text-sm leading-relaxed font-medium">
            After 43 days of fasting (Tsome Gehad), families break bread with 'Doro Wat'—a rich chicken stew with 12 pieces of chicken representing the 12 apostles.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 text-center max-w-2xl mx-auto border-amber-500/30 bg-amber-50/50">
        <h3 className="text-2xl font-serif text-amber-800 mb-6 font-bold">Receive a Genna Blessing</h3>
        <button
          onClick={requestBlessing}
          disabled={loading}
          className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-bold transition-all shadow-xl hover:shadow-amber-700/20 disabled:opacity-50"
        >
          {loading ? 'Chanting...' : 'Invoke Blessing'}
        </button>
        {blessing && (
          <div className="mt-8 p-6 bg-white rounded-xl border border-amber-100 text-stone-900 font-serif italic animate-fadeIn leading-loose whitespace-pre-wrap shadow-inner font-medium">
            {blessing}
          </div>
        )}
      </div>
    </div>
  );
};

export default GennaCelebration;
