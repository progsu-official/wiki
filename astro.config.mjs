import { defineConfig } from "astro/config";
import fs from "node:fs";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkWikilinks } from "./src/lib/remark-wikilinks.mjs";
import { remarkMermaid } from "./src/lib/remark-mermaid.mjs";
import { remarkCallouts } from "./src/lib/remark-callouts.mjs";
import { remarkDemoteHeadings } from "./src/lib/remark-demote-headings.mjs";

// Every guide is a symlink into the vault submodule. If it isn't checked out,
// the collection silently comes back empty and we'd ship a wiki with no guides.
const vaultDir = new URL("./vault/", import.meta.url);
if (!fs.existsSync(vaultDir) || fs.readdirSync(vaultDir).length === 0) {
  throw new Error("./vault is empty - run: git submodule update --init --recursive");
}

// Shiki drops the language on the floor; the CSS label in global.css reads it
// back off the <pre>. Plain-text blocks get no label.
const labelLanguage = {
  pre(node) {
    const lang = this.options.lang;
    if (lang && lang !== "text" && lang !== "plaintext" && lang !== "ansi") {
      node.properties["data-language"] = lang;
    }
  },
};

export default defineConfig({
  integrations: [tailwind(), mdx()],
  markdown: {
    remarkPlugins: [remarkDemoteHeadings, remarkWikilinks, remarkMermaid, remarkCallouts],
    shikiConfig: {
      // Code blocks stay dark in both themes, so one theme is enough.
      theme: "vitesse-dark",
      wrap: false,
      transformers: [labelLanguage],
    },
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
