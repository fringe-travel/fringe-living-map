import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession, unlockOneTimeWithShakas } from "@/utils/payments.functions";
import { getShakaWallet } from "@/utils/shaka.functions";
import {
  SHAKA_VALUE_CENTS,
  isShakaRedeemable,
  isShakaFullUnlockable,
  shakasToDollars,
} from "@/lib/shaka-redemption";

interface Props {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
  regionSlug?: string;
  /** Approximate price in cents, used to compute max Shakas redeemable */
  priceCents?: number;
  onUnlocked?: () => void;
}

export function StripeEmbeddedCheckout({
  priceId,
  quantity,
  customerEmail,
  userId,
  returnUrl,
  regionSlug,
  priceCents,
  onUnlocked,
}: Props) {
  const queryClient = useQueryClient();
  const fetchWallet = useServerFn(getShakaWallet);
  const unlockFn = useServerFn(unlockOneTimeWithShakas);
  const redeemEligible = !!userId && isShakaRedeemable(priceId);
  const fullUnlockEligible = !!userId && isShakaFullUnlockable(priceId);

  const wallet = useQuery({
    queryKey: ["shaka-wallet", userId],
    queryFn: () => fetchWallet({}),
    enabled: redeemEligible,
  });
  const balance = wallet.data?.balance ?? 0;

  // Max Shakas usable against this purchase
  const maxRedeemable = useMemo(() => {
    if (!redeemEligible || !priceCents) return 0;
    const byPrice = Math.floor(priceCents / SHAKA_VALUE_CENTS);
    return Math.max(0, Math.min(byPrice, balance));
  }, [redeemEligible, priceCents, balance]);

  const fullUnlockCost = priceCents ? Math.ceil(priceCents / SHAKA_VALUE_CENTS) : 0;
  const canFullUnlock = fullUnlockEligible && fullUnlockCost > 0 && balance >= fullUnlockCost;

  // Draft slider value (uncommitted)
  const [draftShakas, setDraftShakas] = useState(0);
  // Committed value — drives the session creation. Changing it remounts the iframe.
  const [appliedShakas, setAppliedShakas] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Keep draft within bounds when balance/price changes
  useEffect(() => {
    if (draftShakas > maxRedeemable) setDraftShakas(maxRedeemable);
  }, [maxRedeemable, draftShakas]);

  const fetchClientSecret = async (): Promise<string> => {
    const secret = await createCheckoutSession({
      data: {
        priceId,
        quantity,
        customerEmail,
        userId,
        returnUrl:
          returnUrl || `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
        regionSlug,
        ...(appliedShakas > 0 && { shakasToRedeem: appliedShakas }),
      },
    });
    if (!secret) throw new Error("No client secret returned");
    return secret;
  };

  const handleFullUnlock = async () => {
    setUnlockError(null);
    setUnlocking(true);
    try {
      await unlockFn({
        data: { priceId, regionSlug, environment: getStripeEnvironment() },
      });
      queryClient.invalidateQueries({ queryKey: ["shaka-wallet", userId] });
      queryClient.invalidateQueries({ queryKey: ["region-access"] });
      onUnlocked?.();
    } catch (e: any) {
      setUnlockError(e?.message ?? "Could not unlock with Shakas.");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div id="checkout" className="bg-background">
      {redeemEligible && maxRedeemable > 0 && (
        <div className="border-b border-border bg-gradient-to-b from-sunset/5 to-transparent px-5 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-bold">Use your Shakas 🤙</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              Balance: {balance}
            </p>
          </div>

          {canFullUnlock && appliedShakas === 0 && (
            <button
              onClick={handleFullUnlock}
              disabled={unlocking}
              className="mt-3 w-full rounded-xl bg-sunset px-4 py-3 text-sm font-bold text-background transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {unlocking
                ? "Unlocking…"
                : `Unlock free with ${fullUnlockCost} Shakas`}
            </button>
          )}
          {unlockError && <p className="mt-2 text-xs text-red-500">{unlockError}</p>}

          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                Apply as discount
              </label>
              <span className="font-mono text-xs font-bold">
                {draftShakas} Shaka{draftShakas === 1 ? "" : "s"} = −${shakasToDollars(draftShakas).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={maxRedeemable}
              value={draftShakas}
              onChange={(e) => setDraftShakas(Number(e.target.value))}
              className="mt-2 w-full accent-sunset"
              disabled={unlocking}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setAppliedShakas(draftShakas)}
                disabled={draftShakas === appliedShakas || unlocking}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
              >
                {appliedShakas === draftShakas && appliedShakas > 0
                  ? `Applied ${appliedShakas} Shakas`
                  : draftShakas > 0
                  ? `Apply ${draftShakas} Shakas`
                  : appliedShakas > 0
                  ? "Remove Shakas"
                  : "Apply"}
              </button>
              {appliedShakas > 0 && (
                <button
                  onClick={() => {
                    setDraftShakas(0);
                    setAppliedShakas(0);
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-surface"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <EmbeddedCheckoutProvider
        // Force remount when applied Shakas change — clientSecret is immutable
        key={`co-${priceId}-${appliedShakas}`}
        stripe={getStripe()}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
