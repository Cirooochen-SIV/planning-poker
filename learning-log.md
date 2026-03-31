# Learning Log — Planning Poker App

---

## Session 1 — Building & Deploying

**Module completed:** Building & Deploying a Real-Time Web App with Claude Code + Railway
**Time spent:** ~30 minutes

### What I Built

A real-time **Planning Poker** web app for agile teams — players join a shared room, cast story point votes simultaneously, and a moderator reveals them together to avoid anchoring bias. The project consists of `server.js` (Node.js + Express + Socket.io backend with room management, voting logic, and a 24-hour room TTL), `public/index.html` (the frontend UI), `package.json` (dependencies and start script), and `railway.toml` (Railway deployment config).

### Key Concepts I Used

1. **Git push via Claude Code** — asked Claude to push the repo to a remote GitHub URL; it detected the remote was already configured and ran `git push -u origin main` directly.
2. **Codebase reading before advising** — Claude read `package.json`, `server.js`, and `railway.toml` before giving deployment instructions, so the advice was specific to this project rather than generic.
3. **Deployment config awareness** — Claude spotted the existing `railway.toml` and incorporated it into the instructions, including flagging the `/healthz` health check route.
4. **Two deployment paths explained** — Claude distinguished between CLI-based deploy (`railway up`) and GitHub-connected auto-deploy, helping me choose the right workflow for ongoing use.
5. **Dashboard navigation guidance** — when I couldn't find the live URL, Claude gave step-by-step Railway UI directions (Settings → Networking → Generate Domain).

### Prompt Patterns That Worked

**Prompt 1:**
> *"git push to this repo [URL]"*

- **Why it worked:** Direct with the target URL. Claude checked the existing remote config and executed without unnecessary questions.
- **Reusable pattern:** `[action] to [target]` — give Claude the verb and the destination, it figures out the mechanics.

**Prompt 2:**
> *"give me now the instruction of deploying this repo to Railway"*

- **Why it worked:** "this repo" triggered file-reading first. Claude read `railway.toml`, `package.json`, and `server.js` to tailor the instructions.
- **Reusable pattern:** `give me instructions for [task] for this repo` — anchoring to "this repo" triggers codebase reading before answering.

**Prompt 3:**
> *"Seems like the github repo is deployed online on Railway. Where can I see the url?"*

- **Why it worked:** Gave Claude a clear outcome signal ("it's deployed"), so it skipped re-explaining deployment and answered the precise next question.
- **Reusable pattern:** State what you already know, then ask the next question.

### What Surprised Me

I expected to need a `Dockerfile` or extra Railway-specific configuration. In reality, Railway detected the stack automatically from `package.json`. **I assumed cloud deployment required infrastructure knowledge — it mostly required a correct ****`package.json`****.**

### My Mental Model Update

Before this module I thought deploying a real-time app (WebSockets, multiple concurrent rooms) would require configuring servers and ports manually. Now I understand Railway abstracts all of that — it injects `PORT`, manages the process lifecycle, and exposes a public HTTPS URL as long as the app reads `process.env.PORT`.

### What I Would Try Next

Add a persistent room history feature — save vote results to a Railway-provisioned PostgreSQL database and display a "past sessions" panel. This would practice: Railway database add-ons, environment variables for the connection string, and scaffolding database schema against the existing `server.js`.

---

## Session 2 — Iterating the UI & Figma Workflow

**Module completed:** Frontend Iteration + Figma Design-to-Code Loop
**Time spent:** ~60 minutes

### What I Built

Multiple iterative improvements to the live Planning Poker app:
- **Anonymous mode** — removed the name input field; all users join as "Anonymous"
- **URL-based auto-join** — navigating to `/room/12345` directly joins the room without touching the landing page
- **Footer with analog clock** — fixed footer showing Berlin and Romanian time (ported from a React/TSX component to vanilla JS), plus "Made with love by Ciro" credit
- **Redesigned results section** — distribution above stats, thin gradient bars with bordered value boxes and external vote counts, Most Voted as the hero stat in a card, Google Sans font

### Key Concepts I Used

1. **Iterative feature prompting** — described two independent UX changes in one prompt; Claude made all changes in a single targeted edit without touching unrelated code.
2. **React-to-vanilla porting** — gave Claude a `.tsx` file as source; it translated the SVG math, `useEffect` tick loop, and timezone logic to plain JS with no dependencies.
3. **Figma MCP → code** — used `get_design_context` to extract the exact Figma spec (colors, spacing, structure) and `get_screenshot` as a visual reference, then Claude translated the Tailwind/React output to the vanilla HTML/CSS codebase.
4. **Plan mode for scoped changes** — Claude used plan mode to map out what it would change before touching files, catching a potential `position: fixed` overlap with controls before writing a line of code.
5. **Incremental Figma rounds** — ran the design-to-code loop twice on the same node as the Figma design evolved; each time Claude diffed against the live code and made only what changed.

### Prompt Patterns That Worked

**Prompt 1:**
> *"Get rid of 'your name' input field and related content. When enter the application with the url, and the room number is already in the url, directly brings user into the room."*

- **Why it worked:** Two concrete, scoped changes stated as outcomes. Claude knew exactly what "related content" meant by reading the file first (the header "Playing as" label, the `myName` variable, socket event params).
- **Reusable pattern:** Describe the desired end state, not the implementation steps. Claude finds the "related content" itself.

**Prompt 2:**
> *"An analog clock UI I created before /Users/cirochen/Downloads/clock-ui.tsx — Show Berlin time and Romanian time"*

- **Why it worked:** Providing the source file gave Claude the exact SVG math and interaction pattern to port. The timezone names were enough to swap out the city data.
- **Reusable pattern:** `[feature I want] + [file with reference implementation]` — Claude adapts your existing work rather than inventing from scratch.

**Prompt 3:**
> *"Implement this design from Figma. @[URL] Here is the redesign, please implement the UI changes"*

- **Why it worked:** The `@URL` reference triggered `get_design_context` which returned the full spec (colors, layout, component tree) alongside a screenshot. Claude compared it to the existing code and made only what was different.
- **Reusable pattern:** `Implement this design from Figma. @[figma URL]` — the most direct way to close the design-to-code gap for a single component.

### What Surprised Me

The Figma MCP doesn't just return a screenshot — it returns structured code (React + Tailwind) with exact values. Claude then re-translates that into the project's actual tech stack (vanilla HTML/CSS). **The workflow is: Figma → structured spec → project-specific code**, not Figma → screenshot → guess.

### My Mental Model Update

Before this session I thought Figma-to-code meant describing visuals to Claude and hoping it matched. Now I understand that `get_design_context` gives Claude the exact layout tree, spacing, colors, and component hierarchy — so the implementation is a translation problem, not a guessing problem. The designer's intent is preserved precisely.

### What I Would Try Next

**Experiment:** Design the full room view in Figma (header, card deck, player grid, controls, footer) as a single screen, then use `get_design_context` on each section to incrementally implement the whole UI. This would practice: multi-node Figma extraction, keeping design system tokens consistent across sections, and managing a larger implementation in a single session.
