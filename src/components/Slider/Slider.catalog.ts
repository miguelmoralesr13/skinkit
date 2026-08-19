import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Slider>. Actualizar SIEMPRE que cambie Slider.tsx. */
export const sliderSpec: ComponentSpec = {
  name: 'Slider',
  dataSk: 'slider',
  category: 'Formulario',
  description:
    'Control para elegir un número dentro de un rango, sobre un <input type="range"> nativo (accesible, teclado incluido). El color lo pone el CSS vía accent-color.',
  extends: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type">',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del riel/thumb (del theme, vía accent-color).' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta del control (htmlFor cableado).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Texto de ayuda debajo.' },
    { name: 'showValue', type: 'boolean', required: false, default: 'false', description: 'Muestra el valor actual junto al label (requiere `value` controlado).' },
    { name: 'value', type: 'number | string', required: false, description: 'Valor (controlado). min/max/step son props nativas.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor.' },
    { name: 'header', description: 'Fila de label + valor (si hay label o showValue).' },
    { name: 'label', description: 'La etiqueta.' },
    { name: 'value', description: 'El valor actual (si showValue).' },
    { name: 'field', description: 'El <input type=range>.' },
    { name: 'helper', description: 'Texto de ayuda.' },
  ],
  examples: [
    { title: 'Básico', code: '<Slider label="Volumen" min={0} max={100} defaultValue={50} />' },
    { title: 'Con valor', code: '<Slider label="Zoom" min={1} max={5} value={zoom} showValue onChange={(e) => setZoom(+e.target.value)} />' },
  ],
  usage: [
    'Para valores aproximados dentro de un rango continuo. Si el número exacto importa, usá un Input numérico.',
    'min/max/step/value/defaultValue/onChange son nativas y pasan directo al range.',
    'showValue solo tiene sentido en modo controlado (necesita `value`).',
  ],
  a11y: ['input type=range trae rol slider y teclado (flechas, Home/End) de forma nativa.'],
}
