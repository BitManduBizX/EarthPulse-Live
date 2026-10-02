export type CameraCategory = 
  | 'all'
  | 'street'
  | 'traffic'
  | 'parking'
  | 'office'
  | 'road'
  | 'beach'
  | 'earth_space'
  | 'airports'
  | 'wildlife'
  | 'monuments';

export type ExploreModeType = 
  | 'driving'
  | 'walking'
  | 'flight'
  | 'monument';

export interface CameraFeed {
  id: string;
  title: string;
  category: CameraCategory;
  country: string;
  countryCode: string;
  city: string;
  flag: string;
  manufacturer: 'Axis' | 'Sony' | 'Panasonic' | 'TP-Link' | 'Foscam' | 'Dahua' | 'Hikvision' | 'Linksys';
  model: string;
  resolution: string;
  fps: number;
  timezone: string;
  ispRegion: string;
  approxCoords: [number, number]; // [lat, lng] intentionally generalized
  streamType: 'embed' | 'video' | 'hls' | 'simulated';
  streamUrl: string;
  thumbnail: string;
  viewsCount: number;
  status: 'active' | 'standby' | 'night_mode';
  temperature?: string;
  weather?: string;
  description: string;
  exploreModes?: ExploreModeType[];
  isFeatured?: boolean;
  addedDate: string;
}

export interface ExploreTour {
  id: string;
  title: string;
  mode: ExploreModeType;
  city: string;
  country: string;
  flag: string;
  duration: string;
  distanceOrAltitude: string;
  quality: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  highlights: string[];
  cameraModel: string;
  routeStops: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
