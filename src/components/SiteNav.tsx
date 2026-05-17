import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/signal-regions", label: "Regions" },
  
  { to: "/vibers", label: "Become a Viber" },
  
  { to: "/pricing", label: "Support" },
] as const;

export function SiteNav() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tighter text-foreground">FRiNGE</span>
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
            Discover Your Adventure
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="hidden text-xs font-mono uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground md:inline"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="hidden text-sm font-medium text-foreground/60 hover:text-foreground md:inline"
            >
              Sign in
            </button>
          )}
          <Link
            to="/"
            search={{ fullscreen: 1 } as any}
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Explore the Globe
          </Link>
        </div>
      </div>
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
}
