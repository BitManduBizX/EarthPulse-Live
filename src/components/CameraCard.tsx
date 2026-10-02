import React, { useState } from 'react';
import {
  Bookmark,
  Share2,
  Camera,
  Maximize2,
  Radio,
  Eye,
  Thermometer,
  ShieldCheck,
  Check,
  Wifi,
} from 'lucide-react';
import { CameraFeed } from '../types/camera';
import { Translations } from '../utils/translations';

interface Props {
  camera: CameraFeed;
  t: Translations;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenModal: (camera: CameraFeed) => void;
  onTakeSnapshot: (camera: CameraFeed) => void;
}

export const CameraCard: React.FC<Props> = ({
  camera,
  t,
  isBookmarked,
  onToggleBookmark,
  onOpenModal,
  onTakeSnapshot,
}) => {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href.split('?')[0] + `?cam=${camera.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(camera.id);
  };

  const handleSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTakeSnapshot(camera);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative">
      {/* Top Stream Thumbnail / Player Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer">
        {isPlayingInline ? (
          <iframe
            src={camera.streamUrl}
            title={camera.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            onClick={() => onOpenModal(camera)}
            className="w-full h-full relative"
          >
            <img
              src={camera.thumbnail}
              alt={camera.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Subtle Scanline Overlay */}
            <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Click to expand hover hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="px-3.5 py-1.5 rounded-xl bg-black/80 text-white font-mono text-xs font-bold border border-white/20 flex items-center gap-1.5 backdrop-blur-md shadow-lg transform group-hover:scale-100 scale-95 transition-transform">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Launch Stream Viewer</span>
              </span>
            </div>
          </div>
        )}

        {/* Live Badge (Red Pulse) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          <div className="px-2.5 py-0.5 rounded-md bg-red-600/90 backdrop-blur-md text-white font-mono text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{t.liveBadge}</span>
          </div>

          <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/30">
            {camera.fps} FPS
          </div>
        </div>

        {/* Resolution & Weather Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 pointer-events-none">
          {camera.temperature && (
            <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 font-mono text-[10px] font-medium border border-white/10 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" />
              <span>{camera.temperature}</span>
            </div>
          )}
          <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-200 font-mono text-[10px] font-medium border border-white/10">
            {camera.resolution.includes('4K') ? '4K UHD' : 'HD 1080p'}
          </div>
        </div>

        {/* Bottom Bar inside stream preview */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-mono pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{camera.flag}</span>
            <span className="font-bold truncate max-w-[150px] drop-shadow-md">
              {camera.city}, {camera.country}
            </span>
          </div>
          <div className="text-slate-300 drop-shadow-md text-[10px]">
            {camera.timezone}
          </div>
        </div>
      </div>

      {/* Card Details & Actions */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              {camera.manufacturer} • {camera.model.split(' ')[1] || camera.manufacturer}
            </span>
            <span className="text-slate-600 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(camera.viewsCount / 1000).toFixed(1)}k
            </span>
          </div>

          <h3
            onClick={() => onOpenModal(camera)}
            className="text-sm md:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer"
            title={camera.title}
          >
            {camera.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {camera.description}
          </p>

          {/* ISP Node information (blurred coordinate protocol) */}
          <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-slate-600">
            <Wifi className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">ISP: {camera.ispRegion}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <button
            onClick={() => onOpenModal(camera)}
            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.watchLive}</span>
          </button>

          <button
            onClick={handleSnapshot}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title={t.snapshot}
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : t.bookmark}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer relative"
            title={t.share}
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
