import React from 'react';
import { X, ShieldCheck, Lock, MapPin, AlertOctagon, FileCheck, Check } from 'lucide-react';
import { Translations } from '../utils/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenTakedown: () => void;
  t: Translations;
}

export const PrivacyNoticeModal: React.FC<Props> = ({ isOpen, onClose, onOpenTakedown, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.privacyNoticeTitle}</h2>
              <p className="text-xs text-slate-500 font-mono">Insecam & Open Public Cam Standard Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="prose prose-slate max-w-none text-sm space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed text-slate-700 italic">
            &ldquo;Welcome to EarthPulse Live. The world&apos;s largest open directory of public online video webcams. Select a country to watch live street, traffic, parking, office, road, beach, and weather webcams.&rdquo;
          </div>

          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pt-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            Mandatory Privacy Protection Protocols
          </h3>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                1
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">Filtered Feeds Only</strong>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Only public streams with no expectation of personal privacy are listed. Feeds located in residential interiors, private yards, or areas with privacy expectations are strictly barred from indexing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                2
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">Takedown Request Guarantee</strong>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Any feed reported via our automated takedown system will be reviewed and removed immediately without bureaucracy or cost.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold text-xs">
                3
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">Password Protection Exclusion</strong>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Setting a password on any network camera automatically and permanently excludes it from all search crawlers, spiders, and directory indexing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                4
              </div>
              <div className="space-y-1">
                <strong className="text-slate-900 font-semibold block">Approximate Geolocation Blurring</strong>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Camera coordinates are intentionally generalized to the nearest ISP regional point-of-presence (accurate only to several hundred miles) to prevent physical tracking or pinpointing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenTakedown();
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer underline"
          >
            <AlertOctagon className="w-4 h-4" />
            File a Camera Removal Request
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
