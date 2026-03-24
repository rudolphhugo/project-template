# Project Rules for Claude

These rules apply to all work in this repository. Follow them without exception.

---

## 1. Plan Before Coding

**Always present a plan and wait for confirmation before writing any code.**

- Before starting any non-trivial task, outline your approach: what files you'll touch, what you'll create, and why.
- Ask clarifying questions upfront if anything is ambiguous. Offer a **"Skip for now"** option so the user can proceed if they feel the context is clear enough.
- Once the plan is confirmed, begin execution. Do not deviate from the confirmed plan without flagging it.
- "Plan means stop" — presenting a plan is not permission to start. Wait for explicit approval.

---

## 2. Always Use the Existing Stack

**This project ships with Next.js, Shadcn/ui, Lucide Icons, and Tailwind v4. Use them.**

- When building UI, always reach for Shadcn/ui components first — even when the user hasn't specified which components to use.
- If the required Shadcn components are not yet installed, ask before downloading:
  > "These components are needed: `[list]`. Should I install them with `npx shadcn@latest add`?"
- Offer a "code from scratch" fallback only as an option — **never build components from scratch without explicit confirmation**.
- Use Lucide Icons for all iconography unless the user specifies otherwise.
- Use Tailwind v4 utility classes for all styling — no inline styles, no CSS modules unless specifically requested.

---

## 3. Conserve Tokens — Ask Before Sweeping the Codebase

**Never perform broad codebase searches without checking context first.**

- Before running wide searches (e.g., grepping the whole repo, reading multiple files speculatively), pause and ask:
  > "I'd need to scan [scope] to answer this. Should I proceed, or can you point me to the relevant area?"
- If the answer is likely already in the conversation context or in a file already read, use that — don't re-fetch.
- Prefer targeted, specific reads over broad sweeps. Fewer tokens = faster, cheaper, better.
- When in doubt: ask, don't assume.

---

## 4. Capture New Context

**If you learn something important about this project during a session, ask if it should be saved.**

- When you discover a pattern, decision, constraint, or convention that would help future sessions, flag it:
  > "I've learned [X] about this project. Should I add it to CLAUDE.md?"
- Do not silently discard useful context. Surface it and let the user decide.
- Keep additions concise — one rule or note per thing learned, no padding.

---

## Project Status

**What this is:** A prototype for an anonymous lost & found key return service. Users attach a physical QR tag to their keys. Finders scan it, land on a web page, and can contact the owner without either party revealing their identity.

**Current state (as of 2026-03-24):** Working prototype, committed to `main`.

### What's built

| Route | Purpose |
|-------|---------|
| `/` | Demo landing page with scannable QR code |
| `/scan/[id]` | Finder's public page (two-step flow) |
| `/dashboard` | Owner's private dashboard |
| `/api/tag/[id]` | GET / POST / DELETE — shared server state |

**Key files:**
- `lib/keyturn-store.ts` — shared TypeScript types (`TagState`, `Message`, `RewardChoice`)
- `lib/server-store.ts` — in-memory Map (server-side, resets on restart)
- `app/api/tag/[id]/route.ts` — handles `message`, `location`, `set-reward`, `reward-choice` POST types
- `components/qr-block.tsx` — client component that generates QR from `window.location.origin`

**Prototype tag ID:** `abc123` — hardcoded in dashboard and QR. The finder URL is `/scan/abc123`.

### Implemented features

- Anonymous chat between finder and owner (cross-device via polling every 2s)
- Finder two-step flow: greeting screen → actions/chat
- Quick action buttons (pre-written messages)
- Optional location sharing (geolocation API with Stockholm fallback)
- Owner dashboard: item list with live status badges, chat view, map placeholder
- QR code on landing page encodes the dynamic network IP automatically
- Reward system: owner sets an amount (kr), finder chooses between gift card code or charity donation (Red Cross, UNICEF, WWF)
- System messages auto-posted to chat when finder makes reward choice

### Architecture decisions

- **No external backend** — state lives in a server-side `Map` in `lib/server-store.ts`. Resets on dev server restart. Sufficient for prototyping.
- **Polling, not websockets** — dashboard and finder both poll `/api/tag/[id]` every 2 seconds. Simple, works cross-device on same WiFi.
- **Dev server runs on port 3002** (port 3000 was occupied). Network URL: `http://192.168.0.2:3002`.

### What's NOT built yet (known gaps)

- Real-time (WebSockets / Supabase) — polling is fine for prototype
- Persistent storage — state resets on server restart
- Multiple tag IDs — dashboard is hardcoded to `abc123`
- QR code generation per item — currently one global QR on landing page
- Push/email notifications for owner when keys are found
- Authentication for the owner dashboard
- "Lost Mode" toggle per item
