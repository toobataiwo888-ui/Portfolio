---
name: testing-portfolio
description: Test the static portfolio site (HTML pages + Jest validator suite). Use when verifying HTML changes, broken paths/links, or the htmlValidator module.
---

# Testing the Portfolio site

This repo is a set of static HTML pages plus a Node/Jest validation suite (`src/htmlValidator.js`).

## Unit / validation tests
- `npm install` (deps: jest, eslint)
- `npm test` — runs `tests/htmlValidator.test.js` (pure unit tests) and `tests/portfolio.test.js` (validates the real HTML files: structure, no absolute Windows paths, img alt text, internal links resolve).
- `npm run test:coverage` — expects 100% coverage of `src/htmlValidator.js`.
- `npm run lint` — eslint.

## End-to-end rendering / navigation
Serve over HTTP rather than opening `file://` — this mirrors real hosting and makes broken relative paths fail visibly (404 / missing image):
- `python3 -m http.server 8000` in repo root, then open `http://localhost:8000/portfolio%20public.html` (filenames contain spaces → URL-encode as `%20`).
- Verify footer links navigate to `Fourths Apocalypse.html` / `Fourths Apocalypse2.html` (root, not a subfolder) with no 404.
- Verify the apocalypse page background image loads: in devtools console, `getComputedStyle(document.body).backgroundImage` should be `title-card.png` and `fetch('title-card.png',{method:'HEAD'})` should return HTTP 200.
- Verify the "My Portfolio" back-link returns to `portfolio public.html`.
- Adversarial control: `fetch('Fourths Apocalypse/Fourths Apocalypse.html',{method:'HEAD'})` should 404 (old broken path), proving the fix is real.

## Known gaps (may still be true)
- `Fourths Apocalypse2.html` references `Images/*.png` that may not exist in the repo — gallery images can 404.
- `new.html` may be empty; `project3..6.html` referenced from the homepage footer may not exist yet.

## Devin Secrets Needed
- None. The site is fully static and testable locally.
