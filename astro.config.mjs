import { defineConfig } from "astro/config";
import fs from "node:fs";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkWikilinks } from "./src/lib/remark-wikilinks.mjs";
import { remarkCallouts } from "./src/lib/remark-callouts.mjs";

// Every guide is a symlink into the vault submodule. If it isn't checked out,
// the collection silently comes back empty and we'd ship a wiki with no guides.
const vaultDir = new URL("./vault/", import.meta.url);
if (!fs.existsSync(vaultDir) || fs.readdirSync(vaultDir).length === 0) {
  throw new Error("./vault is empty - run: git submodule update --init --recursive");
}

export default defineConfig({
  integrations: [tailwind(), mdx()],
  markdown: {
    remarkPlugins: [remarkWikilinks, remarkCallouts],
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
