# Working this project across Mac + iPhone

How this project is actually meant to be worked day-to-day, split by device. Read
`CLAUDE.md` first for project context — this file is about the *human* workflow around
it, not the codebase itself.

## Division of labor

**Mac (VS Code + Claude Code) = where real work happens.** Writing code, running
`vercel --prod`, editing env vars, resolving merge conflicts, anything that touches
money or ships to customers. Do this here, not from your phone.

**iPhone (Claude app, Remote Control) = monitor + approve, not code.** Check status,
answer a quick question Claude is blocked on, approve or deny a pending permission
prompt, glance at whether something finished. Don't run a real coding session from your
phone for this project — the point of the phone is to not be tied to the laptop, not to
replace it.

## One-time setup (already done tonight, here for reference)

- Push notifications: run `/config` in Claude Code and turn on both **Push when Claude
  decides** and **Push when actions required** — the first tells you when something
  finishes, the second tells you the moment a permission prompt is blocking progress.
- Remote Control: type `/remote-control` (or `/rc`) in the Claude Code prompt box on
  the Mac to get a QR code / session URL. Scan it (or open the URL) from the Claude app
  on your phone, signed into the same account. The session keeps running on the Mac —
  the phone is a second screen for it, not a separate copy.
- Permission allowlist: `.claude/settings.json` in this repo has a short list of
  read-only commands (like `node -c`, `which`) that no longer prompt for approval, so a
  Mac session flows without interruption on the genuinely safe stuff. Anything that
  writes, pushes, deploys, or spends money still prompts — that's deliberate, not a gap
  to close later.

## A typical day

**At the laptop**: do the actual work — feature changes, fixing something Stripe
flagged, deploying. Before touching anything, if it's been more than a few hours since
you last worked here (or you know the phone side made any changes), run `git pull`
first — see the "parallel sessions" gotcha in `CLAUDE.md`.

**Away from the laptop, phone in hand**: you'll get a push if Claude is blocked waiting
on you (approve/deny) or just finished something. Open the Claude app, check the
session, respond in a sentence or two, put the phone away. If you spot something that
needs real code changes, don't try to drive it from the phone — just note it (or tell
Claude to hold it) and pick it up back at the Mac.

**Checking on the business itself (not code) from your phone** — none of these need
Claude or Remote Control, just bookmark them:
- Stripe Dashboard (dashboard.stripe.com) — mobile web works fine — check new orders,
  capture one, see webhook health
- Vercel Dashboard (vercel.com/dashboard) — mobile web — check deploy status, logs
- Resend Dashboard (resend.com) — mobile web — check email delivery logs

**Back at the laptop**: `git pull` before starting (habit, not paranoia — this repo has
already had two sessions diverge once tonight), then continue.

## The one rule that matters most

Nothing that spends real money or changes what customers see should happen from a
phone-approved prompt you only half-read. If a permission prompt shows up on your phone
for something you don't immediately recognize, the safe default is deny and go look at
it properly on the Mac — not approve now, understand later.
