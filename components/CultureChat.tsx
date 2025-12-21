
import React, { useState, useRef, useEffect } from 'react';
import { getCulturalResponse } from '../services/gemini';
import { Message } from '../types';

const CultureChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Selam. I am the Chronicler of Abyssinia. What secrets of our ancient land shall we explore today? Perhaps the rock-hewn churches of Lalibela, or the pulsing rhythms of Ethio-jazz?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const reply = await getCulturalResponse(input, history);
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Forgive me, the spirits of the mountains are silent. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 bg-[#1c1917]/50 border-b border-stone-800 flex items-center justify-between">
        <h2 className="text-xl font-serif text-amber-400">The Chronicler's Study</h2>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-amber-600/20 text-amber-50 border border-amber-600/30' 
                : 'bg-stone-800/80 text-stone-200 border border-stone-700'
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 animate-pulse text-stone-400">
              Channelling history...
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-[#1c1917]/50 border-t border-stone-800">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about coffee, kings, or culture..."
            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-amber-600/20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CultureChat;
