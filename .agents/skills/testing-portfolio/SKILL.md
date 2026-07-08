---
name: testing-portfolio
description: Test the static HTML portfolio pages end-to-end. Use when verifying link paths, background/image assets, or navigation between the portfolio HTML files.
---

# Testing the static portfolio

This repo is a **static HTML/CSS site** — no build step, no server, no JS, no dependencies. Test by opening files directly in a browser.

## How to run
- Open a page via `file://`, e.g. `file:///<repo>/Fourths Apocalypse.html` in Chrome. Spaces in filenames become `%20` in the URL bar; Chrome handles this automatically when you paste the raw path.
- No install/lint/build commands exist.

## What to verify
- **Asset paths must be relative** (e.g. `url("title-card.png")`, `href="portfolio public.html"`), never absolute local paths like `C:\Users\...`. Absolute local paths leak the author's machine info and render as broken (black background / dead links) on any other machine.
- Background image on `Fourths Apocalypse.html` should render `title-card.png` behind the content.
- "My Portfolio" links on `Fourths Apocalypse.html` and `Fourths Apocalypse2.html` should navigate to `portfolio public.html`.

## Known unrelated issues (not regressions)
- `Fourths Apocalypse2.html` references thumbnails under `Images/` that are **not committed** to the repo, so those `<img>` tags are broken. This is unrelated to path-fix changes.
- `portfolio public.html` footer links to `project3.html`..`project6.html` and a nested `Fourths Apocalypse/` folder that don't exist yet.

## Devin Secrets Needed
- None. Purely local static-file testing.
