# vidanstojic.me

Personal portfolio of Vidan Stojić, built with [Astro](https://astro.build) and deployed to GitHub Pages at [vidanstojic.me](https://vidanstojic.me).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check and build into dist/
```

## Add or edit a project

Each project is one Markdown file in `src/content/projects/`. The front matter is validated against the schema in `src/content.config.ts`:

```yaml
---
title: Project name
summary: One sentence shown in lists.
layer: interface   # interface | services | data | language | kernel
stack: [Kotlin, Jetpack Compose]
team: Solo          # optional
context: Personal project
status: complete    # or in-progress
repo: https://github.com/vidanstojic/...   # optional
featured: true      # featured projects get a full row on the home page
order: 1            # lower comes first
---
```

Contact details (email, LinkedIn, CV) live in `src/site.ts`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. The custom domain is set by `public/CNAME`.
