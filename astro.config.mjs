// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain: `site` is the domain, no `base`.
export default defineConfig({
  site: 'https://vidanstojic.me',
  trailingSlash: 'ignore',
});
