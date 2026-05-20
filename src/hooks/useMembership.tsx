import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";
import { FRINGE_MEMBERSHIP_PRICE_ID } from "@/lib/pricing-ids";

type State = { isMember: boolean; loading: boolean };

/**
 * A user is a "member" if they have an active FRiNGE Membership subscription.
 * Founding Member status is a perk/badge — it does NOT grant membership.
 */
export function useMembership(): State {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<State>({ isMember: false, loading: true });
  const env = getStripeEnvironment();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setState({ isMember: false, loading: false });
      return;
    }
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("price_id, status, current_period_end")
        .eq("user_id", user.id)
        .eq("environment", env)
        .eq("price_id", FRINGE_MEMBERSHIP_PRICE_ID)
        .order("created_at", { ascending: false });

      const now = Date.now();
      const active = (data || []).some((s) => {
        const end = s.current_period_end ? new Date(s.current_period_end).getTime() : Infinity;
        if (["active", "trialing", "past_due"].includes(s.status)) return end > now;
        if (s.status === "canceled") return end > now;
        return false;
      });
      if (!cancelled) setState({ isMember: active, loading: false });
    };

    check();
    const channel = supabase.channel(`membership-${user.id}`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        check
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id, authLoading, env]);

  return state;
}
