
CREATE TABLE public.viber_follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  viber_handle text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, viber_handle)
);

CREATE INDEX idx_viber_follows_user ON public.viber_follows(user_id);
CREATE INDEX idx_viber_follows_handle ON public.viber_follows(viber_handle);

ALTER TABLE public.viber_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own follows"
  ON public.viber_follows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own follows"
  ON public.viber_follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own follows"
  ON public.viber_follows FOR DELETE
  USING (auth.uid() = user_id);

-- Public follower counts (aggregate, no user_id exposed)
CREATE VIEW public.viber_follow_counts
WITH (security_invoker=on) AS
SELECT viber_handle, count(*)::int AS followers
FROM public.viber_follows
GROUP BY viber_handle;
