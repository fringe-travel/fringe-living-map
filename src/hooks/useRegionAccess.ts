import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";

type AccessState = {
  hasAccess: boolean;
  reason: "global" | "region_monthly" | "day_pass" | null;
  loading: boolean;
  refetch: () => void;
};

export function useRegionAccess(regionSlug: string): AccessState {
  const { user } = useAuth();
  const [state, setState] = useState<AccessState>({
    hasAccess: false,
    reason: null,
    loading: true,
    refetch: () => {},
  });

  const env = getStripeEnvironment();

  const fetchAccess = async () => {
    if (!user) {
      setState((s) => ({ ...s, hasAccess: false, reason: null, loading: false }));
      return;
    }
    setState((s) => ({ ...s, loading: true }));

    // Active subscriptions
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("product_id, status, current_period_end")
      .eq("user_id", user.id)
      .eq("environment", env)
      .order("created_at", { ascending: false });

    const now = Date.now();
    const isSubActive = (s: any) => {
      const end = s.current_period_end ? new Date(s.current_period_end).getTime() : Infinity;
      if (["active", "trialing", "past_due"].includes(s.status)) return end > now;
      if (s.status === "canceled") return end > now;
      return false;
    };

    const activeSubs = (subs || []).filter(isSubActive);
    if (activeSubs.some((s: any) => s.product_id === "global_pass")) {
      setState({ hasAccess: true, reason: "global", loading: false, refetch: fetchAccess });
      return;
    }
    if (activeSubs.some((s: any) => s.product_id === `${regionSlug}_pass`)) {
      setState({ hasAccess: true, reason: "region_monthly", loading: false, refetch: fetchAccess });
      return;
    }

    // Day pass
    const { data: passes } = await supabase
      .from("region_access")
      .select("expires_at")
      .eq("user_id", user.id)
      .eq("region_slug", regionSlug)
      .eq("environment", env)
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    if (passes && passes.length > 0) {
      setState({ hasAccess: true, reason: "day_pass", loading: false, refetch: fetchAccess });
      return;
    }

    setState({ hasAccess: false, reason: null, loading: false, refetch: fetchAccess });
  };

  useEffect(() => {
    fetchAccess();
    // Realtime: refetch on any change to subscriptions or region_access for this user
    if (!user) return;
    const channel = supabase
      .channel(`access-${user.id}-${regionSlug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` }, fetchAccess)
      .on("postgres_changes", { event: "*", schema: "public", table: "region_access", filter: `user_id=eq.${user.id}` }, fetchAccess)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, regionSlug]);

  return { ...state, refetch: fetchAccess };
}
