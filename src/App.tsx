import React, { useState, useEffect, useMemo } from 'react';
import { CameraFeed, CameraCategory, SupportedLanguage } from './types/camera';
import { mockCameras } from './data/mockCameras';
import { translations } from './utils/translations';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CameraCard } from './components/CameraCard';
import { CameraModal } from './components/CameraModal';
import { ExploreModesHub } from './components/ExploreModesHub';
import { MatrixWallView } from './components/MatrixWallView';
import { InteractiveMap } from './components/InteractiveMap';
import { PulseAIAssistant } from './components/PulseAIAssistant';
import { ConsentBanner } from './components/ConsentBanner';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { TakedownModal } from './components/TakedownModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import {
  Radio,
  Sparkles,
  Camera,
  Layers,
  MapPin,
  Bookmark,
  Search,
  FilterX,
  Compass,
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'gallery' | 'map' | 'explore' | 'matrix_wall' | 'bookmarks'>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CameraCategory>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular' | 'new'>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('earthpulse_bookmarks');
      return saved ? JSON.parse(saved) : ['cam-tokyo-shibuya', 'cam-earth-iss-space'];
    } catch {
      return ['cam-tokyo-shibuya'];
    }
  });

  // Modal and Dialog states
  const [modalCamera, setModalCamera] = useState<CameraFeed | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTakedownOpen, setIsTakedownOpen] = useState(false);
  const [takedownPreset, setTakedownPreset] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[currentLanguage];

  // URL query parameter support for direct camera links (e.g. ?cam=cam-tokyo-shibuya)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const camId = params.get('cam');
    if (camId) {
      const match = mockCameras.find((c) => c.id === camId);
      if (match) {
        setModalCamera(match);
      }
    }
  }, []);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('earthpulse_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTakeSnapshot = (camera: CameraFeed) => {
    // Open modal directly so user can interact and download snapshot
    setModalCamera(camera);
    showToast(`Snapshot studio launched for ${camera.city}`);
  };

  const handleOpenTakedownForCamera = (cameraId: string) => {
    setTakedownPreset(cameraId);
    setIsTakedownOpen(true);
  };

  // Filtered cameras calculation
  const filteredCameras = useMemo(() => {
    return mockCameras.filter((cam) => {
      // If in bookmarks view
      if (activeView === 'bookmarks' && !bookmarkedIds.includes(cam.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();

        // Semantic keyword routing for core CCTV queries
        const isGenericDiscoveryQuery = 
          q.includes('free cctv') || 
          q.includes('free camera') || 
          q.includes('online cameras') || 
          q.includes('biggest online') ||
          q.includes('live stream online') ||
          q.includes('live camera online');

        const isDownloadQuery = q.includes('download');
        const isEnhancementQuery = q.includes('enhanc');
        const isStreetQuery = q.includes('street');
        const isEarthCamQuery = q.includes('earth cam');
        const isHomeQuery = q.includes('home');
        const isNearMeQuery = q.includes('near me');

        let matchesSemantic = false;
        if (isDownloadQuery) {
          // All feeds support snapshot download, prioritize high-res feeds
          matchesSemantic = cam.resolution.includes('4K') || cam.resolution.includes('2K');
        } else if (isEnhancementQuery) {
          // Feeds with high-end optical sensors
          matchesSemantic = ['Axis', 'Sony', 'Panasonic', 'Hikvision'].includes(cam.manufacturer);
        } else if (isStreetQuery) {
          matchesSemantic = cam.category === 'street' || cam.category === 'road';
        } else if (isEarthCamQuery) {
          matchesSemantic = cam.category === 'earth_space' || cam.isFeatured === true;
        } else if (isHomeQuery || isNearMeQuery || isGenericDiscoveryQuery) {
          matchesSemantic = true;
        }

        const matchesStandard =
          cam.title.toLowerCase().includes(q) ||
          cam.city.toLowerCase().includes(q) ||
          cam.country.toLowerCase().includes(q) ||
          cam.manufacturer.toLowerCase().includes(q) ||
          cam.category.toLowerCase().includes(q) ||
          cam.description.toLowerCase().includes(q) ||
          cam.ispRegion.toLowerCase().includes(q) ||
          cam.timezone.toLowerCase().includes(q);

        if (!matchesStandard && !matchesSemantic) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && cam.category !== selectedCategory) {
        return false;
      }

      // Manufacturer filter
      if (selectedManufacturer && cam.manufacturer !== selectedManufacturer) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedFilter === 'popular') {
        return b.viewsCount - a.viewsCount;
      }
      if (selectedFilter === 'new') {
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedManufacturer, selectedFilter, activeView, bookmarkedIds]);

  return (
    <ErrorBoundary fallbackTitle="EarthPulse Main Frame">
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-900 text-white text-xs font-mono px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Global Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          activeView={activeView}
          onViewChange={setActiveView}
          onToggleAi={() => setIsAiOpen(!isAiOpen)}
          aiOpen={isAiOpen}
          t={t}
          bookmarkedCount={bookmarkedIds.length}
          onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
        />

        {/* Main Body Routing */}
        <main className="flex-1">
          {activeView === 'explore' ? (
            <ExploreModesHub
              t={t}
              onSelectCameraModal={(tourId) => {
                const matchedCam = mockCameras.find((c) => tourId.includes(c.id));
                if (matchedCam) setModalCamera(matchedCam);
              }}
            />
          ) : activeView === 'matrix_wall' ? (
            <MatrixWallView
              cameras={filteredCameras.length > 0 ? filteredCameras : mockCameras}
              t={t}
              onSelectCamera={setModalCamera}
            />
          ) : activeView === 'map' ? (
            <InteractiveMap
              cameras={filteredCameras}
              onSelectCamera={setModalCamera}
              t={t}
            />
          ) : (
            // Gallery / Bookmarks View
            <>
              {/* Dynamic Matrix Hero */}
              <HeroSection
                t={t}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
                selectedManufacturer={selectedManufacturer}
                onSelectManufacturer={setSelectedManufacturer}
                onExploreClick={() => setActiveView('explore')}
                totalFilteredCount={filteredCameras.length}
              />

              {/* Cameras Grid Area */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base md:text-lg text-slate-900">
                      {activeView === 'bookmarks' ? 'Saved Webcams & Watchlist' : 'Live Camera Index'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                      {filteredCameras.length} streams
                    </span>
                  </div>

                  {(searchQuery || selectedCategory !== 'all' || selectedManufacturer) && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">Filters active:</span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSelectedManufacturer('');
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer underline"
                      >
                        <FilterX className="w-3.5 h-3.5" />
                        Reset all
                      </button>
                    </div>
                  )}
                </div>

                {/* Empty State */}
                {filteredCameras.length === 0 ? (
                  <div className="min-h-[360px] rounded-3xl bg-white border border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Search className="w-7 h-7" />
                    </div>
                    <div className="max-w-md space-y-1">
                      <h3 className="text-lg font-bold text-slate-800">No Active Feeds Matched</h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        We couldn&apos;t find feeds matching &quot;{searchQuery}&quot;. Try selecting a broader category or search by manufacturer like Axis, Sony, or Panasonic.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedManufacturer('');
                        setActiveView('gallery');
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
                    >
                      Clear Search Filters
                    </button>
                  </div>
                ) : (
                  /* Cards Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                    {filteredCameras.map((camera) => (
                      <CameraCard
                        key={camera.id}
                        camera={camera}
                        t={t}
                        isBookmarked={bookmarkedIds.includes(camera.id)}
                        onToggleBookmark={handleToggleBookmark}
                        onOpenModal={setModalCamera}
                        onTakeSnapshot={handleTakeSnapshot}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* FAQ & CCTV Knowledge Base */}
              <FAQSection
                t={t}
                onOpenTakedown={() => setIsTakedownOpen(true)}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
              />
            </>
          )}
        </main>

        {/* Floating Contextual AI Companion */}
        <PulseAIAssistant
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          t={t}
          activeView={activeView}
          selectedCategory={selectedCategory}
          selectedManufacturer={selectedManufacturer}
          modalCamera={modalCamera}
          onSearchTrigger={(q) => {
            setSearchQuery(q);
            setActiveView('gallery');
          }}
        />

        {/* Stream Detail Modal */}
        <CameraModal
          camera={modalCamera}
          onClose={() => setModalCamera(null)}
          isBookmarked={modalCamera ? bookmarkedIds.includes(modalCamera.id) : false}
          onToggleBookmark={handleToggleBookmark}
          onOpenTakedown={handleOpenTakedownForCamera}
          t={t}
        />

        {/* Privacy Notice Modal */}
        <PrivacyNoticeModal
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
          onOpenTakedown={() => setIsTakedownOpen(true)}
          t={t}
        />

        {/* Takedown Request Modal */}
        <TakedownModal
          isOpen={isTakedownOpen}
          onClose={() => setIsTakedownOpen(false)}
          presetCamera={takedownPreset}
        />

        {/* User Permission & Consent Banner */}
        <ConsentBanner
          t={t}
          onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
          onOpenTakedownModal={() => setIsTakedownOpen(true)}
          onConsentAccepted={() => showToast('Live stream feeds & optics activated')}
        />

        {/* Global Footer */}
        <Footer
          t={t}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTakedown={() => setIsTakedownOpen(true)}
          onSelectExploreMode={() => setActiveView('explore')}
          onSelectMatrixWall={() => setActiveView('matrix_wall')}
        />
      </div>
    </ErrorBoundary>
  );
}
