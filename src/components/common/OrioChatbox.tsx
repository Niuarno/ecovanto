import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'orio' | 'user';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    link: string;
  };
}

export const OrioChatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'orio',
      text: "Greetings. I am Orio, the ATELIER ECOVANTO intelligence concierge. How may I assist you with garment sizing, couture materials, order dispatches, or Berlin showroom appointments today?",
      timestamp: 'JUST NOW',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How do corsets fit?',
    'What fabrics are used?',
    'Do you ship to my country?',
    'Berlin showroom address',
    'Discount code',
  ];

  const generateOrioResponse = (query: string): { text: string; quickAction?: { label: string; link: string } } => {
    const q = query.toLowerCase();

    if (q.includes('corset') || q.includes('size') || q.includes('fit') || q.includes('measure')) {
      return {
        text: "Our corsetry features medical-grade 12-spring-steel spiral boning engineered to contour between 4cm to 7cm at the natural waistline without restricting respiration. We suggest ordering your true waist measurement. If between sizes, size down for structured corsets.",
        quickAction: { label: 'OPEN SIZE SPECIFICATIONS', link: '/faq' },
      };
    }

    if (q.includes('fabric') || q.includes('material') || q.includes('wool') || q.includes('leather')) {
      return {
        text: "We source exclusively from heritage northern Italian and Austrian mills, salvaging deadstock virgin wools, cupro linings, high-twist viscose, and vegetable-tanned bridal leathers with raw edge architectural finishes.",
        quickAction: { label: 'READ ATELIER MANIFESTO', link: '/about' },
      };
    }

    if (q.includes('ship') || q.includes('delivery') || q.includes('transit') || q.includes('country') || q.includes('track')) {
      return {
        text: "All dispatches depart directly from our Berlin Kreuzberg atelier via DHL Express Carbon Neutral or UPS Express Saver. European orders arrive in 1-3 business days. Complimentary express delivery is applied automatically on acquisitions exceeding €500.",
        quickAction: { label: 'LOOKUP PARCEL DISPATCH', link: '/orders' },
      };
    }

    if (q.includes('appointment') || q.includes('berlin') || q.includes('showroom') || q.includes('visit') || q.includes('fitting')) {
      return {
        text: "The ECOVANTO showroom is located at Köpenicker Str. 124 in Berlin Kreuzberg. Private fittings and bespoke consultations are held Tuesday through Saturday by appointment.",
        quickAction: { label: 'SCHEDULE PRIVATE FITTING', link: '/contact' },
      };
    }

    if (q.includes('discount') || q.includes('voucher') || q.includes('code') || q.includes('offer')) {
      return {
        text: "Use inaugural private access voucher code 'ATELIER10' during checkout for 10% privilege deduction on the Autumn/Winter 2026 Archive.",
        quickAction: { label: 'BROWSE AUTUMN ARCHIVE', link: '/shop' },
      };
    }

    return {
      text: "Understood. The Berlin studio team has logged your inquiry. If you require specialized suiting tailoring, custom sizing, or press lookbooks, you may reach our human concierge directly at atelier@ecovanto.com.",
      quickAction: { label: 'TRANSMIT DIRECT INQUIRY', link: '/contact' },
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'JUST NOW',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateOrioResponse(query);
      const orioMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        sender: 'orio',
        text: responseData.text,
        timestamp: 'JUST NOW',
        quickAction: responseData.quickAction,
      };
      setMessages((prev) => [...prev, orioMsg]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <>
      {/* Floating Trigger Button (Compact on Mobile, Full on Desktop) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="link"
        className="fixed bottom-4 right-3 sm:right-6 z-40 px-3 sm:px-4 py-2 sm:py-3 bg-surface/90 border border-border hover:border-foreground shadow-2xl text-[10px] sm:text-xs font-mono text-foreground flex items-center space-x-1.5 sm:space-x-2.5 backdrop-blur-md transition-colors"
        aria-label="Open Orio AI Concierge"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="tracking-widest uppercase font-semibold">
          <span className="sm:hidden">ORIO // AI</span>
          <span className="hidden sm:inline">ORIO AI // CONCIERGE</span>
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-16 sm:bottom-20 right-2 sm:right-6 md:right-8 z-50 w-[95vw] sm:w-[420px] h-[520px] max-h-[82vh] bg-surface border border-border-strong shadow-2xl flex flex-col justify-between text-foreground select-none overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-3.5 sm:p-4 bg-surface-subtle border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 bg-foreground text-background flex items-center justify-center text-xs font-mono font-bold">
                  🐾
                </div>
                <div>
                  <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-foreground">
                    ORIO // ATELIER INTELLIGENCE
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 tracking-widest block">
                    ONLINE • BERLIN SHOWROOM AGENT
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-1"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-background text-xs font-mono">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[85%] p-3 sm:p-3.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-foreground text-background font-medium'
                        : 'bg-surface border border-border text-foreground'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.quickAction && (
                      <Link
                        to={msg.quickAction.link}
                        onClick={() => setIsOpen(false)}
                        className="mt-3 inline-flex items-center space-x-1.5 text-[10px] tracking-wider uppercase underline underline-offset-4 text-foreground font-semibold hover:opacity-80 block"
                      >
                        <span>{msg.quickAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  <span className="text-[8px] text-muted tracking-widest mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1.5 p-3 bg-surface border border-border w-16 text-muted text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-2 bg-surface border-t border-border overflow-x-auto no-scrollbar flex space-x-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 bg-surface-subtle hover:bg-foreground hover:text-background border border-border text-[10px] font-mono text-muted hover:text-background tracking-wider uppercase whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 sm:p-3 bg-surface border-t border-border flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ASK ORIO SIZING, FABRICS, TRANSIT..."
                className="flex-1 bg-background border border-border p-2 sm:p-2.5 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 sm:p-2.5 bg-foreground text-background hover:opacity-90 disabled:opacity-40 transition-opacity"
                aria-label="Send inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
