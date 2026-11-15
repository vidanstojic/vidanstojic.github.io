// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain: `site` is the domain, no `base`.
//
// GitHub Pages lets browsers cache HTML for up to 10 minutes and removes the
// previous deploy's files. With hashed asset names, a cached page could point
// at a stylesheet or script that no longer exists and render unstyled. So:
// - stylesheets are inlined into each page (HTML and CSS always match);
// - scripts, fonts and other assets keep stable names across deploys.
export default defineConfig({
  site: 'https://vidanstojic.me',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: '_astro/[name].js',
          chunkFileNames: '_astro/[name].js',
          assetFileNames: '_astro/[name][extname]',
        },
      },
    },
  },
});
