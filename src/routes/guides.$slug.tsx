import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { fetchGuideBySlug, guideParagraphs } from "@/lib/guides";
import { FAQJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { SLUG_BY_CATEGORY, type Category } from "@/lib/store";

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }) => {
    const guide = await fetchGuideBySlug(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Guide not found — Bevel & Bloom" }, { name: "robots", content: "noindex" }],
      };
    }
    const { guide } = loaderData;
    const title = `${guide.title} — Bevel & Bloom`;
    const path = `/guides/${guide.slug}`;
    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": guide.is_howto ? "HowTo" : "Article",
          headline: guide.title,
          description: guide.excerpt,
          ...(guide.is_howto
            ? {
                step: guideParagraphs(guide.body).map((text, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  text,
                })),
              }
            : { articleBody: guide.body }),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path },
          ]),
        ),
      },
      ...(guide.faq?.length
        ? [{ type: "application/ld+json", children: JSON.stringify(FAQJsonLd(guide.faq)) }]
        : []),
    ];
    return {
      meta: [
        { title },
        { name: "description", content: guide.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: guide.excerpt },
        { property: "og:url", content: path },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts,
    };
  },
  component: GuidePage,
});

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Render [text](url) markdown-style links inside guide body text. */
function renderWithLinks(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href] = match;
    if (href.startsWith("/")) {
      parts.push(
        <Link key={match.index} to={href} className="text-primary underline underline-offset-2">
          {label}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {label}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const paragraphs = guideParagraphs(guide.body);
  const categorySlug = SLUG_BY_CATEGORY[guide.category as Category];

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/guides" className="hover:text-foreground">
          Guides
        </Link>
        <span className="mx-2">/</span>
        {categorySlug ? (
          <Link
            to="/shop/$category"
            params={{ category: categorySlug }}
            className="hover:text-foreground"
          >
            {guide.category}
          </Link>
        ) : (
          <span>{guide.category}</span>
        )}
      </nav>

      <p className="eyebrow mt-8 text-muted-foreground">{guide.category}</p>
      <h1 className="display mt-3 text-3xl leading-tight sm:text-4xl">{guide.title}</h1>

      {guide.is_howto ? (
        <ol className="mt-10 space-y-6">
          {paragraphs.map((step, i) => {
            const split = step.match(/^([^.]+\.)\s*(.*)$/s);
            return (
              <li key={i} className="flex gap-4">
                <span className="display flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-sm">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {split ? (
                    <>
                      <strong className="font-medium text-foreground">{split[1]}</strong>{" "}
                      {split[2]}
                    </>
                  ) : (
                    step
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mt-10 space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {renderWithLinks(p)}
            </p>
          ))}
        </div>
      )}

      {guide.is_howto && (
        <p className="mt-8 rounded-sm border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          Note: general maintenance practice, not a substitute for your local cosmetology
          board's specific sanitation requirements.
        </p>
      )}

      {guide.faq && guide.faq.length > 0 && (
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="display text-2xl">Common Questions</h2>
          <div className="mt-6 space-y-6">
            {guide.faq.map((item, i) => (
              <div key={i}>
                <h3 className="text-sm font-medium">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
