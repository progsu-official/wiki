import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { GUIDE_CATEGORIES } from "../consts";

// container pages: the category listings themselves, plus any nested
// "card index" pages that behave the same way (e.g. roadmap-by-year).
// These are excluded from the pages list below so they don't show twice.
const CONTAINER_ONLY_SLUGS = new Set(["zero-to-hero/roadmap-by-year"]);

export const GET: APIRoute = async () => {
  const containers = [
    ...Object.entries(GUIDE_CATEGORIES).map(([slug, meta]) => ({
      type: "container" as const,
      title: meta.label,
      href: `/guides/${slug}`,
    })),
    {
      type: "container" as const,
      title: "Roadmap by year",
      href: "/guides/zero-to-hero/roadmap-by-year",
    },
  ];

  const entries = await getCollection("guides");
  const pages = entries
    .filter((entry) => !CONTAINER_ONLY_SLUGS.has(entry.slug))
    .map((entry) => {
      const category = entry.slug.split("/")[0];
      return {
        type: "page" as const,
        title: entry.data.title,
        href: `/guides/${entry.slug}`,
        category: GUIDE_CATEGORIES[entry.data.category]?.label ?? category,
        tags: entry.data.tags,
      };
    });

  return new Response(JSON.stringify({ containers, pages }), {
    headers: { "Content-Type": "application/json" },
  });
};
