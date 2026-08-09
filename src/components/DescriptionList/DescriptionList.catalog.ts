import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <DescriptionList>. Actualizar SIEMPRE que cambie DescriptionList.tsx. */
export const descriptionListSpec: ComponentSpec = {
  name: 'DescriptionList',
  dataSk: 'dlist',
  category: 'Display',
  description:
    'Pares término/definición para detalles y metadatos (ficha de un recurso). Compuesto: <DescriptionList> con <DescriptionList.Item>. Semántica dl/dt/dd. La forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDListElement>',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'horizontal = término al lado de la definición; vertical = término arriba.' },
  ],
  parts: [
    { name: 'root', description: 'El <dl> [data-sk=dlist]. Lleva [data-orientation].' },
    { name: 'row', description: 'Cada par (<div>). <DescriptionList.Item term>.' },
    { name: 'term', description: 'El término (<dt>).' },
    { name: 'description', description: 'La definición (<dd>).' },
  ],
  examples: [
    {
      title: 'Ficha',
      code: '<DescriptionList>\n  <DescriptionList.Item term="Estado">Activo</DescriptionList.Item>\n  <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>\n  <DescriptionList.Item term="Creado">2024-08-01</DescriptionList.Item>\n</DescriptionList>',
    },
  ],
  usage: [
    'El término va en `term`; la definición como children.',
    'orientation="horizontal" para fichas compactas; "vertical" cuando las definiciones son largas.',
    'Para datos tabulares con muchas filas/columnas, usá una tabla, no esto.',
  ],
  a11y: ['Usa la semántica nativa <dl>/<dt>/<dd> (los <div> de fila son válidos dentro de <dl>).'],
}
