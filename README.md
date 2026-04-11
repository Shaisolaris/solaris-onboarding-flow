# Solaris — Multi-step Onboarding Flow

A 5-step SaaS onboarding wizard with progress bar, form validation, smooth transitions, and a review screen. The kind of flow every SaaS needs on day one but most ship half-baked.

**Live demo:** https://shaisolaris.github.io/solaris-onboarding-flow/

## What it shows

- **5-step wizard** — Company → Team → Integrations → Preferences → Launch → Welcome
- **Animated progress bar** and step markers
- **Smooth transitions** between steps (no jarring jumps)
- **Form validation** — "Continue" disabled until the current step has the minimum required fields
- **Dynamic team invites** — add/remove teammates inline, up to 5
- **Integration toggles** — 6 tools with custom iOS-style switches
- **Preferences** — theme picker, timezone, notification checkboxes
- **Review screen** summarizing every choice before launch
- **Welcome screen** with personalized greeting
- **Dark mode** with localStorage persistence
- Fully responsive

## Stack

- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS 3
- Deployed to GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## License

MIT.
