import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ButtonGroup>. Actualizar SIEMPRE que cambie ButtonGroup.tsx. */
export const buttonGroupSpec: ComponentSpec = {
  name: 'ButtonGroup',
  dataSk: 'button-group',
  category: 'Acción',
  description:
    'Junta varios <Button> en un bloque unido (toolbars, acciones relacionadas). El skin colapsa los bordes/radios internos para que se vean pegados.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Dirección del grupo.' },
    { name: 'label', type: 'string', required: false, description: 'aria-label del grupo (role=group).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor role=group. Lleva [data-orientation]. Estila los [data-sk=button] hijos.' },
  ],
  examples: [
    {
      title: 'Acciones',
      code: '<ButtonGroup label="Formato">\n  <Button variant="outlined">B</Button>\n  <Button variant="outlined">I</Button>\n  <Button variant="outlined">U</Button>\n</ButtonGroup>',
    },
  ],
  usage: [
    'Meté <Button> como hijos; conviene que compartan variant (ej. todos outlined) para que el bloque se vea parejo.',
    'Para elegir UNA opción de varias (no acciones), usá SegmentedControl.',
    'El colapso de bordes lo hace el skin; no le pongas radios propios a los botones internos.',
  ],
  a11y: ['role=group; pasá `label` si el conjunto necesita nombre accesible.'],
}
