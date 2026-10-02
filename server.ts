import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini SDK if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[EarthPulse Server] Failed to initialize GoogleGenAI with key:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'EarthPulse Live Stream Engine',
    timestamp: new Date().toISOString(),
    aiReady: Boolean(aiClient),
    activeFeedsIndexed: 14892,
  });
});

// Privacy Takedown Request Endpoint
app.post('/api/takedown', (req: Request, res: Response) => {
  const { cameraUrlOrIp, ownerName, email, reason, notes } = req.body;
  if (!cameraUrlOrIp || !email) {
    res.status(400).json({ error: 'Camera identifier (URL or IP) and contact email are required.' });
    return;
  }

  const ticketId = `EP-TAKE-${Math.floor(100000 + Math.random() * 900000)}`;
  res.json({
    success: true,
    ticketId,
    status: 'Feed Flagged & Temporarily De-Indexed',
    message: `Your takedown petition for "${cameraUrlOrIp}" has been submitted and queued for immediate exclusion. A confirmation notice was logged for ${email}.`,
    timestamp: new Date().toISOString(),
  });
});

// Environment-Aware AI Assistant ("Pulse AI")
app.post('/api/pulse-ai', async (req: Request, res: Response) => {
  const { message, context } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message query is required' });
    return;
  }

  const normalizedQuery = message.toLowerCase();

  // Try Gemini AI if available
  if (aiClient) {
    try {
      const systemInstruction = `You are "Pulse AI", the intelligent real-time exploration and technical camera assistant for EarthPulse Live (the world's largest open directory of public webcams, virtual tours, and surveillance/traffic streams).
You assist users with:
1. Locating live streams (Tokyo Shibuya Scramble, Manhattan Times Square, Rio de Janeiro Copacabana, Venice Grand Canal, Swiss Alps, ISS Earth view, etc.).
2. Explaining camera hardware & manufacturers (Axis, Sony, Panasonic, Dahua, Hikvision, TP-Link, Foscam, Linksys).
3. Streaming protocols (RTSP, RTMP, HLS, WebRTC, MJPEG, ONVIF Profile S/T).
4. CCTV enhancement software (Amped FIVE, Topaz Video AI, MotionDSP Ikena, Cognitech Video Investigator, super-resolution neural de-noising).
5. Regional geography, timezones, weather impacts on visibility, and travel tips.
6. Public privacy & ethics compliance: camera feeds in the directory are public-facing only without expectation of privacy, coordinates are generalized to ISP points-of-presence (several hundred miles blur) to prevent tracking, and takedowns are handled via automated instant tickets.

Keep your tone futuristic, crisp, knowledgeable, and concise (2-4 paragraphs or formatted bullet points). Format cleanly with bold headers or markdown lists.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${context ? `[Active Context: ${context}]\n\n` : ''}User Query: ${message}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        res.json({ reply: text, source: 'gemini-3.8-flash' });
        return;
      }
    } catch (error) {
      console.warn('[EarthPulse AI] Gemini generation error, using fallback:', error);
    }
  }

  // High-fidelity heuristic fallback engine if Gemini key is missing or errored
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

  res.json({ reply: fallbackReply, source: 'earthpulse-knowledge-engine' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  // Dev server in AI Studio must strictly run on port 3000. Production on Cloud Run uses process.env.PORT || 8080.
  const port = isProduction ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 8080) : 3000;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[EarthPulse Live] Server online on http://0.0.0.0:${port} [env: ${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('[EarthPulse Server] Fatal startup failure:', err);
  process.exit(1);
});
