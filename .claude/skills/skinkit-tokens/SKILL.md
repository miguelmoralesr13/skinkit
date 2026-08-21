---
name: skinkit-tokens
description: >
  Customize skinkit's look — color tokens, shape tokens, or a specific component's CSS. Single
  Tailwind-native design-token system (src/styles/tokens.css) + one CSS file per component
  (src/styles/components/<dataSk>.css), no more separate theme/skin axes.
  Trigger: When asked to change skinkit's colors, palette, radius/shadow scale, dark mode, or the
  visual look of a specific component ("cambiá el color primario", "menos sombra en los cards",
  "otro radio de bordes", "personalizá con variables Tailwind").
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Write, Edit, Bash
---

## When to Use

- Changing the default palette, radius/shadow scale, or typography tokens → edit
  `src/styles/tokens.css`.
- Changing (or adding) a specific component's CSS → edit
  `src/styles/components/<dataSk>.css`.
- Adding/adjusting dark mode values, or wiring a new hardcoded literal color for dark-mode
  correctness → see **Dark mode** below.
- NOT for creating a new component's `.tsx`/catalog — that's `skinkit-component`.

## The model

skinkit ships **one look**, Tailwind-native, fully overridable via CSS custom properties — not a
menu of presets to pick from. There is no `theme`/`skin` prop or `[data-theme]`/`[data-skin]`
attribute anymore; `SkinkitProvider` sets `[data-skinkit-root]` and, optionally, `data-color-scheme`
when a `colorScheme` prop is passed (see **Dark mode** below) — that's the one axis it still knows
about, everything else is CSS custom properties.

- **Color and shape live in `src/styles/tokens.css`**, inside one `@theme` block:
  `--color-sk-*` (surface/text/primary/secondary/.../danger, + `-on-*` pairs), `--radius-sk-sm/md/lg/pill`,
  `--shadow-sk-sm/md/lg`, `--text-sk-sm/md/lg`, `--font-sk-sans/mono`. Tailwind v4 compiles `@theme`
  values to real `:root` custom properties **and** auto-generates utilities from them
  (`bg-sk-primary`, `rounded-sk-lg`, `shadow-sk-md`, `text-sk-md`...). This file ships real default
  values (not `initial`) — the library must look right with zero config.
- **Each component's CSS lives in its own file**, `src/styles/components/<dataSk>.css` (named
  after the catalog's `dataSk`, not the directory — e.g. `radio-group.css`, not `Radio.css`),
  selecting `[data-sk='...']`/`[data-part='...']` directly (no scope prefix — there's one look).
  Aggregated via `@import './<dataSk>.css' layer(components);` in
  `src/styles/components/index.css`.
- **Golden rule, still true**: color comes from `--color-sk-*` tokens, shape/spacing from
  `--radius-sk-*`/`--shadow-sk-*`/Tailwind's spacing scale. Don't hardcode a hex or a one-off
  radius into a component file unless it genuinely doesn't fit the named scale (see below).

## Customizing tokens (global look)

Edit `src/styles/tokens.css` directly — e.g. change `--color-sk-primary` to re-brand, or
`--radius-sk-md` to make everything sharper/rounder. Every component that references that token
repaints automatically, nothing else to touch.

A **consumer** (not this repo) does the same thing without forking anything:
```css
/* their own CSS, or inline style on any ancestor */
[data-skinkit-root] { --color-sk-primary: #ff0000; --radius-sk-md: 4px; }
```
or, with Tailwind arbitrary values: `<div className="[--color-sk-primary:#ff0000]">`. A consumer
running their own Tailwind v4 build can also `@import "skinkit/tailwind-preset";` (the raw
`tokens.css` source, exported unbuilt) to get `bg-sk-primary`-style utilities in their own app code
and override tokens before skinkit renders.

## Dark mode

Activated with the native CSS `light-dark()` function, not a second `@theme`/theme axis — a token
that needs a dark value just becomes `--color-sk-x: light-dark(#lightHex, #darkHex);` instead of a
plain literal. `light-dark()` resolves off the `color-scheme` **computed on the element where the
variable is used** (inherited property), which is why one declaration on `[data-skinkit-root]` is
enough for the whole subtree — no need to touch component files:

```css
/* tokens.css */
[data-skinkit-root] { color-scheme: light dark; }                       /* follows the OS */
[data-skinkit-root][data-color-scheme='light'] { color-scheme: light; } /* forced */
[data-skinkit-root][data-color-scheme='dark'] { color-scheme: dark; }   /* forced */
```

`SkinkitProvider` exposes this as `colorScheme?: 'light' | 'dark'` (`undefined` = follow the OS).
Persisting the user's choice (localStorage, etc.) is the CONSUMER's job, not skinkit's.

**Not every color token needs a dark value.** Before adding `light-dark(...)` to a token, check
whether it actually depends on the page background:
- **Neutrals** (`--color-sk-surface`, `-surface-2`, `-text`, `-text-muted`, `-border`) — yes,
  always, they ARE the background/foreground.
- **Code syntax colors** (`--color-sk-code-*`) — yes, same reason any code editor ships separate
  light/dark syntax themes: they're text directly on a surface.
- **Shadows** (`--shadow-sk-*`) — yes: a black `rgba()` shadow nearly disappears on an already-dark
  surface, needs more opacity in the dark branch.
- **Brand/tone colors** (`primary`, the 7 tones, all `-on-*` pairs, `danger`) — **no, leave as a
  plain literal.** They're solid fills (buttons, badges) with their own contrast already resolved
  against their paired `-on-*` text color, independent of whatever the page background is doing.
  Forcing a second value here is a cosmetic-only change with no real accessibility payoff — check
  actual contrast (WCAG, ~4.5:1 for normal text) before deciding a tone needs one.

**New hardcoded literal color in a component file** (the handful of `color-mix()`/`rgba()` spots
`@apply` can't express, per the recipe below) — wrap it the same way, keeping the light value
identical to what's already there so light mode never regresses:
```css
/* hover-darken that should LIGHTEN on a dark surface instead */
background: color-mix(in srgb, var(--sk-button-bg) 85%, light-dark(#000, #fff));
/* elevation shadow that needs more opacity on dark */
box-shadow: light-dark(0 12px 48px rgba(0, 0, 0, 0.25), 0 12px 48px rgba(0, 0, 0, 0.55));
```
Backdrop/scrim overlays (`rgba(0,0,0,α)` dimming whatever's *behind* a modal/dropdown, not the
component's own surface) are scheme-neutral — don't wrap those.

**Portal gotcha (easy to miss):** components that `createPortal` to `document.body` — currently
`Dialog`, `CommandMenu`, `Toast`, `TourOverlay` (`grep -rl createPortal src/components/`) — each
build their own fresh `[data-skinkit-root]` div at the body level, since a portal escapes the DOM
tree it's called from. That fresh div does **not** inherit `data-color-scheme` from the original
`SkinkitProvider` above it in the React tree (React tree ≠ DOM tree once portaled). Any new
portaling component MUST call `useSkinkitColorScheme()` (exported from `SkinkitProvider.tsx` and
`src/index.ts`) and put the result on its own portal root: `<div data-skinkit-root=""
data-color-scheme={colorScheme} className="skinkit-root">`. Forgetting this means a forced
`colorScheme` silently does nothing for that component — it'll keep following the OS. Verified by
actually forcing "Claro" in the playground with the OS in dark mode and opening the affected
component, not by reading the CSS and assuming it cascades.

## Customizing (or adding) a component's CSS

Edit `src/styles/components/<dataSk>.css` directly. Reference conversions already in the repo:
`button.css` (simple variant/size/tone), `accordion.css` (`[data-part][data-state]` compound
pattern). Recipe:

1. Target `[data-sk='...']`/`[data-part='...']` selectors — the contract is `skinkit/catalog`
   (`getComponentSpec(name).parts`), the authoritative list, not soft-guessing from the `.tsx`.
2. Use `@apply` for anything expressible as plain Tailwind utilities (layout, spacing, color,
   radius, shadow, typography, simple transitions).
3. Plain CSS (no `@apply`, can sit in the same rule) for anything Tailwind can't express as a
   utility: `color-mix()`, `calc()`, custom multi-value `border-left`, etc.
4. Map literal shape values to the named scale when they match (999px → `rounded-sk-pill`, 16px →
   `rounded-sk-lg`, 12px → `rounded-sk-md`, 8px → `rounded-sk-sm`; shadows matching one of the 3
   `--shadow-sk-*` literals → `shadow-sk-sm/md/lg`). **A value that doesn't cleanly match stays
   literal** (Tailwind arbitrary value `rounded-[14px]`, or plain CSS) — don't force a one-off into
   the nearest token, that's how visual drift creeps in.
5. New component → also add one `@import './<dataSk>.css' layer(components);` line to
   `src/styles/components/index.css` (see `skinkit-component`'s "After Creating" step).

## Verification — still visual, not a script

Same discipline as before, just aimed at one file instead of many: a script can't judge "does this
look right." After a token or component CSS change:

```bash
bun run typecheck    # tsc --noEmit — cheap, catches nothing style-specific but run it first
bun run dev           # playground, :3200 — walk the affected component(s), exercise the
                       # token-override panel (top toolbar) to confirm var() overrides cascade.
                       # For dark mode specifically: use the Sistema/Claro/Oscuro toggle next to
                       # it — check light stays pixel-identical, and force each mode explicitly
                       # (don't rely only on "Sistema" matching your OS by coincidence).
bun run shots [Name]  # scripts/capture-components.mjs — one screenshot per component into
                       # component-shots/, for before/after regression review. No pass/fail
                       # judgment built in on purpose (a prior automated "looks the same" check
                       # gave false positives) — read the images yourself.
```

## Resources

- **Token contract**: `src/styles/tokens.css` (also has the `color-scheme` dark-mode activation
  block at the bottom)
- **Reference component CSS**: `src/styles/components/button.css` (simple, also has a
  `light-dark()` color-mix example), `src/styles/components/accordion.css` (compound/stateful)
- **Portal + colorScheme reference**: `src/components/Dialog/Dialog.tsx` (`useSkinkitColorScheme`
  usage) — copy this pattern for any new portaling component
- **`src/provider/SkinkitProvider.tsx`**: `colorScheme` prop + `useSkinkitColorScheme` context
- **Part contract source**: `skinkit/catalog` (`COMPONENT_CATALOG`, each spec's `parts`)
- **Build**: `src/styles/index.css` is the entry (`@import "tailwindcss"` + tokens + components +
  layout); `npm run build:css` (`@tailwindcss/cli`) compiles it to `dist/styles/skinkit.css`,
  shipped as `skinkit/styles/base`.
