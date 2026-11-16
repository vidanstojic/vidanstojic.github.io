/**
 * Projects and their sub-pages in a given language. Serbian entries override
 * only the text of the English ones; a missing translation falls back to English.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type ProjectData = CollectionEntry<'projects'>['data'];
export interface Project {
  id: string;
  data: ProjectData;
  /** The entry whose Markdown body is rendered. */
  entry: CollectionEntry<'projects'> | CollectionEntry<'projectsSr'>;
  translated: boolean;
}
export interface Subpage {
  id: string;
  data: { title: string; tab: string; summary: string; order: number };
  entry: CollectionEntry<'subpages'> | CollectionEntry<'subpagesSr'>;
  translated: boolean;
}

const byOrder = (a: Project, b: Project) => a.data.order - b.data.order;

export async function getProjects(lang: Lang): Promise<Project[]> {
  const en = await getCollection('projects');
  if (lang === 'en') return en.map((p) => ({ id: p.id, data: p.data, entry: p, translated: true })).sort(byOrder);
  const sr = new Map((await getCollection('projectsSr')).map((p) => [p.id, p]));
  return en
    .map((p): Project => {
      const t = sr.get(p.id);
      if (!t) return { id: p.id, data: p.data, entry: p, translated: false };
      return {
        id: p.id,
        entry: t,
        translated: true,
        data: {
          ...p.data,
          title: t.data.title ?? p.data.title,
          summary: t.data.summary,
          context: t.data.context,
          team: t.data.team ?? p.data.team,
          gallery: p.data.gallery.map((g, i) => ({
            ...g,
            alt: t.data.gallery[i]?.alt ?? g.alt,
            caption: t.data.gallery[i]?.caption ?? g.caption,
          })),
          repos: p.data.repos.map((r, i) => ({ ...r, label: t.data.repoLabels[i] ?? r.label })),
        },
      };
    })
    .sort(byOrder);
}

export async function getSubpages(lang: Lang, projectId?: string): Promise<Subpage[]> {
  const en = (await getCollection('subpages')).filter((s) => !projectId || s.id.startsWith(`${projectId}/`));
  const sr = lang === 'sr' ? new Map((await getCollection('subpagesSr')).map((s) => [s.id, s])) : new Map();
  return en
    .map((s): Subpage => {
      const t = sr.get(s.id);
      return t
        ? { id: s.id, entry: t, translated: true, data: { ...t.data, order: s.data.order } }
        : { id: s.id, entry: s, translated: lang === 'en', data: s.data };
    })
    .sort((a, b) => a.data.order - b.data.order);
}
