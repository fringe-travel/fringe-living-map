import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";

type Props = {
  handle: string;
  className?: string;
};

/**
 * Follow / unfollow a viber by handle. Writes to public.viber_follows,
 * which is RLS-scoped to auth.uid().
 */
export function FollowButton({ handle, className }: Props) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setFollowing(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("viber_follows")
        .select("id")
        .eq("user_id", user.id)
        .eq("viber_handle", handle)
        .maybeSingle();
      if (!cancelled) setFollowing(!!data);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, handle]);

  const toggle = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setLoading(true);
    try {
      if (following) {
        await supabase
          .from("viber_follows")
          .delete()
          .eq("user_id", user.id)
          .eq("viber_handle", handle);
        setFollowing(false);
      } else {
        await supabase
          .from("viber_follows")
          .insert({ user_id: user.id, viber_handle: handle });
        setFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-60";
  const idle =
    "border-foreground/20 bg-background text-foreground hover:bg-foreground hover:text-background";
  const active =
    "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground";

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={className ?? `${base} ${following ? active : idle}`}
        aria-pressed={following}
      >
        {following ? "✓ Following" : `+ Follow @${handle}`}
      </button>

      <AuthDialog
        open={authOpen}
        reason={`Sign in to follow @${handle}`}
        onClose={() => setAuthOpen(false)}
        onAuthed={async () => {
          setAuthOpen(false);
          // Auto-follow after sign in
          const { data: u } = await supabase.auth.getUser();
          if (u.user) {
            await supabase
              .from("viber_follows")
              .insert({ user_id: u.user.id, viber_handle: handle });
            setFollowing(true);
          }
        }}
      />
    </>
  );
}
