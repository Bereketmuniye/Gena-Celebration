
import React, { useState } from 'react';
import { generateEthiopianVisual } from '../services/gemini';

const Visualizer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    "A sunset over the Simien Mountains with Gelada baboons",
    "A beautiful woman in traditional Habesha Kemis garment",
    "The rock-hewn church of Lalibela under a starry sky",
    "A vibrant Addis Ababa street market at night",
    "An ancient gold crown of an Aksumite King"
  ];

  const handleGenerate = async (p?: string) => {
    const activePrompt = p || prompt;
    if (!activePrompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setImage(null);
    try {
      const url = await generateEthiopianVisual(activePrompt);
      setImage(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="glass-card p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-serif text-amber-400 mb-4">Visions of Abyssinia</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => handleGenerate(p)}
              className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-full border border-stone-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision..."
            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? 'Painting...' : 'Visualize'}
          </button>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-400 font-medium">Manifesting Abyssinian Charisma...</p>
          </div>
        ) : image ? (
          <img src={image} alt="Generated Ethiopian Vision" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-12">
            <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-700">
              <svg className="w-10 h-10 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-stone-300 font-serif text-lg">Your Canvas Awaits</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto">Enter a description or choose a preset to generate breathtaking Ethiopian artwork.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
