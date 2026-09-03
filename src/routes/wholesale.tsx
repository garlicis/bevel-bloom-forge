import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

/** [FILL IN: wholesale contact email] — replace with the real address. */
const WHOLESALE_EMAIL = "[FILL IN: wholesale contact email]";

const TITLE = "Wholesale & Bulk Orders — Bevel & Bloom";
const DESCRIPTION =
  "Custom wholesale and bulk orders for salons, studios, barbershops, beauty schools, and resellers. No fixed minimums — tell us what you need and we'll quote it.";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/wholesale" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/wholesale" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Wholesale & Bulk Orders",
          url: "/wholesale",
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Organization",
            name: "Bevel & Bloom",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "wholesale",
              email: WHOLESALE_EMAIL,
              availableLanguage: "English",
            },
          },
        }),
      },
    ],
  }),
  component: WholesalePage,
});

const BUSINESS_TYPES = [
  "Salon/Spa",
  "Barbershop",
  "School",
  "Distributor/Reseller",
  "Other",
] as const;

const schema = z.object({
  business_name: z.string().trim().min(1, "Business name is required").max(120),
  business_type: z.enum(BUSINESS_TYPES),
  interest: z
    .string()
    .trim()
    .min(1, "Tell us roughly which products and quantities you need")
    .max(2000),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional(),
});

const WHO_ITS_FOR = [
  "Salons and spas",
  "Barbershops",
  "Beauty and cosmetology schools",
  "Distributors and resellers",
];

function WholesalePage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse({
      business_name: String(data['business_name'] ?? ""),
      business_type: String(data['business_type'] ?? ""),
      interest: String(data['interest'] ?? ""),
      email: String(data['email'] ?? ""),
      phone: String(data['phone'] ?? ""),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("wholesale_inquiries").insert({
      business_name: parsed.data.business_name,
      business_type: parsed.data.business_type,
      interest: parsed.data.interest,
      email: parsed.data.email,
      phone: parsed.data.phone ? parsed.data.phone : null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please email us instead.");
      return;
    }

    form.reset();
    setDone(true);
    toast.success("Inquiry received — we'll follow up with a quote.");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">Trade</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Wholesale &amp; Bulk Orders</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Bevel &amp; Bloom works with salons, studios, barbershops, beauty schools, and resellers on
        custom wholesale orders — no fixed minimums, no fixed price list. Tell us what you need and
        we&apos;ll put together a quote.
      </p>

      <section className="mt-12 border-t border-border/70 pt-8">
        <h2 className="text-base font-medium sm:text-lg">Who this is for</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {WHO_ITS_FOR.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-border/70 pt-8">
        <h2 className="text-base font-medium sm:text-lg">How it works</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We don&apos;t publish a fixed minimum order quantity or wholesale price list — order size,
          product mix, and pricing are worked out per inquiry based on what you need. Reach out with
          a rough idea of the products and quantities you&apos;re interested in, and we&apos;ll
          follow up with a custom quote.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Prefer email? Write to{" "}
          <a href={`mailto:${WHOLESALE_EMAIL}`} className="text-foreground underline">
            {WHOLESALE_EMAIL}
          </a>{" "}
          instead of using the form — either way reaches us.
        </p>
      </section>

      <section className="mt-8 border-t border-border/70 pt-8">
        <h2 className="text-base font-medium sm:text-lg">Request a quote</h2>
        {done ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Thanks — your inquiry is in. We&apos;ll follow up by email with a custom quote. You can
            also reach us at {WHOLESALE_EMAIL}.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business name</Label>
              <Input id="business_name" name="business_name" maxLength={120} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">Business type</Label>
              <select
                id="business_type"
                name="business_type"
                defaultValue={BUSINESS_TYPES[0]}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest">Products / quantities of interest</Label>
              <Textarea id="interest" name="interest" rows={5} maxLength={2000} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" maxLength={255} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" maxLength={40} />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send inquiry"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
