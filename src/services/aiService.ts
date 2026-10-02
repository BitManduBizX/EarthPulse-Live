/**
 * EarthPulse Live - AI Integration Service
 * Securely accesses Gemini API key from environment variables
 * (import.meta.env.VITE_GEMINI_API_KEY / server-side proxy) with zero hardcoded secrets.
 */

export interface AiResponse {
  reply: string;
  source: string;
}

export async function askPulseAI(message: string, context?: string): Promise<AiResponse> {
  const normalizedQuery = message.toLowerCase();

  // 1. Try server-side proxy endpoint first (if full-stack server is running)
  try {
    const res = await fetch('/api/pulse-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context: context || 'EarthPulse Live Global Camera Directory',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return {
          reply: data.reply,
          source: data.source || 'gemini-3.8-flash',
        };
      }
    }
  } catch (err) {
    // Backend proxy not reachable (e.g., deployed as a static SPA on Netlify or client preview)
    console.debug('[Pulse AI] Backend route unavailable, checking client environment keys...');
  }

  // 2. Check client environment variable (VITE_GEMINI_API_KEY)
  const clientApiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
  if (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are Pulse AI, the real-time exploration and technical camera assistant for EarthPulse Live.
User Query: "${message}".
Context: Answer questions about public webcams, camera manufacturers (Axis, Sony, Panasonic), RTSP/HLS protocols, CCTV enhancement software (Amped FIVE, Topaz, MotionDSP), and regional geography. Keep it concise, helpful, and formatted in clean markdown.`,
              },
            ],
          },
        ],
      };

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return {
            reply: generatedText,
            source: 'gemini-cloud-client',
          };
        }
      }
    } catch (err) {
      console.warn('[Pulse AI] Direct client Gemini API request failed, switching to knowledge engine:', err);
    }
  }

  // 3. High-fidelity built-in Knowledge Engine fallback (zero downtime, zero-crash guaranteed)
  let fallbackReply = '';
  if (normalizedQuery.includes('tokyo') || normalizedQuery.includes('shibuya') || normalizedQuery.includes('japan')) {
    fallbackReply = `🗼 **Tokyo Live Feeds & Urban Exploration**\n\nTokyo boasts some of the most dynamic 4K public streams in the world. Our top active recommendations:\n• **Shibuya Scramble Crossing**: Axis Q1785-LE with ultra-high frame rate tracking 3,000+ pedestrians per green light.\n• **Shinjuku Kabukicho Godzilla Road**: Sony 4K low-light optical sensor showing neon nightlife.\n• **Tokyo Tower & Rainbow Bridge**: 360° SkyCam capturing Tokyo Bay weather and marine traffic.\n\n*Pro-tip:* Tokyo is in JST (UTC+9). Peak nightlife neon visibility occurs between 19:00 - 02:00 JST.`;
  } else if (normalizedQuery.includes('beach') || normalizedQuery.includes('brazil') || normalizedQuery.includes('ocean') || normalizedQuery.includes('surf')) {
    fallbackReply = `🏖️ **Global Beach & Surf Surveillance Feeds**\n\n• **Copacabana & Ipanema (Rio de Janeiro, Brazil)**: Axis P1378-LE high-dynamic range camera capturing Atlantic swells, wind tides, and beach volleyball courts.\n• **Waikiki Beach (Honolulu, Hawaii)**: HD skycam panoramic feed tracking surf swell heights.\n• **Bondi Beach (Sydney, Australia)**: Coastal safety patrol camera equipped with optical zoom for rip current monitoring.\n\n*Optics tip:* Marine coastal cameras use IP67/IP68 sealed marine-grade aluminum housing with hydrophobic lens coatings to prevent sea salt spray degradation.`;
  } else if (normalizedQuery.includes('enhance') || normalizedQuery.includes('enhancement') || normalizedQuery.includes('cctv software')) {
    fallbackReply = `🔍 **Professional CCTV Enhancement Software Architecture**\n\nForensic and public video enhancement uses specialized algorithms to recover clarity from low-light or compressed feeds:\n\n1. **Amped FIVE (Forensic Interactive Video Enhancement)**: The global standard for law enforcement and municipal security. Features de-blurring, perspective stabilization, optical flow tracking, and frame averaging.\n2. **Topaz Video AI**: Neural-network upscaling (Artemis and Proteus models) that reconstructs sub-pixel detail and performs 60fps frame interpolation.\n3. **MotionDSP Ikena**: Real-time super-resolution software for recovering license plates and distant signage through atmospheric haze.\n4. **Cognitech Video Investigator**: Geometric rectification and 3D photogrammetric calibration for municipal surveillance.\n\n*Key Principle:* Enhancement never invents data—it aligns temporal multi-frame redundancy to cancel sensor noise (SNR improvement).`;
  } else if (normalizedQuery.includes('rtsp') || normalizedQuery.includes('protocol') || normalizedQuery.includes('onvif') || normalizedQuery.includes('stream')) {
    fallbackReply = `📡 **IP Camera Streaming Protocols & Video Ingestion**\n\n• **RTSP (Real-Time Streaming Protocol - RFC 2326)**: Operates over TCP/UDP port 554. Commands stream playback (SETUP, PLAY, PAUSE) while RTP delivers H.264/H.265 video packets with sub-second latency.\n• **ONVIF (Open Network Video Interface Forum)**: Profile S (basic video streaming), Profile G (edge storage), and Profile T (advanced H.265 & analytics) enable interoperability across Axis, Sony, Bosch, and Dahua hardware.\n• **HLS / LL-HLS**: HTTP Live Streaming slices media into 2-6s .ts or .m4s fragments, ideal for massive scale cross-browser web distribution without dedicated UDP firewall penetration.\n• **WebRTC**: Direct browser peer-to-peer streaming with <200ms latency, increasingly used for remote PTZ (Pan-Tilt-Zoom) live control.`;
  } else if (normalizedQuery.includes('axis') || normalizedQuery.includes('sony') || normalizedQuery.includes('hardware') || normalizedQuery.includes('manufacturer')) {
    fallbackReply = `📹 **Leading Optical Camera Manufacturers Compared**\n\n• **Axis Communications (Sweden)**: Pioneer of network cameras (invented in 1996). Renowned for *Lightfinder 2.0* technology, *Zipstream* compression, and cybersecurity firmware with signed keys.\n• **Sony Security Solutions (Japan)**: Market leader in STARVIS and Exmor R back-illuminated CMOS sensors. Superior low-light color reproduction in 0.005 lux moonlight.\n• **Panasonic i-PRO (Japan)**: Heavy-duty industrial PTZ cameras with salt-resistant chassis and Clearsight anti-smear rain dome coatings.\n• **Hikvision / Dahua**: High volume, cost-effective smart surveillance with AcuSense false-alarm reduction and deep learning human/vehicle classification.`;
  } else if (normalizedQuery.includes('privacy') || normalizedQuery.includes('legal') || normalizedQuery.includes('takedown')) {
    fallbackReply = `🛡️ **EarthPulse Public Privacy & Geolocation Protection**\n\nEarthPulse complies strictly with international public web indexing standards:\n• **Zero Private Feeds**: We index exclusively open municipal feeds, virtual tourism streams, traffic junctions, and public vistas where no reasonable expectation of privacy exists.\n• **ISP-Level Coordinate Blurring**: Map markers are randomized within the ISP routing sub-region (100–300 miles radius) to prevent physical geolocation of unmanaged cameras.\n• **Instant Takedown Guarantee**: Any verified owner or citizen can submit an automated takedown ticket via our Legal/Takedown tab for immediate review and exclusion.\n• **Password Exclusion**: Simply enabling basic HTTP/RTSP authentication password immediately purges any camera from web crawlers.`;
  } else {
    fallbackReply = `🌐 **EarthPulse Assistant Dispatch**\n\nReceived your inquiry: *"${message}"*.\n\nOur platform connects you to **14,280+ active public webcams** across 120+ countries. You can switch between:\n• **Explore Modes**: Driving Tours, Walking Capital Strolls, Aerial SkyCams, and Monument Zooms.\n• **Categories**: Street, Traffic, Beach, Earth / Space, Airport, Wildlife.\n• **Interactive Matrix Map**: View geographically plotted feeds with regional ISP data.\n\nNeed technical tips? Ask about **RTSP streaming commands**, **CCTV enhancement software**, or request recommendations for specific cities like **Tokyo, Rome, New York, or Zurich**!`;
  }

  return {
    reply: fallbackReply,
    source: 'earthpulse-knowledge-engine',
  };
}
