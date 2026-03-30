# The Puppet Developer Installation — Planning Doc
*Started: 2026-03-29 | Status: Planning phase, not yet built*

---

## What We're Building

A 0-to-1 onboarding protocol for people who have never used Claude Code. Starts them in web chat and walks them all the way to a full terminal-based Claude Code workflow with NUTS, CLAUDE.md, cloud tasks, and everything Matt uses day-to-day.

The name: you're the puppet master, Claude is the puppet developer. You tell it what to build, how to check its work, and when to ship. You don't need to understand the code — you need to know how to direct the one who does.

**Format:** GitHub repo (markdown content) + interactive website (GitHub Pages), built simultaneously.

---

## Confirmed Scope Decisions

| Decision | Choice |
|----------|--------|
| Audience | General public (no Blackjack Attack references) |
| OS support | Both Mac and Windows (separate command paths throughout) |
| Intended users | Friends, public, potential product later |
| Time goal | Someone productive within a day |
| Content depth | Everything — all commands, all best practices, NUTS flow, cloud tasks, full protocol weight |
| Build approach | One-shot attempt, but acknowledge 2-3 sessions may be needed for 20 pages of content |
| Format | Mix of B + C: markdown files in repo AND interactive website |
| Hosting | GitHub Pages (free, auto-deploys on push to main) |
| Framework | Pure HTML/CSS/JS — no build step, GitHub Pages ready |

---

## Content Structure (All Phases)

### Phase 0 — Mindset
- What vibe coding actually is
- **The Claude ecosystem** — untangle the product names:

| Product | What it is |
|---------|-----------|
| **Claude** | The AI model (the brain) |
| **claude.ai** | Web chat — talk to Claude in your browser |
| **Claude Code** | CLI tool — Claude in your terminal, reads/writes your actual files |
| **Claude Code Desktop** | Desktop app (Mac/Windows) — same as CLI but with a window |

- Mental model: you = product manager, Claude = puppet developer
- What you'll have by end of day
- You won't understand the code — and that's fine
- Why directing AI is a skill (not cheating, not easy)
- **What Claude can't do** — set expectations early:
  - Can't browse the web live (without plugins)
  - Can't see your screen in real-time (only screenshots you share)
  - Can't run long-running servers (it runs commands, not services)
  - Context window has limits — very long sessions get sluggish
  - Doesn't remember past sessions by default (that's what CLAUDE.md and memory fix)
- **Exits when:** you understand you're the director, not the coder, and you know what Claude can and can't do

### Phase 1 — Web Chat: Write Your Project Scope
*Platform: claude.ai*
- Open claude.ai, describe your idea in plain English
- Let Claude ask questions, narrow scope
- Output: a **project scope document** — a clear brief you hand to your "technical cofounder" (Claude Code)
  - What the app does (1-2 paragraphs)
  - Who it's for
  - Core features (what's in scope)
  - Explicit exclusion list (what's NOT in scope — critical for keeping Claude focused)
  - Tech stack recommendation (Claude suggests, you don't need to understand it yet)
  - Acceptance criteria (how you'll know it's done)
- The scope doc you write here becomes the seed of your CLAUDE.md later (Phase 8) — it's the foundation everything builds on
- **Exits when:** project scope document written and saved

### Phase 2 — GitHub: Your Code's Home
*Platform: github.com*
- What GitHub is ("Google Docs for code")
- Create account
- Create first repository
- What is a repo / commit / branch (one sentence each)
- What `.gitignore` is ("a list of files Git should pretend don't exist") — Claude will set this up, but you should know it exists so you don't accidentally commit passwords or junk files
- **Exits when:** empty GitHub repo exists with your name on it

### Phase 3 — Railway: Your App on the Internet
*Platform: railway.app (opinionated choice — simplest deploy UX for beginners. Alternatives: Vercel for static/Next.js, Render for general-purpose, Netlify for static sites. Railway chosen because it handles any stack with minimal config.)*
- What a server is ("a computer that's always on")
- Create Railway account (sign in with GitHub)
- Deploy from GitHub repo
- What is a deployment / domain
- See your app live for the first time
- Understand auto-deploy loop: change → commit → Railway redeploys
- Free tier vs. paid (~$5/mo)
- **Exits when:** app is live at a public URL, auto-deploys on push

### Phase 4 — Environment Variables & Databases
*You won't need this on day one if your first build is a simple static site. Come back to this phase when your app needs a database, API key, or any secret. Placed here because it's the natural next question after "my app is live."*

#### Environment Variables
- What env vars are ("passwords your app reads when it starts")
- Why NOT in code ("GitHub is public by default")
- How to set them in Railway dashboard
- How to tell Claude "this should be an env var"

#### Databases (when your app needs to remember things)
- What a database is ("a spreadsheet your app reads and writes to automatically")
- When you need one: user accounts, saving data, anything that persists between visits
- How to provision one on Railway:
  1. Click "New" → "Database" → PostgreSQL (most common)
  2. Railway gives you a `DATABASE_URL` env var automatically
  3. Tell Claude "I have a PostgreSQL database, here's the connection URL" — Claude handles the rest
- You don't need to learn SQL. Claude writes the database queries.

- **Exits when:** app reads at least one secret from Railway env vars, and (if needed) has a database provisioned

### Phase 5 — Terminal Setup
*Split: Mac path vs. Windows path*

**Mac:**
- What the terminal is
- Install Homebrew ("app store for developer tools")
- Install Node.js via Homebrew
- Git (comes with Xcode command line tools)
- First 5 commands: `ls`, `cd`, `pwd`, `git status`, `git pull`

**Windows:**
- Install WSL2 (Windows Subsystem for Linux) — "Linux inside Windows"
- Install Windows Terminal
- Install Node.js
- Git for Windows
- Same first 5 commands

- **Exits when:** user can navigate folders and run `git status` in terminal

### Phase 6 — Claude Code CLI
- **Billing/auth setup:** Claude Code requires a Claude Pro/Max subscription or Anthropic API key. Walk through signing up and connecting.
- Install:
  1. Run `npm install -g @anthropic-ai/claude-code`
  2. Run `claude` for the first time (will prompt for auth)
  3. Connect to your GitHub repo
- What's different from web chat (sees your full file system, reads/writes your actual code, runs commands)
- **First real build:** Paste your Phase 1 scope doc, say "build me the starter version"
- Understand file structure (Claude explains each file in one sentence)
- Make your first small change
- Commit and push
- **Updating:** Run `npm update -g @anthropic-ai/claude-code` periodically. Claude Code updates frequently — if something isn't working, try updating first.
- **Alternatives to the terminal CLI:**

| Option | What it is | When to use |
|--------|-----------|-------------|
| Terminal CLI | `claude` in your terminal | Full power, recommended |
| Desktop app | Mac/Windows app | Same as CLI but with a window — good if terminal feels intimidating |
| VS Code extension | Inside your code editor | If you already use VS Code |
| JetBrains plugin | Inside IntelliJ/WebStorm | If you already use JetBrains |

- **Exits when:** user has run `claude` in terminal, built from their scope doc, and committed real code

### Phase 7 — Settings, Permissions & Plugins
- **`~/.claude/settings.json`** — The config file that controls Claude Code's behavior.

#### Permissions & Bypass Mode

| Mode | What happens | When to use |
|------|-------------|-------------|
| Ask every time | Claude asks before every file edit, bash command, etc. | First day, learning what Claude does |
| Auto-allow (bypass) | Claude runs without asking permission | Daily use once you trust the workflow |

**Recommendation: turn on bypass permissions as your default.** Here's why:
- The steering phrases and operating rules in your CLAUDE.md are what keep Claude safe — not the permission prompts.
- Clicking "allow" on every file read and edit slows you down dramatically.
- If you're using the Telegram bot (Phase 17), bypass mode is **required** — you can't approve permissions from your phone.
- If you ever feel uneasy, you can cycle back to ask-every-time instantly. It's one setting change, not a commitment.

**The tradeoff:**
- Bypass = faster, smoother, required for remote/Telegram use
- Ask = safer feeling, but your CLAUDE.md rules are already doing the safety work
- You can always check what Claude did after the fact — it shows every tool call

**How to enable:**
1. Open `~/.claude/settings.json`
2. Set permissions to auto-allow
3. To cycle back: change the setting, restart session

#### Plugins & MCP

- What MCP is ("plugins that give Claude new abilities — memory, documentation lookup, browser control, Telegram")
- How to enable plugins in `settings.json` under `enabledPlugins`
- Recommended plugins:

| Plugin | What it does |
|--------|-------------|
| **claude-mem** | Persistent memory across sessions. Claude remembers what you worked on last time. Searchable. |
| **compound-engineering** | Context7 (up-to-date library docs), specialized workflow agents, research tools. |
| **playwright** | Browser automation — Claude can navigate pages, take screenshots, fill forms. |
| **telegram** | Receive and respond to Telegram messages (see Phase 17). |

- How to find and add more plugins

#### Cost & Billing

- Claude Code costs real money — either via Claude Pro/Max subscription or Anthropic API key
- Long sessions with big contexts get expensive. When a session feels sluggish or Claude starts forgetting earlier work, start a fresh session.
- Pro vs Max plans: what you get, when to upgrade
- Token usage: what costs tokens (every message, every file read, every tool call)

- **Exits when:** settings.json configured with bypass permissions, plugins enabled, user understands cost model

### Phase 8 — CLAUDE.md: Teaching Claude Your Project
- What CLAUDE.md is ("Claude reads this every session — it's its memory")
- **The two-tier architecture:**
  - **Global** `~/.claude/CLAUDE.md` — the full protocol that applies to ALL projects. Contains: session greeting, all 30+ commands, steering phrases, NUTS flow, operating rules, bug handling, edit discipline, documentation stack, protocol maintenance rules.
  - **Project-level** `CLAUDE.md` — project-specific, checked into the repo. Contains: about the project, tech stack, architecture, deployment info, cloud task config, known issues, troubleshooting. Can override or extend global commands.
  - Project-level takes precedence over global for that project.
- How to generate it: "Read my code and write me a CLAUDE.md"
- What goes in each tier:
  - **Global (lives on your machine, applies everywhere):**
    - Session greeting
    - All commands (the full 30+ command set — core, critique, planning, information, documentation, todo, handoff, cloud)
    - Steering phrases
    - NUTS flow definition
    - Operating rules (hard rules Claude must follow)
    - Bug handling protocol
    - Edit discipline
    - Documentation stack conventions (file path patterns like `docs/plans/YYYY-MM-DD-feat-name-plan.md`)
    - Protocol maintenance rules (how Prevention Rules feed back)
    - Telegram behavior (if using mobile integration)
  - **Project (lives in the repo, project-specific):**
    - App description and tech stack
    - Key files and architecture
    - Commands (how to run, test, deploy)
    - Cloud task configuration (environment IDs, cron schedules)
    - Known issues and troubleshooting
    - Can override or extend global commands for this specific project
- **Session greeting:** Add a startup message to your global CLAUDE.md so Claude confirms it loaded the protocol every session. Example:
  ```
  **On first message of every session**, display:
  `Puppet Developer Installed. Built by Puppet Dev Studios.`
  ```
  This is your confirmation that Claude read the instructions. If you don't see it, something didn't load.
- **The "About the User" section** — This shapes every interaction. Tell Claude who you are: your experience level, what you know, how you prefer explanations. A senior engineer and a first-time coder get very different responses. This section is how you set that.
- **Memory system:**
  - `MEMORY.md` — a curated index of cross-session context in `~/.claude/projects/.../memory/`
  - What it's for: things that aren't in CLAUDE.md but would take 2+ minutes to rediscover (recurring patterns, feedback you've given, project phase)
  - How to use it: "Remember that..." saves to memory. "What do you remember about..." recalls.
  - If using the `claude-mem` plugin, it also auto-captures observations searchable via MCP tools — separate from MEMORY.md
- **Git workflow & `gh` CLI:**
  - The actual shipping workflow: feature branches → PR via `gh pr create` → merge via `gh pr merge` → auto-deploys on push to main
  - How to tell Claude to handle git for you: "commit and push", `-cp`, creating PRs
  - The `gh` CLI: GitHub's command-line tool. Claude uses it to create PRs, check CI status, merge. You don't need to learn it — Claude runs it.
- **Exits when:** global CLAUDE.md exists with protocol + greeting, project CLAUDE.md exists with project details, Claude displays the greeting on session start, and memory system is initialized

### Phase 9 — Daily Skills: Screenshots, Slash Commands & Session Management

Practical skills you'll use every session.

#### Screenshots & Images

Claude can read images. This is huge for non-technical users — instead of describing what's wrong, show it.

**How to share a screenshot:**
1. Take a screenshot (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)
2. Save it to your Desktop
3. Tell Claude: "See the screenshot on my Desktop" — Claude will find and read it
4. Claude sees exactly what you see and can diagnose the problem

**Use screenshots for:**
- Bug reports: "This page looks wrong — see the screenshot"
- Design feedback: "I want it to look more like this" (screenshot of a reference site)
- Error messages: screenshot the browser or terminal error
- Comparing before/after: "Does this match the design?"

#### Built-in Slash Commands

Claude Code has built-in commands (separate from your custom `-commands`):

| Command | What it does |
|---------|-------------|
| `/help` | Show Claude Code's built-in help |
| `/clear` | Clear the conversation (start fresh) |
| `/compact` | Compress the conversation to save context space |
| `/model` | Switch between Claude models |

#### Session Management

- **`/compact`** — When a session gets long, Claude starts losing track of earlier work. `/compact` compresses the conversation so Claude can keep going. Use it when Claude starts repeating itself or forgetting what you discussed.
- **Start fresh** — Sometimes it's better to start a new session entirely. If Claude is stuck in a bad mental model, a fresh session with `-status` gets you back on track fast.
- **The `!` prefix** — Type `! <command>` to run a shell command directly from the Claude Code prompt. Example: `! git status` or `! npm test`. The output lands in the conversation so Claude can see it too.
- **Escape key** — Press Escape to interrupt Claude mid-stream. Use this when you see Claude going the wrong direction — don't wait for it to finish building the wrong thing.

- **Exits when:** you've shared a screenshot with Claude, used `/compact`, and interrupted Claude with Escape at least once

### Phase 10 — The `-c` → `-i` Loop

Before learning the full NUTS workflow, learn the core interaction pattern that powers it.

**The loop:**
1. Claude does something (writes a plan, builds code, makes a suggestion)
2. You type `-c` — Claude critiques its own work adversarially
3. You type `-i` — Claude implements all valid fixes from the critique
4. Repeat until clean

**This is your most-used pattern.** It works on anything: plans, code, docs, ideas. You can run it:
- **Standalone:** "Write me a landing page" → `-c` → `-i` → `-c` → `-i` (converges to zero issues)
- **Fixed rounds:** "Run 3x rounds of `-c` `-i`" — useful when you want refinement but don't need full NUTS
- **Before NUTS:** Rough out an idea with `-c` → `-i` loops before formalizing into a NUTS plan
- **After NUTS:** Quick polish pass on something that already went through the full flow
- **Instead of NUTS:** For small tasks that don't warrant the full 8-step cycle

**The convergence table** — after each `-c` pass, Claude shows a summary:
```
| Pass | Crit | High | Med | Low | Total |
|------|------|------|-----|-----|-------|
| 1    | 2    | 3    | 1   | 0   | 6     |
| 2    | 0    | 1    | 2   | 1   | 4     |
| 3    | 0    | 0    | 1   | 1   | 2     |
```
When total hits zero (or only low/informational items remain), it's converged. Ship it.

- **Exits when:** you've run at least one `-c` → `-i` loop and seen the convergence pattern

### Phase 11 — The Full NUTS Workflow
*The complete quality system — builds on the `-c` → `-i` loop*

**NUTS = No Uncritiqued Task Ships.**

Why it exists: Without it, AI writes code fast, looks right, ships, breaks. NUTS catches problems at plan stage where fixing costs a paragraph edit instead of a debugging session.

#### The Flow (8 Steps)

| Step | What Happens | Plain English |
|------|-------------|--------------|
| 1. Plan | Research, identify gaps, write a plan | Describe before touching code |
| 2. Critique (`-c`) | Adversarial passes until zero issues | Find everything wrong with the plan |
| 3. Audit (pre-build) | 5-question diagnostic, Q1 = "what worries you?" | Last cheap exit before code |
| 4. Build (`-build`) | Implement the critiqued plan | Now build it |
| 5. Review (`-c`) | Adversarial passes until zero issues | Find everything wrong with what was built |
| 6. Audit (post-build) | 5-question diagnostic on the implementation | Did the code deliver the plan? |
| 7. Compound | Push, then document the solution | Write down what you learned |
| 8. Summary | Recap + auto-archive completed TODOs | The final output |

**Key rules:**
- Never skip to build. Plan → critique → audit → build. Always.
- Never push before post-build audit. Build commits locally. Review + audit must converge to zero before pushing.
- Critique/review passes continue until convergence — zero actionable findings. Not a fixed number. A simple fix might converge in 2 passes, a complex refactor might take 5-17.
- Sequential: find issues → fix them → next pass. Not: find, find, find, then fix.
- Every critique/review pass must use an adversarial agent — not a self-scan. Minimum 2 agent passes before declaring convergence.
- Parallel agents within one pass = one pass, not two. They see the same code snapshot.
- Audit Q1 is always "what worries you?" — preserves the gut-check. In `-autonuts`, Q1 answer must be displayed prominently.
- Post-build audit is scoped to implementation. If a finding requires changing the architecture, flag it for the user instead of implementing.
- Honest gut-checks. No cheerleading.
- Never skip compound. The knowledge compounds.
- Bug fixes follow the same cycle.

**When to scale down:** Trivial changes (typo fixes, config, anything under ~5 lines with no logic changes) don't need full NUTS. A quick `-c` pass may be enough.

**The NUTS tracker** — Claude displays this at every step so you always know where you are:
```
NUTS [2/8]: Critique — pass 1 (converging to zero)
  1. Plan ✅
  2. Critique ← you are here
  3. Audit (pre-build)
  4. Build
  5. Review
  6. Audit (post-build)
  7. Compound
  8. Summary
```

**The 5 commands you need for NUTS:**

| Command | What it does |
|---------|-------------|
| `-c` | Adversarial critique. Find everything wrong. |
| `-i` | Implement all valid criticisms. No asking — just fix it. |
| `-build` | Implement the plan. Don't stop until done. |
| `-nuts` | Start the NUTS flow (walks you through each step). |
| `-autonuts` | Run the full NUTS flow autonomously — no pausing. |

The full command reference (30+ commands) is in Phase 19.

### Phase 12 — Steering Phrases & Operating Rules

How to control Claude's behavior precisely and keep it from going off the rails.

#### Steering Phrases

Short phrases that override Claude's instinct to "be helpful" by doing more than you asked:

| Say this | Claude does this |
|----------|-----------------|
| "Do not implement yet" | Reviews scope, rates confidence, identifies risks. No code. |
| "Just fix that one issue" | Zero scope expansion. Fixes exactly what you pointed at. |
| "Continue to ask questions" | Batches ALL questions before writing any code. |
| "I was just calling out one error" | Fixes only the specific thing mentioned. Does not rewrite surrounding work. |
| "Interview style to talk through this plan" | Asks you questions one at a time to collaboratively build out a plan, instead of generating the whole thing at once. |
| "Make sure you understand" | Pauses and confirms understanding of the codebase/context before proceeding. Prevents Claude from guessing. |

#### Hard Rules (non-negotiable)

- Nothing public without explicit approval. Default to private.
- No personal contact info in repos. Redact it.
- No scope expansion without permission. Fix one thing = fix one thing.
- No time estimates. Don't let Claude guess how long things take.
- Ambiguous input = ask, don't act. The cost of one clarifying question is near-zero. The cost of unauthorized changes is high.
- Never broadly "find and fix bugs." Claude will invent bugs that don't exist and "fix" them, breaking working code. Always describe specific bugs with specific symptoms.
- Never perform irreversible actions without verifying prerequisites.

#### Workflow Rules

- Batch work into small, deployable chunks. Never build everything in one session.
- One code path per feature. No duplicate implementations.
- Questions before implementing — batch in rounds of 3-6.
- Clean before documenting. Audit code before writing docs about it.
- Review all doc edits twice before committing.
- Before UI-heavy work, gather 2-4 visual references so Claude designs from references, not imagination.
- Claude will try to add adjacent features during builds. Treat any unscoped addition as scope creep.

#### Bug Handling Protocol

- Trace the full code path before proposing any fix. Never guess at root causes.
- Check for duplicate implementations of the same feature.
- After building any multi-component flow, trace full lifecycle: create → use → cleanup → edge case.

#### Edit Discipline

- After every edit, Claude reads the file back twice before continuing. This catches mistakes that "obvious" edits introduce.

### Phase 13 — The Documentation Stack & Self-Improving Protocol

How your project builds up layers of documentation over time. Not all needed from day one — start with CLAUDE.md and add layers as the project grows.

| Layer | What it is | When to create |
|-------|-----------|----------------|
| **CLAUDE.md** | Project overview, architecture, key decisions, known issues | Before first session |
| **Scope doc** | What to build, what NOT to build, acceptance criteria | Before first build |
| **Plan docs** | Pre-build architecture for non-trivial work | Before each feature |
| **Context docs (NCD)** | Session snapshots — what's working, broken, next | Every 2-3 sessions |
| **Solution docs** | Post-build documentation: problem, root cause, fix, prevention rules | After every non-trivial fix |

**The scope doc you write in Phase 1 becomes the seed of your CLAUDE.md.** As your project grows, your CLAUDE.md grows with it — architecture decisions, known issues, bug handling rules, all accumulate.

**The Prevention Rules loop:** Solution docs include a Prevention Rules section. Those rules feed back into CLAUDE.md. This is how the protocol self-improves — each solved problem generates durable rules that prevent the entire class of problem from recurring. Over time, your CLAUDE.md becomes smarter because it encodes every lesson learned.

**Scope docs should include an explicit exclusion list** — what is NOT in scope. When Claude tries to add adjacent features (and it will), point at the list.

**Protocol maintenance:** The CLAUDE.md is a living document. It updates via conversation:
- **Protocol changes** (new commands, workflow modifications, operating rules) → update global `~/.claude/CLAUDE.md`
- **Project-specific changes** (architecture, deployment, known issues) → update that project's `CLAUDE.md`
- **Prevention Rules from solution docs feed back into CLAUDE.md.** When a solution doc's Prevention Rules reveal a universal pattern, add it to the global protocol. Project-specific patterns go to the project CLAUDE.md.
- **Memory files** (`~/.claude/projects/.../memory/`) are for cross-session context that doesn't belong in repo-committed docs.
- The protocol gets better the more you use it.

### Phase 14 — Testing

You don't need to understand how to write tests. You just need to know they exist and that Claude writes them for you.

**What tests are:** Code that checks if your other code works correctly. Like a checklist that runs automatically.

**How to use tests with Claude:**
1. After Claude builds a feature, say: "Write tests for what you just built"
2. Claude writes test files that verify the feature works
3. Run the tests: `npm test` (or whatever your project uses)
4. If tests pass: the code works as intended
5. If tests fail: Claude reads the failures and fixes the code

**When to ask for tests:**
- After any significant feature build
- Before deploying to production
- When something that worked stops working — "Write a test that proves this works, then run it"

**The NUTS connection:** In the Build step (Phase 12), Claude tests each component. In the Review step, tests help verify nothing is broken. Tests are part of the quality system, not separate from it.

**Key commands:**

| Command | What it does |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:single -- path/to/test.js` | Run one specific test file |

**Testing tips:**
- Don't say "write tests for everything" — too broad. Be specific: "Write tests for the login flow"
- If Claude says "all tests pass," that's a green light to ship
- Tests catch bugs before your users do
- You can tell Claude "run the tests" and it will execute them and read the results

- **Exits when:** you've asked Claude to write a test, run it, and seen it pass

### Phase 15 — When Things Go Wrong

Every beginner will hit a wall. This is how you recover.

*This phase needs concrete, real-world examples — not just bullet points. Each scenario should include what the error actually looks like (screenshot-level detail), what to paste to Claude, and what a good resolution looks like. Build with real examples from common failure modes.*

**Deploy fails:**
- Read the error message. Copy it. Paste it to Claude with "this deploy failed."
- Claude will trace the issue. Most common: missing env var, wrong Node version, dependency not installed.
- Railway shows deploy logs — share them with Claude.
- *Example: what a "missing DATABASE_URL" Railway deploy failure actually looks like, and the exact message to send Claude.*

**Claude writes broken code:**
- Don't panic. Don't say "find and fix all the bugs" (Claude will invent problems).
- Describe the specific symptom: "When I click X, Y happens instead of Z."
- Use `-c` to critique what Claude just built before shipping it.
- If things are really broken, start a fresh Claude session — sometimes Claude gets stuck in a bad mental model.
- *Example: what it looks like when Claude breaks a page, and the difference between "fix all the bugs" (bad) vs "the login button shows a blank page instead of the form" (good).*

**Something that worked stops working:**
- Run `-status` to get an honest assessment.
- Check recent changes: "What changed since it last worked?"
- Use `-audit5` to surface what might be wrong.

**You're lost or overwhelmed:**
- `-r` gives you a full summary of the current session.
- `-ncd` creates a context checkpoint of the whole project.
- `-help` shows all available commands with guidance on what to do next.

**The golden rule:** Always describe what you see, not what you think the problem is. Let Claude trace the code path.

### Phase 16 — Multi-Window Terminal Management

How to run multiple Claude Code sessions at once — and the one rule that keeps it from blowing up.

**The rule: many planners, one builder.**
- You can have as many windows *planning* as you want. Planning doesn't touch files.
- Only ONE window should be *building* (writing code) at a time.
- If two windows build simultaneously, they'll edit the same files, create merge conflicts, and trigger linting errors that cascade into a mess.

**How to set it up:**
- Open multiple terminal tabs or windows, each running `claude` in the same project directory
- Label them mentally: "this one is planning feature X", "this one is building feature Y"
- When one window finishes building and pushes, another can start building

**Common patterns:**
- Window 1: building the current task. Window 2: planning the next task via `-present` or `-nuts` (stop at Plan step).
- Window 1: running `-autonuts` on a feature. Window 2: running `-c` on a different plan doc. Window 3: `-status` check.
- Never: Window 1 building feature A while Window 2 builds feature B. This will break things.

**Why this matters:** Claude Code reads and writes your actual files. Two builders = two writers = conflicts. Planning is read-only, so it's always safe to parallelize.

**Advanced: Git worktrees** — For true parallel building, Claude can create isolated copies of your repo (worktrees) where changes don't conflict. This is the escape hatch when you genuinely need two builders. But start with the "many planners, one builder" rule first.

- **Exits when:** you understand the "many planners, one builder" rule and can run parallel sessions without conflicts

### Phase 17 — Telegram Bot & Remote Dispatch

Control Claude Code from your phone. Send it tasks from Telegram while you're away from the computer.

**What you need:**
- A Telegram bot (create via @BotFather on Telegram)
- The `telegram` MCP plugin configured in Claude Code
- `caffeinate` (Mac) or equivalent to keep your machine awake

**Prerequisites:**
- **Bypass permissions must be ON** (Phase 7) — you can't approve permission prompts from your phone
- Your CLAUDE.md steering phrases and operating rules are what keep Claude safe, not permission prompts

**Setup:**
1. Create a bot via @BotFather on Telegram, get the bot token
2. Configure the Telegram channel in Claude Code (`/telegram:configure`)
3. Set up access control (`/telegram:access`) — approve your Telegram account
4. Run `caffeinate -dims` in a terminal tab to prevent your Mac from sleeping while Claude works
5. Verify bypass permissions are enabled in `~/.claude/settings.json`

**How it works:**
- Send a message to your bot from Telegram → Claude Code receives it
- Claude acks immediately (says what it's about to do), then works
- Every status update is a new message (edits don't trigger phone notifications)
- When done, Claude sends a completion message with elapsed time

**Telegram behavior rules (taught to Claude via CLAUDE.md):**
- Instant ack before doing any work
- New messages only — never edit to deliver results
- Duration on completion: `(MM:SS)` at the end
- Narrate — the user can't see tool calls or diffs, so describe what you're doing

**Use cases:**
- "Run -status and tell me what's broken"
- "Plan the next feature on the todo list"
- "Run -audit10 and send me the findings"
- Morning briefings sent to your phone automatically

- **Exits when:** you can send a task to Claude from Telegram and get results back on your phone

### Phase 18 — Cloud Tasks & Scheduled Agents
- What scheduled cloud agents are ("Claude works overnight while you sleep")
- The morning briefing concept (`-gm`)
- Setting up a daily scheduled agent (cron schedule via `claude.ai/code/scheduled`)
- The `-wrap` command and end-of-night handoff
- NUTS depth tags — how deep the overnight agent runs on each task:

| Tag | What Runs Overnight | Output |
|-----|---------------------|--------|
| `[PLAN]` | Plan only | Plan doc |
| `[PC]` | Plan → Critique (converge) | Refined plan doc |
| `[PCA]` | Plan → Critique → Audit | Audited plan doc |
| `[BUILD]` | Full NUTS through code | Code on feature branch |
| `[AUTO]` | Full autonuts (all steps) | Ready to merge |

- The `-cloud` command for ad-hoc scheduling — depth options:

| Depth | What Runs | Default? |
|-------|-----------|----------|
| Plan only | Research + write plan doc | |
| Plan + Critique | Plan, critique until convergence | Default |
| Plan + Critique + Audit | Adds audit5 with "what worries you?" | |
| Build | Full NUTS through code | Warn: unreliable in cloud |
| Auto | Full autonuts | Warn: recommend local |

- The `-cc` command for checking what was done overnight
- Max 2 tagged items per night
- Tags are removed from TODO after the morning task processes them

### Phase 19 — Full Command Reference
*Quick-reference card — terse, no explanation. Phases 10-12 teach these in context; this is the cheat sheet you bookmark.*

- All 30+ commands in one place, organized by category:
  - Core (daily use): `-go`, `-c`, `-i`, `-build`, `-cs`
  - Critique variants: `-c{N}`, `-ec`
  - Planning & assessment: `-present`, `-nuts`, `-autonuts`, `-status`, `-audit{N}`, `-health`, `-o`
  - Information: `-e`, `-f`, `-r`, `-help`
  - Documentation: `-ncd`, `-ud`, `-stats`, `-cp`
  - Todo management: `-todo`, `-todo add`, `-todo done`, `-todo remove`, `-todo tag`, `-todo untag`
  - Handoff: `-wrap`, `-gm`
  - Cloud: `-cloud`, `-cc`
- All 6 steering phrases (one-liner each, no explanation — context is in Phase 13)
- Common error messages and what to do
- "When X happens, do Y" troubleshooting table
- Glossary (repo, commit, branch, deploy, env var, terminal, convergence, etc.)
- Skills & slash commands: custom commands (e.g. `/commit`, `/review-pr`) that extend Claude's capabilities
- Links to Claude Code docs, Railway, GitHub

---

## Content Style Rules

- **Tables and charts everywhere.** Prefer tables over prose for commands, comparisons, options, and any structured information. Use diagrams and visual aids wherever they clarify a concept.
- **Number all guided steps.** Any time the user is being walked through a setup, installation, or process, use numbered steps (1, 2, 3...). Never use unordered bullets for sequential instructions.
- **Plain English.** No jargon without a parenthetical explanation. If a term is used more than once, it should be in the glossary.

---

## Website Features (Interactive)

**Must-have:**
- OS toggle (Mac / Windows) — affects all terminal commands site-wide
- Progress tracker — which phases you've completed (localStorage)
- Copy-to-clipboard on all code blocks
- Collapsible "What is X?" explainer boxes
- Phase checklist (checkbox at end of each phase to mark complete)
- Dark mode

**Nice-to-have:**
- Glossary tooltips (hover a term to see definition)
- Sidebar navigation with phase completion indicators
- Print-friendly CSS
- Search

---

## Repo Structure

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
│   ├── main.css
│   └── prism.css
├── js/
│   ├── app.js
│   ├── clipboard.js
│   └── prism.js
└── assets/
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| HTML | Pure HTML5 | No build step, GitHub Pages works immediately |
| CSS | Vanilla CSS with custom properties | No dependencies, easy to theme |
| JS | Vanilla JS | No framework needed, keeps it simple |
| Code highlighting | Prism.js (CDN) | Easy drop-in |
| Hosting | GitHub Pages | Free, auto-deploys, custom domain support |
| Domain | TBD | Buy one if going public as product |

---

## Open Items Before Build

- Decide GitHub org or personal — personal account fine for now
- Confirm Railway free tier limits for the onboarding example

---

## Build Order

1. Create new GitHub repo (`the-puppet-developer-installation`)
2. Build `index.html` shell + navigation + OS toggle + dark mode
3. Build CSS (main styles, code blocks, responsive)
4. Build JS (progress tracking, OS toggle logic, clipboard)
5. Write all 20 phase HTML files (content + interactive elements)
6. Wire navigation between phases
7. Test Mac/Windows toggle works site-wide
8. Test progress tracking persists on refresh
9. Enable GitHub Pages on repo
10. Verify live URL works
11. Write `CLAUDE.md` for the repo itself
12. Commit + push everything
