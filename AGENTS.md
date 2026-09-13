# AGENTS.md — skinkit

Librería de componentes React **headless**, con un único sistema de estilo Tailwind-nativo:

- **Tokens** (color + forma) en `src/styles/tokens.css`, un solo `@theme` (`--color-sk-*`,
  `--radius-sk-*`, `--shadow-sk-*`, `--text-sk-*`, `--font-sk-*`), con valores por defecto reales.
- **CSS por componente** en `src/styles/components/<dataSk>.css`, uno por cada `dataSk` del
  catálogo, targeteando `[data-sk]`/`[data-part]` directo (sin scope de skin: hay un solo look).

Los componentes (`src/components/`) NO llevan estilo propio: emiten un contrato estable
(`data-sk` / `data-part` / `data-state`) y todo lo visual vive en ese CSS externo que apunta a él.
Regla de oro: **color desde tokens `var(--color-sk-*)`, forma desde `--radius-sk-*`/`--shadow-sk-*`
+ el CSS del componente.** Personalización = pisar esas variables (CSS plano, inline `style`, o
Tailwind arbitrary values), no elegir entre presets — no hay `theme`/`skin` prop ni
`[data-theme]`/`[data-skin]`.

## Skills

Cuando trabajes en esta librería, cargá el skill correspondiente ANTES de escribir CSS:

| Skill | Cuándo | Archivo |
|-------|--------|---------|
| `skinkit-component` | Crear un componente nuevo (headless + ficha de catálogo obligatoria) | [.claude/skills/skinkit-component/SKILL.md](.claude/skills/skinkit-component/SKILL.md) |
| `skinkit-component-update` | Modificar un componente existente (y sincronizar su catálogo) | [.claude/skills/skinkit-component-update/SKILL.md](.claude/skills/skinkit-component-update/SKILL.md) |
| `skinkit-tokens` | Cambiar tokens (color/forma) o el CSS de un componente puntual | [.claude/skills/skinkit-tokens/SKILL.md](.claude/skills/skinkit-tokens/SKILL.md) |

## i18n

Ningún componente hardcodea textos visibles/accesibles (aria-labels, placeholders, "Sin
resultados", botones de diálogos). Salen de `src/i18n/` (`SkinkitMessages` tipado, diccionarios
`es` (default) y `en`) vía `useSkinkitMessages()`; `<SkinkitProvider locale messages>` los cambia.
Prop explícita > `messages` del provider > diccionario del `locale`. Texto nuevo = clave nueva en
`types.ts` + `es.ts` + `en.ts` + default del catálogo como `'Texto' (según locale)`.

## Fuente de la verdad (catálogo)

Cada componente tiene un `<Name>.catalog.ts` **aparte** con todas sus props + parts + uso →
es lo que consume la generación de pantallas con IA. Se agrega en `src/catalog/index.ts`
(`COMPONENT_CATALOG`, exportado como `skinkit/catalog`). **Regla dura:** crear componente =
crear su catálogo; modificar componente = actualizar su catálogo, en el mismo cambio.

## Comandos

```bash
bun install
bun run dev        # playground, http://localhost:3200
bun run build      # tsup (JS) + tsc (types) + tailwindcss (CSS) → dist
bun run typecheck  # tsc --noEmit
bun run shots      # 1 imagen por componente → component-shots/
```

Verificar el look es **visual, nunca por script**: `bun run shots` sólo captura (no juzga
pass/fail). Al tocar un token o el CSS de un componente, corré `bun run dev` y `bun run shots
<Componente>` y mirá la imagen. Detalle en el skill `skinkit-tokens`.

## Gotcha

`Accordion.Panel` colapsa con el atributo `hidden` (correcto a11y/foco) → bloquea animación de
altura. Panel animado = responsabilidad del CSS del componente sin `hidden` (grid-rows/max-height
por `[data-state]`).
