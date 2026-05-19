import { useEffect, useState } from "react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  priceId: string;
  className?: string;
  children: React.ReactNode;
  reason?: string;
  regionSlug?: string;
  priceCents?: number;
};

export function UnlockButton({ priceId, className, children, reason, regionSlug, priceCents }: Props) {
  const { user } = useAuth();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const [authOpen, setAuthOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const launch = (uid: string, email?: string) => {
    openCheckout({
      priceId,
      quantity: 1,
      userId: uid,
      customerEmail: email,
      regionSlug,
      priceCents,
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  const handleClick = () => {
    if (!user) {
      setPending(true);
      setAuthOpen(true);
      return;
    }
    launch(user.id, user.email ?? undefined);
  };

  // Once user becomes available after auth, launch.
  useEffect(() => {
    if (pending && user) {
      setPending(false);
      setAuthOpen(false);
      launch(user.id, user.email ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, user?.id]);

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>
      <AuthDialog
        open={authOpen}
        reason={reason || "Sign in to unlock"}
        onClose={() => {
          setAuthOpen(false);
          setPending(false);
        }}
        onAuthed={() => {
          // user state will update via useAuth; effect above launches checkout
        }}
      />
      <Dialog open={isOpen} onOpenChange={(o) => !o && closeCheckout()}>
        <DialogContent className="max-w-md p-0 overflow-hidden max-h-[85vh] overflow-y-auto">
          {checkoutElement}
        </DialogContent>
      </Dialog>
    </>
  );
}
