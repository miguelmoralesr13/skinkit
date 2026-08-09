---
name: skinkit-skin
description: >
  Generate a new skin (shape/anatomy layer) for the skinkit library. A skin is external
  CSS that restyles the components via their part contract — it changes FORM, never behavior.
  Trigger: When asked to add/create/generate a skin, a visual style, or a "look" in skinkit
  (e.g. "nuevo skin", "estilo brutalista/glass/retro", "otra anatomía", "que se vea distinto").
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Write, Edit, Bash
---

## When to Use

- The user wants a new visual STYLE / shape / anatomy for the components (rounded, sharp,
  glass, retro, flat…). If they only want a new COLOR palette, that's a **theme** → use
  `skinkit-theme`.

## Critical Patterns

- A skin is **one CSS file** under `src/styles/skins/<name>.css`. No JS, no component edits.
- Scope EVERYTHING under `[data-skin="<name>"]` so skins coexist.
- **Golden rule: color comes from the theme via `var(--sk-*)`; the skin only sets SHAPE**
  (radius, border, shadow, spacing, typography, layout). Hardcoding a color breaks theme swapping.
- Target the **part contract** (stable attributes the components emit) — never invent class names.
- Cover every **state**: `[data-variant]`, `[data-size]`, `[data-state]`, `[data-error]`,
  `:hover`, `:active`, `:disabled`, `:focus-visible`.
- Markup/DOM order is fixed. To move a part visually (e.g. indicator before label), use CSS
  `order` on a flex container — you can re-lay-out without touching the component.
- **Layout components are NOT skinned.** `Grid`, `Stack`, `Container`, `Spacer` and `AppShell`
  are structural CSS that lives in the base (`src/styles/layout.css`) and is identical across
  skins — do not add rules for them in a skin.

## Part Contract (what to target)

skinkit has ~100 components. The table below is a **representative subset** (one per pattern).
The authoritative, per-component `parts` contract is `skinkit/catalog` (`COMPONENT_CATALOG` — each
spec's `parts`), and `src/styles/skins/soft.css` styles **every** component. The template
(`assets/skin.template.css`) already contains a **stub for every selector of every component**
(generated from soft.css), each with a comment listing the CSS properties to define — so you just
fill in the values.

| Component | Root | Parts | State attrs |
|-----------|------|-------|-------------|
| Button | `[data-sk="button"]` | `[data-part="icon"]`, `[data-part="label"]` | `[data-variant=filled\|outlined\|ghost]`, `[data-size=sm\|md\|lg]`, `:disabled` |
| Card | `[data-sk="card"]` | `[data-part="header\|body\|footer"]` | — |
| Input | `[data-sk="input"]` | `[data-part="label\|field\|helper"]` | `[data-error]`, `:focus` on field |
| Accordion | `[data-sk="accordion"]` | `[data-part="item\|trigger\|label\|indicator\|panel"]` | `[data-state=open\|closed]` on item/trigger/panel, `:focus-visible` on trigger |

Selector shape: `[data-skin="<name>"] [data-sk="button"][data-variant="outlined"] { ... }`
and `[data-skin="<name>"] [data-sk="accordion"] [data-part="trigger"][data-state="open"] { ... }`.

## Gotcha — Accordion panel

`Accordion.Panel` uses the native `hidden` attribute when closed (correct for a11y/focus),
which **blocks height animation**. If the skin needs an animated open/close, it must NOT rely
on `hidden` — coordinate with the component (render always + collapse via CSS grid-rows /
max-height driven by `[data-state]`). For a static skin, `hidden` is fine.

## The winning recipe: DERIVE from soft (for completeness) + AGGRESSIVE transform (for distinctness)

Two failure modes we hit, and the fix:

- **Hand-authoring from memory → BROKEN/MISSING parts.** You will misname parts (pagination uses
  `page`/`prev`/`next`, NOT `item`; combobox/multi-select have `listbox`/`option`; number-input has
  `increment`/`decrement`; password-input has `toggle`; datatable has `pager`/`page-current`/
  `card-*`/`sort-icon`…). soft.css has ~700 rules covering every part with the correct names —
  memory doesn't. **Do NOT re-author from scratch.**
- **Deriving with a WEAK transform → soft clone.** Renaming `'soft'`→`'<name>'` and only retinting
  the material (glass's frost) keeps soft's radii/shadows/borders, so everything looks like soft.

**Do both right:** write a transform script (see `scratchpad/gen-elevated.mjs`) that reads
`soft.css`, renames `'soft'`→`'<name>'`, and **aggressively rewrites the STRUCTURAL values** in
every rule body — this is where the skin's identity comes from, and it must be strong:
- radii (`border-radius: *` → your scale, e.g. clamp 16→8 or → 0),
- shadows (`box-shadow` → your `--x-*` bevel/elevation/glow),
- backgrounds/borders where it defines the look,
- selector-aware tweaks (e.g. Material "state layer": in `:hover`/`[data-active]` selectors,
  replace `var(--sk-surface-2)` with a `--sk-primary` tint).

Then **append an overlay layer** (wins the cascade) for per-component signatures the generic
transform can't express: borderless surfaces, filled inputs, underline tabs, elevated DataTable,
tonal chips, etc. Define `--x-*` helper vars on `[data-skin='<name>']`. Color still comes from
tokens (`var(--sk-*)`); only shape/material is yours. Keep the generator in scratchpad so the skin
can be regenerated.

**Trap — flat Display components clone silently.** A handful of components have **zero appearance**
in soft (`stat`, `empty`, `breadcrumb`, `radio-group`, `radio-card-group`, `field`, `slider`,
`marquee`, `animated-number`): soft styles them with only layout/typography, no border/radius/
shadow/background. The transform has nothing to rewrite, so they come out **byte-identical to soft**
in every derived skin — exactly the "looks like soft" bug. For the ones that render a visible
surface (`stat`, `empty`), **add explicit overlay rules** giving them the skin's identity (retro =
sunken readout / dashed well; glass = frosted panel). In the "comparar skins" grid these are the
cells to scrutinize first — they're the ones that come out identical to soft. The genuinely
text/layout-only ones (`field`, `radio-group`, `breadcrumb`, `slider`…) are fine looking alike.

## Steps

1. **Create** `src/styles/skins/<name>.css` via the transform-`soft`+overlay recipe above. Use
   `var(--sk-*)` for color only. Layout + visually-hidden are base CSS.
2. **Register** in 3 places: `playground/main.tsx` (import), `playground/App.tsx` (`SKINS` array),
   `package.json` (`exports` → `"./skins/<name>"`).
3. **Build safety:** `bun run typecheck` must be clean.
4. **Visual pass over EVERY component (THE gate — mandatory when creating/changing a skin).** There
   is no PASS/FAIL validation script and there must not be one — a CSS script cannot judge "looks
   like soft" (one that compared declarations reported PASS while the skin still looked identical;
   that's why it was removed). Instead there is a **capture** script that only takes screenshots so
   the review is visual and covers the whole catalog:
   ```bash
   bun run shots            # una imagen por componente en skin-shots/, cada una con las 6 skins
   bun run shots Button Stat   # o sólo algunos (match por substring)
   ```
   Then **Read every image in `skin-shots/`** (each shows the component in all skins side by side,
   labeled) and confirm, component by component:
   - **Rule: no two skins look the same, and none looks like soft.** A coincidence is obvious — the
     new skin's cell is visually identical to the `soft` cell.
   - **Every component actually receives the skin's shape** — none came out unstyled/crude.
   - Pay special attention to the **flat Display trap** below (stat/empty are the usual coincidences).
   When a cell matches soft, strengthen that component's transform/overlay with a STRONG appearance
   change (rectangular vs pill, filled input, elevated vs flat, bold shadow, sunken well…), regen,
   re-run `bun run shots`, look again. (`minimal` is intentionally flat, so its flat-Display cells
   legitimately resemble soft — that's the one documented exception.)
   The capture script drives the playground's **"comparar skins"** toggle; you can also flip it by
   hand in `bun run dev` and inspect live with the Claude-in-Chrome plugin. Flip the `theme` selector
   → every cell's colors must repaint (proof color came from tokens, not the skin).

## If a skin only reads against a backdrop

Some materials (glass) only show over a non-flat background. Give that skin's playground stage a
backdrop: `.sb-stage[data-skin='<name>'] { background: <gradient/blobs> }` (playground chrome only).

## Commands

```bash
bun run dev        # playground en http://localhost:3200 (HMR)
bun run shots      # captura 1 imagen por componente (las 6 skins juntas) en skin-shots/
bun run typecheck  # tsc --noEmit
```

## Resources

- **Template**: See [assets/skin.template.css](assets/skin.template.css)
- **Reference skins**: `src/styles/skins/soft.css` (redondeado), `brutal.css` (neobrutalista),
  `minimal.css` (plano; muestra el truco de `order` para mover el indicador)
- **Gate visual**: `bun run shots` (`scripts/capture-skins.mjs`) genera 1 imagen por componente en
  `skin-shots/`, cada una con las 6 skins lado a lado (usa el toggle "comparar skins" del
  playground). Es el único gate: se leen las imágenes y se confirma que dos skins nunca se ven
  iguales ni se parecen a soft, y que cada componente recibe la forma del skin. NO hay script de
  PASS/FAIL — un script no puede juzgar "se parece" (daba PASS con la skin igual a soft); el script
  sólo captura, la validación es del ojo.
- **Contract source**: el contrato completo por componente está en `skinkit/catalog`
  (`COMPONENT_CATALOG`, el `parts` de cada spec) y en los `src/components/*/*.tsx`.
  `assets/skin.template.css` ya trae un stub de cada selector de cada componente.
- **Regenerar el template** si cambió el contrato (nuevos componentes/parts): el template es un
  derivado de `soft.css`. Corré desde la raíz del repo:
  `bun .claude/skills/skinkit-skin/assets/gen-skin-template.mjs` (transforma cada regla de soft en
  un stub con hints de propiedades y reescribe `assets/skin.template.css`).
