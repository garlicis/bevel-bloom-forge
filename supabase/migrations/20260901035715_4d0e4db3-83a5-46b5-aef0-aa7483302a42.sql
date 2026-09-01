CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL,
  body text NOT NULL,
  faq jsonb,
  is_howto boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.guides TO anon;
GRANT SELECT ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published guides"
ON public.guides
FOR SELECT
TO anon, authenticated
USING (published = true);

INSERT INTO public.guides (slug, title, excerpt, category, body, faq, is_howto, published) VALUES
(
'isolation-vs-volume-lash-tweezers',
'Isolation vs. Volume Lash Tweezers: Which Grip Do You Need?',
'A quick breakdown of isolation and volume tweezer designs, and which one fits classic vs. volume lash sets.',
'Lash & Brow',
'Isolation tweezers are built for classic lash extension work — one extension applied to one natural lash at a time. They typically have a fine, precise, slightly curved or straight tip that lets a technician isolate a single natural lash cleanly, without catching the lashes next to it. Precision matters more than grip surface here, since the tool is doing delicate separation work rather than holding a fan of extensions.

Volume tweezers are shaped differently because the job is different. Volume lashing means picking up and fanning out multiple ultra-fine extensions (anywhere from 2 to 10+, depending on the set) before applying them to a single natural lash. Volume tweezers tend to have a longer, more curved boot or L-shaped tip that gives better control over holding and shaping that fan before it touches adhesive. Some technicians keep both on their station and switch depending on the client''s set; others specialize in one style. If you''re newer to lashing, isolation tweezers are usually the first pair mastered, since isolation is the foundational skill both styles build on.

Tip shape matters more than material for isolation-vs-volume, but material affects how the tweezers feel over a full appointment. Precision-forged stainless steel holds its point and tension far longer than stamped, budget alternatives — which matters when you''re doing multiple full sets a day.',
'[{"q":"Can I do volume sets with isolation tweezers?","a":"Technically yes for very small fans, but it gets difficult past 3-4 extensions per fan — volume tweezers are shaped specifically to make larger fans manageable."},{"q":"Do I need both types when I''m starting out?","a":"Most training programs recommend mastering isolation first, then adding volume tweezers once isolation technique is solid."}]'::jsonb,
false,
true
),
(
'choosing-lash-tweezers-hand-size-technique',
'How to Choose Lash Tweezers for Your Hand Size and Technique',
'What actually changes fit and control — grip length, curve angle, and tension — and how to match them to your hand and technique.',
'Lash & Brow',
'Tweezer length matters more than most beginners expect. A tweezer too long for your hand can feel unwieldy during fine isolation work, while one too short can cramp your grip over a multi-hour appointment. Most professional lash tweezers run between 4.5 and 5.5 inches — closer to 4.5" suits smaller hands or a tighter, more controlled pinch, while 5.5" gives more leverage for larger hands or a looser grip.

Curve angle changes what angle you can approach the lash line from. A straight or slightly curved tip works well for isolation directly at the lash base. A more pronounced curve (a "boot" tip on volume tweezers) makes it easier to approach at an angle without your hand blocking your view of the lash line.

Tension — how much resistance the tweezer gives when pinched — is a personal preference more than a technical rule. Lighter tension tends to reduce hand fatigue over long appointments; firmer tension can give more confident control for technicians who press harder out of habit. Test a few tension levels before committing if you can, since it''s the hardest spec to judge from a photo alone.

One practical tip: if you switch between isolation and volume work often, keep tension roughly consistent across both pairs — retraining your hand for two very different tensions mid-appointment is a common source of dropped extensions.',
NULL,
false,
true
),
(
'fiber-tip-vs-steel-tip-tweezers',
'Fiber-Tip vs. Traditional Steel-Tip Tweezers: Pros and Cons',
'What the textured fiber coating actually changes about grip, and when a bare steel tip is still the better choice.',
'Lash & Brow',
'Fiber-tip tweezers have a textured, non-slip coating applied to the gripping surface. The main benefit is grip: that texture holds an extension more securely than bare polished steel, which matters when holding a fan of volume extensions that want to slip before adhesive sets.

The tradeoff is precision at the very tip. Bare steel tips can be forged and honed to a marginally finer point than a coated tip allows, since the coating adds a small amount of material thickness. For very tight isolation work, some technicians prefer that finer point over the added grip.

Durability is roughly a wash between the two, assuming both are precision-forged rather than stamped — a quality fiber coating is bonded to hold up over daily use, not something that flakes off after a few sterilization cycles. Cheap coatings on stamped tools are a different story, which is part of why overall build quality matters more than tip material alone.

In practice: many volume technicians prefer fiber tips for the grip advantage on multi-extension fans, while some classic/isolation specialists stick with bare steel for the marginally finer point. Neither is objectively correct — it comes down to which set styles make up most of your work.',
NULL,
false,
true
),
(
'sterilize-maintain-lash-tweezers',
'How to Sterilize and Maintain Lash Tweezers Between Clients',
'A general maintenance routine for keeping tweezers hygienic and in good working condition between appointments.',
'Lash & Brow',
'Wipe immediately after use. Remove adhesive residue with a lint-free wipe before it fully cures — dried adhesive is far harder to remove and can affect tip alignment over time.

Disinfect between clients. Use an EPA-registered disinfectant appropriate for salon tools and follow the labeled contact time. Check your local cosmetology board''s specific requirements, since standards vary by state and country.

Deep-clean periodically. Beyond between-client disinfecting, a periodic soak or ultrasonic clean (per your disinfectant manufacturer''s instructions) helps clear residue near the hinge.

Dry fully before storage. Moisture left on stainless steel can eventually affect finish and hinge action over months of daily use.

Store tips protected. A tip guard or dedicated case prevents tips from knocking against other tools, one of the more common causes of misalignment.

Check alignment regularly. Close the tips gently and check they meet evenly with no visible gap. A tweezer slightly out of alignment gives less reliable isolation even if it still looks fine.',
NULL,
true,
true
);