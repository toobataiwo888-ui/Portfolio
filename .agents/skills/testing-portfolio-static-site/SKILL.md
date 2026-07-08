---
name: testing-portfolio-static-site
description: Test the Timothy Taiwo Portfolio static HTML site end-to-end. Use when verifying changes to the .html pages (links, images, error handling, resource loading).
---

# Testing the Portfolio static site

This repo is a **static HTML portfolio** — no build step, no server, no package manager, no JS framework. Files live in the repo root:
- `portfolio public.html` — main portfolio/resume page (the "home" page). Its footer links to the project pages.
- `Fourths Apocalypse.html` — game lore page; uses `title-card.png` as a CSS background.
- `Fourths Apocalypse2.html` — image gallery; `<img>` tags reference an `Images/` folder that is NOT in the repo.
- `title-card.png` — background asset (in repo root).

## How to run / test
No server needed. Open pages directly in Chrome via `file://`, e.g.:
`file:///home/ubuntu/repos/Portfolio/Fourths Apocalypse2.html`
(spaces in filenames are fine in the address bar; Chrome encodes them to `%20`.)

## Known gotchas / things to check
- Filenames contain **spaces** — quote paths in shell commands.
- The `Images/` folder referenced by the gallery does not exist in the repo, so gallery images will 404. This is expected and is exactly what image error-handling should surface. If error handling is present, expect visible "Image unavailable: …" placeholders and `console.error("Failed to load image: …")` logs (check via the browser console tool). If broken, images fail silently as broken-image icons.
- Watch for **hardcoded Windows absolute paths** like `C:\Users\HomePC\Desktop\...` in `href`/`url()` — these silently fail for everyone but the original author and should be relative paths.
- To verify a link target, read the DOM/HTML (the computer tool returns stripped HTML for Chrome) and confirm the `href`, then click it and confirm navigation (URL bar changes to the expected page).

## Validating inline JS
For any `<script>` block, extract it and run `node --check` to confirm syntax before committing:
`sed -n '/<script>/,/<\/script>/p' file.html | sed '1d;$d' > /tmp/x.js && node --check /tmp/x.js`

## Devin Secrets Needed
None — the site is fully static and requires no credentials or secrets.
