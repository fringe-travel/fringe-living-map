import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { ShakaPacksDialog } from "@/components/ShakaPacksDialog";

type Props = {
  viberName?: string;
  viberUserId?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Opens the Shaka wallet dialog. If a recipient (viberUserId) is provided, the
 * dialog also exposes a one-tap send action that decrements the wallet balance.
 * If no recipient is provided, it acts purely as a wallet top-up.
 */
export function ShakaButton({ viberName, viberUserId, className, children }: Props) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setWalletOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={
          className ??
          "inline-flex items-center gap-1.5 rounded-full border border-sunset/30 bg-sunset/10 px-3 py-1.5 text-xs font-bold text-sunset transition-colors hover:bg-sunset/20"
        }
      >
        {children ?? <>🤙 Send a Shaka</>}
      </button>

      <AuthDialog
        open={authOpen}
        reason={viberName ? `Sign in to thank ${viberName}` : "Sign in to send Shakas"}
        onClose={() => setAuthOpen(false)}
        onAuthed={() => {
          setAuthOpen(false);
          setWalletOpen(true);
        }}
      />

      <ShakaPacksDialog
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        recipientUserId={viberUserId}
        recipientName={viberName}
      />
    </>
  );
}
