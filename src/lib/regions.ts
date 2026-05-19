import boracayImg from "@/assets/region-boracay.jpg";
import rioImg from "@/assets/region-rio.jpg";
import hoodRiverImg from "@/assets/region-hood-river.jpg";

export type SignalDrop = {
  minutesAgo: number;
  spot: string;
  vibe: string;
  by: string;
  tag: "crowd" | "wind" | "sunset" | "food" | "music" | "surf" | "vibe";
};

export type Region = {
  slug: string;
  name: string;
  country: string;
  tags: string;
  image: string;
  video?: string;
  freshVibes: number;
  activeSpots: number;
  lastUpdatedMin: number;
  spots: string[];
  pricePerDay: number;
  pricePerMonth: number;
  status: "signal" | "high" | "quiet";
  description: string;
  previewFeed: SignalDrop[];
};

const DEFAULT_VIBE_VIDEO = "/fringe-app-preview.mp4";


export const regions: Region[] = [
  {
    slug: "boracay",
    name: "Boracay Signal",
    country: "Philippines",
    tags: "Beach · Sunset · Nightlife · Island energy",
    image: boracayImg,
    freshVibes: 18,
    activeSpots: 7,
    lastUpdatedMin: 8,
    spots: ["Station 1", "D'Mall", "Bulabog", "Station 2", "White Beach", "Sunset Beach"],
    pricePerDay: 1.99,
    pricePerMonth: 4.99,
    status: "signal",
    description: "Unlock real-time vibes from beaches, food spots, sunsets, nightlife, and local activity across the island.",
    previewFeed: [
      { minutesAgo: 3, spot: "Station 2", vibe: "Sunset crowd building, sky going pink.", by: "maya_k", tag: "sunset" },
      { minutesAgo: 8, spot: "D'Mall", vibe: "Quiet right now, easy to grab a table.", by: "leo.r", tag: "food" },
      { minutesAgo: 14, spot: "Bulabog", vibe: "Solid side-shore, kites everywhere.", by: "kai_w", tag: "wind" },
      { minutesAgo: 22, spot: "White Beach", vibe: "DJ set kicking off near the cove.", by: "noa", tag: "music" },
      { minutesAgo: 31, spot: "Station 1", vibe: "Soft swell, mellow longboard session.", by: "tora", tag: "surf" },
      { minutesAgo: 47, spot: "Sunset Beach", vibe: "Locals gathering for golden hour.", by: "isa", tag: "crowd" },
    ],
  },
  {
    slug: "rio",
    name: "Rio Signal",
    country: "Brazil",
    tags: "Kite · Surf · Beach · Nightlife · Local movement",
    image: rioImg,
    freshVibes: 24,
    activeSpots: 11,
    lastUpdatedMin: 4,
    spots: ["Barra", "Ipanema", "Copacabana", "Arpoador"],
    pricePerDay: 1.99,
    pricePerMonth: 4.99,
    status: "high",
    description: "Track beach energy, kite conditions, nightlife heat, and the real local movement across Rio in real time.",
    previewFeed: [
      { minutesAgo: 2, spot: "Arpoador", vibe: "Sunset clap forming, packed rock.", by: "luca.s", tag: "sunset" },
      { minutesAgo: 6, spot: "Ipanema Posto 9", vibe: "Beach is alive, samba near the kiosk.", by: "bea", tag: "music" },
      { minutesAgo: 11, spot: "Barra", vibe: "Clean 4ft sets, light offshore wind.", by: "rafa", tag: "surf" },
      { minutesAgo: 19, spot: "Copacabana", vibe: "Pickup futevôlei game, crowd watching.", by: "marina", tag: "crowd" },
      { minutesAgo: 28, spot: "Leblon", vibe: "Açaí bar empty, fast service.", by: "diego", tag: "food" },
      { minutesAgo: 44, spot: "Lapa", vibe: "Bars warming up, early arches crowd.", by: "tati", tag: "vibe" },
    ],
  },
  {
    slug: "hood-river",
    name: "Hood River Signal",
    country: "Oregon, USA",
    tags: "Wind · Kite · River · Gorge conditions",
    image: hoodRiverImg,
    freshVibes: 12,
    activeSpots: 5,
    lastUpdatedMin: 15,
    spots: ["The Hook", "Event Site", "Spit", "Swell City", "Rowena"],
    pricePerDay: 2.99,
    pricePerMonth: 6.99,
    status: "quiet",
    description: "Gorge wind, kite and windsurf conditions, river sessions, and golden hour — straight from the people already out there.",
    previewFeed: [
      { minutesAgo: 4, spot: "The Hook", vibe: "22kt steady west, beginners happy.", by: "sam.w", tag: "wind" },
      { minutesAgo: 9, spot: "Event Site", vibe: "Launch packed, rigging 9m kites.", by: "jules", tag: "crowd" },
      { minutesAgo: 17, spot: "Swell City", vibe: "Gnarly swell, advanced only.", by: "tre", tag: "wind" },
      { minutesAgo: 26, spot: "Rowena", vibe: "Glassy upriver, paddlers out.", by: "ana", tag: "surf" },
      { minutesAgo: 38, spot: "Waterfront", vibe: "Food trucks open, short line at pFriem.", by: "noah", tag: "food" },
      { minutesAgo: 52, spot: "Spit", vibe: "Golden hour starting, kites silhouetted.", by: "ivy", tag: "sunset" },
    ],
  },
];

export function getRegion(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}
