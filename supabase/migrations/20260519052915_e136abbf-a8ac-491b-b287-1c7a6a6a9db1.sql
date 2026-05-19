CREATE OR REPLACE FUNCTION public.has_region_access(user_uuid uuid, region text, check_env text DEFAULT 'live'::text)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    exists (
      select 1 from public.subscriptions
      where user_id = user_uuid
      and environment = check_env
      and price_id = 'global_pass'
      and (
        (status in ('active','trialing','past_due') and (current_period_end is null or current_period_end > now()))
        or (status = 'canceled' and current_period_end > now())
      )
    )
    or exists (
      select 1 from public.subscriptions
      where user_id = user_uuid
      and environment = check_env
      and price_id = region || '_pass'
      and (
        (status in ('active','trialing','past_due') and (current_period_end is null or current_period_end > now()))
        or (status = 'canceled' and current_period_end > now())
      )
    )
    or exists (
      select 1 from public.region_access
      where user_id = user_uuid
      and environment = check_env
      and region_slug = region
      and expires_at > now()
    );
$function$;