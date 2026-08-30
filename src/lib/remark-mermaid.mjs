import { visit } from "unist-util-visit";

// Mermaid fences are handed to the client as data, not as Shiki-highlighted
// source. Rendering the raw diagram text and swapping it out after hydration
// would flash a wall of arrows at the reader first.
function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function remarkMermaid() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || index === null || typeof index === "undefined") return;
      if (node.lang !== "mermaid") return;

      parent.children.splice(index, 1, {
        type: "html",
        value: `<div class="mermaid-diagram" data-diagram="${escapeAttribute(node.value)}"></div>`,
      });
    });
  };
}
