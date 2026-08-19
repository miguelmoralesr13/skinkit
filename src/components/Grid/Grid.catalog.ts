import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Grid>. Actualizar SIEMPRE que cambie Grid.tsx. */
export const gridSpec: ComponentSpec = {
  name: 'Grid',
  dataSk: 'grid',
  category: 'Layout',
  description:
    'CSS Grid parametrizada por props, con soporte responsive por breakpoints y modo auto-fit. `cols` acepta un número o un objeto por breakpoint (base/sm/md/lg/xl); `minChildWidth` activa el modo auto-fit que reacomoda las columnas sin media queries. El CSS de layout vive en la hoja base (styles/layout.css), no en el CSS por-componente: una grilla es igual sin importar cómo se personalice el resto.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'cols', type: 'number | { base?; sm?; md?; lg?; xl? }', required: false, description: 'Cantidad de columnas (responsive). Se ignora si se pasa minChildWidth.' },
    { name: 'minChildWidth', type: 'number | string', required: false, description: 'Modo auto-fit: ancho mínimo de cada columna; se reacomodan solas (número = px).' },
    { name: 'gap', type: 'number | string', required: false, default: '4', description: 'Separación (número = token --sk-sp-n; string = valor CSS).' },
    { name: 'rowGap', type: 'number | string', required: false, description: 'Separación entre filas (override de gap).' },
    { name: 'columnGap', type: 'number | string', required: false, description: 'Separación entre columnas (override de gap).' },
    { name: 'alignItems', type: 'CSS align-items', required: false, description: 'Alineación vertical de los ítems.' },
    { name: 'justifyItems', type: 'CSS justify-items', required: false, description: 'Alineación horizontal de los ítems.' },
    { name: 'flow', type: "'row' | 'column' | 'dense' | 'row dense' | 'column dense'", required: false, default: "'row'", description: 'grid-auto-flow.' },
    { name: 'inline', type: 'boolean', required: false, default: 'false', description: 'Usa inline-grid.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=grid]. Lleva [data-auto] (modo auto-fit) y [data-inline]. Expone --sk-grid-tpl-<bp> (el grid-template-columns completo), --sk-grid-gap, --sk-grid-align, etc.' },
    { name: 'item', description: '[data-sk=grid-item]. <Grid.Item colSpan rowSpan> — abarca varias columnas/filas. Expone --sk-grid-item-col-<bp> y --sk-grid-item-row.' },
  ],
  examples: [
    { title: 'Columnas responsive', code: '<Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>\n  <Card>…</Card>\n  <Card>…</Card>\n  <Card>…</Card>\n  <Card>…</Card>\n</Grid>' },
    { title: 'Auto-fit (sin breakpoints)', code: '<Grid minChildWidth={220} gap={3}>\n  {items.map((it) => <Card key={it.id}>{it.name}</Card>)}\n</Grid>' },
    { title: 'Item que abarca columnas', code: '<Grid cols={4} gap={4}>\n  <Grid.Item colSpan={{ base: 4, md: 2 }}>Destacado</Grid.Item>\n  <Grid.Item>1</Grid.Item>\n  <Grid.Item>2</Grid.Item>\n</Grid>' },
  ],
  usage: [
    'Para tarjetas que deben reacomodarse solas sin definir breakpoints, usá minChildWidth (auto-fit).',
    'Para un número exacto de columnas por breakpoint, usá cols con un objeto { base, sm, md, lg, xl }.',
    'Para layouts 1D (una fila/columna con separación y wrap), Stack suele ser más simple que Grid.',
  ],
}
