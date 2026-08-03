import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkWikilinks } from "./src/lib/remark-wikilinks.mjs";

export default defineConfig({
  integrations: [tailwind(), mdx()],
  markdown: {
    remarkPlugins: [remarkWikilinks],
  },
  vite: {
    resolve: {
      // src/content/guides/* are symlinks into the vault git submodule.
      // Without this, Vite resolves them to their real path outside
      // src/content/ and Astro's content collections can't match them.
      preserveSymlinks: true,
    },
  },
});
