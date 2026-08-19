import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <InputGroup>. Actualizar SIEMPRE que cambie InputGroup.tsx. */
export const inputGroupSpec: ComponentSpec = {
  name: 'InputGroup',
  dataSk: 'input-group',
  category: 'Formulario',
  description:
    'Junta un Input (u otro control) con addons a los lados (texto, ícono o un botón), unidos en una sola pieza visual (ej. "$" | monto | ".00", o usuario | "@dominio"). Compound: InputGroup + InputGroup.Addon. El CSS cose los bordes y pinta los addons.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Addons (<InputGroup.Addon>) y el Input/control entre ellos.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=input-group]: contenedor en fila.' },
    { name: 'addon', description: '[data-part=addon]: <InputGroup.Addon> — prefijo/sufijo (texto/ícono/botón).' },
  ],
  examples: [
    {
      title: 'Prefijo y sufijo',
      code: '<InputGroup>\n  <InputGroup.Addon>$</InputGroup.Addon>\n  <Input placeholder="0" />\n  <InputGroup.Addon>.00</InputGroup.Addon>\n</InputGroup>',
    },
    {
      title: 'Con un botón',
      code: '<InputGroup>\n  <Input placeholder="Buscar…" />\n  <Button>Ir</Button>\n</InputGroup>',
    },
  ],
  usage: [
    'Poné el Input (o el control) entre los <InputGroup.Addon>; el CSS aplana las esquinas internas.',
    'Para un simple label arriba del input, usá la prop label del Input, no InputGroup.',
  ],
}
