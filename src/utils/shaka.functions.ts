import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

let _admin: ReturnType<typeof createClient<Database>> | null = null;
function admin() {
  if (!_admin) {
    _admin = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _admin;
}

export const getShakaWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await admin()
      .from("shaka_wallets")
      .select("balance, lifetime_purchased, lifetime_sent, lifetime_received")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? { balance: 0, lifetime_purchased: 0, lifetime_sent: 0, lifetime_received: 0 };
  });

export const sendShaka = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { recipientUserId: string; amount?: number; note?: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(data.recipientUserId)) throw new Error("Invalid recipient");
    const amount = data.amount ?? 1;
    if (!Number.isInteger(amount) || amount < 1 || amount > 50) throw new Error("Invalid amount");
    const note = data.note?.slice(0, 200);
    return { recipientUserId: data.recipientUserId, amount, note };
  })
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await admin().rpc("send_shakas", {
      p_sender: userId,
      p_recipient: data.recipientUserId,
      p_amount: data.amount,
      p_note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
