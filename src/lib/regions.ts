import boracayImg from "@/assets/region-boracay.jpg";
import rioImg from "@/assets/region-rio.jpg";
import mauiImg from "@/assets/region-maui.jpg";

export type Region = {
  slug: string;
  name: string;
  country: string;
  tags: string;
  image: string;
  freshVibes: number;
  activeSpots: number;
  lastUpdatedMin: number;
  spots: string[];
  pricePerDay: number;
  pricePerMonth: number;
  status: "signal" | "high" | "quiet";
  description: string;
};

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
  },
  {
    slug: "maui",
    name: "Maui Signal",
    country: "Hawaii",
    tags: "Wind · Waves · Beaches · Island conditions",
    image: mauiImg,
    freshVibes: 12,
    activeSpots: 5,
    lastUpdatedMin: 15,
    spots: ["Kihei", "Kanaha", "Paia", "Lahaina"],
    pricePerDay: 2.99,
    pricePerMonth: 6.99,
    status: "quiet",
    description: "Wind, waves, beaches, golden hour, and island conditions — straight from the people already out there.",
  },
];

export function getRegion(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}
