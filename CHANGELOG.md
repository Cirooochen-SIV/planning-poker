# Changelog — Planning Poker

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.5.0] — 2026-03-31 · Brand Contrast Fix

### Changed
- **Brand name** on the landing page — removed indigo-purple gradient, now solid black (`#1e293b`) for clear legibility against the background image.
- **Tagline** on the landing page — changed from `text-2` (#475569) to deep navy `#1e3a5f` with `font-weight: 500`; harmonises with the blue wave background while meeting contrast requirements.

---

## [1.4.0] — 2026-03-31 · Background Image & Results Improvements

### Added
- **Background image** — a blue wave image (`bg.jpg`) applied as a fixed, full-cover background on `body`, visible on both the landing screen and the room session screen. `background-attachment: fixed` gives a subtle parallax feel as content scrolls.

### Changed
- **Most voted — tied state** — when multiple values share the highest vote count, all tied answers are now shown in the Most Voted slot separated by `·`, with the label changing to *Most voted (tied)*.
- **Special vote hint alignment** — `💬 Voters with "?" or "☕", please explain your reasoning.` is now center-aligned inside the stats card.
- **Landing gradient removed** — `#view-landing` background changed from the `#eef2ff → #f8fafc` gradient to transparent so the body background image shows through cleanly.

---

## [1.3.0] — 2026-03-31 · UX Polish & Celebration

### Added
- **Consensus celebration** — when all voters pick the same value, a full-screen dark overlay appears for 3 seconds showing the brain image, the heading "We're all on the same page 🎉", and an 80-piece CSS confetti burst. Resets automatically each round.
- **Special vote explanation prompt** — when any voter casts `?` or `☕`, a `💬 Voters with "?" or "☕", please explain your reasoning.` message appears at the bottom of the stats card.
- **Estimate reminder** — a `💡 Before voting, please consider uncertainty, complexity, and dependencies of the ticket.` hint now sits between the "Choose your estimate" title and the card deck.

### Changed
- **Section label contrast** — section titles ("Choose your estimate", "Players", "Results") darkened from `text-3` (#94a3b8) to `text-2` (#475569) for WCAG-compliant readability.
- **Header logo** — removed indigo-purple gradient; logo is now solid black so the 🃏 emoji renders correctly alongside the wordmark.

---

## [1.2.0] — 2026-03-31 · Results Redesign (Figma Round 2)

### Changed
- **"RESULTS" label** moved to the top of the section, above the distribution bars — no separate "Distribution" header.
- **Stats card** now has its own inset panel: `#fafafa` background, `#e9eaeb` border, `12px` border-radius, `16px 24px` padding.
- **Gap** between distribution and stats card increased to `24px`.
- **Stat labels** changed to mixed case: *Most voted*, *Average*, *Minimum*, *Maximum*.

---

## [1.1.1] — 2026-03-31 · Typography

### Changed
- **Font** switched from system font stack to **Google Sans** (loaded via Google Fonts CDN), with system stack as fallback. Applied globally via `font-family` on `body`.

---

## [1.1.0] — 2026-03-31 · Results Redesign (Figma Round 1)

### Changed
- **Section order** — Distribution bars now appear above the stats row.
- **Distribution bars** redesigned: thin `10px` bars with a `1px` inset gradient fill; vote values moved into bordered boxes (`32×40px`, `#e9eaeb` border); vote counts moved outside the bar to the right.
- **Most Voted** promoted to hero stat — `36px`, accent color (`#6366f1`), medium weight.
- **Average / Minimum / Maximum** reduced to secondary size — `24px`, `#606060`.
- **Stats layout** changed from fixed gap to `space-between` across full width.

---

## [1.0.2] — 2026-03-31 · Footer & Clock

### Added
- **Persistent footer** — fixed to the bottom of every page (landing + room view), `56px` tall with top border.
- **Analog clock** — SVG clock ported from a React/TSX reference component to vanilla JS. Ticks every second.
- **Timezone selector** — toggle between **Berlin** (`Europe/Berlin`, CET/CEST) and **Romania** (`Europe/Bucharest`, EET/EEST). Selector uses `[•]` / `[ ]` indicator style.
- **"Made with love by Ciro"** credit on the right side of the footer.
- `padding-bottom: 56px` added to `body` to prevent footer overlap with room controls.

---

## [1.0.1] — 2026-03-31 · Anonymous Mode & URL Auto-join

### Changed
- **Removed name input** — "Your name" field and "Playing as" header label removed. All users join as Anonymous.
- **Auto-join from URL** — navigating directly to `/room/12345` immediately joins the room on socket connect, skipping the landing page entirely.

### Removed
- `myName` state variable and all related socket event name parameters.
- `header-player` element from the room header.

---

## [1.0.0] — 2026-03-31 · Initial Release

### Added
- **Real-time Planning Poker** — multiple players join a shared room and cast story point votes simultaneously.
- **Room management** — 5-digit room codes, auto-generated. Rooms expire after **24 hours of inactivity**; a sweep runs every hour.
- **Card packs** — Mountain Goat, Fibonacci, Sequential, Playing Cards, T-Shirt sizes.
- **Moderator controls** — first player to create a room becomes moderator. Moderator can reveal votes, reset the round, and change the card pack.
- **Observer mode** — any player can toggle off voting and watch as a non-voter.
- **Vote reveal** — cards stay face-down until moderator reveals; prevents anchoring bias.
- **Results section** — Average, Most Voted, Minimum, Maximum stats, plus a vote distribution chart with gradient bars.
- **Shareable room link** — "Copy link" button copies the `/room/:id` URL to clipboard.
- **URL routing** — each room has a stable `/room/:id` path; browser history is updated on join.
- **Socket.io** real-time sync — votes, reveals, resets, and player joins/leaves broadcast instantly to all connected clients.
- **Railway deployment** — connected to GitHub (`main` branch); auto-deploys on every push. Config in `railway.toml`.
