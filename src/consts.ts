export const SITE_TITLE = "progsu Wiki";
export const SITE_DESCRIPTION =
  "The official knowledge base for progsu, with guides and resources for CS students at GSU.";

export const NAV_LINKS = [
  { label: "Guides", href: "/guides" },
  { label: "progsu.com", href: "https://progsu.com" },
  { label: "Blog", href: "/blog" },
] as const;

export const GUIDE_CATEGORIES = {
  "zero-to-hero": { label: "Zero to Hero", accent: "purple" },
  career: { label: "Career", accent: "purple" },
  technical: { label: "Technical", accent: "purple" },
  networking: { label: "Networking", accent: "cyan" },
  misc: { label: "Misc", accent: "purple" },
} as const;
