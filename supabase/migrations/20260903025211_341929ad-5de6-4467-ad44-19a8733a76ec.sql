CREATE TABLE public.wholesale_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  business_type text NOT NULL,
  interest text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.wholesale_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wholesale_inquiries TO authenticated;
GRANT ALL ON public.wholesale_inquiries TO service_role;

ALTER TABLE public.wholesale_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a wholesale inquiry"
  ON public.wholesale_inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view wholesale inquiries"
  ON public.wholesale_inquiries FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update wholesale inquiries"
  ON public.wholesale_inquiries FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete wholesale inquiries"
  ON public.wholesale_inquiries FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_wholesale_inquiries_updated_at
  BEFORE UPDATE ON public.wholesale_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();