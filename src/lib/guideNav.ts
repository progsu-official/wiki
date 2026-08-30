import { getCollection } from "astro:content";
import { GUIDE_CATEGORIES } from "../consts";

export interface NavItem {
  text: string;
  link: string;
  items: NavItem[];
}

export interface NavGroup {
  text: string;
  link: string;
  items: NavItem[];
}

const CATEGORY_ORDER = ["zero-to-hero", "career", "technical", "networking", "misc"] as const;

/**
 * Curated reading order, keyed by parent slug. A guide that isn't listed sorts
 * after the curated ones, alphabetically — so a new vault guide shows up on its
 * own instead of silently vanishing from the sidebar.
 */
const ORDER: Record<string, string[]> = {
  "zero-to-hero": [
    "getting-started",
    "picking-your-endgame",
    "building-experience-early",
    "landing-your-first-internship",
    "roadmap-by-year",
  ],
  "zero-to-hero/roadmap-by-year": ["freshman-year", "sophomore-year", "junior-year", "senior-year"],
  career: ["resume-guide", "interview-guide"],
  networking: ["linkedin-guide", "referrals-guide", "local-atl-resources"],
};

function rank(parent: string, segment: string): number {
  const order = ORDER[parent];
  if (!order) return Number.MAX_SAFE_INTEGER;
  const i = order.indexOf(segment);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

export async function getGuideNav(): Promise<{ groups: NavGroup[]; flat: NavItem[] }> {
  const entries = await getCollection("guides");
  const titles = new Map(entries.map((e) => [e.slug, e.data.title]));
  const slugs = entries.map((e) => e.slug);

  const label = (slug: string) => (titles.get(slug) ?? slug.split("/").pop() ?? slug).toLowerCase();

  // Nests by slug depth, so a guide that gains children later needs no change here.
  const build = (parent: string): NavItem[] => {
    const depth = parent.split("/").length + 1;
    return slugs
      .filter((s) => s.startsWith(`${parent}/`) && s.split("/").length === depth)
      .sort((a, b) => {
        const ra = rank(parent, a.split("/").pop()!);
        const rb = rank(parent, b.split("/").pop()!);
        return ra !== rb ? ra - rb : label(a).localeCompare(label(b));
      })
      .map((s) => ({ text: label(s), link: `/guides/${s}`, items: build(s) }));
  };

  const groups = CATEGORY_ORDER.map((cat) => ({
    text: GUIDE_CATEGORIES[cat].label.toLowerCase(),
    link: `/guides/${cat}`,
    items: build(cat),
  })).filter((g) => g.items.length > 0);

  // Depth-first, matching reading order — this is what prev/next walks.
  const flat: NavItem[] = [];
  const walk = (items: NavItem[]) => {
    for (const item of items) {
      flat.push(item);
      walk(item.items);
    }
  };
  for (const g of groups) walk(g.items);

  return { groups, flat };
}
