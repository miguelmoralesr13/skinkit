import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <SegmentedControl>. Actualizar SIEMPRE que cambie SegmentedControl.tsx. */
export const segmentedControlSpec: ComponentSpec = {
  name: 'SegmentedControl',
  dataSk: 'segmented',
  category: 'Formulario',
  description:
    'Selector de UNA opción entre pocas, en línea (toggle group tipo iOS). Compuesto: <SegmentedControl> con <SegmentedControl.Item>. role=radiogroup con flechas ← →. La forma la da el skin.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>",
  props: [
    { name: 'value', type: 'string', required: false, description: 'Opción activa (controlado).' },
    { name: 'defaultValue', type: 'string', required: false, description: 'Opción activa inicial (uncontrolled). Conviene setearla.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Se invoca con el value elegido.' },
    { name: 'label', type: 'string', required: false, default: "'Opciones'", description: 'aria-label del grupo.' },
  ],
  parts: [
    { name: 'root', description: 'role=radiogroup [data-sk=segmented].' },
    { name: 'item', description: 'Cada opción (role=radio). Lleva [data-state=active|inactive]. <SegmentedControl.Item value>.' },
  ],
  examples: [
    {
      title: 'Vista',
      code: '<SegmentedControl defaultValue="lista" onValueChange={setVista}>\n  <SegmentedControl.Item value="lista">Lista</SegmentedControl.Item>\n  <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>\n</SegmentedControl>',
    },
  ],
  usage: [
    'Para 2–4 opciones cortas y mutuamente excluyentes, siempre visibles. Para más, usá Select o Tabs.',
    'Seteá `defaultValue` (o `value`) para que arranque con una activa.',
    'Se parece a Tabs, pero Tabs cambia paneles de contenido; esto elige un VALOR.',
  ],
  a11y: ['role=radiogroup + items role=radio con aria-checked; flechas mueven y seleccionan; roving tabindex.'],
}
