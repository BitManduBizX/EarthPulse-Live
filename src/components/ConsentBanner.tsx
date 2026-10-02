import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, Lock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Translations } from '../utils/translations';

interface Props {
  t: Translations;
  onOpenPrivacyModal: () => void;
  onOpenTakedownModal: () => void;
  onConsentAccepted: () => void;
}

export const ConsentBanner: React.FC<Props> = ({
  t,
  onOpenPrivacyModal,
  onOpenTakedownModal,
  onConsentAccepted,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('earthpulse_user_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('earthpulse_user_consent', 'accepted_' + new Date().toISOString());
    setIsVisible(false);
    onConsentAccepted();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 z-50">
      <div className="bg-white/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl shadow-2xl p-5 md:p-6 text-slate-800 transition-all ring-1 ring-emerald-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  {t.consentTitle}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-medium border border-slate-200">
                  Insecam Standards Compliant
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                {t.consentDesc} All feed locations are intentionally blurred to generalized ISP switching centers to preserve regional security.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {isExpanded ? 'Hide Protocols ▲' : 'View 4 Ethics Protocols ▼'}
            </button>
            <button
              onClick={onOpenPrivacyModal}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer border border-emerald-200"
            >
              {t.consentSettings}
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 text-xs md:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t.consentAccept}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">1. Filtered Public Streams</strong>
                <span className="text-slate-500 leading-normal">Only feeds in public view with zero reasonable expectation of privacy are indexed.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">2. Rapid Takedown</strong>
                <span className="text-slate-500 leading-normal">
                  Immediate de-indexing upon complaint.{' '}
                  <button onClick={onOpenTakedownModal} className="text-emerald-600 underline font-medium cursor-pointer">
                    Request removal
                  </button>
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">3. Password Protection</strong>
                <span className="text-slate-500 leading-normal">Assigning a password instantly excludes any network camera from indexing.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">4. Approximate Geolocation</strong>
                <span className="text-slate-500 leading-normal">GPS coordinates are blurred up to hundreds of miles to the nearest ISP node.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
