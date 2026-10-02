import React, { useState } from 'react';
import {
  Car,
  Footprints,
  Plane,
  Compass,
  Play,
  Volume2,
  VolumeX,
  Clock,
  Navigation,
  ShieldCheck,
  Maximize2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { ExploreTour, ExploreModeType } from '../types/camera';
import { exploreTours } from '../data/exploreTours';
import { Translations } from '../utils/translations';

interface Props {
  t: Translations;
  onSelectCameraModal?: (tourId: string) => void;
}

export const ExploreModesHub: React.FC<Props> = ({ t }) => {
  const [selectedMode, setSelectedMode] = useState<ExploreModeType>('driving');
  const [activeTour, setActiveTour] = useState<ExploreTour>(exploreTours[0]);
  const [isMuted, setIsMuted] = useState(true);

  const filteredTours = exploreTours.filter((tour) => tour.mode === selectedMode);

  const modeDefinitions = [
    {
      id: 'driving' as ExploreModeType,
      title: t.drivingTour,
      icon: <Car className="w-4 h-4" />,
      color: 'emerald',
      badge: 'URBAN VELOCITY',
      desc: 'Sunday drives through famous global cities. Focus on traffic dynamics, road layouts, and skyline architecture.',
    },
    {
      id: 'walking' as ExploreModeType,
      title: t.walkingTour,
      icon: <Footprints className="w-4 h-4" />,
      color: 'sky',
      badge: 'STREET LEVEL',
      desc: 'Street-level strolls across 50+ world capitals celebrating local food alleys, historical plazas, and culture.',
    },
    {
      id: 'flight' as ExploreModeType,
      title: t.aerialFlight,
      icon: <Plane className="w-4 h-4" />,
      color: 'purple',
      badge: 'HIGH ALTITUDE',
      desc: 'Aerial skyline perspectives highlighting geographic density, summit glaciers, and metropolitan prosperity.',
    },
    {
      id: 'monument' as ExploreModeType,
      title: t.monumentExplorer,
      icon: <Compass className="w-4 h-4" />,
      color: 'amber',
      badge: 'OPTICAL MACRO',
      desc: 'High-definition telephoto close-ups of world wonders, engineering suspension feats, and historic stonework.',
    },
  ];

  const currentModeInfo = modeDefinitions.find((m) => m.id === selectedMode)!;

  return (
    <div className="py-6 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Mode Switcher */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>VIRTUAL PERSPECTIVE SELECTOR</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.exploreModesTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl">
              {t.exploreModesDesc}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
            CURRENT STREAM: <strong className="text-slate-800 font-bold">{activeTour.title}</strong>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {modeDefinitions.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSelectedMode(mode.id);
                  const firstOfMode = exploreTours.find((t) => t.mode === mode.id);
                  if (firstOfMode) setActiveTour(firstOfMode);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                    }`}
                  >
                    {mode.icon}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>
                <h3
                  className={`font-bold text-sm md:text-base ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {mode.title}
                </h3>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {mode.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Tour Interactive Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Active Player (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-4">
          {/* Video Container */}
          <div className="relative aspect-video w-full bg-slate-950">
            <iframe
              src={`${activeTour.videoUrl}${isMuted ? '&mute=1' : '&mute=0'}`}
              title={activeTour.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Matrix HUD Overlay Badge */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>REC // {activeTour.quality}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-medium hidden sm:flex items-center gap-1">
                <span>{activeTour.flag}</span>
                <span>{activeTour.city}, {activeTour.country}</span>
              </div>
            </div>

            {/* Audio Toggle Control */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Tour Meta & Controls */}
          <div className="p-5 md:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{activeTour.flag}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">
                    {currentModeInfo.title}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">{activeTour.duration}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  {activeTour.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono font-bold border border-slate-200">
                  {activeTour.distanceOrAltitude}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeTour.description}
            </p>

            {/* Route Stops / Milestones */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                SURVEILLANCE & ROUTE WAYPOINTS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeTour.routeStops.map((stop, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center gap-2"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{stop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optics Rig & Highlights */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">OPTICS RIG:</span>
                <span className="text-slate-100">{activeTour.cameraModel}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Latency Video Pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tour Playlist in current mode (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              {currentModeInfo.title} Playlist ({filteredTours.length})
            </h4>
            <span className="text-[11px] text-emerald-600 font-mono font-semibold">Active Sector</span>
          </div>

          <div className="space-y-3">
            {filteredTours.map((tour) => {
              const isActive = activeTour.id === tour.id;
              return (
                <div
                  key={tour.id}
                  onClick={() => setActiveTour(tour)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 group ${
                    isActive
                      ? 'bg-emerald-50/80 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={tour.thumbnail}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold">
                      {tour.duration}
                    </div>
                    {isActive && (
                      <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{tour.flag}</span>
                      <span className="text-[11px] font-mono text-slate-500 truncate">
                        {tour.city}, {tour.country}
                      </span>
                    </div>
                    <h5
                      className={`text-xs md:text-sm font-bold line-clamp-2 ${
                        isActive ? 'text-emerald-950' : 'text-slate-900 group-hover:text-emerald-700'
                      }`}
                    >
                      {tour.title}
                    </h5>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 pt-0.5">
                      <span>{tour.distanceOrAltitude}</span>
                      <span>•</span>
                      <span>{tour.quality}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
