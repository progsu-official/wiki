import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import GithubSlugger from "github-slugger";
import { GUIDE_CATEGORIES } from "../consts";

// container pages: the category listings themselves, plus any nested
// "card index" pages that behave the same way (e.g. roadmap-by-year).
// These are excluded from the pages list below so they don't show twice.
const CONTAINER_ONLY_SLUGS = new Set(["zero-to-hero/roadmap-by-year"]);

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Inline markdown as the reader sees it, so a snippet never shows syntax the
 * page doesn't render. Wikilinks resolve through `titles` because that is what
 * remark-wikilinks puts on the page: an unlabelled [[slug]] renders as the
 * target guide's title.
 */
function stripInline(markdown: string, titles: Map<string, string>) {
  return (
    markdown
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target: string, label?: string) =>
        label ? label.trim() : (titles.get(target.trim()) ?? target.trim())
      )
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/(\*\*|~~|\*)/g, "")
      // A run of underscores is a fill-in-the-blank the page renders as-is
      // ("work for _____?"); only a lone pair is emphasis.
      .replace(/(?<!_)__(?!_)/g, "")
      .replace(/(?<![A-Za-z0-9_])_(?=[^\s_])|(?<=[^\s_])_(?![A-Za-z0-9_])/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Block markdown flattened to prose. Only ever applied to a section's body —
 * a heading goes through stripInline alone, because the list-marker rule here
 * would eat the "1." out of "## 1. your headline" and take the anchor with it.
 */
function toPlainText(markdown: string, titles: Map<string, string>) {
  const blocks = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^\s*(?:[-*_]\s*){3,}$/gm, " ")
    .replace(/^\s{0,3}>\s?/gm, "")
    // Obsidian callout markers, per remark-callouts.mjs — the rendered page
    // turns "[!tip]" into a label, so it shouldn't sit in a snippet.
    .replace(/^\[!(\w+)\][ \t]*/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/\|/g, " ");
  return stripInline(blocks, titles);
}

type Section = { heading: string; slug: string; text: string };

/**
 * Split a guide into one section per heading so a body hit can deep-link to
 * the part of the page it came from. Slugs come from github-slugger because
 * that is what Astro's own heading anchors use — remark-demote-headings
 * changes a heading's level but never its text, so the two agree.
 *
 * Two kinds of section deliberately carry no anchor: text above the first
 * heading, and a lede heading that just repeats the title (the guide layout
 * hides that one, so scrolling to it would land the reader nowhere).
 */
function toSections(markdown: string, title: string, titles: Map<string, string>): Section[] {
  const slugger = new GithubSlugger();
  const sections: Section[] = [];
  let current: Section = { heading: "", slug: "", text: "" };
  let buffer: string[] = [];
  let inFence = false;

  const flush = () => {
    const text = toPlainText(buffer.join("\n"), titles);
    if (text) sections.push({ ...current, text });
    buffer = [];
  };

  for (const line of markdown.split("\n")) {
    if (/^\s{0,3}```/.test(line)) inFence = !inFence;

    const heading = inFence ? null : line.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
    if (!heading) {
      buffer.push(line);
      continue;
    }

    flush();
    const text = stripInline(heading[2].replace(/\s*#+\s*$/, ""), titles);
    const isLede = sections.length === 0 && norm(text) === norm(title);
    current = { heading: text, slug: isLede ? "" : slugger.slug(text), text: "" };
  }
  flush();

  return sections;
}

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

  const categoryOrder = Object.keys(GUIDE_CATEGORIES);

  const entries = await getCollection("guides");
  const titles = new Map(
    entries.map((entry) => [entry.slug.split("/").pop()!, entry.data.title] as const)
  );

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
        _categorySlug: category,
        sections: toSections(entry.body, entry.data.title, titles),
      };
    })
    .sort((a, b) => categoryOrder.indexOf(a._categorySlug) - categoryOrder.indexOf(b._categorySlug))
    .map(({ _categorySlug, ...page }) => page);

  return new Response(JSON.stringify({ containers, pages }), {
    headers: { "Content-Type": "application/json" },
  });
};
