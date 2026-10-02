import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Cpu, Radio, Smartphone, AlertOctagon } from 'lucide-react';
import { Translations } from '../utils/translations';

interface Props {
  t: Translations;
  onOpenTakedown: () => void;
  onOpenPrivacy: () => void;
}

export const FAQSection: React.FC<Props> = ({ t, onOpenTakedown, onOpenPrivacy }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is CCTV Enhancement Software and how does it improve low-quality video feeds?',
      a: `CCTV enhancement software utilizes forensic algorithms and deep neural networks to extract readable details from compressed, noisy, or atmospheric-distorted surveillance feeds. 

Industry-standard suites include:
• **Amped FIVE**: Forensic standard with frame averaging, perspective de-blurring, and stabilization without creating fabricated artifacts.
• **Topaz Video AI**: AI super-resolution (Artemis, Proteus models) reconstructing sub-pixel textures and temporal 60fps interpolation.
• **MotionDSP Ikena**: Real-time super-resolution software for recovering distant signage through atmospheric heat haze and night camera grain.
• **Cognitech Video Investigator**: Photogrammetric 3D measuring and geometric camera lens un-warping.

*Crucial principle:* Enhancement relies on temporal redundancy across multiple consecutive frames to boost the Signal-to-Noise Ratio (SNR).`,
    },
    {
      q: 'How does EarthPulse protect privacy and why are camera coordinates generalized to ISP hubs?',
      a: `In adherence with international public web indexing protocols (Insecam compliance standards):
1. **Zero Private Feeds**: We index exclusively municipal traffic intersections, open harbor views, surf beaches, and tourist vistas where zero expectation of personal privacy exists.
2. **ISP Coordinate Blurring**: Coordinates displayed on our interactive map are intentionally offset by up to several hundred miles to the regional Internet Service Provider routing gateway. This guarantees cameras cannot be physically tracked or localized.
3. **Password Protection**: Setting any password on your network camera immediately excludes it from crawlers permanently.`,
    },
    {
      q: 'How do I add or submit a new public camera stream to EarthPulse Live?',
      a: `EarthPulse welcomes municipal open streams, university weather cams, and public tourism boards! To submit a feed:
• The stream must be 100% public (RTSP, HLS .m3u8, or YouTube Live stream).
• The vantage point must not overlook private residences or private property.
• Use the submission contact link in the footer to provide your stream URI, city, country, and camera hardware model. Once verified by our directory crawlers, it is added to the live grid.`,
    },
    {
      q: 'How do I remove my camera from the directory?',
      a: `Removal is instant and guaranteed:
• Click the "Submit Takedown" button anywhere on the site or in the footer.
• Provide the camera title, IP, or URL and your contact email.
• Our automated compliance system creates an immediate tracking ticket (e.g. EP-TAKE-XXXX) and flags the feed for de-indexing within minutes.
• Alternatively, simply assign a password to your camera's administrative interface.`,
    },
    {
      q: 'What streaming protocols and browsers are supported?',
      a: `EarthPulse Live is engineered for 100% compatibility across all modern web browsers:
• **Supported Browsers**: Chrome, Safari, Edge, Firefox, Brave, and Opera.
• **Supported Mobile**: iOS Safari, Android Chrome, tablet touch interfaces.
• **Ingestion Pipelines**: HLS (HTTP Live Streaming), WebRTC for sub-second zero-latency feeds, and embedded HTML5 video players.`,
    },
    {
      q: 'Is EarthPulse Live completely free to use?',
      a: `Yes, 100% free with zero fees, zero account creation, and zero paywalls. EarthPulse is maintained as an open-access global virtual exploration and public information portal for researchers, students, travelers, and curiosity seekers worldwide.`,
    },
  ];

  return (
    <div className="py-12 border-t border-slate-200/80 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>KNOWLEDGE REPOSITORY</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all bg-white shadow-xs hover:border-slate-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm md:text-base text-slate-800">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-emerald-100 text-emerald-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action quick links below FAQ */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <button
            onClick={onOpenTakedown}
            className="text-amber-700 hover:text-amber-800 underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            File Camera Takedown Request
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={onOpenPrivacy}
            className="text-emerald-700 hover:text-emerald-800 underline font-semibold cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Read Full Insecam Ethics Policy
          </button>
        </div>
      </div>
    </div>
  );
};
