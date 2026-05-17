import { UnlockButton } from "@/components/UnlockButton";
import { SHAKA_PRICE_ID } from "@/lib/pricing-ids";

type Props = {
  viberName?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Send a Shaka — small tip to support a viber for capturing a real-time vibe.
 * Defaults to $3 (configured on the `shaka_tip` Paddle price).
 */
export function ShakaButton({ viberName, className, children }: Props) {
  return (
    <UnlockButton
      priceId={SHAKA_PRICE_ID}
      reason={viberName ? `Send ${viberName} a Shaka` : "Send a Shaka"}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full border border-sunset/30 bg-sunset/10 px-3 py-1.5 text-xs font-bold text-sunset transition-colors hover:bg-sunset/20 disabled:opacity-60"
      }
    >
      {children ?? <>🤙 Send a Shaka</>}
    </UnlockButton>
  );
}
