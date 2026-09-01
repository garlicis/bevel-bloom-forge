import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { fetchPublishedGuides } from "@/lib/guides";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides — Bevel & Bloom" },
      {
        name: "description",
        content:
          "Technique and tool guides for lash, brow, nail, and barber professionals — from tweezer selection to sterilization.",
      },
      { property: "og:title", content: "Guides — Bevel & Bloom" },
      {
        property: "og:description",
        content:
          "Technique and tool guides for lash, brow, nail, and barber professionals.",
      },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: GuidesLayout,
});

function GuidesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/guides") return <Outlet />;

  return <GuidesIndex />;
}

function GuidesIndex() {
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ["guides"],
    queryFn: fetchPublishedGuides,
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <p className="eyebrow text-muted-foreground">The Studio Journal</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Guides</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Technique notes and tool guidance from the bench — written for working
        professionals, not marketing copy.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading guides…</p>
        ) : guides.length === 0 ? (
          <p className="text-sm text-muted-foreground">No guides published yet.</p>
        ) : (
          guides.map((guide) => (
            <Link
              key={guide.id}
              to="/guides/$slug"
              params={{ slug: guide.slug }}
              className="group rounded-sm border border-border bg-card p-6 shadow-soft transition-colors hover:border-foreground/30"
            >
              <p className="eyebrow text-muted-foreground">{guide.category}</p>
              <h2 className="display mt-2 text-xl leading-snug group-hover:underline">
                {guide.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {guide.excerpt}
              </p>
              <span className="mt-4 inline-block text-xs font-medium uppercase tracking-wider text-primary">
                Read guide
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
