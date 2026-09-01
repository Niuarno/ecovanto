import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, ArrowRight } from 'lucide-react';

export const OrdersLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { orders, getOrderByNumber } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!query.trim()) return;

    const matched = getOrderByNumber(query.trim());
    if (matched) {
      navigate(`/orders/${matched.id}`);
    } else {
      setError(`No order found matching "${query.trim().toUpperCase()}". Check your reference code.`);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-24 text-foreground select-none transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="pb-8 border-b border-border">
          <span className="text-[10px] font-mono tracking-[0.25em] text-muted uppercase block mb-2">
            CLIENT SERVICES
          </span>
          <h1 className="text-3xl sm:text-5xl font-light font-display tracking-[0.15em] uppercase text-foreground">
            ORDER & DISPATCH LOOKUP
          </h1>
        </div>

        {/* Search Box */}
        <div className="p-8 bg-surface border border-border space-y-6">
          <span className="text-xs font-mono tracking-widest uppercase text-foreground block">
            TRACK BY ORDER REFERENCE CODE
          </span>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.G. ECO-94821"
              className="flex-1 bg-background border border-border p-3.5 text-xs font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground uppercase"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 font-semibold"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH ORDER</span>
            </button>
          </form>

          {error && (
            <p className="text-xs font-mono text-red-400">{error}</p>
          )}
        </div>

        {/* Session Orders List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-mono text-muted">
            <span className="uppercase tracking-widest">RECENT ORDERS ON THIS DEVICE [{orders.length}]</span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <Link
                key={ord.id}
                to={`/orders/${ord.id}`}
                className="group block p-6 bg-surface border border-border hover:border-border-strong transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono uppercase text-foreground font-medium">
                        ORDER #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 bg-surface-subtle text-foreground uppercase border border-border">
                        {ord.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-muted">
                      {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} garments • €{ord.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-foreground group-hover:underline">
                    <span>VIEW DETAILS & TRACKING</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
