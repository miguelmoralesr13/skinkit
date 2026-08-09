import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Stack>. Actualizar SIEMPRE que cambie Stack.tsx. */
export const stackSpec: ComponentSpec = {
  name: 'Stack',
  dataSk: 'stack',
  category: 'Layout',
  description:
    'Layout 1D en flexbox parametrizado por props, con dirección responsive. El patrón "en mobile apilado, en desktop en fila" es simplemente direction={{ base: "column", md: "row" }}. No estila: emite CSS vars que resuelve la hoja base. Sirve para toolbars, filas de botones, formularios verticales, etc.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse' | {…por bp}", required: false, default: "'column'", description: 'Dirección del flex (responsive).' },
    { name: 'gap', type: 'number | string', required: false, default: '4', description: 'Separación entre hijos (número = token --sk-sp-n).' },
    { name: 'align', type: 'CSS align-items', required: false, description: 'Alineación en el eje cruzado.' },
    { name: 'justify', type: 'CSS justify-content', required: false, description: 'Distribución en el eje principal.' },
    { name: 'wrap', type: 'boolean', required: false, default: 'false', description: 'Permite que los hijos pasen a la siguiente línea.' },
    { name: 'inline', type: 'boolean', required: false, default: 'false', description: 'Usa inline-flex.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=stack]. Lleva [data-wrap], [data-inline]. Expone --sk-stack-dir-<bp>, --sk-stack-gap, --sk-stack-align, --sk-stack-justify.' },
  ],
  examples: [
    { title: 'Apilado → fila en desktop', code: '<Stack direction={{ base: "column", md: "row" }} gap={3} align="center">\n  <Button>Guardar</Button>\n  <Button variant="ghost">Cancelar</Button>\n</Stack>' },
    { title: 'Columna con separación', code: '<Stack gap={4}>\n  <Input label="Nombre" />\n  <Input label="Email" />\n</Stack>' },
    { title: 'Fila separada con Spacer', code: '<Stack direction="row" align="center">\n  <strong>Título</strong>\n  <Spacer />\n  <Button>Acción</Button>\n</Stack>' },
  ],
  usage: [
    'Es el layout por defecto para juntar cosas en una línea o columna con separación uniforme.',
    'Para grillas 2D (N columnas × filas), usá Grid.',
    'Combinalo con <Spacer /> para empujar elementos a los extremos.',
  ],
}
