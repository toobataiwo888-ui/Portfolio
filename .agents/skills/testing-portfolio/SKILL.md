---
name: testing-portfolio
description: Test the static HTML portfolio site (portfolio pages + project pages) end-to-end. Use when verifying link/path/rendering changes in the .html files of this repo.
---

# Testing the Portfolio site

This repo is a set of **static `.html` files** (no build, no server, no package manager).
Filenames contain **spaces** (e.g. `portfolio public.html`, `Fourths Apocalypse.html`).

## How to run it locally
Serve from the repo root so relative links and spaced filenames resolve:

```bash
python3 -m http.server 8000
```

Then open in the browser with URL-encoded spaces (`%20`):
- `http://localhost:8000/portfolio%20public.html` — main portfolio/resume page
- `http://localhost:8000/Fourths%20Apocalypse.html` — game lore page (uses `title-card.png` as background)
- `http://localhost:8000/Fourths%20Apocalypse2.html` — image gallery page

Do NOT test via `file://` — spaces + relative asset paths behave differently than when hosted.

## What to verify after link/path changes
- **Asset paths must be relative** (e.g. `url("title-card.png")`), never absolute `C:\...` Windows paths — those only worked on the author's machine.
- **Cross-page links** ("My Portfolio", footer project links) actually navigate (200), not 404.
- **Email** link should be `mailto:` (a Gmail-compose URL is tied to a logged-in session).
- **Section dividers** should be `<hr>` — literal `---` inside a `<p>` renders as visible dashes.

## Known gaps (not bugs to fix unless assets are added)
- `Fourths Apocalypse2.html` references an `Images/` folder that may not be committed — its images can appear broken.
- `title-card.png` is large (~4.7 MB); might be flagged for compression.

## Tips
- The browser DOM (returned alongside screenshots) is the fastest way to assert exact `href` values.
- Maximize the window before recording: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.

## Devin Secrets Needed
- None. Everything is local static HTML with no auth.
