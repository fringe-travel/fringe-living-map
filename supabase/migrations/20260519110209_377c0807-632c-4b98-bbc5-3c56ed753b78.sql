-- Allow Shaka transactions to record redemption + free unlocks
alter table public.shaka_transactions
  drop constraint if exists shaka_transactions_kind_check;

alter table public.shaka_transactions
  add constraint shaka_transactions_kind_check
  check (kind in ('purchase', 'send', 'receive', 'redeem', 'unlock'));

-- Redeem Shakas as discount on a Stripe checkout session.
-- Called from the payments webhook after checkout.session.completed.
-- Idempotent on stripe_session_id so retries don't double-debit.
create or replace function public.redeem_shakas_for_purchase(
  p_user uuid,
  p_amount integer,
  p_price_id text,
  p_session_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;

  -- Idempotent: skip if this session already redeemed
  if exists (
    select 1 from public.shaka_transactions
    where stripe_session_id = p_session_id and kind = 'redeem'
  ) then
    return;
  end if;

  -- Ensure wallet exists, lock the row
  insert into public.shaka_wallets (user_id) values (p_user)
    on conflict (user_id) do nothing;

  select balance into v_balance
    from public.shaka_wallets
    where user_id = p_user
    for update;

  if v_balance < p_amount then
    raise exception 'Insufficient Shaka balance (have %, need %)', v_balance, p_amount;
  end if;

  update public.shaka_wallets
    set balance = balance - p_amount
    where user_id = p_user;

  insert into public.shaka_transactions (kind, user_id, amount, price_id, stripe_session_id)
    values ('redeem', p_user, p_amount, p_price_id, p_session_id);
end;
$$;

-- Fully unlock a one-time purchase using Shakas only (no Stripe).
-- Debits the wallet and returns success; the caller writes the grant
-- (region_access row, founding_member row, etc.) using the returned id.
-- Idempotent on p_external_id so retries don't double-debit.
create or replace function public.unlock_with_shakas(
  p_user uuid,
  p_amount integer,
  p_price_id text,
  p_external_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;

  if exists (
    select 1 from public.shaka_transactions
    where stripe_session_id = p_external_id and kind = 'unlock'
  ) then
    return;
  end if;

  insert into public.shaka_wallets (user_id) values (p_user)
    on conflict (user_id) do nothing;

  select balance into v_balance
    from public.shaka_wallets
    where user_id = p_user
    for update;

  if v_balance < p_amount then
    raise exception 'Insufficient Shaka balance (have %, need %)', v_balance, p_amount;
  end if;

  update public.shaka_wallets
    set balance = balance - p_amount
    where user_id = p_user;

  insert into public.shaka_transactions (kind, user_id, amount, price_id, stripe_session_id)
    values ('unlock', p_user, p_amount, p_price_id, p_external_id);
end;
$$;