import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import { ShakaWalletBadge } from "@/components/ShakaWalletBadge";

const links = [
  { to: "/", label: "Explore" },
  { to: "/signal-regions", label: "Regions" },
  { to: "/vibers", label: "Become a Viber" },
] as const;


export function SiteNav() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleExplore = (e: React.MouseEvent) => {
    closeMenu();
    if (typeof window === "undefined") return;
    const el = document.getElementById("living-globe");
    if (el && window.location.pathname === "/") {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
      el.requestFullscreen?.().catch(() => {});
    }
    // else: let the Link navigate to "/?fullscreen=1", LivingGlobe's mount effect handles it
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
        <Link to="/" onClick={closeMenu} className="flex flex-col leading-none">
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
              onClick={l.to === "/" ? handleExplore : closeMenu}
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <ShakaWalletBadge />
              <Link
                to="/account"
                className="hidden text-sm font-medium text-foreground/60 hover:text-foreground md:inline"
              >
                Account
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="hidden text-xs font-mono uppercase tracking-[0.18em] text-foreground/60 hover:text-foreground md:inline"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="hidden text-sm font-medium text-foreground/60 hover:text-foreground md:inline"
            >
              Sign in
            </button>
          )}
          <Link
            to="/pricing"
            onClick={closeMenu}
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 sm:inline-flex"
          >
            Founding Members
          </Link>


          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-foreground transition-transform ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-5 bg-foreground transition-transform ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-base font-semibold text-foreground/80 hover:bg-surface hover:text-foreground"
                activeProps={{ className: "text-foreground bg-surface" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/"
              onClick={handleExplore}
              
              className="mt-2 rounded-full border border-border px-4 py-3 text-center text-sm font-semibold text-foreground/80 sm:hidden"
            >
              Explore Living Globe
            </Link>
            <Link
              to="/pricing"
              onClick={closeMenu}
              className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground sm:hidden"
            >
              Founding Members
            </Link>

            <div className="mt-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="block rounded-xl px-3 py-3 text-sm font-semibold text-foreground/80 hover:bg-surface hover:text-foreground"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      supabase.auth.signOut();
                      closeMenu();
                    }}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-mono uppercase tracking-[0.18em] text-foreground/60 hover:bg-surface hover:text-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    closeMenu();
                  }}
                  className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-foreground/70 hover:bg-surface hover:text-foreground"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
}
