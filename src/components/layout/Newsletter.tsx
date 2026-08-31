import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { ArrowRight, Check } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useUI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubscribed(true);
    showToast({
      type: 'success',
      title: 'DISPATCH GRANTED',
      message: '10% private code ATELIER10 sent to your email.',
    });
  };

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 border-t border-border bg-surface-subtle transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-3">
          MEMBERSHIP & ACCESS
        </span>
        <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] font-display text-foreground uppercase mb-4">
          SIGN UP
        </h2>
        <p className="text-xs md:text-sm font-light text-foreground-secondary max-w-md mx-auto mb-8 leading-relaxed">
          Sign up for the newsletter and receive 10% off your first purchase alongside early runway access and private capsule invitations.
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center space-x-2 py-3 px-6 bg-surface border border-border text-xs font-mono text-foreground">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>YOU ARE REGISTERED. CODE: ATELIER10</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center max-w-md mx-auto gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL"
              required
              className="w-full sm:flex-1 bg-background border border-border px-4 py-3.5 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              data-cursor="link"
              className="w-full sm:w-auto px-6 py-3.5 bg-foreground text-background text-xs font-mono tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 flex-shrink-0"
            >
              <span>SIGN UP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-6 text-[9px] font-mono text-muted tracking-wider uppercase">
          STRICTLY NO SPAM. UNSUBSCRIBE ANYTIME.
        </div>
      </div>
    </section>
  );
};
