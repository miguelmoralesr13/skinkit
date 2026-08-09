import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Toolbar>. Actualizar SIEMPRE que cambie Toolbar.tsx. */
export const toolbarSpec: ComponentSpec = {
  name: 'Toolbar',
  dataSk: 'toolbar',
  category: 'Acción',
  description:
    'Agrupa controles (Button, Toggle, ButtonGroup…) en una barra con role="toolbar" y navegación por flechas entre ellos. Opcional <Toolbar.Separator>. La forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Dirección; define qué flechas navegan.' },
    { name: 'label', type: 'string', required: false, description: 'aria-label de la toolbar.' },
  ],
  parts: [
    { name: 'root', description: 'role=toolbar [data-sk=toolbar]. Lleva [data-orientation].' },
    { name: 'separator', description: 'Divisor entre grupos. <Toolbar.Separator>.' },
  ],
  examples: [
    {
      title: 'Formato',
      code: '<Toolbar label="Formato">\n  <Toggle aria-label="Negrita">B</Toggle>\n  <Toggle aria-label="Cursiva">I</Toggle>\n  <Toolbar.Separator />\n  <Button size="sm">Guardar</Button>\n</Toolbar>',
    },
  ],
  usage: [
    'Meté Buttons/Toggles como hijos; las flechas ← → (o ↑ ↓ si vertical) mueven el foco entre ellos.',
    'Usá <Toolbar.Separator> para separar grupos de acciones.',
    'Para un grupo de botones PEGADOS (sin roles de toolbar), usá ButtonGroup.',
  ],
  a11y: ['role=toolbar + aria-orientation; flechas y Home/End mueven el foco entre controles.'],
}
