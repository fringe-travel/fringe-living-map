CREATE TABLE public.investor_interest (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  accredited boolean NOT NULL DEFAULT false,
  message text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.investor_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit interest"
ON public.investor_interest
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 255
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 2000)
);

CREATE POLICY "Service role manages investor interest"
ON public.investor_interest
FOR ALL
USING (auth.role() = 'service_role');

CREATE INDEX idx_investor_interest_created_at ON public.investor_interest (created_at DESC);