
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
    <div className="flex flex-col h-[600px] md:h-full glass-card rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 md:p-6 bg-stone-100/80 border-b border-stone-200 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-serif text-stone-900 font-bold">The Chronicler's Study</h2>
        <div className="flex space-x-1">
          <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-emerald-600"></div>
          <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-600"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed font-medium ${m.role === 'user'
              ? 'bg-amber-700 text-white shadow-lg'
              : 'bg-stone-100 text-stone-950 border border-stone-200'
              }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 p-3 md:p-4 rounded-2xl border border-stone-200 animate-pulse text-stone-700 font-bold text-xs md:text-sm">
              Channelling history...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-stone-50/50 border-t border-stone-200">
        <div className="flex space-x-2 md:space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about coffee, kings..."
            className="flex-1 bg-white border border-stone-300 rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-amber-600/50 transition-all text-xs md:text-sm text-stone-950 font-medium placeholder:text-stone-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all shadow-lg text-xs md:text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CultureChat;
