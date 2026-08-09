---
name: skinkit-component
description: >
  Create a new headless component in the skinkit library. Every component ships with a SEPARATE
  catalog file (source of truth: all props + parts + usage) required for AI screen generation.
  Trigger: When asked to add/create/generate a new component in skinkit
  (e.g. "nuevo componente", "agregá un Tabs/Tooltip/Badge", "creá el componente X").
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Write, Edit, Bash
---

## When to Use

- Creating a brand-new component in skinkit. NOT for modifying an existing one → use
  `skinkit-component-update`.

## Non-negotiable Rules

1. **Headless: the component ships ZERO styling.** No CSS, no inline styles, no classes with
   visual meaning. Only structure + the data contract. All visuals live in skins.
2. **Every component has a SEPARATE catalog file** `<Name>.catalog.ts` — the source of truth
   with ALL props, the parts contract, examples and usage. This is what AI screen generation
   reads. **No component is complete without it. It is a separate file, never inline.**
3. **Emit the stable contract** so skins can style it:
   - `data-sk="<kebab-name>"` on the root (compound: on each sub-part's root too).
   - `data-part="<name>"` on every stylable sub-element.
   - State as data attributes: `data-state`, `data-error`, `data-variant`, `data-size`, etc.
     Prefer native pseudo-states (`:disabled`, `:focus`) when the DOM already provides them.
4. **Forward refs** and **spread native props** (`...rest`) so the component composes.
5. Behavior (state, ARIA, keyboard) lives in the component/a hook — never in CSS.

## Files to Create & Register

| File | Purpose |
|------|---------|
| `src/components/<Name>/<Name>.tsx` | El componente headless |
| `src/components/<Name>/<Name>.catalog.ts` | **Fuente de la verdad** (ComponentSpec) — OBLIGATORIO |
| `src/components/<Name>/index.ts` | Barrel del componente (export componente + tipos) |
| `src/components/<Name>/use<Name>.ts` | (Opcional) hook si tiene comportamiento |

Registrar en:
- `src/index.ts` → exportar el componente y sus tipos.
- `src/catalog/index.ts` → importar el spec y agregarlo a `COMPONENT_CATALOG`.

## After Creating — the skin cost

Un componente nuevo **no tiene estilo en ningún skin todavía**: sale sin forma. Avisá al usuario
y, si corresponde, agregá reglas para sus parts en cada skin de `src/styles/skins/` (o al menos
en el skin por defecto), o el componente se ve “crudo”. El contrato de parts que definís acá es
exactamente lo que los skins van a targetear.

## Catalog is the Source of Truth

El `<Name>.catalog.ts` debe listar **TODAS** las props (nombre, tipo, requerida, default,
descripción), el `extends` de props nativas, el contrato de parts, ejemplos JSX funcionales y
recomendaciones de uso (cuándo, qué hacer, qué NO). Ver `src/catalog/types.ts` para el shape y
`src/components/Button/Button.catalog.ts` como referencia. Si agregás una prop y no la ponés en
el catálogo, para la IA no existe.

## Commands

```bash
bun run typecheck   # tsc --noEmit — validá antes de dar por hecho
bun run dev         # playground para verlo (agregalo al playground si querés previsualizar)
```

## Resources

- **Templates**: [assets/component.template.tsx](assets/component.template.tsx),
  [assets/catalog.template.ts](assets/catalog.template.ts),
  [assets/index.template.ts](assets/index.template.ts)
- **Referencias vivas**: `src/components/Button/` (simple) y `src/components/Accordion/` (compound + hook + ARIA/teclado)
- **Spec type**: `src/catalog/types.ts`
