CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can see admin list" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = _user_id)
$$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('Lash & Brow','Nail & Cuticle','Barber & Hair','Kits')),
  price numeric NOT NULL,
  cost numeric,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Public role can read everything EXCEPT the internal cost column
GRANT SELECT (id, name, description, category, price, image_url, created_at, updated_at) ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" ON public.products FOR SELECT TO anon USING (true);
CREATE POLICY "Admins can view products" ON public.products FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (name, description, category, price, cost, image_url) VALUES
('Pro-Grip Fiber Tip Lash Tweezers', 'Hand-honed fiber tips for isolation and volume fanning. Anti-glare matte finish, perfectly balanced in the hand.', 'Lash & Brow', 24.00, 7.50, '/seed/lash-tweezers.jpg'),
('Heavy-Duty Podiatry Nipper', 'Forged 420 stainless with a double-spring action and precision-ground jaws for thick, resistant nails.', 'Nail & Cuticle', 28.00, 9.00, '/seed/podiatry-nipper.jpg'),
('12-Piece Leather Travel Grooming Kit', 'A complete manicure and pedicure set in a soft blush leather roll. Everything honed, cased, and travel ready.', 'Kits', 45.00, 16.00, '/seed/grooming-kit.jpg'),
('6-inch Convex Edge Barber Shear', 'Mirror-polished convex blades with an adjustable tension knob for silent, effortless slice cutting.', 'Barber & Hair', 65.00, 22.00, '/seed/barber-shear.jpg');

ALTER PUBLICATION supabase_realtime ADD TABLE public.products;