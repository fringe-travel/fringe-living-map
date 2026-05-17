import { useState } from "react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";

type Props = {
  priceId: string;
  className?: string;
  children: React.ReactNode;
  reason?: string;
};

export function UnlockButton({ priceId, className, children, reason }: Props) {
  const { open, loading, pendingAuth, continueAfterAuth, clearPending } = usePaddleCheckout();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const handleClick = async () => {
    if (!user) {
      setAuthOpen(true);
      // Stash the priceId so the auth dialog can continue after success
      // by calling open() with a fresh user. We use the pendingAuth state in
      // the hook itself so we just call open() — it will set pendingAuth.
      await open({ priceId });
      return;
    }
    await open({ priceId });
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "Loading..." : children}
      </button>
      <AuthDialog
        open={authOpen || !!pendingAuth}
        reason={reason || "Sign in to unlock"}
        onClose={() => {
          setAuthOpen(false);
          clearPending();
        }}
        onAuthed={async () => {
          setAuthOpen(false);
          // After auth, the auth provider updates `user`, but we need to
          // trigger checkout with fresh session info immediately.
          const { data } = await import("@/integrations/supabase/client").then((m) =>
            m.supabase.auth.getUser()
          );
          if (data.user) {
            await continueAfterAuth(data.user.id, data.user.email ?? undefined);
          }
        }}
      />
    </>
  );
}
