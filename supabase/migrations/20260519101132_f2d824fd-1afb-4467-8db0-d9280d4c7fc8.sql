-- Track founding members: one row per user, with a sequential founding number for the Founding Wall.
create table public.founding_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  founding_number bigint generated always as identity,
  stripe_session_id text unique,
  price_id text not null,
  claimed_at timestamptz not null default now()
);

alter table public.founding_members enable row level security;

-- Public read: the Founding Wall is a public roster.
create policy "Founding members are publicly visible"
  on public.founding_members for select
  using (true);

-- Only the service role (webhook) can write.
create policy "Service role manages founding members"
  on public.founding_members for all
  using (auth.role() = 'service_role');

-- Idempotent claim: insert a founding row and credit 5 Shakas in one shot.
create or replace function public.claim_founding_member(
  p_user uuid,
  p_price_id text,
  p_session_id text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Idempotent on session id
  if exists (select 1 from public.founding_members where stripe_session_id = p_session_id) then
    return;
  end if;

  insert into public.founding_members (user_id, price_id, stripe_session_id)
    values (p_user, p_price_id, p_session_id)
    on conflict (user_id) do nothing;

  -- Credit 5 welcome Shakas (reuses existing purchase RPC; idempotent on session id)
  perform public.credit_shaka_purchase(p_user, 5, p_price_id, p_session_id);
end;
$$;