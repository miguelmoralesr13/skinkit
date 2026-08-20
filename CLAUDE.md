# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`skinkit` — a headless React component library (npm name `skinkit`, `v0.1.0`, 99 components).
Components emit **zero style**: only structure plus a stable `data-sk`/`data-part` attribute
contract. All visuals live in **one Tailwind v4-native design-token + CSS system**: a single
`@theme` (color + shape tokens) plus one CSS file per component, both fully overridable via CSS
custom properties — no forking a component to restyle it, and no picking between presets. Comments
and docs are in Spanish; keep new ones in Spanish to match. `AGENTS.md` is a shorter mirror of this
file — if you change the architecture, keep both in sync.

## The styling model

This replaced an earlier two-axis system (`theme` = color / `skin` = shape, 15 hand-written skin
CSS files + 3 theme files, selected via `[data-theme]`/`[data-skin]`). That's gone — there's now
**one look**, customized by overriding CSS variables, not by switching between presets.

- **Tokens** (`src/styles/tokens.css`, one `@theme` block) hold BOTH color and shape:
  `--color-sk-*` (surface/text/primary/secondary/tertiary/accent/success/warning/info/danger/border,
  each with an `-on-*` pair for contrast text, plus 5 `--color-sk-code-*` syntax tokens),
  `--radius-sk-sm/md/lg/pill`, `--shadow-sk-sm/md/lg`, `--text-sk-sm/md/lg` (font-size scale,
  distinct from Tailwind's own `text-sm/base/lg`), `--font-sk-sans/mono`. Tailwind v4 compiles
  `@theme` values into real `:root` custom properties **and** auto-generates matching utilities
  (`bg-sk-primary`, `rounded-sk-lg`, `shadow-sk-md`, `text-sk-md`...). Ships real default values
  (not `initial`) — `import 'skinkit/styles/base'` alone must render a reasonable-looking UI.
- **Component CSS** (`src/styles/components/<dataSk>.css`, one file per catalog `dataSk`,
  mirroring `src/components/<Name>/`) replaces what `soft.css` used to be — the sole shipped look.
  Selectors go straight to `[data-sk='...']`/`[data-part='...']` (no `[data-skin='x']` scope
  prefix). Written with `@apply` for plain utility lists, plain CSS (`color-mix()`, `calc()`, etc.)
  where `@apply` can't express it — both coexist freely in the same rule.
- **Customization** = override `--color-sk-*`/`--radius-sk-*`/etc. — with plain CSS
  (`[data-skinkit-root] { --color-sk-primary: #ff0000 }`), inline `style`, Tailwind arbitrary
  values (`className="[--color-sk-primary:#ff0000]"`), or by extending `skinkit/tailwind-preset`
  (the raw, uncompiled `tokens.css`) in a consumer's own Tailwind v4 build. `SkinkitProvider` only
  sets `[data-skinkit-root]` — no `theme`/`skin` props, nothing to pick between.

## Skills (load BEFORE writing code)

This repo ships project-specific skills under `.claude/skills/`. When the task matches, invoke the
skill first — they encode the catalog rules and the CSS conventions that are easy to get wrong.

| Skill | When |
|-------|------|
| `skinkit-component` | Creating a new component (headless + its mandatory catalog file) |
| `skinkit-component-update` | Modifying an existing component (must sync its catalog in the same change) |
| `skinkit-tokens` | Changing color/shape tokens, dark mode, or a specific component's CSS |

## Catalog — the source of truth for AI

Each component has a **separate** `<Name>.catalog.ts` next to it that exports a `ComponentSpec`
(all props, the parts contract, examples, usage do/don'ts, a11y notes, and a required `category`).
Shape is defined in `src/catalog/types.ts`. All specs are aggregated in `src/catalog/index.ts` as
`COMPONENT_CATALOG` (with a `getComponentSpec(name)` lookup) and exported to consumers as
`skinkit/catalog`. This layer is entirely independent of the styling system above — no changes
here when tokens/component CSS change.

Every spec sets `category: ComponentCategory` — one of `Acción | Formulario | Navegación | Overlay |
Feedback | Display | Layout` (see `CATEGORY_ORDER` in `src/catalog/types.ts` for display order).
`getCatalogByCategory()` groups the catalog into sections; the playground rail renders grouped by
it. A new component must pick a category (the field is required — a missing one fails typecheck).

This catalog is what **AI screen generation consumes** — *"if it isn't in the catalog, for the AI it
doesn't exist."* **Hard rule (non-negotiable):** creating a component = creating its catalog file;
changing a component's props / behavior / parts = updating its catalog in the **same change**. The
`skinkit-component` / `skinkit-component-update` skills enforce this.

## Commands

```bash
cd lib-skinkit
bun install        # or npm install
bun run dev        # playground — vite, http://localhost:3200
bun run build       # tsup (JS) + tsc (.d.ts) + tailwindcss (CSS) → dist/
bun run typecheck  # tsc --noEmit
bun run preview    # vite build && vite preview
bun run shots      # 1 screenshot per component → component-shots/
```

There is **no test runner and no lint script** here (unlike sibling projects in `../`). Rely on
`typecheck` for verification. Per user rules, do not run `build` after changes unless asked.

**Verifying the look is VISUAL, never a script.** `bun run shots` (`scripts/capture-components.mjs`,
Playwright over the running playground) writes one PNG per component to `component-shots/`. It
does NOT judge pass/fail — a CSS script can't reliably tell "looks right" from "looks broken" (a
prior attempt at automated skin-similarity detection under the old system gave false positives).
When changing tokens or a component's CSS, run it and read the images. See the `skinkit-tokens`
skill.

## The attribute contract (the real API)

Components render structure and these stable hooks; CSS is the only thing that reads them. Never
add component-owned styling — if a component needs to look different, that belongs in its CSS
file under `src/styles/components/`.

| Attribute | Meaning |
|-----------|---------|
| `[data-sk="button\|card\|input\|accordion\|..."]` | component root (one per component, see `dataSk` in each catalog spec) |
| `[data-part="label\|icon\|header\|body\|footer\|field\|helper\|item\|trigger\|indicator\|panel\|..."]` | sub-part |
| `[data-variant]`, `[data-size]` | prop-declared variants (e.g. Button) |
| `[data-state="open\|closed"]` | stateful components (e.g. Accordion item/trigger/panel) |
| `[data-error]` | present (empty string) when a form field's `error` is true |
| `[data-skinkit-root]` | the provider wrapper; scopes the base reset |

Behavior (state, `aria-*`, keyboard nav) is the component's job; CSS never touches it. Each
component's exact parts/variants live in its `<Name>.catalog.ts` — that file, not this table, is
the authoritative contract for any given component.

**Accordion gotcha:** `Accordion.Panel` collapses via the native `hidden` attribute (correct for
a11y/focus — collapsed content is truly removed from the tab order). But `hidden` blocks any
height/collapse animation. CSS that wants an animated panel must drive open/closed from
`[data-state]` (e.g. `grid-template-rows` / `max-height`) rather than relying on `hidden`.

## CSS / token layering

`src/styles/` layout:

1. `tokens.css` — the single `@theme` block described above (color + shape + type). Every
   component CSS file references these, never a literal hex/px value that already has a token.
2. `components/<dataSk>.css` — one file per component (88 files today; a handful of catalog
   entries share a `dataSk`, e.g. `Calendar`/`RangeCalendar` both use `calendar`, so file count
   ≠ component count exactly), aggregated via `@import './<dataSk>.css' layer(components);` in
   `components/index.css`. The `layer(components)` on each import means a consumer's own
   Tailwind build (which emits into `@layer utilities`) always wins on a conflicting override,
   regardless of file/script load order.
3. `layout.css` — structural CSS for `Grid`/`Stack`/`Container`/`Spacer`/`AppShell`, skin-agnostic
   (this predates and is unrelated to the old "skin" concept — it's just not per-component visual
   styling). Driven by `src/lib/responsive.ts`, which converts a responsive prop
   (`cols={{ base: 1, md: 3 }}`) into `--sk-grid-tpl-<bp>`-style CSS vars resolved via media
   queries — untouched by the Tailwind migration, still CSS-variable-driven (dynamic column counts
   aren't statically greppable by Tailwind's JIT scanner).
4. `index.css` (exported as `skinkit/styles/base`, but see packaging note below) —
   `@import "tailwindcss"; @import "./tokens.css"; @import "./components/index.css"; @import
   "./layout.css";` plus a minimal reset scoped to `[data-skinkit-root]`.

## Packaging model (important gotcha)

`tsup` compiles **only the JS/TS** into `dist/` (`dts: false` in `tsup.config.ts` — declarations
are emitted separately by `tsc -p tsconfig.build.json`, since tsup's dts rollup isn't compatible
with TypeScript 7/tsgo; that's why `build` is a multi-step script). Five JS entries:
- `src/index.ts` — the core components + provider.
- `src/catalog/index.ts` — the catalog, importable without pulling in any component code.
- `src/components/DynamicForm/index.ts` — pulls in `react-hook-form` / `zod` /
  `@hookform/resolvers` (all three are optional peer deps).
- `src/components/RichTextEditor/index.ts` — pulls in `@tiptap/*` (9 packages, all optional peer
  deps — see `package.json`). Same reasoning as DynamicForm: a compound family (~20 sub-components
  across `RichTextEditor*.tsx` sibling files, assembled via `Object.assign` in `index.ts` because
  TS doesn't infer a static property assigned to a function from a *different* file than where the
  function was declared — the same-file pattern Dialog/Accordion use doesn't work across files).
- `src/components/FilePreviewer/office/index.tsx` — pulls in `docx-preview` + `xlsx` (both
  optional peer deps). `FilePreviewer` itself (core, exported from `src/index.ts`) stays
  dependency-free — it previews image/video/audio/pdf/code out of the box and falls back to an
  icon+download panel for Word/Excel; this entry exports `officeRenderers`, an object you spread
  into `FilePreviewer`'s `renderers` prop to get real Word/Excel rendering instead of the fallback.

These three are the **only** entries that pull in extra runtime deps. Keeping each a separate tsup
entry/export means importing `skinkit` alone never drags form-validation/editor/office-preview
deps into a consumer's bundle.

**CSS is a separate, real build step now** (this changed from the old "ship raw CSS" model):
`npm run build:css` runs `@tailwindcss/cli` (`tailwindcss -i ./src/styles/index.css -o
./dist/styles/skinkit.css --minify`) because `src/styles/index.css` uses `@apply`/`@theme`/`@import
"tailwindcss"`, which aren't valid standalone CSS — they need Tailwind's engine to resolve.
`package.json` `exports`:

- `skinkit` → `dist/index.js` (components + provider)
- `skinkit/catalog` → `dist/catalog/index.js` (`COMPONENT_CATALOG`, `getComponentSpec`, spec types)
- `skinkit/form` → `dist/components/DynamicForm/index.js` (schema-driven form, needs the optional peer deps above)
- `skinkit/editor` → `dist/components/RichTextEditor/index.js` (Tiptap-backed rich text editor, needs the optional `@tiptap/*` peer deps)
- `skinkit/file-preview-office` → `dist/components/FilePreviewer/office/index.js` (`officeRenderers` for real Word/Excel preview in `FilePreviewer`, needs the optional `docx-preview`/`xlsx` peer deps)
- `skinkit/styles/base` → `dist/styles/skinkit.css` (**compiled**, not raw source — the one
  exception to "CSS ships as-is" from the old architecture, forced by needing Tailwind's engine)
- `skinkit/tailwind-preset` → `src/styles/tokens.css` (**uncompiled** — just the `@theme` block,
  valid input for another Tailwind v4 build; a consumer imports this into their own build to
  extend/override skinkit's tokens as real utilities in their own app code)

**One new runtime dependency**: `tailwind-merge`, used by `src/lib/cx.ts` (`extendTailwindMerge`
with skinkit's custom `sk-*` color/radius groups registered) so a consumer's conflicting override
class deterministically wins instead of both classes landing in the DOM. This is the one place the
library's previous zero-runtime-deps promise for the core (`src/index.ts`) breaks — an explicit,
accepted trade-off of taking a real Tailwind dependency. `tailwindcss`/`@tailwindcss/cli`/
`@tailwindcss/vite` remain devDependencies only (build-time tools; their output is plain CSS).

## Conventions & where things go

- Each component: own directory with `Component.tsx` + `index.ts` barrel + `<Name>.catalog.ts`;
  hooks split into their own file (e.g. `Accordion/useAccordion.ts`). Compound components attach
  sub-parts as static props (`Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`).
- Everything public is re-exported through `src/index.ts` (values and types).
- `src/lib/` holds the shared helpers: `cx.ts` (class-joining + Tailwind conflict resolution via
  `tailwind-merge`, the only class-merging mechanism in the library), `responsive.ts` (converts a
  plain-or-per-breakpoint prop like `cols={{ base: 1, md: 3 }}` into `--*-<bp>` CSS vars that
  `styles/layout.css` resolves via media queries — used by layout components such as Grid/Stack),
  and `useDismissable.ts` (shared Escape-key + click-outside close behavior for overlay components
  like Popover/Menu/Dialog). Components also emit a fixed `sk-*` className alongside `data-sk` for
  convenience; the `data-*` contract is the canonical selector target.
- `SkinkitProvider` only sets `data-skinkit-root` on a wrapper div. It's optional — setting the
  attribute by hand works identically. It no longer takes `theme`/`skin` props (removed along with
  the old preset system) — components inside a portal (Dialog/CommandMenu/Toast) don't need to
  "reapply" anything either, since `@theme` tokens live on `:root` and are already available
  anywhere in the document, portal or not.
- The playground (`playground/`) is a vite app (`root: 'playground'`) that imports components from
  `../src` directly (not the built package). It renders the catalog grouped by category with a
  small token-override panel (primary color + radius) that demonstrates the real customization
  mechanism — CSS variable overrides, not a preset picker.

## Adding things

Prefer the matching skill (above) — it walks the full checklist. In short:

- **New component**: create its dir, render only structure + the `data-sk`/`data-part`/variant
  contract (no styles), barrel via `index.ts`, export from `src/index.ts`. **Write its
  `<Name>.catalog.ts` and register it in `src/catalog/index.ts`.** Then create
  `src/styles/components/<dataSk>.css` and register it in `components/index.css`.
  (`skinkit-component` skill.)
- **Modify a component**: apply the change, then **update its `<Name>.catalog.ts`** in the same
  change if props/behavior/parts moved, and check `src/styles/components/<dataSk>.css` for
  orphaned selectors. (`skinkit-component-update` skill.)
- **Change the look**: edit `src/styles/tokens.css` (global color/shape) or a specific
  `src/styles/components/<dataSk>.css` (one component). (`skinkit-tokens` skill.)
