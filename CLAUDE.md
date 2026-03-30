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
the-puppet-developer-installation/
├── CLAUDE.md
├── README.md
├── index.html                   # Main site shell + navigation
├── phases/
│   ├── 00-mindset.html
│   ├── 01-project-scope.html
│   ├── 02-github.html
│   ├── 03-railway.html
│   ├── 04-env-vars-databases.html
│   ├── 05-terminal.html
│   ├── 06-claude-code-cli.html
│   ├── 07-settings-plugins.html
│   ├── 08-claude-md.html
│   ├── 09-daily-skills.html
│   ├── 10-c-i-loop.html
│   ├── 11-nuts-workflow.html
│   ├── 12-steering-and-rules.html
│   ├── 13-documentation.html
│   ├── 14-testing.html
│   ├── 15-when-things-go-wrong.html
│   ├── 16-multi-window.html
│   ├── 17-telegram.html
│   ├── 18-cloud-tasks.html
│   └── 19-reference.html
├── css/
│   └── main.css
├── js/
│   └── app.js                  # Navigation, OS toggle, progress tracking, clipboard
└── assets/
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
