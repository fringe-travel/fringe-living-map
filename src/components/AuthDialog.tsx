import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthed?: () => void;
  reason?: string;
};

export function AuthDialog({ open, onClose, onAuthed, reason }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-close if the user becomes authenticated (e.g. via Google redirect or any other path)
  useEffect(() => {
    if (open && user) {
      onAuthed?.();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  if (!open || typeof document === "undefined") return null;

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error("No session returned. Please try again.");
        toast.success("Signed in", { description: `Welcome back${data.user?.email ? `, ${data.user.email}` : ""}.` });
        onAuthed?.();
        onClose();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created", { description: "You're signed in." });
          onAuthed?.();
        } else {
          toast.success("Check your email", {
            description: "We sent a confirmation link to finish signing up.",
          });
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError((result.error as any).message ?? "Google sign-in failed.");
    // If redirected, the page navigates away, nothing else to do.
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-16 sm:items-center sm:pt-4" onClick={onClose}>
      <div
        className="relative my-auto w-full max-w-md rounded-3xl border border-border bg-background p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground"
        >
          Close ✕
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
          {reason || "Sign in to continue"}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tighter">
          {mode === "signin" ? "Welcome back." : "Create your FRiNGE account."}
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          One account unlocks every pass you buy across devices.
        </p>

        <button
          onClick={handleGoogle}
          className="mt-6 w-full rounded-xl border border-border bg-surface py-3 text-sm font-bold hover:bg-surface-2"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Sign in" : "Create account & continue"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-foreground/50 hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>,
    document.body
  );
}
