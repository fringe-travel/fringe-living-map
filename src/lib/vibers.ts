/**
 * Viber profiles — the humans behind the handles.
 * Used on region pages, the homepage ticker, and post-checkout payoff.
 */

export type ViberProfile = {
  handle: string;
  name: string;
  /** One-line context: who they are + what they've been doing. */
  story: string;
  /** Region they vibe in most. */
  region: string;
  /** Hex pair for avatar gradient (no real photos yet). */
  gradient: [string, string];
  /** Optional short vertical clip showing the viber on the ground. */
  clip?: string;
  /** Optional still photo (poster / fallback). */
  photo?: string;
};


export const VIBERS: Record<string, ViberProfile> = {
  // Boracay
  maya_k: { handle: "maya_k", name: "Maya", region: "Boracay", story: "Walking Bulabog to Station 2 every sunset for the last 3 weeks.", gradient: ["#ff7a59", "#ffb347"] },
  "jess.v": { handle: "jess.v", name: "Jess", region: "Boracay", story: "Bar-hopping Station 2, calling the crowd before it gets packed.", gradient: ["#ff5da2", "#ff9ec4"] },
  rico: { handle: "rico", name: "Rico", region: "Boracay", story: "Plays the acoustic set she texts you about — knows every venue.", gradient: ["#7c5cff", "#a78bfa"] },
  "leo.r": { handle: "leo.r", name: "Leo", region: "Boracay", story: "D'Mall regular — knows which kitchen is fast at 9pm.", gradient: ["#22d3ee", "#3b82f6"] },
  "amy.t": { handle: "amy.t", name: "Amy", region: "Boracay", story: "Mango shake critic. Reports vibe like it's the weather.", gradient: ["#fbbf24", "#f97316"] },
  kai_w: { handle: "kai_w", name: "Kai", region: "Boracay", story: "Local kiter on Bulabog, posts wind reads before the schools do.", gradient: ["#06b6d4", "#0ea5e9"] },
  finn: { handle: "finn", name: "Finn", region: "Boracay", story: "Calls the launch zone every morning at 6am sharp.", gradient: ["#10b981", "#06b6d4"] },
  // Rio
  "luca.s": { handle: "luca.s", name: "Luca", region: "Rio", story: "Arpoador native — calls the sunset clap before it happens.", gradient: ["#ef4444", "#f97316"] },
  vini: { handle: "vini", name: "Vini", region: "Rio", story: "Skater, shows the bowl below the rock every evening.", gradient: ["#8b5cf6", "#ec4899"] },
  bea: { handle: "bea", name: "Bea", region: "Rio", story: "Knows every samba kiosk on Ipanema by song.", gradient: ["#f59e0b", "#ef4444"] },
  rafa: { handle: "rafa", name: "Rafa", region: "Rio", story: "Surfer at Barra — paddles out before sunrise, every day.", gradient: ["#0ea5e9", "#22d3ee"] },
  lara: { handle: "lara", name: "Lara", region: "Rio", story: "Kite instructor, reads Barra wind better than the forecasts.", gradient: ["#14b8a6", "#06b6d4"] },
  // Hood River
  "sam.w": { handle: "sam.w", name: "Sam", region: "Hood River", story: "The Hook regular — first one rigged, last one off the water.", gradient: ["#3b82f6", "#6366f1"] },
  mel: { handle: "mel", name: "Mel", region: "Hood River", story: "Foiler — calls the glassy windows nobody else notices.", gradient: ["#06b6d4", "#3b82f6"] },
  jules: { handle: "jules", name: "Jules", region: "Hood River", story: "Event Site mainstay — knows which kite size to rig at a glance.", gradient: ["#a855f7", "#ec4899"] },
  dax: { handle: "dax", name: "Dax", region: "Hood River", story: "Big-air kiter — when Dax says it's sending, it's sending.", gradient: ["#f59e0b", "#ef4444"] },
};

export function getViber(handle: string): ViberProfile | undefined {
  return VIBERS[handle];
}

/** Avatar component-ready CSS gradient. */
export function viberGradient(handle: string): string {
  const v = VIBERS[handle];
  if (!v) return "linear-gradient(135deg, #94a3b8, #475569)";
  return `linear-gradient(135deg, ${v.gradient[0]}, ${v.gradient[1]})`;
}

export function viberInitial(handle: string): string {
  const v = VIBERS[handle];
  return (v?.name ?? handle).slice(0, 1).toUpperCase();
}

/** Fallback story for handles not in the profile map. */
export function viberStoryOrFallback(handle: string, region: string): string {
  const v = VIBERS[handle];
  if (v) return v.story;
  return `Showing up in ${region}, drop after drop.`;
}
