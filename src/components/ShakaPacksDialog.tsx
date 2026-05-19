import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { SHAKA_PACKS } from "@/lib/pricing-ids";
import { getShakaWallet, sendShaka } from "@/utils/shaka.functions";

type Props = {
  open: boolean;
  onClose: () => void;
  recipientUserId?: string;
  recipientName?: string;
};

export function ShakaPacksDialog({ open, onClose, recipientUserId, recipientName }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchWallet = useServerFn(getShakaWallet);
  const sendOne = useServerFn(sendShaka);
  const { openCheckout, closeCheckout, isOpen: checkoutOpen, checkoutElement } = useStripeCheckout();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const wallet = useQuery({
    queryKey: ["shaka-wallet", user?.id],
    queryFn: () => fetchWallet({}),
    enabled: !!user && open,
  });

  useEffect(() => {
    if (open) setSent(false);
  }, [open]);

  const balance = wallet.data?.balance ?? 0;
  const canSend = !!recipientUserId && balance > 0 && !sending && !sent;

  const handleSend = async () => {
    if (!recipientUserId) return;
    setSending(true);
    try {
      await sendOne({ data: { recipientUserId, amount: 1 } });
      setSent(true);
      qc.invalidateQueries({ queryKey: ["shaka-wallet", user?.id] });
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleBuy = (priceId: string) => {
    if (!user) return;
    openCheckout({
      priceId,
      userId: user.id,
      customerEmail: user.email ?? undefined,
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg p-0">
          <div className="p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sunset">
              🤙 Shakas
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
              {recipientName ? `Thank ${recipientName} with a Shaka` : "Top up your Shakas"}
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              Shakas are small thank-yous you send to vibers who capture real-world signals. $2 a
              Shaka, paid in advance so tips stay friction free.
            </p>

            {user && (
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-surface/40 px-4 py-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    Your balance
                  </p>
                  <p className="mt-0.5 text-2xl font-extrabold tracking-tight">
                    {wallet.isLoading ? "…" : `${balance} 🤙`}
                  </p>
                </div>
                {recipientUserId && (
                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="rounded-full bg-sunset px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40"
                  >
                    {sent ? "Sent 🤙" : sending ? "Sending…" : "Send 1 Shaka"}
                  </button>
                )}
              </div>
            )}

            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                {balance > 0 ? "Top up more" : "Get your first pack"}
              </p>
              <div className="mt-3 grid gap-3">
                {SHAKA_PACKS.map((p) => (
                  <button
                    key={p.priceId}
                    onClick={() => handleBuy(p.priceId)}
                    disabled={!user}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-4 text-left transition-all hover:border-sunset/50 disabled:opacity-50"
                  >
                    <div>
                      <p className="text-lg font-bold tracking-tight">{p.label}</p>
                      <p className="text-xs text-foreground/55">{p.tagline}</p>
                    </div>
                    <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background">
                      ${(p.priceCents / 100).toFixed(0)}
                    </span>
                  </button>
                ))}
              </div>
              {!user && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                  Sign in to buy a pack
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={checkoutOpen} onOpenChange={(o) => !o && closeCheckout()}>
        <DialogContent className="max-w-md p-0 overflow-hidden max-h-[85vh] overflow-y-auto">{checkoutElement}</DialogContent>
      </Dialog>
    </>
  );
}
