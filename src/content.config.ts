import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Layers of the stack, bottom-up. The order here drives the order of the
 * stack diagram on the home page (rendered top-down: interface first).
 */
export const LAYERS = ['kernel', 'language', 'data', 'services', 'interface'] as const;
export type Layer = (typeof LAYERS)[number];

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One sentence, shown in lists. */
    summary: z.string(),
    layer: z.enum(LAYERS),
    stack: z.array(z.string()).min(1),
    /** e.g. "Solo", "Team of 2", "Team project" */
    team: z.string().optional(),
    context: z.string(),
    status: z.enum(['complete', 'in-progress']).default('complete'),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    /** Lower comes first among featured projects. */
    order: z.number().default(100),
  }),
});

export const collections = { projects };
