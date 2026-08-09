import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <TimePicker>. Actualizar SIEMPRE que cambie TimePicker.tsx. */
export const timePickerSpec: ComponentSpec = {
  name: 'TimePicker',
  dataSk: 'time-picker',
  category: 'Formulario',
  description:
    'Selector de hora sobre un <input type="time"> nativo (rueda/teclado del sistema, accesible). Espejo de Input. La forma la da el skin.',
  extends: "Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>",
  props: [
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta (htmlFor cableado).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=time-picker]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'field', description: 'El <input type=time>.' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Con label', code: '<TimePicker label="Hora" defaultValue="09:30" />' },
    { title: 'Con paso', code: '<TimePicker label="Turno" step={900} />' },
  ],
  usage: [
    'value/defaultValue son "HH:mm" (24h); min/max/step son nativos (step en segundos, 900 = 15 min).',
    'Para elegir fecha, usá DatePicker; para fecha+hora, combiná ambos.',
  ],
  a11y: ['input type=time trae la UI y el teclado del sistema; label ↔ input cableado con htmlFor/id.'],
}
