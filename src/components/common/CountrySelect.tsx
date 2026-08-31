import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, CountryCode } from '../../data/countries';
import { ChevronDown, Search, Check } from 'lucide-react';

interface CountrySelectProps {
  value: string;
  onChange: (countryName: string) => void;
  label?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  label = 'COUNTRY / TERRITORY *',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.name.toLowerCase() === value.toLowerCase()) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="space-y-1.5 relative select-none">
      {label && (
        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="link"
        className="w-full bg-surface border border-border hover:border-foreground/40 p-3 text-xs font-mono text-foreground flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center space-x-2.5 truncate">
          <span className="text-sm">{selectedCountry.flag}</span>
          <span className="uppercase font-medium">{selectedCountry.name}</span>
          <span className="text-[10px] text-muted font-normal">({selectedCountry.code})</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
        />
      </button>

      {/* Custom Theme Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface border border-border-strong shadow-2xl p-2 max-h-64 overflow-y-auto space-y-1">
          {/* Search box inside dropdown */}
          <div className="relative mb-2 px-1">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH COUNTRY..."
              className="w-full bg-background border border-border p-2 text-[11px] font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground uppercase"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute right-3 top-2.5" />
          </div>

          {/* List items */}
          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {filteredCountries.map((c) => {
              const isSelected = c.name === selectedCountry.name;
              return (
                <button
                  type="button"
                  key={c.code}
                  onClick={() => {
                    onChange(c.name);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full p-2 text-xs font-mono flex items-center justify-between transition-colors text-left ${
                    isSelected
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-foreground hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span>{c.flag}</span>
                    <span className="uppercase">{c.name}</span>
                    <span className="text-[10px] opacity-70">({c.dialCode})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
