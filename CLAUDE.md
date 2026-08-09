# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`skinkit` — a headless React component library (npm name `skinkit`, currently a spike at
`v0.0.1`). Components emit **zero style**: only structure plus a stable attribute contract. All
visuals live in **external, un-hashed, un-bundled CSS** that targets that contract, so a consumer
can use a bundled skin/theme or write their own without forking a single component. Comments and
docs are in Spanish; keep new ones in Spanish to match. `AGENTS.md` is a shorter mirror of this
file — if you change the architecture, keep both in sync.

## The two orthogonal styling axes

This is the whole idea — internalize it before touching anything:

- **`theme` (re-look / "piel")** → `[data-theme="<slug>"]`. A bundle of **color tokens only**. Fills
  the palette contract. Changes the palette without touching components or skins.
- **`skin` (re-anatomy / "esqueleto")** → `[data-skin="<slug>"]`. A layer of CSS that dictates
  **shape and structure** (radius, border, shadow, spacing usage). Same components, different anatomy.

They compose freely: any `theme` × any `skin`. **Golden rule: color comes from theme tokens
(`var(--sk-*)`), shape comes from the skin.** A skin must never hardcode color, and a theme must
never define shape — this is what keeps the two axes independent. Deciding theme vs skin: does the
change touch **color**? → theme. **Shape/structure**? → skin.

## Skills (load BEFORE writing code)

This repo ships project-specific skills under `.claude/skills/`. When the task matches, invoke the
skill first — they encode the catalog rules and the theme/skin boundary that are easy to get wrong.

| Skill | When |
|-------|------|
| `skinkit-component` | Creating a new component (headless + its mandatory catalog file) |
| `skinkit-component-update` | Modifying an existing component (must sync its catalog in the same change) |
| `skinkit-theme` | Creating a theme / palette / color scheme (**color only**) |
| `skinkit-skin` | Creating a skin / visual style / anatomy (**shape only**) |

## Catalog — the source of truth for AI

Each component has a **separate** `<Name>.catalog.ts` next to it that exports a `ComponentSpec`
(all props, the parts contract, examples, usage do/don'ts, a11y notes, and a required `category`).
Shape is defined in `src/catalog/types.ts`. All specs are aggregated in `src/catalog/index.ts` as
`COMPONENT_CATALOG` (with a `getComponentSpec(name)` lookup) and exported to consumers as
`skinkit/catalog`.

Every spec sets `category: ComponentCategory` — one of `Acción | Formulario | Navegación |
Feedback | Display` (see `CATEGORY_ORDER` for display order). `getCatalogByCategory()` groups the
catalog into sections; the playground rail renders grouped by it. A new component must pick a
category (the field is required — a missing one fails typecheck).

This catalog is what **AI screen generation consumes** — *"if it isn't in the catalog, for the AI it
doesn't exist."* **Hard rule (non-negotiable):** creating a component = creating its catalog file;
changing a component's props / behavior / parts = updating its catalog in the **same change**. The
`skinkit-component` / `skinkit-component-update` skills enforce this.

## Commands

```bash
cd lib-skinkit
bun install       # or npm install
bun run dev       # playground — vite, http://localhost:3200
bun run build     # tsup → dist/ (JS + .d.ts ONLY; CSS is not built)
bun run typecheck # tsc --noEmit
bun run preview   # vite build && vite preview
bun run shots     # capture 1 image per component (all 6 skins side by side) → skin-shots/
```

There is **no test runner and no lint script** here (unlike sibling projects in `../`). Rely on
`typecheck` for verification. Per user rules, do not run `build` after changes unless asked.

**Verifying skins is VISUAL, never a script.** `bun run shots` (`scripts/capture-skins.mjs`,
Playwright over the running playground's "comparar skins" mode) writes one PNG per component to
`skin-shots/`, each showing the component in all skins at once. It does NOT judge pass/fail — a CSS
script can't tell "looks like soft" (one that did reported PASS while skins were identical). When
creating/changing a skin, run it and Read every image: no two skins may look the same or like soft,
and every component must actually receive the skin's shape (`minimal` is intentionally flat, the one
exception). See the `skinkit-skin` skill.

## The attribute contract (the real API)

Components render structure and these stable hooks; CSS is the only thing that reads them. Never
add component-owned styling — if a component needs to look different, that belongs in a skin.

| Attribute | Meaning |
|-----------|---------|
| `[data-sk="button\|card\|input\|accordion"]` | component root |
| `[data-part="label\|icon\|header\|body\|footer\|field\|helper\|item\|trigger\|indicator\|panel"]` | sub-part |
| `[data-variant]`, `[data-size]` | prop-declared variants (Button) |
| `[data-state="open\|closed"]` | Accordion item/trigger/panel state |
| `[data-error]` | present (empty string) when Input `error` is true |
| `[data-skinkit-root]` | the provider wrapper; scopes the base reset |

Behavior (state, `aria-*`, keyboard: ↑ ↓ Home End across Accordion triggers) is the component's
job; CSS never touches it. Enter/Space on a trigger is handled by the native `<button>`.

**Accordion gotcha:** `Accordion.Panel` collapses via the native `hidden` attribute (correct for
a11y/focus — collapsed content is truly removed from the tab order). But `hidden` blocks any
height/collapse animation. A skin that wants an animated panel must drive open/closed from
`[data-state]` (e.g. `grid-template-rows` / `max-height`) rather than relying on `hidden`.

## CSS / token layering

`src/styles/` has three deliberately separate layers — do not collapse them:

1. `tokens/global.css` — brand-neutral **primitives**: spacing (`--sk-sp-*`) and font sizes
   (`--sk-fs-*`). No color, no shape.
2. `tokens/semantic.css` — the **color CONTRACT**: `--sk-surface`, `--sk-text`, `--sk-primary`,
   `--sk-on-primary`, `--sk-border`, `--sk-danger`, `--sk-font`, etc., all declared as `initial`.
   A theme MUST be active for these to resolve — with no `[data-theme]`, `var(--sk-*)` is `initial`.
3. `tokens/themes/<slug>.css` — fills the contract under `[data-theme="<slug>"]`. Themes: `paper`
   (light), `dusk`, `forest`.

Skins (`styles/skins/<slug>.css`) are each **one CSS file scoped under `[data-skin="<slug>"]`**
that styles the parts, pulling color from `var(--sk-*)`. Reference skins: `soft` (rounded, soft
shadows), `brutal` (square, thick border, mono), `minimal`.

`styles/index.css` (exported as `skinkit/styles/base`) imports global + semantic + the bundled
themes and applies a minimal reset scoped to `[data-skinkit-root]`. It intentionally ships **no
skin** — components come unstyled on purpose.

## Packaging model (important gotcha)

`tsup` compiles **only the JS/TS + types** into `dist/` — two entries: `src/index.ts` (components)
and `src/catalog/index.ts` (the catalog, so it's importable without pulling in React styling code).
The **CSS is shipped as-is** from `src/styles` (listed in `package.json` `files`) — never hashed,
injected, or bundled, so consumers can override it. `package.json` `exports` map subpaths directly:

- `skinkit` → `dist/index.js` (components + provider)
- `skinkit/catalog` → `dist/catalog/index.js` (`COMPONENT_CATALOG`, `getComponentSpec`, spec types)
- `skinkit/styles/base` → `src/styles/index.css`
- `skinkit/skins/<slug>` → `src/styles/skins/<slug>.css`
- `skinkit/themes/<slug>` → `src/styles/tokens/themes/<slug>.css`

Consequence: adding a skin/theme file is not enough — you must also add its subpath to `exports`
(and import new themes into `styles/index.css` if they should ship with `base`).

## Conventions & where things go

- Each component: own directory with `Component.tsx` + `index.ts` barrel + `<Name>.catalog.ts`;
  hooks split into their own file (e.g. `Accordion/useAccordion.ts`). Compound components attach
  sub-parts as static props (`Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`).
- Everything public is re-exported through `src/index.ts` (values and types).
- `src/lib/cx.ts` is the only class-joining helper — no `clsx`/`classnames` dependency. Components
  also emit a fixed `sk-*` className alongside `data-sk` for convenience; the `data-*` contract is
  the canonical selector target.
- `SkinkitProvider` only sets `data-theme` + `data-skin` on a wrapper div and exposes them via
  `useSkinkit()`. It's optional — setting the two attributes by hand works identically.
- The playground (`playground/`) is a vite app (`root: 'playground'`) that imports components from
  `../src` directly (not the built package). It renders the same markup under multiple skins side by
  side with a shared theme selector, to prove the two axes are independent.

## Adding things

Prefer the matching skill (above) — it walks the full checklist. In short:

- **New component**: create its dir, render only structure + the `data-sk`/`data-part`/variant
  contract (no styles), barrel via `index.ts`, export from `src/index.ts`. **Write its
  `<Name>.catalog.ts` and register it in `src/catalog/index.ts`.** Then add its rules to **each**
  skin CSS file. (`skinkit-component` skill.)
- **Modify a component**: apply the change, then **update its `<Name>.catalog.ts`** in the same
  change if props/behavior/parts moved. (`skinkit-component-update` skill.)
- **New skin**: one CSS file under `styles/skins/`, everything scoped to `[data-skin="<name>"]`,
  color via `var(--sk-*)` only. Add its `skinkit/skins/<name>` subpath to `exports`. (`skinkit-skin`.)
- **New theme**: one CSS file under `styles/tokens/themes/` scoped to `[data-theme="<name>"]` filling
  the semantic contract, color only. Add its subpath to `exports`; import it in `styles/index.css`
  if it should ship with `base`. (`skinkit-theme`.)
