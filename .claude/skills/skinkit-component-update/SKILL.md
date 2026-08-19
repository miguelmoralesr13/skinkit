---
name: skinkit-component-update
description: >
  Modify an existing skinkit component AND keep its catalog file (source of truth) in sync.
  Any change to props, behavior or the parts contract MUST update <Name>.catalog.ts in the
  same change. Trigger: When editing/updating/refactoring/fixing an existing skinkit component,
  changing its props, or changing what parts it emits ("modificá/actualizá/refactorizá el componente X").
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Read, Write, Edit, Bash
---

## When to Use

- Editing an existing component in `src/components/`. For a brand-new component → use
  `skinkit-component`.

## The Rule

**Component and catalog change together, in the same edit.** `<Name>.catalog.ts` is the source
of truth consumed by AI screen generation. A component whose catalog is stale is a bug: the IA
will generate code against props/parts that no longer exist (or miss new ones).

## What Triggers a Catalog Update

| Cambio en el componente | Actualizá en el catálogo |
|-------------------------|--------------------------|
| Agregar / quitar / renombrar una prop | `props[]` (nombre, tipo, required, default, description) |
| Cambiar el default de una prop | `props[].default` |
| Cambiar el tipo de una prop | `props[].type` |
| Agregar / quitar un `data-part` | `parts[]` |
| Cambiar el `data-sk` de la raíz | `dataSk` |
| Cambiar comportamiento (teclado, estado, ARIA) | `a11y[]` y/o `usage[]` |
| Cambiar cómo se usa (nueva recomendación, nuevo caveat) | `usage[]` y/o `examples[]` |
| Cambiar props nativas heredadas | `extends` |

## Steps

1. Hacé el cambio en `src/components/<Name>/<Name>.tsx` (y su hook si aplica).
2. **En el mismo cambio**, actualizá `src/components/<Name>/<Name>.catalog.ts` según la tabla.
3. Si cambió el barrel público (nuevo export/tipo), actualizá `src/index.ts`.
4. **Si cambiaron los parts** (`data-part`/`data-sk`), revisá
   `src/styles/components/<dataSk>.css`: los selectores que apuntaban a un part renombrado/
   eliminado quedan huérfanos → ajustalos (ver skill `skinkit-tokens`).
5. `bun run typecheck` para validar que el spec y el componente siguen coherentes.

## Sanity Check Before Finishing

- [ ] ¿Toda prop pública del `.tsx` está en `props[]` del catálogo? (y viceversa, sin sobrantes)
- [ ] ¿Los `data-part` del `.tsx` coinciden con `parts[]`?
- [ ] ¿`dataSk` coincide con el `data-sk` de la raíz?
- [ ] ¿Los ejemplos del catálogo siguen compilando con la nueva API?
- [ ] ¿El CSS del componente quedó apuntando a un part que ya no existe?

## Commands

```bash
bun run typecheck   # tsc --noEmit
bun run dev         # verificar en el playground
```

## Resources

- **Spec type**: `src/catalog/types.ts`
- **Registry**: `src/catalog/index.ts` (COMPONENT_CATALOG)
- **Referencia**: `src/components/Accordion/Accordion.catalog.ts`
