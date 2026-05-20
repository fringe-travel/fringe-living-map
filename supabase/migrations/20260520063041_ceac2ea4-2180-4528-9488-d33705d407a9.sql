
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  region_slug text NOT NULL,
  category text NOT NULL,
  discount_label text NOT NULL,
  redemption_code text NOT NULL,
  url text,
  logo_url text,
  blurb text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active partners are publicly visible"
  ON public.partners FOR SELECT
  USING (active = true);

CREATE POLICY "Service role manages partners"
  ON public.partners FOR ALL
  USING (auth.role() = 'service_role');

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.partners (slug, name, region_slug, category, discount_label, redemption_code, url, blurb) VALUES
  ('cascade-kiteboarding', 'Cascade Kiteboarding', 'hood-river', 'Kite school & shop', '15% off lessons & rentals', 'FRINGE15', 'https://cascadekiteboarding.com', 'Gorge-based kite school and shop. Lessons, gear, and the people who actually ride here.'),
  ('sunny-side-cafe', 'Sunny Side Cafe', 'boracay', 'Cafe', '10% off your bill', 'FRINGE10', 'https://sunnysideboracay.com', 'Island breakfast institution on Station 1. Smoothie bowls, eggs, strong coffee.'),
  ('zes-kite-school', 'Ze''s Kite School', 'rio', 'Kite school', '20% off intro lessons', 'FRINGERIO', 'https://zeskiteschool.com', 'Barra-based kite school run by a Rio local. Beginner-friendly, gear included.');
