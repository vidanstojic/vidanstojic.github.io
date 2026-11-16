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

Contact details (email, LinkedIn) live in `src/site.ts`.

## Languages

English is the default and lives at `/`; Serbian (Latin script) lives at `/sr/`.

- Interface text for both languages is in `src/i18n/index.ts`.
- A Serbian project is `src/content/projects-sr/<same id>.md`. It holds only the text (`summary`, `context`, optional `title`, `team`, gallery captions) and the translated body; everything else comes from the English file. Sub-pages go to `src/content/subpages-sr/<project>/<page>.md`.
- Without a translation the Serbian page shows the English text with a short note.
- Page layouts are in `src/views/`; the files in `src/pages/` and `src/pages/sr/` only choose the view.

## CV

The CV button opens a dialog: the standard PDF (`/cv/Vidan_Stojic_CV.pdf`, built at build time) or a custom one made in the browser from the projects the visitor picks. Both use `src/lib/cv/pdf.ts`; the CV text is in `src/lib/cv/data.ts`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. The custom domain is set by `public/CNAME`.
