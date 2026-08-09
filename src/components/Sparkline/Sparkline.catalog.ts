import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Sparkline>. Actualizar SIEMPRE que cambie Sparkline.tsx. */
export const sparklineSpec: ComponentSpec = {
  name: 'Sparkline',
  dataSk: 'sparkline',
  category: 'Display',
  description:
    'Mini gráfico de línea (tendencia) en SVG, sin ejes. Auto-escala a los datos; el color viene del theme según [data-tone]. Ideal al lado de una Stat.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    { name: 'data', type: 'number[]', required: true, description: 'Serie de valores.' },
    { name: 'width', type: 'number', required: false, default: '100', description: 'Ancho en px.' },
    { name: 'height', type: 'number', required: false, default: '28', description: 'Alto en px.' },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'", required: false, default: "'primary'", description: 'Color de la línea/área (del theme).' },
    { name: 'area', type: 'boolean', required: false, description: 'Rellena el área bajo la línea.' },
    { name: 'dot', type: 'boolean', required: false, description: 'Punto en el último valor.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=sparkline]. Lleva [data-tone].' },
    { name: 'area', description: 'Relleno bajo la línea (si area).' },
    { name: 'line', description: 'La línea (polyline).' },
    { name: 'dot', description: 'Punto del último valor (si dot).' },
  ],
  examples: [
    { title: 'Tendencia', code: '<Sparkline data={[3, 5, 4, 8, 7, 9, 12]} dot />' },
    { title: 'Con área', code: '<Sparkline data={serie} area tone="danger" width={140} />' },
  ],
  usage: [
    'Para mostrar una tendencia compacta (últimos N valores) sin ejes ni tooltips.',
    'Metela junto a una Stat/AnimatedNumber para dar contexto al número.',
    'width/height fijan el tamaño; la escala Y se calcula sola del min/max.',
  ],
}
