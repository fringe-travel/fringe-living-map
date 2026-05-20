import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import ogGlobe from "@/assets/og-globe.jpg";

const OG_IMAGE_URL = `https://fringe-living-map.lovable.app${ogGlobe}`;
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthProvider } from "@/hooks/useAuth";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { FoundingMemberBanner } from "@/components/FoundingMemberBanner";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Signal lost</h1>
        <p className="mt-3 text-4xl font-extrabold tracking-tighter">404, Off the map</p>
        <p className="mt-3 text-sm text-foreground/60">
          That region isn't broadcasting. Try another signal zone.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105 transition-transform"
        >
          Back to FRiNGE
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sunset">Signal interrupted</p>
        <h1 className="mt-3 text-2xl font-bold">Something dropped offline</h1>
        <p className="mt-2 text-sm text-foreground/60">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:bg-surface"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FRiNGE, See what's happening there right now." },
      {
        name: "description",
        content:
          "FRiNGE is a signal map of real places. See real-time vibes and what's happening now in beaches, cities, and adventure spots.",
      },
      { property: "og:title", content: "FRiNGE, See what's happening there right now." },
      { property: "og:description", content: "Unlock real-time access to live places and see what's happening now." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "FRiNGE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FRiNGE, See what's happening there right now." },
      { name: "twitter:description", content: "Unlock real-time access to live places and see what's happening now." },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "640" },
      { property: "og:image:alt", content: "The FRiNGE Living Globe, live signals from real places around the world." },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "FRiNGE",
          url: "https://fringe-living-map.lovable.app",
          logo: OG_IMAGE_URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "FRiNGE",
          url: "https://fringe-living-map.lovable.app",
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <PaymentTestModeBanner />
          <FoundingMemberBanner />
          <SiteNav />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
