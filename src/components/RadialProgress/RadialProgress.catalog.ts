import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <RadialProgress>. Actualizar SIEMPRE que cambie RadialProgress.tsx. */
export const radialProgressSpec: ComponentSpec = {
  name: 'RadialProgress',
  dataSk: 'radial-progress',
  category: 'Display',
  description:
    'Progreso circular (anillo) con SVG. El color del arco viene del theme según [data-tone]. Para el avance lineal, usá Progress.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'value', type: 'number', required: false, default: '0', description: 'Valor actual (0..max).' },
    { name: 'max', type: 'number', required: false, default: '100', description: 'Máximo.' },
    { name: 'size', type: 'number', required: false, default: '64', description: 'Diámetro en px.' },
    { name: 'thickness', type: 'number', required: false, default: '8', description: 'Grosor del anillo en px.' },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'", required: false, default: "'primary'", description: 'Color del arco (del theme).' },
    { name: 'showValue', type: 'boolean', required: false, description: 'Muestra el porcentaje en el centro.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Contenido central custom (reemplaza al %).' },
    { name: 'classNames', type: '{ track?: string; indicator?: string; label?: string }', required: false, description: 'Clases adicionales por sub-parte (track, indicator, label).' },
  ],
  parts: [
    { name: 'root', description: 'role=progressbar [data-sk=radial-progress]. Lleva [data-tone].' },
    { name: 'track', description: 'Círculo de fondo (SVG).' },
    { name: 'indicator', description: 'Arco de avance (SVG).' },
    { name: 'label', description: 'Texto central (% o children).' },
  ],
  examples: [
    { title: 'Con %', code: '<RadialProgress value={72} showValue />' },
    { title: 'Grande', code: '<RadialProgress value={40} size={96} thickness={10}>40/100</RadialProgress>' },
  ],
  usage: [
    'Para mostrar un progreso/score circular. Para una barra, usá Progress.',
    'size y thickness controlan el tamaño y el grosor del anillo.',
    'El % central sale de value/max; pasá children para un texto propio.',
  ],
  a11y: ['role=progressbar con aria-valuenow/min/max.'],
}
