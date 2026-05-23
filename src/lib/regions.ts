import boracayImg from "@/assets/region-boracay.jpg";
import rioImg from "@/assets/region-rio.jpg";
import hoodRiverImg from "@/assets/region-hood-river.jpg";
import vibeVideo from "@/assets/fringe-app-preview.mp4?url";

/** Shared demo viber account — all demo dispatches credit this UUID. */
export const DEMO_VIBER_USER_ID = "de70de70-de70-de70-de70-de70de70de70";

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

const DEFAULT_VIBE_VIDEO = vibeVideo;


export const regions: Region[] = [
  {
    slug: "boracay",
    name: "Boracay Signal",
    country: "Philippines",
    tags: "Beach · Sunset · Nightlife · Island energy",
    image: boracayImg,
    video: DEFAULT_VIBE_VIDEO,
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
      { minutesAgo: 12, spot: "Station 2", vibe: "Beach bar packed, line at the bar.", by: "jess.v", tag: "crowd" },
      { minutesAgo: 27, spot: "Station 2", vibe: "Acoustic set just kicked off.", by: "rico", tag: "music" },
      { minutesAgo: 8, spot: "D'Mall", vibe: "Quiet right now, easy to grab a table.", by: "leo.r", tag: "food" },
      { minutesAgo: 19, spot: "D'Mall", vibe: "Mango shakes flowing, chill crowd.", by: "amy.t", tag: "vibe" },
      { minutesAgo: 14, spot: "Bulabog", vibe: "Solid side-shore, kites everywhere.", by: "kai_w", tag: "wind" },
      { minutesAgo: 21, spot: "Bulabog", vibe: "20kt steady, intermediate friendly.", by: "finn", tag: "wind" },
      { minutesAgo: 36, spot: "Bulabog", vibe: "Launch zone packed but moving.", by: "sara.b", tag: "crowd" },
      { minutesAgo: 22, spot: "White Beach", vibe: "DJ set kicking off near the cove.", by: "noa", tag: "music" },
      { minutesAgo: 41, spot: "White Beach", vibe: "Fire dancers warming up.", by: "tasha", tag: "vibe" },
      { minutesAgo: 31, spot: "Station 1", vibe: "Soft swell, mellow longboard session.", by: "tora", tag: "surf" },
      { minutesAgo: 48, spot: "Station 1", vibe: "Sunset yoga group on the sand.", by: "lina", tag: "vibe" },
      { minutesAgo: 47, spot: "Sunset Beach", vibe: "Locals gathering for golden hour.", by: "isa", tag: "crowd" },
      { minutesAgo: 55, spot: "Sunset Beach", vibe: "Sky pink, paddleboards out.", by: "dre", tag: "sunset" },
    ],
  },
  {
    slug: "rio",
    name: "Rio Signal",
    country: "Brazil",
    tags: "Kite · Surf · Beach · Nightlife · Local movement",
    image: rioImg,
    video: DEFAULT_VIBE_VIDEO,
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
      { minutesAgo: 18, spot: "Arpoador", vibe: "Skaters carving the bowl below.", by: "vini", tag: "vibe" },
      { minutesAgo: 33, spot: "Arpoador", vibe: "Cold beer line short at the kiosk.", by: "pao", tag: "food" },
      { minutesAgo: 6, spot: "Ipanema Posto 9", vibe: "Beach is alive, samba near the kiosk.", by: "bea", tag: "music" },
      { minutesAgo: 24, spot: "Ipanema Posto 9", vibe: "Volleyball tournament drawing a crowd.", by: "thi", tag: "crowd" },
      { minutesAgo: 11, spot: "Barra", vibe: "Clean 4ft sets, light offshore wind.", by: "rafa", tag: "surf" },
      { minutesAgo: 29, spot: "Barra", vibe: "Kite school out, steady 18kt.", by: "lara", tag: "wind" },
      { minutesAgo: 42, spot: "Barra", vibe: "Sunset crowd at Pepe drawing in.", by: "gus", tag: "sunset" },
      { minutesAgo: 19, spot: "Copacabana", vibe: "Pickup futevôlei game, crowd watching.", by: "marina", tag: "crowd" },
      { minutesAgo: 38, spot: "Copacabana", vibe: "Caipirinha carts everywhere.", by: "duda", tag: "food" },
      { minutesAgo: 28, spot: "Leblon", vibe: "Açaí bar empty, fast service.", by: "diego", tag: "food" },
      { minutesAgo: 44, spot: "Lapa", vibe: "Bars warming up, early arches crowd.", by: "tati", tag: "vibe" },
      { minutesAgo: 58, spot: "Lapa", vibe: "Live samba starting at Carioca da Gema.", by: "bruno", tag: "music" },
    ],
  },
  {
    slug: "hood-river",
    name: "Hood River Signal",
    country: "Oregon, USA",
    tags: "Wind · Kite · River · Gorge conditions",
    image: hoodRiverImg,
    video: DEFAULT_VIBE_VIDEO,
    freshVibes: 12,
    activeSpots: 5,
    lastUpdatedMin: 15,
    spots: ["The Hook", "Event Site", "Spit", "Swell City", "Rowena"],
    pricePerDay: 2.99,
    pricePerMonth: 6.99,
    status: "quiet",
    description: "Gorge wind, kite and windsurf conditions, river sessions, and golden hour, straight from the people already out there.",
    previewFeed: [
      { minutesAgo: 4, spot: "The Hook", vibe: "22kt steady west, beginners happy.", by: "sam.w", tag: "wind" },
      { minutesAgo: 18, spot: "The Hook", vibe: "Glassy inside, perfect for foiling.", by: "mel", tag: "surf" },
      { minutesAgo: 33, spot: "The Hook", vibe: "Lesson groups wrapping up.", by: "ben.k", tag: "crowd" },
      { minutesAgo: 9, spot: "Event Site", vibe: "Launch packed, rigging 9m kites.", by: "jules", tag: "crowd" },
      { minutesAgo: 24, spot: "Event Site", vibe: "Gusting 26, big air sending.", by: "dax", tag: "wind" },
      { minutesAgo: 17, spot: "Swell City", vibe: "Gnarly swell, advanced only.", by: "tre", tag: "wind" },
      { minutesAgo: 35, spot: "Swell City", vibe: "Mast-high sets rolling through.", by: "kira", tag: "surf" },
      { minutesAgo: 26, spot: "Rowena", vibe: "Glassy upriver, paddlers out.", by: "ana", tag: "surf" },
      { minutesAgo: 49, spot: "Rowena", vibe: "Empty parking lot, peaceful.", by: "owen", tag: "vibe" },
      { minutesAgo: 38, spot: "Waterfront", vibe: "Food trucks open, short line at pFriem.", by: "noah", tag: "food" },
      { minutesAgo: 52, spot: "Spit", vibe: "Golden hour starting, kites silhouetted.", by: "ivy", tag: "sunset" },
      { minutesAgo: 61, spot: "Spit", vibe: "Wind dropping, last sessions out.", by: "ash", tag: "wind" },
    ],
  },
  {
    slug: "roaming",
    name: "Roaming Signal",
    country: "Everywhere else",
    tags: "Wandering vibers · Off the map · Drops from anywhere",
    image: boracayImg,
    video: DEFAULT_VIBE_VIDEO,
    freshVibes: 9,
    activeSpots: 6,
    lastUpdatedMin: 12,
    spots: ["Lisbon", "Bali", "Mexico City", "Tokyo", "Tulum", "Cape Town"],
    pricePerDay: 0,
    pricePerMonth: 0,
    status: "signal",
    description: "Vibers on the move, dropping signal from places that aren't on our targeted regions yet. Wandering, scouting, vibing.",
    previewFeed: [
      { minutesAgo: 6, spot: "Lisbon", vibe: "Miradouro packed for golden hour, fado drifting up.", by: "noor", tag: "sunset" },
      { minutesAgo: 14, spot: "Lisbon", vibe: "Late espresso at a Bairro Alto stand, no line.", by: "thom", tag: "food" },
      { minutesAgo: 9, spot: "Bali", vibe: "Uluwatu cliffs glowing, crowd cheering a clean set.", by: "sage", tag: "surf" },
      { minutesAgo: 22, spot: "Bali", vibe: "Canggu night market lit, gado gado fast.", by: "ines", tag: "food" },
      { minutesAgo: 11, spot: "Mexico City", vibe: "Roma Norte alley bar spilling onto the street.", by: "memo", tag: "vibe" },
      { minutesAgo: 28, spot: "Mexico City", vibe: "Tacos al pastor sizzling, line moving fast.", by: "yuli", tag: "food" },
      { minutesAgo: 17, spot: "Tokyo", vibe: "Shibuya crossing electric, billboards reflecting rain.", by: "ren", tag: "crowd" },
      { minutesAgo: 34, spot: "Tokyo", vibe: "Golden Gai tiny bar just opened a seat.", by: "aiko", tag: "vibe" },
      { minutesAgo: 19, spot: "Tulum", vibe: "Beach bonfire starting, drums warming up.", by: "cleo", tag: "music" },
      { minutesAgo: 41, spot: "Cape Town", vibe: "Lion's Head sunset hike, full ridge of headlamps.", by: "zee", tag: "sunset" },
      { minutesAgo: 52, spot: "Cape Town", vibe: "Sea Point promenade buzzing, runners and dogs.", by: "ash.m", tag: "crowd" },
    ],
  },
];

export function getRegion(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}
