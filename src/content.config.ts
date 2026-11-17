import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Layers of the stack, bottom-up. The order here drives the order of the
 * stack bands (rendered top-down: mobile apps first).
 */
export const LAYERS = ['kernel', 'compilers', 'data', 'services', 'desktop', 'mobile'] as const;
export type Layer = (typeof LAYERS)[number];

export const STATUS_LABEL = {
  complete: 'Completed',
  'in-progress': 'In progress',
  'preparing-release': 'Preparing for Google Play',
} as const;

/** One project = one Markdown file directly in src/content/projects/. */
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One sentence, shown on cards and in the page header. */
      summary: z.string(),
      layer: z.enum(LAYERS),
      stack: z.array(z.string()).min(1),
      /** e.g. "Solo", "Team of 2", "Team project" */
      team: z.string().optional(),
      context: z.string(),
      status: z.enum(['complete', 'in-progress', 'preparing-release']).default('complete'),
      repo: z.url().optional(),
      /** Extra source links, for projects split over several repositories. */
      repos: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      playStore: z.url().optional(),
      demo: z.url().optional(),
      /** Screenshots or diagrams. Images live in src/assets/projects/. */
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      featured: z.boolean().default(false),
      /** Lower comes first. */
      order: z.number().default(100),
    }),
});

/**
 * Deeper pages for a project: src/content/subpages/<project-id>/<page>.md
 * renders at /projects/<project-id>/<page>.
 */
const subpages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/subpages' }),
  schema: z.object({
    title: z.string(),
    /** Short tab label, e.g. "Architecture". */
    tab: z.string(),
    summary: z.string(),
    order: z.number().default(10),
  }),
});

/**
 * Serbian translations. Only the text is translated; everything else (layer,
 * stack, links, images, order) comes from the English file with the same id.
 * src/content/projects-sr/<id>.md and src/content/subpages-sr/<project>/<page>.md
 */
const projectsSr = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects-sr' }),
  schema: z.object({
    title: z.string().optional(),
    summary: z.string(),
    context: z.string(),
    team: z.string().optional(),
    /** Same order as the English gallery. */
    gallery: z.array(z.object({ alt: z.string(), caption: z.string().optional() })).default([]),
    /** Labels for the extra repository links, same order as in English. */
    repoLabels: z.array(z.string()).default([]),
  }),
});

const subpagesSr = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/subpages-sr' }),
  schema: z.object({
    title: z.string(),
    tab: z.string(),
    summary: z.string(),
  }),
});

export const collections = { projects, subpages, projectsSr, subpagesSr };
