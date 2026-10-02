import React from 'react';
import { ShieldCheck, AlertOctagon, Globe, Radio, Compass, Heart, ExternalLink } from 'lucide-react';
import { Translations } from '../utils/translations';

interface Props {
  t: Translations;
  onOpenPrivacy: () => void;
  onOpenTakedown: () => void;
  onSelectExploreMode: () => void;
  onSelectMatrixWall: () => void;
}

export const Footer: React.FC<Props> = ({
  t,
  onOpenPrivacy,
  onOpenTakedown,
  onSelectExploreMode,
  onSelectMatrixWall,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Manifesto (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                EarthPulse<span className="text-emerald-400">Live</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The world&apos;s largest free directory of live public webcams, urban traffic intersections, and virtual exploration routes. 100% free, privacy-blurred ISP geolocation, and uninhibited global perspective.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>14,280+ Active Synchronous Nodes Online</span>
            </div>
          </div>

          {/* Virtual Hub */}
          <div className="space-y-2.5">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              VIRTUAL HUB
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onSelectExploreMode}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Driving Urban Tours
                </button>
              </li>
              <li>
                <button
                  onClick={onSelectExploreMode}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Capital Walking Strolls
                </button>
              </li>
              <li>
                <button
                  onClick={onSelectExploreMode}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Aerial SkyCams & Flight
                </button>
              </li>
              <li>
                <button
                  onClick={onSelectExploreMode}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Monument Explorers
                </button>
              </li>
              <li>
                <button
                  onClick={onSelectMatrixWall}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-300 font-bold"
                >
                  Matrix Multi-Cam Wall
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2.5">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              ETHICS & PRIVACY
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Insecam Standards Notice</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTakedown}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 text-amber-300"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Submit Camera Takedown</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  ISP Coordinate Blurring
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Password Protection Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Hardware Ecosystem */}
          <div className="space-y-2.5">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              CAMERA OPTICS
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Indexed optical manufacturers: Axis Communications, Sony STARVIS, Panasonic i-PRO, Hikvision ColorVu, Dahua WizSense, TP-Link VIGI, Foscam, and Linksys.
            </p>
            <div className="pt-2 text-[10px] text-slate-600">
              RTSP • HLS • ONVIF Profile S/T • WebRTC
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <div>
            © {new Date().getFullYear()} EarthPulse Live. Open Access Public Video Directory. All coordinates intentionally offset to ISP gateway nodes for privacy.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacy} className="hover:text-slate-400 cursor-pointer">
              Privacy Protocols
            </button>
            <span>•</span>
            <button onClick={onOpenTakedown} className="hover:text-slate-400 cursor-pointer">
              Feed Removal
            </button>
            <span>•</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
