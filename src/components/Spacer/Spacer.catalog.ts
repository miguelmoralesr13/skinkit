import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Spacer>. Actualizar SIEMPRE que cambie Spacer.tsx. */
export const spacerSpec: ComponentSpec = {
  name: 'Spacer',
  dataSk: 'spacer',
  category: 'Layout',
  description:
    'Espacio dentro de un layout flex (Stack/Grid). Sin `size` crece (flex: 1) para empujar a los hermanos a los extremos; con `size` reserva un hueco fijo en el eje principal. No estila: emite una var que resuelve la hoja base.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'size', type: 'number | string', required: false, description: 'Tamaño fijo en el eje principal (número = token --sk-sp-n). Si se omite, crece.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=spacer] (aria-hidden). Lleva [data-fixed] cuando tiene size. Expone --sk-spacer-size.' },
  ],
  examples: [
    { title: 'Empujar a los extremos', code: '<Stack direction="row" align="center">\n  <Logo />\n  <Spacer />\n  <Nav />\n</Stack>' },
    { title: 'Hueco fijo', code: '<Stack direction="row">\n  <span>A</span>\n  <Spacer size={6} />\n  <span>B</span>\n</Stack>' },
  ],
  usage: [
    'Usalo dentro de un Stack o Grid; en un contenedor no-flex no tiene efecto.',
    'Sin size crece y separa; con size es un hueco fijo. Para separación uniforme entre TODOS los hijos, mejor el `gap` del Stack.',
  ],
}
