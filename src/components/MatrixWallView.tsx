import React, { useState } from 'react';
import { Radio, RefreshCw, Maximize2, Grid, Layers, Eye } from 'lucide-react';
import { CameraFeed } from '../types/camera';
import { Translations } from '../utils/translations';

interface Props {
  cameras: CameraFeed[];
  t: Translations;
  onSelectCamera: (cam: CameraFeed) => void;
}

export const MatrixWallView: React.FC<Props> = ({ cameras, t, onSelectCamera }) => {
  const [gridSize, setGridSize] = useState<4 | 6 | 9>(4);
  const [startIndex, setStartIndex] = useState(0);

  const displayedCameras = cameras.slice(startIndex, startIndex + gridSize);

  const handleNextPage = () => {
    const next = startIndex + gridSize;
    setStartIndex(next >= cameras.length ? 0 : next);
  };

  const gridClass =
    gridSize === 4
      ? 'grid-cols-1 sm:grid-cols-2'
      : gridSize === 6
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <span>Matrix Multi-Stream Video Wall</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                ACTIVE SYNCHRONOUS
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Simultaneous public surveillance stream grid. Zero buffering.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Grid Size Selectors */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs font-mono">
            <button
              onClick={() => setGridSize(4)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                gridSize === 4 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2x2 (4 Cams)
            </button>
            <button
              onClick={() => setGridSize(6)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                gridSize === 6 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3x2 (6 Cams)
            </button>
            <button
              onClick={() => setGridSize(9)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                gridSize === 9 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3x3 (9 Cams)
            </button>
          </div>

          <button
            onClick={handleNextPage}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cycle Feeds</span>
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className={`grid ${gridClass} gap-4`}>
        {displayedCameras.map((cam, idx) => (
          <div
            key={cam.id}
            className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group relative flex flex-col"
          >
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${cam.streamUrl}&mute=1`}
                title={cam.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* HUD Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                  CH-0{idx + 1} // {cam.manufacturer}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[9px] font-black">
                  LIVE
                </span>
              </div>

              <button
                onClick={() => onSelectCamera(cam)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Expand Single Feed"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/90 text-xs font-mono text-slate-300 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-1.5 truncate">
                <span>{cam.flag}</span>
                <span className="font-bold text-white truncate">{cam.city}</span>
                <span className="text-slate-500 truncate max-w-[120px]">— {cam.title}</span>
              </div>
              <span className="text-emerald-400 text-[10px] shrink-0 font-bold">{cam.timezone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
