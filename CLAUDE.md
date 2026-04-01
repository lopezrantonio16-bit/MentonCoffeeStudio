@AGENTS.md

# Stack

- Next.js 16, React 19, TypeScript
- Tailwind v4 (utility-first, inline classes only — no CSS modules, no `@apply`)
- shadcn/ui (Base UI primitives) — always first choice for new components
- Motion (`motion/react`) — orchestrated animations (entrances, exits, layout shifts)
- CSS transitions — simple states (hover, focus, color changes)
- React Three Fiber + Drei — 3D is a core differentiator, first-class dependency
- Geist Sans — sole typeface, weight/size for hierarchy

# Design System

- **Color tokens:** use semantic tokens (`bg-primary`, `text-foreground`). One-off hex values OK for intentional brand moments.
- **Light mode only.** No dark mode tokens, no `dark:` prefixes.
- **Layout:** `max-w-4xl` content ceiling, all sections.
- **Spacing:** Tailwind default scale. Arbitrary values (`w-[7rem]`, `text-[10px]`) fine for precision fit.
- **Responsive:** every component must be intentional at 375px, 768px, and 1280px+.
- **Motion personality:** gentle entrances (`opacity`, small `y` offset, `springs.gentle`/`springs.smooth`), snappy interactions (`springs.snappy`, `whileTap` scale). Always respect `useReducedMotion`.
- **Assets:** inline SVG for icons/graphics, GLB in `/public/model/` for 3D, `next/image` for raster. Everything in `/public`.

# File Structure

```
src/components/ui/       → shadcn primitives (Button, etc.)
src/components/sections/ → page-level compositions (Hero, Provenance, etc.)
src/components/          → standalone visual components (CoffeeModel, etc.)
src/lib/                 → shared utilities (motion springs, cn helper)
```

Strict: `ui/` = reusable primitives, `sections/` = page compositions. No mixing.

# State

Local `useState` by default. React context for shared state (e.g. cart across components). No external state libraries.

# Commerce

The purchase flow (Add to Cart → quantity → Checkout + Apple Pay) is production-final UI. Payment processing is not wired yet. When plumbing is added, attach handlers to existing components — do not redesign the interface.

# Git & Deploy

- Conventional commits always: `feat:`, `fix:`, `chore:`, `refactor:`, `revert:`, `style:`, `docs:`
- Push to `main` = production deploy (Vercel GitHub integration)
- Copy is not locked — do not optimize code around current wording

# Not App Dependencies

`@anthropic-ai/sdk` is in `package.json` for Claude Code tooling, not the app. Do not import it in `src/`.
