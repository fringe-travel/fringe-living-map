import { useState } from "react";
import { initializePaddle, getPaddlePriceId } from "@/lib/paddle";
import { useAuth } from "@/hooks/useAuth";

type Options = {
  priceId: string;
  successUrl?: string;
};

export function usePaddleCheckout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<Options | null>(null);

  const open = async (options: Options, currentUserId?: string, currentUserEmail?: string) => {
    const uid = currentUserId ?? user?.id;
    const email = currentUserEmail ?? user?.email;
    if (!uid) {
      setPendingAuth(options);
      return;
    }
    setLoading(true);
    try {
      await initializePaddle();
      const paddlePriceId = await getPaddlePriceId(options.priceId);
      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId, quantity: 1 }],
        customer: email ? { email } : undefined,
        customData: { userId: uid },
        settings: {
          displayMode: "overlay",
          successUrl: options.successUrl || `${window.location.origin}/?checkout=success`,
          allowLogout: false,
          variant: "one-page",
        },
      });
    } catch (e) {
      console.error("Checkout error", e);
    } finally {
      setLoading(false);
    }
  };

  const continueAfterAuth = async (userId: string, email?: string) => {
    if (!pendingAuth) return;
    const opts = pendingAuth;
    setPendingAuth(null);
    await open(opts, userId, email);
  };

  return { open, loading, pendingAuth, continueAfterAuth, clearPending: () => setPendingAuth(null) };
}
