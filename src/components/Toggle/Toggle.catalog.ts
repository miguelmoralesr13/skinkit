import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Toggle>. Actualizar SIEMPRE que cambie Toggle.tsx. */
export const toggleSpec: ComponentSpec = {
  name: 'Toggle',
  dataSk: 'toggle',
  category: 'Acción',
  description:
    'Botón de dos estados que queda presionado (negrita, favorito, filtro activo). A diferencia de Switch (formulario on/off), es una acción con estado. aria-pressed. La forma la da el skin.',
  extends: "Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>",
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del estado presionado (del theme).' },
    { name: 'pressed', type: 'boolean', required: false, description: 'Presionado (controlado). Usalo con onPressedChange.' },
    { name: 'defaultPressed', type: 'boolean', required: false, default: 'false', description: 'Estado inicial (uncontrolled).' },
    { name: 'onPressedChange', type: '(pressed: boolean) => void', required: false, description: 'Se invoca al cambiar.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Tamaño.' },
  ],
  parts: [{ name: 'root', description: 'El <button>. Lleva [data-state=on|off] y [data-size].' }],
  examples: [
    { title: 'Negrita', code: '<Toggle aria-label="Negrita">B</Toggle>' },
    { title: 'Controlado', code: '<Toggle pressed={fav} onPressedChange={setFav}>★</Toggle>' },
  ],
  usage: [
    'Para una acción que ALTERNA y muestra su estado (formato, favorito). Para un ajuste on/off en un form, usá Switch.',
    'Si el contenido es solo un ícono, pasá aria-label.',
    'Va bien dentro de Toolbar / ButtonGroup.',
  ],
  a11y: ['aria-pressed refleja el estado; el foco y Enter/Espacio son nativos del <button>.'],
}
