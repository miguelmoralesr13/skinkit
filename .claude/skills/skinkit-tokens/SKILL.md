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
- NOT for creating a new component's `.tsx`/catalog — that's `skinkit-component`.

## The model

skinkit ships **one look**, Tailwind-native, fully overridable via CSS custom properties — not a
menu of presets to pick from. There is no `theme`/`skin` prop or `[data-theme]`/`[data-skin]`
attribute anymore; `SkinkitProvider` only sets `[data-skinkit-root]`.

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
                       # token-override panel (top toolbar) to confirm var() overrides cascade
bun run shots [Name]  # scripts/capture-components.mjs — one screenshot per component into
                       # component-shots/, for before/after regression review. No pass/fail
                       # judgment built in on purpose (a prior automated "looks the same" check
                       # gave false positives) — read the images yourself.
```

## Resources

- **Token contract**: `src/styles/tokens.css`
- **Reference component CSS**: `src/styles/components/button.css` (simple),
  `src/styles/components/accordion.css` (compound/stateful)
- **Part contract source**: `skinkit/catalog` (`COMPONENT_CATALOG`, each spec's `parts`)
- **Build**: `src/styles/index.css` is the entry (`@import "tailwindcss"` + tokens + components +
  layout); `npm run build:css` (`@tailwindcss/cli`) compiles it to `dist/styles/skinkit.css`,
  shipped as `skinkit/styles/base`.
