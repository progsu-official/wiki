export const SITE_TITLE = "progsu Wiki";
export const SITE_DESCRIPTION =
  "The official knowledge base for progsu, with guides and resources for CS students at GSU.";

// courses lives at src/pages/_courses/ and is not routed yet — the link goes
// back in the moment that directory loses its underscore.
export const NAV_LINKS = [
  { label: "guides", href: "/guides" },
  { label: "progsu.com", href: "https://progsu.com" },
] as const;

export const SOCIAL_LINKS = [
  { label: "discord", href: "https://discord.com/invite/GjyeW2Mh6q" },
  { label: "instagram", href: "https://www.instagram.com/progsuhq?igsh=cWQ5OTR3ZjBiMTdw" },
  { label: "linkedin", href: "https://linkedin.com/company/progsu" },
  { label: "github", href: "https://github.com/progsu-official" },
] as const;

export const GUIDE_CATEGORIES = {
  "zero-to-hero": { label: "Zero to Hero" },
  career: { label: "Career" },
  technical: { label: "Technical" },
  networking: { label: "Networking" },
  misc: { label: "Misc" },
} as const;
