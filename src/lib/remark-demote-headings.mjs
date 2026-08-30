import { visit } from "unist-util-visit";

/**
 * The page already renders the guide title as its own <h1>, but several vault
 * guides use `#` as their section marker — so those pages shipped seven or
 * eight level-one headings. Demote every heading by one level in any document
 * that contains an h1, leaving exactly one on the page.
 *
 * This has to run at the remark stage: Astro collects the `headings` array
 * during rehype, so demoting here is what keeps the "on this page" rail and
 * the rendered markup agreeing with each other.
 */
export function remarkDemoteHeadings() {
  return (tree) => {
    let hasTopLevel = false;
    visit(tree, "heading", (node) => {
      if (node.depth === 1) hasTopLevel = true;
    });

    if (!hasTopLevel) return;

    visit(tree, "heading", (node) => {
      node.depth = Math.min(node.depth + 1, 6);
    });
  };
}
