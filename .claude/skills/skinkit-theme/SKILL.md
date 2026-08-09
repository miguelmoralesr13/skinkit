---
name: skinkit-theme
description: >
  Generate a new theme (color palette) for the skinkit library. A theme fills the
  semantic token contract and changes ONLY color — never shape.
  Trigger: When asked to add/create/generate a theme, palette, or color scheme in skinkit
  (e.g. "nuevo tema", "agregá un theme", "paleta X", "modo oscuro/marca X").
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Write, Edit, Bash
---

## When to Use

- The user wants a new color palette / theme / brand look for skinkit.
- Anything that changes COLOR only. If the user wants a different SHAPE/structure
  (rounded vs sharp, borders, anatomy), that's a **skin**, not a theme → use `skinkit-skin`.

## Critical Patterns

- A theme is **one CSS file** under `src/styles/tokens/themes/<name>.css`.
- It is scoped under `[data-theme="<name>"]` and fills the semantic contract from
  `src/styles/tokens/semantic.css`. **Nothing else.**
- **Golden rule: a theme sets ONLY color/font variables. Never radius, border, shadow,
  spacing or any shape** — that is the skin's job. A theme must work with *every* skin.
- Values are literal colors (hex/oklch), not `var(--sk-*)` references (those are the
  contract you are filling).

## The Contract (fill EVERY variable)

The authoritative list is `src/styles/tokens/semantic.css` (every `--sk-*` declared `initial`).
`assets/theme.template.css` already has all of them with example (light) values — just re-tint.
If a token is added to `semantic.css`, add it here and to the template too.

```css
[data-theme='<name>'] {
  /* Superficies */
  --sk-surface:        /* fondo base (card, input, panel) */;
  --sk-surface-2:      /* fondo secundario (hover, footer, zebra, addon) */;
  /* Texto */
  --sk-text:           /* texto principal */;
  --sk-text-muted:     /* texto secundario / helper / labels */;
  /* Acción */
  --sk-primary:        /* color de acción */;
  --sk-primary-hover:  /* acción en hover */;
  --sk-on-primary:     /* texto sobre primary (contraste AA) */;
  /* Bordes y feedback */
  --sk-border:         /* bordes / divisores */;
  --sk-danger:         /* error / destructivo */;
  /* Tipografía */
  --sk-font:           /* familia de texto */;
  --sk-font-mono:      /* familia mono (algunos skins la usan) */;
  /* Sintaxis de código (componente Code) — seguí el theme claro/oscuro */
  --sk-code-comment:   /* comentarios */;
  --sk-code-string:    /* strings */;
  --sk-code-number:    /* números / constantes */;
  --sk-code-keyword:   /* keywords */;
  --sk-code-function:  /* funciones / nombres */;
}
```

Contrast check: `--sk-on-primary` over `--sk-primary`, and `--sk-text` over `--sk-surface`,
must pass WCAG AA (≥ 4.5:1 for body text). Los `--sk-code-*` deben leerse sobre `--sk-surface-2`.

## Steps

1. **Create** `src/styles/tokens/themes/<name>.css` from `assets/theme.template.css`.
2. **Register** in 3 places:
   - `src/styles/index.css` → add `@import './tokens/themes/<name>.css';`
   - `package.json` → add `"./themes/<name>": "./src/styles/tokens/themes/<name>.css"` to `exports`
   - `playground/App.tsx` → add `'<name>'` to the `THEMES` array
3. **Verify** in the playground (`bun run dev`, port 3200): pick the new theme; every skin
   should repaint with the new palette and NO shape should change.

## Commands

```bash
bun run dev        # playground en http://localhost:3200 (HMR)
```

## Resources

- **Template**: See [assets/theme.template.css](assets/theme.template.css)
- **Reference themes**: `src/styles/tokens/themes/paper.css` (claro), `dusk.css` (oscuro), `forest.css` (verde)
- **Contract**: `src/styles/tokens/semantic.css`
