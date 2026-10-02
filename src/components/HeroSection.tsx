import React from 'react';
import {
  Compass,
  Radio,
  MapPin,
  Flame,
  Clock,
  Sparkles,
  Camera,
  Layers,
  Plane,
  Waves,
  Car,
  Globe2,
  TreePine,
  Building,
  Monitor,
} from 'lucide-react';
import { CameraCategory } from '../types/camera';
import { Translations } from '../utils/translations';

interface Props {
  t: Translations;
  selectedCategory: CameraCategory;
  onSelectCategory: (cat: CameraCategory) => void;
  selectedFilter: 'all' | 'popular' | 'new';
  onSelectFilter: (filter: 'all' | 'popular' | 'new') => void;
  selectedManufacturer: string;
  onSelectManufacturer: (m: string) => void;
  onExploreClick: () => void;
  totalFilteredCount: number;
}

export const HeroSection: React.FC<Props> = ({
  t,
  selectedCategory,
  onSelectCategory,
  selectedFilter,
  onSelectFilter,
  selectedManufacturer,
  onSelectManufacturer,
  onExploreClick,
  totalFilteredCount,
}) => {
  const categories: { id: CameraCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t.filterAll, icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'street', label: t.categoryStreet, icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'traffic', label: t.categoryTraffic, icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'beach', label: t.categoryBeach, icon: <Waves className="w-3.5 h-3.5" /> },
    { id: 'earth_space', label: t.categoryEarth, icon: <Globe2 className="w-3.5 h-3.5" /> },
    { id: 'airports', label: t.categoryAirports, icon: <Plane className="w-3.5 h-3.5" /> },
    { id: 'wildlife', label: t.categoryWildlife, icon: <TreePine className="w-3.5 h-3.5" /> },
    { id: 'monuments', label: t.categoryMonuments, icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'road', label: t.categoryRoad, icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'office', label: t.categoryOffice, icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  const manufacturers = ['All Hardware', 'Axis', 'Sony', 'Panasonic', 'Hikvision', 'Dahua', 'TP-Link', 'Linksys'];

  return (
    <div className="relative border-b border-slate-200/80 bg-matrix-grid overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Top Ticker Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-emerald-500/30 shadow-xs text-xs font-mono text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-emerald-700">{t.totalFeeds}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">{t.activeNow}</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-emerald-700 font-medium hidden sm:inline">100% Free & No Account</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Launch Virtual Explorer Modes</span>
            </button>
          </div>
        </div>

        {/* Main Hero Title */}
        <div className="max-w-4xl space-y-3 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            The World’s Public Streams,{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
              Live & Unfiltered.
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
            Stream high-definition public webcams, traffic arteries, coastal surf breaks, airport runways, and architectural monuments across 120+ countries. Zero tracking, privacy-blurred ISP coordinates, and environment-aware optics.
          </p>
        </div>

        {/* Filter Pills / Categories */}
        <div className="space-y-3 pt-2">
          {/* Main Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-emerald-400 border-slate-900 shadow-md shadow-slate-900/10'
                      : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Row: Popular / Newly Added & Hardware Manufacturer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-600 font-medium">SORT:</span>
              <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => onSelectFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Feeds
                </button>
                <button
                  onClick={() => onSelectFilter('popular')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    selectedFilter === 'popular'
                      ? 'bg-amber-50 text-amber-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-500" />
                  {t.filterPopular}
                </button>
                <button
                  onClick={() => onSelectFilter('new')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    selectedFilter === 'new'
                      ? 'bg-sky-50 text-sky-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3 h-3 text-sky-500" />
                  {t.filterNew}
                </button>
              </div>
            </div>

            {/* Hardware Manufacturer Quick Select */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-mono text-slate-600 font-medium shrink-0">OPTICS:</span>
              <div className="flex items-center gap-1">
                {manufacturers.map((m) => {
                  const isMatch = (m === 'All Hardware' && !selectedManufacturer) || selectedManufacturer === m;
                  return (
                    <button
                      key={m}
                      onClick={() => onSelectManufacturer(m === 'All Hardware' ? '' : m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                        isMatch
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : 'bg-white/80 hover:bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
