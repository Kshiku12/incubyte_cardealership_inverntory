import React, { useState, useRef, useEffect } from 'react';
import type { Vehicle } from '../types';
import { sendChatMessage } from '../services/api';
import { Sparkles, Send, Bot, User as UserIcon, Zap, ShoppingCart } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  vehicles?: Vehicle[];
  timestamp: string;
}

interface AiConciergeProps {
  onOpenVehicleDetails: (v: Vehicle) => void;
  onPurchase: (v: Vehicle) => void;
}

const PROMPT_SUGGESTIONS = [
  'I want an ultra fast electric sports car with sub-2 second acceleration',
  'What is the most luxurious and spacious SUV for family travel?',
  'What financing rates and lease programs are currently available?',
  'How do VIP showroom test drives work?'
];

export const AiConcierge: React.FC<AiConciergeProps> = ({ onOpenVehicleDetails, onPurchase }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Greetings. I am your Aura Motors AI Concierge. Describe the vehicle of your dreams, inquire about telemetry and performance, or explore our curated showroom fleet. How may I assist your automotive journey today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.response,
        vehicles: data.suggestedVehicles,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Apologies, I encountered an issue connecting to the showroom telemetry. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-luxury-electric" />
          Autonomous Automotive Concierge
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
          Showroom AI Assistant
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Describe the driving characteristics, power output, or styling of your dream car. 
          Our AI matches your aspirations directly to live inventory.
        </p>
      </div>

      {/* Main Chat Box */}
      <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3.5 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isUser
                      ? 'bg-luxury-gold text-black'
                      : 'bg-dark-800 border border-white/10 text-luxury-electric'
                  }`}
                >
                  {isUser ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-yellow-700/80 to-luxury-gold/80 text-white rounded-tr-none shadow-lg'
                        : 'bg-dark-900/90 text-slate-200 border border-white/10 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span className="block text-[10px] text-slate-400 text-right mt-1.5">
                      {m.timestamp}
                    </span>
                  </div>

                  {/* If assistant returned suggested vehicles */}
                  {m.vehicles && m.vehicles.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-bold text-luxury-gold uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-luxury-electric" />
                        Matched Vehicles from Showroom Catalog:
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {m.vehicles.map((v) => {
                          const isOutOfStock = v.quantity <= 0;
                          return (
                            <div
                              key={v.id || (v as any)._id}
                              className="glass-card rounded-xl p-3 border border-white/10 flex flex-col justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={v.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'}
                                  alt={v.model}
                                  className="w-16 h-12 object-cover rounded-lg shrink-0"
                                />
                                <div>
                                  <div className="text-[10px] font-bold text-luxury-gold uppercase">
                                    {v.make}
                                  </div>
                                  <div className="text-xs font-bold text-white truncate max-w-[150px]">
                                    {v.model}
                                  </div>
                                  <div className="text-xs font-extrabold text-white">
                                    ${v.price.toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2">
                                <button
                                  onClick={() => onOpenVehicleDetails(v)}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-dark-800 text-[11px] font-semibold text-slate-200 hover:text-white hover:bg-dark-700 transition"
                                >
                                  View Specs
                                </button>
                                <button
                                  onClick={() => onPurchase(v)}
                                  disabled={isOutOfStock}
                                  className={`py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                                    isOutOfStock
                                      ? 'bg-dark-800 text-slate-500 cursor-not-allowed'
                                      : 'bg-luxury-gold text-black hover:bg-yellow-500'
                                  }`}
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                  {isOutOfStock ? 'Sold Out' : 'Purchase'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-9 h-9 rounded-xl bg-dark-800 border border-white/10 text-luxury-electric flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-dark-900/90 border border-white/10 flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">Analyzing showroom telemetry and match criteria...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-6 py-2.5 bg-dark-950/60 border-t border-white/5 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="text-xs text-slate-300 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 whitespace-nowrap transition disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-dark-950 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about our vehicles, performance, or describe your dream car..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-dark-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-luxury-gold transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-luxury-gold to-yellow-600 text-black hover:brightness-110 disabled:opacity-50 transition shadow-lg shadow-luxury-gold/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
