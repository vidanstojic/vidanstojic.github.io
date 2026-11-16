// Link-preview images (Open Graph, 1200x630) rendered at build time:
// one for the site and one per project, in the same dark "layers" style.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { LAYER_INFO, SITE } from '../../site';

type Layer = keyof typeof LAYER_INFO;
type Card = {
  eyebrow: string;
  title: string;
  text: string;
  layer?: Layer;
};

const LAYERS = Object.keys(LAYER_INFO) as Layer[];
const font = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));
const FONTS = [
  { name: 'Mono', data: font('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'), weight: 500 as const },
  { name: 'Mono', data: font('jetbrains-mono', 'jetbrains-mono-latin-ext-500-normal.woff'), weight: 500 as const },
  { name: 'Sans', data: font('inter', 'inter-latin-400-normal.woff'), weight: 400 as const },
  { name: 'Sans', data: font('inter', 'inter-latin-ext-400-normal.woff'), weight: 400 as const },
];

export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  const site: Card = {
    eyebrow: `${SITE.role} · ${SITE.location}`.toUpperCase(),
    title: 'I build software from the kernel to the screen.',
    text: 'Android apps, backend services, a compiler and an operating system kernel.',
  };
  return [
    { params: { slug: 'site' }, props: site },
    ...projects.map((p) => ({
      params: { slug: p.id },
      props: {
        eyebrow: `${LAYER_INFO[p.data.layer].addr} · ${LAYER_INFO[p.data.layer].name.toUpperCase()}`,
        title: p.data.title,
        text: p.data.summary,
        layer: p.data.layer,
      } satisfies Card,
    })),
  ];
}) satisfies GetStaticPaths;

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export const GET: APIRoute = async ({ props }) => {
  const { eyebrow, title, text, layer } = props as Card;
  const titleSize = title.length > 34 ? 56 : 68;
  const shortText = text.length > 150 ? `${text.slice(0, 147).replace(/\s+\S*$/, '')}…` : text;

  const bands = LAYERS.map((l) =>
    h(
      'div',
      {
        flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 28, background: LAYER_INFO[l].bg,
        borderLeft: `4px solid ${l === layer ? '#ff4f00' : 'rgba(255,255,255,0.08)'}`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: l === layer ? '#ff6a2b' : 'rgba(255,255,255,0.38)', fontFamily: 'Mono', fontSize: 17, letterSpacing: 3,
      },
      `${LAYER_INFO[l].addr}  ${LAYER_INFO[l].name.toUpperCase()}`,
    ),
  );

  const tree = h('div', { width: 1200, height: 630, display: 'flex', background: '#0a0a0a', color: '#f2f2f2' }, [
    h('div', { width: 820, display: 'flex', flexDirection: 'column', padding: '64px 64px 56px 72px' }, [
      h('div', { display: 'flex', alignItems: 'center', fontFamily: 'Mono', fontSize: 19, letterSpacing: 4, color: '#ff6a2b' }, [
        h('div', { width: 10, height: 10, borderRadius: 10, background: '#ff4f00', marginRight: 16 }),
        eyebrow,
      ]),
      h('div', { marginTop: 40, fontFamily: 'Mono', fontSize: titleSize, lineHeight: 1.08, letterSpacing: -2, display: 'flex' }, title),
      h('div', { marginTop: 28, fontFamily: 'Sans', fontSize: 27, lineHeight: 1.45, color: 'rgba(242,242,242,0.68)', display: 'flex' }, shortText),
      h('div', { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontFamily: 'Mono', fontSize: 20, letterSpacing: 2 }, [
        h('div', { display: 'flex', color: '#f2f2f2' }, SITE.name),
        h('div', { display: 'flex', color: 'rgba(255,255,255,0.45)' }, 'vidanstojic.me'),
      ]),
    ]),
    h('div', { width: 380, display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.1)' }, bands),
  ]);

  const svg = await satori(tree as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: FONTS });
  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
