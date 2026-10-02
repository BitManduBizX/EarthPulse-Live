import React, { useState } from 'react';
import {
  X,
  Radio,
  Camera,
  Download,
  Share2,
  Bookmark,
  Thermometer,
  ShieldCheck,
  AlertOctagon,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Cpu,
  Wifi,
  Clock,
  Eye,
  Check,
} from 'lucide-react';
import { CameraFeed } from '../types/camera';
import { Translations } from '../utils/translations';

interface Props {
  camera: CameraFeed | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenTakedown: (cameraId: string) => void;
  t: Translations;
}

export const CameraModal: React.FC<Props> = ({
  camera,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenTakedown,
  t,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  if (!camera) return null;

  const handleCopyShare = () => {
    const url = window.location.href.split('?')[0] + `?cam=${camera.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadSnapshot = () => {
    setIsSnapshotting(true);
    // Render a high-res canvas snapshot with camera metadata and EarthPulse watermark
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsSnapshotting(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = camera.thumbnail;
    img.onload = () => {
      // Draw background frame
      ctx.drawImage(img, 0, 0, 1280, 720);

      // Add dark gradient header & footer for HUD
      const gradBottom = ctx.createLinearGradient(0, 580, 0, 720);
      gradBottom.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradBottom.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = gradBottom;
      ctx.fillRect(0, 580, 1280, 140);

      const gradTop = ctx.createLinearGradient(0, 0, 0, 100);
      gradTop.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, 1280, 100);

      // Watermark Branding
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('● EARTHPULSE LIVE', 32, 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px monospace';
      ctx.fillText(`STREAM ID: ${camera.id.toUpperCase()}`, 300, 48);

      // Camera title & timestamp footer
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`${camera.city}, ${camera.country} — ${camera.title}`, 32, 660);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '16px monospace';
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      ctx.fillText(`CAPTURE: ${timestamp} | MODEL: ${camera.model} | ISP: ${camera.ispRegion}`, 32, 692);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `earthpulse-${camera.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsSnapshotting(false);
      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 3000);
    };

    img.onerror = () => {
      setIsSnapshotting(false);
      alert('Unable to capture frame due to cross-origin media headers. Try another camera.');
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white font-mono text-xs font-black tracking-widest flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>LIVE FEED</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {camera.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{camera.flag} {camera.city}, {camera.country}</span>
                <span>•</span>
                <span className="text-emerald-400">{camera.timezone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(camera.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Bookmark Feed"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Share Stream"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Area with Zoom Controls */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          <div
            className="w-full h-full transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <iframe
              src={`${camera.streamUrl}${isMuted ? '&mute=1' : '&mute=0'}`}
              title={camera.title}
              className="w-full h-full border-0 pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Matrix HUD Overlay Elements */}
          <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FPS: {camera.fps} // 1080p60</span>
            </div>
            {camera.temperature && (
              <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-mono font-medium hidden sm:flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>{camera.temperature} ({camera.weather})</span>
              </div>
            )}
          </div>

          {/* Floating Player Utility Toolbar */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
            {/* Zoom Controls */}
            <div className="flex items-center bg-black/80 backdrop-blur-md rounded-xl border border-slate-700 p-0.5 shadow-xl text-xs font-mono">
              <button
                onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                disabled={zoomLevel <= 1}
                className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-emerald-400">{zoomLevel.toFixed(1)}x</span>
              <button
                onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
                disabled={zoomLevel >= 2.5}
                className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded-lg text-slate-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-black/80 hover:bg-black text-slate-200 backdrop-blur-md border border-slate-700 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Snapshot Button */}
            <button
              onClick={handleDownloadSnapshot}
              disabled={isSnapshotting}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              title="Save Stamp with Watermark"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">
                {snapshotSuccess ? 'Snapshot Saved!' : isSnapshotting ? 'Capturing...' : 'Snapshot'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Technical Telemetry & Legal Accordion */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-mono bg-slate-900/90">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">OPTICAL SENSOR</span>
              <div className="font-bold text-slate-200 truncate">{camera.model}</div>
              <span className="text-emerald-400 text-[11px] block">{camera.manufacturer} Architecture</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">ISP ROUTING NODE</span>
              <div className="font-bold text-slate-200 truncate">{camera.ispRegion}</div>
              <span className="text-sky-400 text-[11px] block">Generalized Pop Subnet</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">STREAM SPECS</span>
              <div className="font-bold text-slate-200">{camera.resolution}</div>
              <span className="text-purple-400 text-[11px] block">{camera.fps} FPS // H.265 / WebRTC</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">AUDIENCE & ACCESS</span>
              <div className="font-bold text-slate-200">{(camera.viewsCount).toLocaleString()} Explorers</div>
              <span className="text-amber-400 text-[11px] block">Public Domain Stream</span>
            </div>
          </div>

          {/* Privacy Protocol & Takedown CTA */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Coordinates are intentionally generalized up to 200 miles to nearest ISP regional POP. Zero tracking is conducted.
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenTakedown(camera.id);
              }}
              className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer shrink-0"
            >
              Report Feed / Request Takedown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
