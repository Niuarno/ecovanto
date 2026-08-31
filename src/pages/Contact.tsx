import React, { useState } from 'react';
import { useUI } from '../context/UIContext';
import { ArrowRight, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const { showToast } = useUI();
  const [topic, setTopic] = useState('ORDERS');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const topics = [
    'ORDERS & TRACKING',
    'ATELIER APPOINTMENTS',
    'RETURNS & EXCHANGES',
    'PRESS & EDITORIAL',
    'COLLABORATION',
    'GENERAL INQUIRY',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitted(true);
    showToast({
      type: 'success',
      title: 'DISPATCH TRANSMITTED',
      message: 'The Berlin atelier team will review your inquiry within 24 hours.',
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-28 md:pt-36 pb-24 text-[#F4F4F0] select-none">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="pb-10 mb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#8A8A8A] uppercase block mb-2">
              DIRECT COMMUNICATIONS
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display tracking-[0.15em] uppercase text-white">
              CONTACT
            </h1>
          </div>
          <p className="text-xs md:text-sm font-light text-[#8A8A8A] max-w-md">
            For bespoke suiting commissions, showroom fittings, order dispatches, and press inquiries.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0E0E0E] p-8 md:p-12 border border-white/10">
            {isSubmitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-light font-display tracking-widest uppercase text-white">
                  INQUIRY RECORDED
                </h2>
                <p className="text-xs font-mono text-[#8A8A8A] max-w-md mx-auto leading-relaxed">
                  Thank you, {fullName || 'client'}. Your request regarding <span className="text-white">[{topic}]</span> has been logged. Our concierge will be in touch via {email}.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-6 py-3 border border-white/20 hover:border-white text-xs font-mono tracking-widest uppercase text-white transition-colors"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Topic Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                    INQUIRY TOPIC / REASON
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {topics.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`p-2.5 text-[10px] font-mono tracking-wider border transition-colors text-left truncate ${
                          topic === t
                            ? 'bg-white text-black border-white font-medium'
                            : 'border-white/15 text-[#8A8A8A] hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="E.G. CLARA MEYER"
                      className="w-full bg-black/60 border border-white/15 p-3 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="NAME@DOMAIN.COM"
                      className="w-full bg-black/60 border border-white/15 p-3 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                    TELEPHONE (OPTIONAL FOR SHOWROOM CALLS)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 (0) 30 123456"
                    className="w-full bg-black/60 border border-white/15 p-3 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                    MESSAGE / MEASUREMENTS / INQUIRY DETAILS
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ENTER YOUR CORRESPONDENCE HERE..."
                    className="w-full bg-black/60 border border-white/15 p-3 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#F4F4F0] hover:bg-white text-black font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 group"
                >
                  <span>SEND TRANSMISSION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

          {/* Showroom & Press Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-[#0E0E0E] border border-white/10 space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                BERLIN SHOWROOM & ATELIER
              </span>
              <h3 className="text-xl font-light font-display uppercase tracking-wider text-white">
                KREUZBERG QUARTER
              </h3>
              <p className="text-xs font-mono text-[#A0A09C] leading-relaxed">
                Köpenicker Str. 124 <br />
                10997 Berlin, Germany <br />
                T: +49 (0) 30 892 1045
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#8A8A8A]">
                OPENING HOURS: TUE – SAT, 12:00 – 19:00 <br />
                (BY APPOINTMENT ONLY)
              </div>
            </div>

            <div className="p-8 bg-[#0E0E0E] border border-white/10 space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#8A8A8A] uppercase block">
                DIRECT INBOXES
              </span>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8A8A8A]">CLIENT CONCIERGE:</span>
                  <a href="mailto:concierge@ecovanto.com" className="text-white hover:underline">
                    concierge@ecovanto.com
                  </a>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#8A8A8A]">EDITORIAL & PRESS:</span>
                  <a href="mailto:press@ecovanto.com" className="text-white hover:underline">
                    press@ecovanto.com
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">COMMISSIONS:</span>
                  <a href="mailto:atelier@ecovanto.com" className="text-white hover:underline">
                    atelier@ecovanto.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
