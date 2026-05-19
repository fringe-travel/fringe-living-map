
-- Wallet: one row per user, current Shaka balance
create table public.shaka_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 0,
  lifetime_purchased integer not null default 0,
  lifetime_sent integer not null default 0,
  lifetime_received integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint balance_non_negative check (balance >= 0)
);

alter table public.shaka_wallets enable row level security;

create policy "Users can view own wallet"
  on public.shaka_wallets for select
  using (auth.uid() = user_id);

create policy "Service role manages wallets"
  on public.shaka_wallets for all
  using (auth.role() = 'service_role');

-- Transactions: audit trail of every Shaka movement
create table public.shaka_transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('purchase', 'send', 'receive', 'bonus')),
  user_id uuid not null references auth.users(id) on delete cascade,
  counterparty_user_id uuid references auth.users(id) on delete set null,
  amount integer not null check (amount > 0),
  price_id text,
  stripe_session_id text unique,
  note text,
  created_at timestamptz not null default now()
);

create index idx_shaka_tx_user on public.shaka_transactions(user_id, created_at desc);
create index idx_shaka_tx_counterparty on public.shaka_transactions(counterparty_user_id);

alter table public.shaka_transactions enable row level security;

create policy "Users can view own transactions"
  on public.shaka_transactions for select
  using (auth.uid() = user_id);

create policy "Service role manages transactions"
  on public.shaka_transactions for all
  using (auth.role() = 'service_role');

create trigger update_shaka_wallets_updated_at
  before update on public.shaka_wallets
  for each row execute function public.update_updated_at_column();

-- Atomic send: debit sender, credit recipient, log both sides
create or replace function public.send_shakas(
  p_sender uuid,
  p_recipient uuid,
  p_amount integer,
  p_note text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sender_balance integer;
begin
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  if p_sender = p_recipient then raise exception 'Cannot send Shakas to yourself'; end if;

  -- Ensure both wallets exist
  insert into public.shaka_wallets (user_id) values (p_sender)
    on conflict (user_id) do nothing;
  insert into public.shaka_wallets (user_id) values (p_recipient)
    on conflict (user_id) do nothing;

  -- Lock sender row, check balance
  select balance into v_sender_balance
    from public.shaka_wallets
    where user_id = p_sender
    for update;

  if v_sender_balance < p_amount then
    raise exception 'Insufficient Shaka balance';
  end if;

  update public.shaka_wallets
    set balance = balance - p_amount,
        lifetime_sent = lifetime_sent + p_amount
    where user_id = p_sender;

  update public.shaka_wallets
    set balance = balance + p_amount,
        lifetime_received = lifetime_received + p_amount
    where user_id = p_recipient;

  insert into public.shaka_transactions (kind, user_id, counterparty_user_id, amount, note)
    values ('send', p_sender, p_recipient, p_amount, p_note);
  insert into public.shaka_transactions (kind, user_id, counterparty_user_id, amount, note)
    values ('receive', p_recipient, p_sender, p_amount, p_note);
end;
$$;

-- Credit a purchased pack (called from webhook)
create or replace function public.credit_shaka_purchase(
  p_user uuid,
  p_amount integer,
  p_price_id text,
  p_session_id text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;

  -- Idempotent: skip if this session was already credited
  if exists (select 1 from public.shaka_transactions where stripe_session_id = p_session_id) then
    return;
  end if;

  insert into public.shaka_wallets (user_id) values (p_user)
    on conflict (user_id) do nothing;

  update public.shaka_wallets
    set balance = balance + p_amount,
        lifetime_purchased = lifetime_purchased + p_amount
    where user_id = p_user;

  insert into public.shaka_transactions (kind, user_id, amount, price_id, stripe_session_id)
    values ('purchase', p_user, p_amount, p_price_id, p_session_id);
end;
$$;
