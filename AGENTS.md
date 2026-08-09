# AGENTS.md — skinkit

Librería de componentes React **headless** con dos ejes de estilo ortogonales, ambos por **CSS externo**:

- **Re-look** = `theme` (tokens de color) → `[data-theme]`, en `src/styles/tokens/themes/`
- **Re-anatomía** = `skin` (forma/estructura) → `[data-skin]`, en `src/styles/skins/`

Los componentes (`src/components/`) NO llevan estilo propio: emiten un contrato estable
(`data-sk` / `data-part` / `data-state`) y todo lo visual vive en CSS externo que apunta a él.
Regla de oro: **color desde tokens `var(--sk-*)`, forma desde el skin.**

## Skills

Cuando trabajes en esta librería, cargá el skill correspondiente ANTES de escribir CSS:

| Skill | Cuándo | Archivo |
|-------|--------|---------|
| `skinkit-component` | Crear un componente nuevo (headless + ficha de catálogo obligatoria) | [.claude/skills/skinkit-component/SKILL.md](.claude/skills/skinkit-component/SKILL.md) |
| `skinkit-component-update` | Modificar un componente existente (y sincronizar su catálogo) | [.claude/skills/skinkit-component-update/SKILL.md](.claude/skills/skinkit-component-update/SKILL.md) |
| `skinkit-theme` | Crear un tema / paleta / esquema de color (solo color) | [.claude/skills/skinkit-theme/SKILL.md](.claude/skills/skinkit-theme/SKILL.md) |
| `skinkit-skin` | Crear un skin / estilo / anatomía visual (solo forma) | [.claude/skills/skinkit-skin/SKILL.md](.claude/skills/skinkit-skin/SKILL.md) |

Duda theme vs skin: ¿cambia COLOR? → theme. ¿cambia FORMA/estructura? → skin.

## Fuente de la verdad (catálogo)

Cada componente tiene un `<Name>.catalog.ts` **aparte** con todas sus props + parts + uso →
es lo que consume la generación de pantallas con IA. Se agrega en `src/catalog/index.ts`
(`COMPONENT_CATALOG`, exportado como `skinkit/catalog`). **Regla dura:** crear componente =
crear su catálogo; modificar componente = actualizar su catálogo, en el mismo cambio.

## Comandos

```bash
bun install
bun run dev        # playground, http://localhost:3200 (muestra skins × themes)
bun run build      # tsup → dist (JS + types; el CSS se envía tal cual desde src/styles)
bun run typecheck  # tsc --noEmit
bun run shots      # 1 imagen por componente (las 6 skins juntas) → skin-shots/
```

Verificar skins es **visual, nunca por script**: `bun run shots` sólo captura (no juzga pass/fail —
un script no puede ver "se parece a soft"). Al crear/cambiar un skin, correlo y mirá cada imagen:
ninguna skin debe verse igual a otra ni a soft, y cada componente debe recibir la forma del skin
(`minimal` es plano a propósito, la única excepción). Detalle en el skill `skinkit-skin`.

## Gotcha

`Accordion.Panel` colapsa con el atributo `hidden` (correcto a11y/foco) → bloquea animación de
altura. Panel animado = responsabilidad del skin sin `hidden` (grid-rows/max-height por `[data-state]`).
