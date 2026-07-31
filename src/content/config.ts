import { defineCollection, z } from "astro:content";

const guides = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.object({
      name: z.string(),
      handle: z.string(),
    }),
    readTime: z.string(),
    publishDate: z.date(),
    updated: z.date(),
    tags: z.array(z.string()),
    category: z.enum(["zero-to-hero", "career", "technical", "networking", "misc"]),
  }),
});

export const collections = { guides };
