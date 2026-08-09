import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Checkbox>. Actualizar SIEMPRE que cambie Checkbox.tsx. */
export const checkboxSpec: ComponentSpec = {
  name: 'Checkbox',
  dataSk: 'checkbox',
  category: 'Formulario',
  description:
    'Casilla de verificación booleana (marcada / sin marcar / indeterminada). Headless: el input nativo es la fuente de verdad y el skin pinta la caja. Ideal para opciones independientes y aceptaciones.',
  extends: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type">',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del estado marcado (del theme).' },
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      description: 'Texto junto a la casilla. Va dentro del <label>, así clickearlo togglea.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Estado "parcial" (ej. un padre cuyos hijos no están todos marcados). Es visual/semántico; no cambia el valor checked.',
    },
  ],
  parts: [
    { name: 'control', description: 'El <input type=checkbox>. El skin lo oculta visualmente (queda accesible/focuseable).' },
    { name: 'box', description: 'Caja visual que el skin pinta según :checked / :indeterminate.' },
    { name: 'indicator', description: 'Marca (tilde o guion) dentro de la caja.' },
    { name: 'label', description: 'Texto de la opción.' },
  ],
  examples: [
    { title: 'Con label', code: '<Checkbox label="Acepto los términos" />' },
    { title: 'Controlado', code: '<Checkbox label="Recordarme" checked={on} onChange={(e) => setOn(e.target.checked)} />' },
    { title: 'Indeterminado', code: '<Checkbox label="Seleccionar todo" indeterminate={some && !all} />' },
  ],
  usage: [
    'Usá Checkbox para opciones INDEPENDIENTES (varias pueden estar marcadas a la vez). Para elegir UNA entre varias, usá Radio/RadioGroup.',
    'Pasá siempre `label` (o aria-label) para que el control sea accesible.',
    'checked/defaultChecked/onChange/disabled son props nativas y pasan directo al input.',
    '`indeterminate` es solo visual: seguí manejando checked por separado.',
  ],
  a11y: [
    'El label envuelve al control: clickear el texto togglea, sin necesidad de htmlFor.',
    'El skin oculta el input con técnica visually-hidden (no display:none) para no perder foco ni teclado.',
  ],
}
