import { visit } from "unist-util-visit";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vaultDir = path.resolve(__dirname, "../../vault");
const categories = ["zero-to-hero", "career", "technical", "networking", "misc"];

function walk(dir, relSegments, map, category) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), [...relSegments, entry.name], map, category);
      continue;
    }
    if (!entry.name.endsWith(".md")) continue;
    const slug = entry.name.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, entry.name), "utf-8");
    const { data } = matter(raw);
    const href = `/guides/${category}/${[...relSegments, slug].join("/")}`;
    map.set(slug, { href, title: data.title || slug });
  }
}

function buildSlugMap() {
  const map = new Map();
  for (const category of categories) {
    const dir = path.join(vaultDir, category);
    if (!fs.existsSync(dir)) continue;
    walk(dir, [], map, category);
  }
  return map;
}

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function remarkWikilinks() {
  const slugMap = buildSlugMap();

  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === null || typeof index === "undefined") return;
      const value = node.value;
      if (!value.includes("[[")) return;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      WIKILINK_RE.lastIndex = 0;
      while ((match = WIKILINK_RE.exec(value)) !== null) {
        const [full, target, label] = match;
        if (match.index > lastIndex) {
          newNodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
        }
        const slug = target.trim();
        const entry = slugMap.get(slug);
        if (entry) {
          newNodes.push({
            type: "link",
            url: entry.href,
            title: null,
            children: [{ type: "text", value: label ? label.trim() : entry.title }],
          });
        } else {
          // no matching guide yet, leave as plain readable text instead of raw [[brackets]]
          newNodes.push({ type: "text", value: label ? label.trim() : slug });
        }
        lastIndex = match.index + full.length;
      }
      if (lastIndex < value.length) {
        newNodes.push({ type: "text", value: value.slice(lastIndex) });
      }
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length;
      }
    });
  };
}
