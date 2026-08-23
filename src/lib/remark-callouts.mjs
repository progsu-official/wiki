import { visit } from "unist-util-visit";

// Obsidian-style `> [!note]` blockquotes into styled callout boxes.
// note/info share the "info" visual variant, matching Callout.astro.
const CALLOUT_RE = /^\[!(note|info|warning|tip)\]\s*/i;
const VARIANT = { note: "info", info: "info", warning: "warning", tip: "tip" };

export function remarkCallouts() {
  return (tree) => {
    visit(tree, "blockquote", (node) => {
      const firstPara = node.children[0];
      const firstText = firstPara?.type === "paragraph" ? firstPara.children[0] : null;
      if (!firstText || firstText.type !== "text") return;

      const match = firstText.value.match(CALLOUT_RE);
      if (!match) return;

      firstText.value = firstText.value.slice(match[0].length);
      const variant = VARIANT[match[1].toLowerCase()];
      node.data = {
        hName: "div",
        hProperties: { className: ["callout", `callout--${variant}`] },
      };
    });
  };
}
