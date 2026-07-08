---
name: testing-static-portfolio
description: Test the static HTML portfolio pages (Fourth's Apocalypse story/gallery, portfolio public). Use when verifying CSS/HTML refactors or visual changes to these pages.
---

# Testing the static Portfolio

This repo is plain static HTML — no build, no server, no package manager, no CI.
Pages are opened directly in a browser via `file://`.

## How to run / view pages
- Open in Chrome via address bar, e.g.
  `file:///home/ubuntu/repos/Portfolio/Fourths%20Apocalypse.html`
  (spaces in filenames must be `%20`).
- Files: `Fourths Apocalypse.html` (dark story page), `Fourths Apocalypse2.html`
  (dark gallery), `portfolio public.html` (light-themed CV).
- Shared styles live in `assets/css/base.css`, linked by the two Apocalypse pages.

## Verifying a visual/CSS refactor (before vs after)
1. Add a worktree of the base branch for the "before" render:
   `git worktree add ~/portfolio-main origin/main`
2. Open the same page from `~/portfolio-main/...` (before) and
   `~/repos/Portfolio/...` (after); compare screenshots — they should match.
3. Prove the shared stylesheet is the source of styling with `browser_console`:
   ```js
   JSON.stringify({
     sheets: Array.from(document.styleSheets).map(s => s.href),
     bg: getComputedStyle(document.body).backgroundColor,
     ff: getComputedStyle(document.body).fontFamily,
   })
   ```
   Expect `assets/css/base.css` in `sheets`, `bg = rgb(0, 0, 0)`,
   `ff = "Segoe UI", Arial, sans-serif` for the Apocalypse pages.
4. Clean up: `git worktree remove ~/portfolio-main --force`.

## Known preexisting issues (NOT regressions)
- Images never load: `Fourths Apocalypse.html` sets its background via a Windows
  absolute path (`C:\Users\HomePC\...`) and `Fourths Apocalypse2.html` references
  an `Images/` folder that isn't in the repo. This is unchanged on `main`.
  Focus visual assertions on body background/text/font/layout, not images.
- Some nav links use Windows absolute paths and won't resolve on Linux/hosted.

## Devin Secrets Needed
- None. Everything is local static HTML.
