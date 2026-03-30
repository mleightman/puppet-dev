# CLAUDE.md — The Puppet Developer Installation

## About the Project

An interactive website that teaches non-technical people how to use Claude Code — from zero to a full NUTS workflow. 20 phases, pure HTML/CSS/JS, hosted on GitHub Pages.

**Plan doc:** `docs/plans/2026-03-29-nuts-onboarding-plan.md` — read this first. It contains the full content structure, scope decisions, and build order.

## About the User

Matt is a non-technical vibecoder. Explain technical concepts in plain language. When merging to main: create a PR via `gh` CLI, then merge it.

## Tech Stack

| Layer | Choice |
|-------|--------|
| HTML | Pure HTML5 — no build step |
| CSS | Vanilla CSS with custom properties |
| JS | Vanilla JS |
| Code highlighting | Prism.js (CDN) |
| Hosting | GitHub Pages |

## Content Style Rules

- **Tables and charts everywhere.** Prefer tables over prose for commands, comparisons, options, and any structured information.
- **Number all guided steps.** Any time the user is being walked through a setup, installation, or process, use numbered steps (1, 2, 3...). Never use unordered bullets for sequential instructions.
- **Plain English.** No jargon without a parenthetical explanation.

## Structure

```
puppet-dev/
├── CLAUDE.md
├── .nojekyll                    # Disables Jekyll on GitHub Pages
├── 404.html                     # Redirects to index.html (preserves hash)
├── index.html                   # Main site shell + SPA navigation
├── phases/
│   ├── 00-mindset.html          # HTML fragments (not full docs)
│   ├── 01-project-scope.html    # Loaded via fetch, injected into main#content
│   ├── ...
│   └── 19-reference.html
├── css/
│   └── main.css                 # Design system, light/dark tokens, responsive
├── js/
│   └── app.js                   # Navigation, OS toggle, progress, clipboard, dark mode
├── assets/
└── docs/
    └── plans/
```

## Website Features

**Must-have:**
- OS toggle (Mac / Windows) — affects all terminal commands site-wide
- Progress tracker (localStorage)
- Copy-to-clipboard on all code blocks
- Collapsible "What is X?" explainer boxes
- Phase checklist
- Dark mode

## Commands

```bash
# No build step — just open index.html or serve locally
python3 -m http.server 8000
# Then visit http://localhost:8000
```
