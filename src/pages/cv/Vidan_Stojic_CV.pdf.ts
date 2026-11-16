// The default CV, generated at build time with the same code the custom CV
// builder runs in the browser, so both always look the same.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildCvPdf } from '../../lib/cv/pdf';
import { CV_PROJECTS, DEFAULT_CV_PROJECTS } from '../../lib/cv/data';

const asset = (file: string) => readFileSync(join(process.cwd(), 'public/cv', file));

export const GET: APIRoute = async () => {
  const pdf = await buildCvPdf(
    DEFAULT_CV_PROJECTS.map((id) => CV_PROJECTS[id]),
    {
      regular: asset('fonts/DejaVuSans.ttf'),
      bold: asset('fonts/DejaVuSans-Bold.ttf'),
      light: asset('fonts/DejaVuSans-ExtraLight.ttf'),
      photo: asset('photo.jpg'),
    },
  );
  return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf' } });
};
