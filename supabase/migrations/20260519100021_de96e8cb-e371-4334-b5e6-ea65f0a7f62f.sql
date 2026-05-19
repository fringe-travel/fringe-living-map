
-- Create shared demo viber auth user (idempotent)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  'de70de70-de70-de70-de70-de70de70de70',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo-viber@fringe.local',
  crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Demo Viber"}'::jsonb,
  false,
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Pre-create the wallet row
INSERT INTO public.shaka_wallets (user_id)
VALUES ('de70de70-de70-de70-de70-de70de70de70')
ON CONFLICT (user_id) DO NOTHING;
