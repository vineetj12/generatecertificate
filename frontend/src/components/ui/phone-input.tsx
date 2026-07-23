'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface Country {
  name: string;
  code: string; // dial code e.g. "+91"
  flag: string; // emoji flag
  iso: string;  // ISO 2-letter code
}

export const COUNTRIES: Country[] = [
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫', iso: 'AF' },
  { name: 'Albania', code: '+355', flag: '🇦🇱', iso: 'AL' },
  { name: 'Algeria', code: '+213', flag: '🇩🇿', iso: 'DZ' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷', iso: 'AR' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', iso: 'AU' },
  { name: 'Austria', code: '+43', flag: '🇦🇹', iso: 'AT' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩', iso: 'BD' },
  { name: 'Belgium', code: '+32', flag: '🇧🇪', iso: 'BE' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷', iso: 'BR' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', iso: 'CA' },
  { name: 'Chile', code: '+56', flag: '🇨🇱', iso: 'CL' },
  { name: 'China', code: '+86', flag: '🇨🇳', iso: 'CN' },
  { name: 'Colombia', code: '+57', flag: '🇨🇴', iso: 'CO' },
  { name: 'Croatia', code: '+385', flag: '🇭🇷', iso: 'HR' },
  { name: 'Czech Republic', code: '+420', flag: '🇨🇿', iso: 'CZ' },
  { name: 'Denmark', code: '+45', flag: '🇩🇰', iso: 'DK' },
  { name: 'Egypt', code: '+20', flag: '🇪🇬', iso: 'EG' },
  { name: 'Ethiopia', code: '+251', flag: '🇪🇹', iso: 'ET' },
  { name: 'Finland', code: '+358', flag: '🇫🇮', iso: 'FI' },
  { name: 'France', code: '+33', flag: '🇫🇷', iso: 'FR' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', iso: 'DE' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭', iso: 'GH' },
  { name: 'Greece', code: '+30', flag: '🇬🇷', iso: 'GR' },
  { name: 'Hungary', code: '+36', flag: '🇭🇺', iso: 'HU' },
  { name: 'India', code: '+91', flag: '🇮🇳', iso: 'IN' },
  { name: 'Indonesia', code: '+62', flag: '🇮🇩', iso: 'ID' },
  { name: 'Iran', code: '+98', flag: '🇮🇷', iso: 'IR' },
  { name: 'Iraq', code: '+964', flag: '🇮🇶', iso: 'IQ' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪', iso: 'IE' },
  { name: 'Israel', code: '+972', flag: '🇮🇱', iso: 'IL' },
  { name: 'Italy', code: '+39', flag: '🇮🇹', iso: 'IT' },
  { name: 'Japan', code: '+81', flag: '🇯🇵', iso: 'JP' },
  { name: 'Jordan', code: '+962', flag: '🇯🇴', iso: 'JO' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪', iso: 'KE' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾', iso: 'MY' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽', iso: 'MX' },
  { name: 'Morocco', code: '+212', flag: '🇲🇦', iso: 'MA' },
  { name: 'Myanmar', code: '+95', flag: '🇲🇲', iso: 'MM' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵', iso: 'NP' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', iso: 'NL' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿', iso: 'NZ' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', iso: 'NG' },
  { name: 'Norway', code: '+47', flag: '🇳🇴', iso: 'NO' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', iso: 'PK' },
  { name: 'Peru', code: '+51', flag: '🇵🇪', iso: 'PE' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭', iso: 'PH' },
  { name: 'Poland', code: '+48', flag: '🇵🇱', iso: 'PL' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹', iso: 'PT' },
  { name: 'Romania', code: '+40', flag: '🇷🇴', iso: 'RO' },
  { name: 'Russia', code: '+7', flag: '🇷🇺', iso: 'RU' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', iso: 'SA' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', iso: 'SG' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', iso: 'ZA' },
  { name: 'South Korea', code: '+82', flag: '🇰🇷', iso: 'KR' },
  { name: 'Spain', code: '+34', flag: '🇪🇸', iso: 'ES' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰', iso: 'LK' },
  { name: 'Sudan', code: '+249', flag: '🇸🇩', iso: 'SD' },
  { name: 'Sweden', code: '+46', flag: '🇸🇪', iso: 'SE' },
  { name: 'Switzerland', code: '+41', flag: '🇨🇭', iso: 'CH' },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿', iso: 'TZ' },
  { name: 'Thailand', code: '+66', flag: '🇹🇭', iso: 'TH' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷', iso: 'TR' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬', iso: 'UG' },
  { name: 'Ukraine', code: '+380', flag: '🇺🇦', iso: 'UA' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', iso: 'AE' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', iso: 'GB' },
  { name: 'United States', code: '+1', flag: '🇺🇸', iso: 'US' },
  { name: 'Vietnam', code: '+84', flag: '🇻🇳', iso: 'VN' },
  { name: 'Yemen', code: '+967', flag: '🇾🇪', iso: 'YE' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼', iso: 'ZW' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Default ISO country code to pre-select (e.g. "IN") */
  defaultCountry?: string;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = '0000 000 000',
  className = '',
  inputClassName = '',
  defaultCountry = 'IN',
}: PhoneInputProps) {
  const defaultC = COUNTRIES.find((c) => c.iso === defaultCountry) || COUNTRIES.find((c) => c.iso === 'IN')!;

  // Parse existing value to extract dial code + number
  const parseValue = (val: string): { country: Country; number: string } => {
    if (!val) return { country: defaultC, number: '' };
    for (const c of [...COUNTRIES].sort((a, b) => b.code.length - a.code.length)) {
      if (val.startsWith(c.code)) {
        return { country: c, number: val.slice(c.code.length).trimStart() };
      }
    }
    return { country: defaultC, number: val };
  };

  const parsed = parseValue(value);
  const [selectedCountry, setSelectedCountry] = useState<Country>(parsed.country);
  const [numberPart, setNumberPart] = useState(parsed.number);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearch('');
    const combined = numberPart ? `${country.code} ${numberPart}` : '';
    onChange(combined);
  };

  const handleNumberChange = (num: string) => {
    setNumberPart(num);
    const combined = num ? `${selectedCountry.code} ${num}` : '';
    onChange(combined);
  };

  return (
    <div className={`relative flex gap-0 ${className}`} ref={dropdownRef}>
      {/* Country Selector Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 h-11 rounded-l-xl border border-white/10 bg-white/[0.04] text-white text-sm hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shrink-0 min-w-[90px]"
      >
        <span className="text-base leading-none">{selectedCountry.flag}</span>
        <span className="text-slate-300 font-medium">{selectedCountry.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Number Input */}
      <input
        type="tel"
        value={numberPart}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 h-11 rounded-r-xl border border-l-0 border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 text-sm px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 ${inputClassName}`}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-72 rounded-xl border border-white/10 bg-[#1a1f2e] shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Scrollable List */}
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-4">No countries found</p>
            ) : (
              filtered.map((country) => (
                <button
                  key={`${country.iso}-${country.code}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-white/[0.06] transition-colors ${
                    selectedCountry.iso === country.iso && selectedCountry.code === country.code
                      ? 'bg-indigo-500/10 text-indigo-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-base leading-none shrink-0">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-slate-500 text-xs shrink-0">{country.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
