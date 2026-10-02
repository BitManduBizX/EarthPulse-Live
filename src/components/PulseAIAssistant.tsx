import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Trash2,
  HelpCircle,
  Camera,
  Cpu,
  ShieldCheck,
  Minimize2,
  Maximize2,
  Bot,
  User,
} from 'lucide-react';
import { ChatMessage } from '../types/camera';
import { Translations } from '../utils/translations';
import { askPulseAI } from '../services/aiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
  onSearchTrigger?: (query: string) => void;
}

export const PulseAIAssistant: React.FC<Props> = ({
  isOpen,
  onClose,
  t,
  onSearchTrigger,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 **Greetings! I am Pulse AI**, your environment-aware camera and virtual exploration guide.\n\nAsk me about:\n• **Live Cameras**: *'Find beach feeds in Brazil'* or *'Show me Tokyo feeds'*\n• **Hardware & Optics**: *'Compare Axis vs Sony IP sensors'*\n• **Protocols**: *'Explain RTSP & ONVIF streaming'*\n• **Forensics**: *'What is CCTV enhancement software?'*",
      timestamp: 'Online',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Show me live feeds in Tokyo',
    'Find beach cams in Brazil',
    'What is CCTV enhancement software?',
    'Explain RTSP & ONVIF protocols',
    'Compare Axis vs Sony cameras',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // If query looks like a search command, also trigger global filter if available
    if (onSearchTrigger) {
      if (query.toLowerCase().includes('tokyo')) onSearchTrigger('Tokyo');
      if (query.toLowerCase().includes('beach')) onSearchTrigger('Beach');
      if (query.toLowerCase().includes('brazil')) onSearchTrigger('Brazil');
    }

    try {
      const result = await askPulseAI(query);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: result.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `🌐 **Pulse AI Technical Dispatch**\n\nYour query *"${query}"* was processed through the EarthPulse local knowledge hub.\n\n• **Hardware tip**: Axis and Sony network cameras deliver the highest dynamic range (HDR) for fluctuating outdoor daylight.\n• **Stream Latency**: WebRTC feeds maintain <200ms latency, while HLS segments buffer 2-6s for stability.\n• **Search**: You can use the search bar above to filter feeds across 120+ countries instantly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Chat history cleared. How may I assist your virtual exploration or technical camera setup?',
        timestamp: 'Reset',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <div
        className={`bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${
          isMinimized
            ? 'w-72 h-14'
            : 'w-[92vw] sm:w-[420px] lg:w-[460px] h-[580px] max-h-[85vh]'
        }`}
      >
        {/* Assistant Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">Pulse AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                OPTICAL & GEOGRAPHIC INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear Chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isUser
                          ? 'bg-slate-900 text-white'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </div>
                      <div
                        className={`text-[9px] font-mono flex items-center justify-between pt-1 ${
                          isUser ? 'text-slate-400' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.source && (
                          <span className="text-emerald-600 font-semibold">{msg.source}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-3 border border-slate-200 shadow-xs text-xs text-slate-500 font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Querying EarthPulse Camera Grid...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar shrink-0">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[11px] whitespace-nowrap transition-colors border border-slate-200/80 cursor-pointer font-medium shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={t.aiAssistantPlaceholder}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 text-xs text-slate-900 placeholder:text-slate-600 border border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
