import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Meter>. Actualizar SIEMPRE que cambie Meter.tsx. */
export const meterSpec: ComponentSpec = {
  name: 'Meter',
  dataSk: 'meter',
  category: 'Display',
  description:
    'Mide un valor dentro de un rango conocido (uso de disco, batería, score). A diferencia de Progress (avance de una tarea), es una medición estática. role="meter". La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'value', type: 'number', required: true, description: 'Valor actual (entre min y max).' },
    { name: 'min', type: 'number', required: false, default: '0', description: 'Mínimo del rango.' },
    { name: 'max', type: 'number', required: false, default: '100', description: 'Máximo del rango.' },
    { name: 'low', type: 'number', required: false, description: 'Umbral bajo: si value < low y no pasás tone, el color pasa a danger.' },
    { name: 'tone', type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, description: 'Color del indicador (del theme). Si se omite, se deriva de low (danger).' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta arriba.' },
    { name: 'showValue', type: 'boolean', required: false, description: 'Muestra el valor junto al label.' },
    { name: 'classNames', type: '{ header?: string; label?: string; value?: string; track?: string; indicator?: string }', required: false, description: 'Clases adicionales por sub-parte (header/label/value/track/indicator).' },
  ],
  parts: [
    { name: 'root', description: 'role=meter [data-sk=meter]. Lleva [data-tone]; expone --sk-meter (0–1).' },
    { name: 'header', description: 'Fila label + valor (si aplica).' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'value', description: 'Valor mostrado.' },
    { name: 'track', description: 'Riel de fondo.' },
    { name: 'indicator', description: 'Relleno; ancho por --sk-meter.' },
  ],
  examples: [
    { title: 'Uso de disco', code: '<Meter label="Disco" value={82} showValue />' },
    { title: 'Con umbral', code: '<Meter label="Batería" value={12} low={20} showValue />' },
  ],
  usage: [
    'Usalo para una medición conocida en un rango (no para el avance de una tarea — eso es Progress).',
    'Con `low` el medidor se pone en danger cuando el valor baja del umbral (útil para batería/espacio).',
    'El relleno se dimensiona con --sk-meter: no la seteés a mano.',
  ],
  a11y: ['role=meter con aria-valuenow/min/max.'],
}
