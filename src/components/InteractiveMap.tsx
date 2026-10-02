import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CameraFeed } from '../types/camera';
import { Translations } from '../utils/translations';
import { MapPin, Radio, ShieldCheck } from 'lucide-react';

interface Props {
  cameras: CameraFeed[];
  onSelectCamera: (cam: CameraFeed) => void;
  t: Translations;
}

export const InteractiveMap: React.FC<Props> = ({ cameras, onSelectCamera, t }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered roughly globally
      const map = L.map(mapContainerRef.current, {
        center: [25, 10],
        zoom: 2.5,
        minZoom: 2,
        maxZoom: 12,
        attributionControl: false,
      });

      // CartoDB Positron / Cyber light style tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Create custom cyber pulse icon
    const createPulseIcon = (flag: string) => {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(16, 185, 129, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 26px; height: 26px; border-radius: 50%; background: #0f172a; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
              ${flag}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });
    };

    // Add markers for all valid cameras
    cameras.forEach((cam) => {
      const [lat, lng] = cam.approxCoords;
      if (lat === 0 && lng === 0) return; // skip orbit / ISS

      const marker = L.marker([lat, lng], {
        icon: createPulseIcon(cam.flag),
      }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 font-sans text-slate-900';
      popupContent.innerHTML = `
        <div style="width: 220px; font-family: sans-serif;">
          <div style="position: relative; border-radius: 8px; overflow: hidden; height: 110px; background: #000; margin-bottom: 8px;">
            <img src="${cam.thumbnail}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 6px; left: 6px; background: #ef4444; color: #fff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-family: monospace;">LIVE</div>
            <div style="position: absolute; bottom: 6px; left: 6px; color: #fff; font-size: 11px; font-weight: bold; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">${cam.city}, ${cam.country}</div>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; line-height: 1.3; margin-bottom: 4px;">${cam.title}</div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-bottom: 8px;">
            ${cam.manufacturer} • ${cam.resolution}
          </div>
          <button id="stream-btn-${cam.id}" style="width: 100%; background: #10b981; color: white; font-weight: 700; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            Open Live Stream
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`stream-btn-${cam.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectCamera(cam);
          };
        }
      });
    });

    return () => {
      // cleanup if component unmounts
    };
  }, [cameras, onSelectCamera]);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Interactive Surveillance Map</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
              {cameras.length} Active Nodes
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Geographic feed distribution. Click any pulsing node to view live street and skyline vantage.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ISP-Level Blur Enabled (Privacy Compliant)</span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 z-10">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
