import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { ShakaPacksDialog } from "@/components/ShakaPacksDialog";
import { getShakaWallet } from "@/utils/shaka.functions";

export function ShakaWalletBadge({ className }: { className?: string }) {
  const { user } = useAuth();
  const fetchWallet = useServerFn(getShakaWallet);
  const [open, setOpen] = useState(false);

  const wallet = useQuery({
    queryKey: ["shaka-wallet", user?.id],
    queryFn: () => fetchWallet({}),
    enabled: !!user,
  });

  if (!user) return null;
  const balance = wallet.data?.balance ?? 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Your Shaka balance"
        className={
          className ??
          "hidden items-center gap-1.5 rounded-full border border-sunset/30 bg-sunset/10 px-3 py-1.5 text-xs font-bold text-sunset transition-colors hover:bg-sunset/20 md:inline-flex"
        }
      >
        🤙 <span>{balance}</span>
      </button>
      <ShakaPacksDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
