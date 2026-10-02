import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  Radio,
  Sparkles,
  Map,
  LayoutGrid,
  Bookmark,
  ShieldCheck,
  Compass,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { SupportedLanguage } from '../types/camera';
import { Translations } from '../utils/translations';

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeView: 'gallery' | 'map' | 'explore' | 'matrix_wall' | 'bookmarks';
  onViewChange: (view: 'gallery' | 'map' | 'explore' | 'matrix_wall' | 'bookmarks') => void;
  onToggleAi: () => void;
  aiOpen: boolean;
  t: Translations;
  bookmarkedCount: number;
  onOpenPrivacyModal: () => void;
}

const autoSuggestOptions = [
  { label: 'Tokyo, Japan', type: 'City', query: 'Tokyo' },
  { label: 'New York, US', type: 'City', query: 'New York' },
  { label: 'Venice, Italy', type: 'City', query: 'Venice' },
  { label: 'Rio de Janeiro, Brazil', type: 'City', query: 'Rio de Janeiro' },
  { label: 'Axis Communications', type: 'Manufacturer', query: 'Axis' },
  { label: 'Sony STARVIS Cameras', type: 'Manufacturer', query: 'Sony' },
  { label: 'Panasonic i-PRO', type: 'Manufacturer', query: 'Panasonic' },
  { label: 'Hikvision ColorVu', type: 'Manufacturer', query: 'Hikvision' },
  { label: 'Copacabana & Waikiki Beaches', type: 'Category', query: 'Beach' },
  { label: 'Airport Runways & Aprons', type: 'Category', query: 'Airport' },
  { label: 'International Space Station (ISS)', type: 'Special', query: 'ISS' },
  { label: 'Traffic & Highways', type: 'Category', query: 'Traffic' },
];

export const Header: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  currentLanguage,
  onLanguageChange,
  activeView,
  onViewChange,
  onToggleAi,
  aiOpen,
  t,
  bookmarkedCount,
  onOpenPrivacyModal,
}) => {
  const [showSuggest, setShowSuggest] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggest(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageLabels: Record<SupportedLanguage, { name: string; flag: string }> = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    ja: { name: '日本語', flag: '🇯🇵' },
    zh: { name: '中文', flag: '🇨🇳' },
  };

  const filteredSuggestions = searchQuery.trim()
    ? autoSuggestOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.query.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : autoSuggestOptions.slice(0, 6);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-3 md:gap-6">
          {/* Logo & Brand */}
          <div
            onClick={() => onViewChange('gallery')}
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform border border-emerald-500/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 relative z-10" />
              <div className="absolute inset-0 rounded-xl border border-emerald-400/40 pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  EarthPulse<span className="text-emerald-600 font-black">Live</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-mono tracking-wider hidden lg:block">
                GLOBAL PUBLIC SURVEILLANCE & VIRTUAL EXPLORATION
              </p>
            </div>
          </div>

          {/* Search Box with Auto-Suggest */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggest(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggest(true);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs md:text-sm text-slate-900 placeholder:text-slate-600 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Auto-suggest dropdown */}
            {showSuggest && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                <div className="text-[10px] font-mono text-slate-600 px-2.5 py-1 uppercase tracking-wider">
                  Quick Suggestions & Keywords
                </div>
                <div className="space-y-0.5">
                  {filteredSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSearchChange(item.query);
                        setShowSuggest(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs text-slate-800 transition-colors cursor-pointer group"
                    >
                      <span className="font-medium group-hover:text-emerald-700">{item.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
            {/* View Mode Buttons */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                onClick={() => onViewChange('gallery')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'gallery'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Feeds</span>
              </button>

              <button
                onClick={() => onViewChange('explore')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'explore'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>

              <button
                onClick={() => onViewChange('map')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'map'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>

              <button
                onClick={() => onViewChange('matrix_wall')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'matrix_wall'
                    ? 'bg-slate-900 text-emerald-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Watch 4 cameras in live Matrix Wall view"
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Matrix Wall</span>
              </button>
            </div>

            {/* Bookmarks Counter */}
            <button
              onClick={() => onViewChange(activeView === 'bookmarks' ? 'gallery' : 'bookmarks')}
              className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                activeView === 'bookmarks'
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Saved Webcams"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
                title="Switch Language"
              >
                <span className="text-sm">{languageLabels[currentLanguage].flag}</span>
                <span className="hidden xl:inline">{languageLabels[currentLanguage].name}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50 animate-in fade-in duration-100">
                {(Object.keys(languageLabels) as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                      currentLanguage === lang
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{languageLabels[lang].flag}</span>
                    <span>{languageLabels[lang].name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Modal trigger */}
            <button
              onClick={onOpenPrivacyModal}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer hidden md:flex"
              title="Privacy & Legal Protocols"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onToggleAi}
              className={`flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                aiOpen
                  ? 'bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Pulse AI</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 text-xs text-slate-900 placeholder:text-slate-600 outline-none"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="absolute right-3 text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
