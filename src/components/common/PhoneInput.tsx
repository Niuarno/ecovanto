import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, CountryCode } from '../../data/countries';
import { ChevronDown, Search } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (fullPhoneNumber: string) => void;
  label?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'PHONE (FOR COURIER NOTIFICATIONS) *',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]); // Germany +49 default
  const [localNumber, setLocalNumber] = useState(() => {
    // Strip default code if present
    if (value.startsWith('+')) {
      const parts = value.split(' ');
      return parts.slice(1).join(' ') || value;
    }
    return value;
  });
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value;
    setLocalNumber(num);
    onChange(`${selectedCountry.dialCode} ${num}`.trim());
  };

  const handleCountrySelect = (c: CountryCode) => {
    setSelectedCountry(c);
    setIsOpen(false);
    setSearch('');
    onChange(`${c.dialCode} ${localNumber}`.trim());
  };

  return (
    <div className="space-y-1.5 relative select-none">
      {label && (
        <label className="text-[10px] font-mono tracking-widest text-muted uppercase block">
          {label}
        </label>
      )}

      <div className="flex border border-border bg-surface focus-within:border-foreground transition-colors">
        {/* Country Dial Code Trigger */}
        <div ref={dropdownRef} className="relative border-r border-border">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-full px-3 py-3 text-xs font-mono text-foreground flex items-center space-x-1.5 hover:bg-surface-subtle transition-colors"
          >
            <span>{selectedCountry.flag}</span>
            <span className="font-semibold">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-3 h-3 text-muted" />
          </button>

          {/* Dial code Dropdown list */}
          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-surface border border-border-strong shadow-2xl p-2 max-h-60 overflow-y-auto space-y-1">
              <div className="relative mb-2 px-1">
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH DIAL CODE..."
                  className="w-full bg-background border border-border p-2 text-[11px] font-mono text-foreground placeholder-muted focus:outline-none focus:border-foreground uppercase"
                />
              </div>

              <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
                {filteredCountries.map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => handleCountrySelect(c)}
                    className="w-full p-1.5 text-xs font-mono flex items-center justify-between text-foreground hover:bg-surface-subtle text-left"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span>{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="text-muted font-semibold ml-2">{c.dialCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          type="tel"
          required={required}
          value={localNumber}
          onChange={handleNumberChange}
          placeholder="171 000000"
          className="flex-1 bg-transparent p-3 text-xs font-mono text-foreground placeholder-muted focus:outline-none"
        />
      </div>
    </div>
  );
};
