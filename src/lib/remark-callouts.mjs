import { visit } from "unist-util-visit";

// Obsidian writes callouts as blockquotes led by a [!type] marker. Rendered as
// plain markdown the marker leaks into the page as literal text, so rewrite the
// blockquote into the same markup Callout.astro produces.
const VARIANTS = { note: "info", info: "info", tip: "tip", warning: "warning" };

const ICONS = {
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  tip: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
};

const LABELS = { info: "Info", warning: "Warning", tip: "Tip" };

const MARKER = /^\[!(\w+)\][ \t]*([^\n]*)\n?/;

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function remarkCallouts() {
  return (tree) => {
    visit(tree, "blockquote", (node, index, parent) => {
      if (!parent || index === null || typeof index === "undefined") return;

      const firstBlock = node.children[0];
      if (!firstBlock || firstBlock.type !== "paragraph") return;
      const lead = firstBlock.children[0];
      if (!lead || lead.type !== "text") return;

      const match = MARKER.exec(lead.value);
      if (!match) return;
      const variant = VARIANTS[match[1].toLowerCase()];
      // an unknown type stays a plain blockquote rather than silently vanishing
      if (!variant) return;

      const title = match[2].trim();
      lead.value = lead.value.slice(match[0].length);
      if (!lead.value) firstBlock.children.shift();
      if (firstBlock.children.length === 0) node.children.shift();

      // The children stay as nodes so wikilinks and links inside the callout
      // still get processed; only the wrapper is raw HTML.
      const open = {
        type: "html",
        value:
          `<aside class="callout callout--${variant} surface-glass" role="note"` +
          ` aria-label="${escapeHtml(title || LABELS[variant])}">` +
          `<div class="callout__icon" aria-hidden="true">` +
          `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"` +
          ` stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">` +
          `<path d="${ICONS[variant]}"></path></svg></div>` +
          `<div class="callout__body">` +
          (title ? `<p class="callout__title">${escapeHtml(title)}</p>` : "") +
          `<div class="callout__content">`,
      };
      const close = { type: "html", value: `</div></div></aside>` };

      const body = node.children;
      parent.children.splice(index, 1, open, ...body, close);
      return index + body.length + 2;
    });
  };
}
