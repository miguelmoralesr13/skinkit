import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <RadioGroup> + <Radio>. Actualizar SIEMPRE que cambie Radio.tsx. */
export const radioGroupSpec: ComponentSpec = {
  name: 'RadioGroup',
  dataSk: 'radio-group',
  category: 'Formulario',
  description:
    'Grupo de opciones mutuamente excluyentes: se elige UNA. Envuelve varios <Radio> con un name común. La selección única y las flechas ↑↓←→ las da el grupo nativo del navegador.',
  extends: 'Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de selección (del theme) para todos los radios del grupo.' },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'name HTML compartido por los radios. Se autogenera si no lo pasás.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Valor seleccionado (modo controlado). Usalo junto con onValueChange.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      description: 'Valor inicial (modo uncontrolled).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Deshabilita todos los radios del grupo.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      description: 'Se dispara con el value del radio elegido.',
    },
  ],
  parts: [{ name: 'root', description: 'Contenedor con role=radiogroup.' }],
  examples: [
    {
      title: 'Uncontrolled',
      code: '<RadioGroup defaultValue="mensual">\n  <Radio value="mensual" label="Mensual" />\n  <Radio value="anual" label="Anual" />\n</RadioGroup>',
    },
    {
      title: 'Controlado',
      code: '<RadioGroup value={plan} onValueChange={setPlan}>\n  <Radio value="free" label="Free" />\n  <Radio value="pro" label="Pro" />\n</RadioGroup>',
    },
  ],
  usage: [
    'Usalo cuando el usuario debe elegir UNA opción entre pocas (2–5) y visibles. Para muchas, preferí un Select.',
    'Cada <Radio> hijo necesita un `value` único.',
    'Para varias opciones marcables a la vez, NO es esto: usá Checkbox.',
  ],
  a11y: [
    'role=radiogroup en el contenedor; los radios nativos comparten name → selección única y flechas gratis.',
    'Poné un label al grupo con aria-label / aria-labelledby si no hay encabezado visible.',
  ],
}

/** Fuente de la verdad de <Radio>. */
export const radioSpec: ComponentSpec = {
  name: 'Radio',
  dataSk: 'radio',
  category: 'Formulario',
  description:
    'Una opción dentro de un RadioGroup. Headless: el input nativo es la fuente de verdad; el CSS lo oculta y pinta el círculo. Suelto (sin grupo) funciona con props nativas.',
  extends: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type">',
  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Valor de esta opción. Requerido dentro de un RadioGroup.',
    },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de selección (del theme) para este radio suelto. Dentro de RadioGroup usá su tone.' },
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      description: 'Texto de la opción. Va dentro del <label>, así clickearlo la selecciona.',
    },
  ],
  parts: [
    { name: 'control', description: 'El <input type=radio>. El CSS lo oculta visualmente (queda focuseable).' },
    { name: 'box', description: 'Círculo/caja visual pintado según :checked.' },
    { name: 'indicator', description: 'Punto de selección dentro del círculo.' },
    { name: 'label', description: 'Texto de la opción.' },
  ],
  examples: [{ title: 'En grupo', code: '<Radio value="pro" label="Plan Pro" />' }],
  usage: [
    'Usá <Radio> SIEMPRE dentro de un <RadioGroup> (le da name y selección única).',
    'Dale un `value` único a cada uno.',
  ],
  a11y: ['El label envuelve al control: clickear el texto selecciona la opción.'],
}
