import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().optional(),
    category: z.string().optional(),
    slug: z.string().optional(),
    tags: z.string().optional(),
    summary: z.string().optional(),
    status: z.string().optional(),
    state: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts };
