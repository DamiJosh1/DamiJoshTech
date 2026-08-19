import React, { useState, useContext, useRef, useEffect } from 'react';
import { StoreContext } from '../StoreContext';
import { Bot, User as UserIcon, Send, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../data';

const Ai = () => {
  const { isDarkMode, user } = useContext(StoreContext);
  const isAdmin = user?.email === 'damijosh12@gmail.com';
  
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string, actionUrl?: string, actionText?: string }[]>([
    { 
      role: 'ai', 
      content: isAdmin 
        ? `Welcome back, Admin ${user?.displayName?.split(' ')[0] || 'Dami'}! I'm your private Executive AI. I've prepared your business analytics and system tools. How can I assist you with store operations today?`
        : `Hello ${user?.displayName?.split(' ')[0] || 'there'}! I'm your AI shopping assistant. I can help you find products, compare features, or track your orders. What are you looking for today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userQuery,
          isAdmin,
          userName: user?.displayName?.split(' ')[0]
        }),
      });
      const data = await res.json();
      
      let aiResponse: { role: 'ai', content: string, actionUrl?: string, actionText?: string } = { role: 'ai' as const, content: data.text || 'I am sorry, I am having trouble connecting to my database right now.' };

      // Optional manual overrides for explicit store directions 
      const query = userQuery.toLowerCase();
      if (isAdmin && (query.includes('stats') || query.includes('sales'))) {
        aiResponse.actionUrl = "/admin";
        aiResponse.actionText = "View Full Dashboard";
      } else if (query.includes('drone')) {
        aiResponse.actionUrl = "/product/4";
        aiResponse.actionText = "View Drone";
      } else if (query.includes('headphone') || query.includes('audio') || query.includes('earbud')) {
        aiResponse.actionUrl = "/shop";
        aiResponse.actionText = "Shop Audio";
      } else if (query.includes('order') || query.includes('track')) {
        aiResponse.actionUrl = "/profile";
        aiResponse.actionText = "Go to My Account";
      }

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col h-full bg-transparent">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 text-purple-500 rounded-full mb-4 ring-1 ring-purple-500/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{isAdmin ? 'Executive AI System' : 'AI Shopping Assistant'}</h1>
          <p className={`${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Ask me anything about our products, recommendations, or your orders.</p>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col min-h-[400px] max-h-[600px] rounded-3xl border overflow-hidden shadow-2xl ${
          isDarkMode ? 'bg-zinc-900/80 border-white/10 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  msg.role === 'ai' 
                    ? 'bg-gradient-to-tr from-purple-600 to-blue-500 text-white' 
                    : (isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')
                }`}>
                  {msg.role === 'ai' ? <Bot size={20} /> : <UserIcon size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-sm'
                      : (isDarkMode ? 'bg-zinc-800/80 text-zinc-100 rounded-tl-sm ring-1 ring-white/5' : 'bg-slate-100 text-slate-800 rounded-tl-sm')
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  
                  {/* Action Button */}
                  {msg.actionUrl && msg.actionText && (
                    <Link 
                      to={msg.actionUrl}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 mt-1 text-sm font-medium rounded-full transition-all ${
                        isDarkMode 
                          ? 'bg-zinc-800 hover:bg-purple-600/20 hover:text-purple-400 text-zinc-300 ring-1 ring-white/10' 
                          : 'bg-white hover:bg-purple-50 hover:text-purple-600 text-slate-600 shadow-sm border border-slate-200'
                      }`}
                    >
                      <span>{msg.actionText}</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center shadow-sm">
                  <Bot size={20} />
                </div>
                <div className={`px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 ${isDarkMode ? 'bg-zinc-800/80 ring-1 ring-white/5' : 'bg-slate-100'}`}>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAdmin ? "Ask for analytics, manage inventory, or view reports..." : "Ask about a product, category, or your order..."}
                className={`w-full pl-6 pr-14 py-4 rounded-full outline-none transition-shadow ${
                  isDarkMode 
                    ? 'bg-zinc-950 border border-zinc-800 focus:border-purple-500/50 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500/20' 
                    : 'bg-slate-50 border border-slate-200 focus:border-purple-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/10'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
              </button>
            </form>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default Ai;
