import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <StackedBar>. Actualizar SIEMPRE que cambie StackedBar.tsx. */
export const stackedBarSpec: ComponentSpec = {
  name: 'StackedBar',
  dataSk: 'stacked-bar',
  category: 'Display',
  description:
    'Barra única dividida en segmentos que muestra cómo se reparte un total en 2–6 partes. A diferencia de Progress/Meter/RadialProgress (un solo valor), pinta varios. Es role="img" con un aria-label generado con todas las partes y una leyenda con etiqueta y valor escritos.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'children'>",
  props: [
    { name: 'segments', type: '{ key: string; label: string; value: number; tone?: StackedBarTone }[]', required: true, description: 'Las partes. La proporción de cada una es value / suma de valores. Valores <= 0 no dibujan tramo (siguen en la leyenda).' },
    { name: 'label', type: 'string', required: false, description: 'Qué se reparte; encabezado del aria-label ("Etiqueta: A 60%, B 40%").' },
    { name: 'showLegend', type: 'boolean', required: false, default: 'true', description: 'Leyenda con etiqueta directa y valor por segmento.' },
    { name: 'formatValue', type: '(segment, percent: number) => string', required: false, description: 'Texto de cada valor en leyenda y aria-label. Por omisión el porcentaje redondeado ("60%").' },
    { name: 'empty', type: 'ReactNode', required: false, description: 'Contenido cuando la suma es 0 (no hay barra). Sin él no se pinta nada.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=stacked-bar]. [data-empty] cuando la suma es 0.' },
    { name: 'bar', description: 'La barra, role="img" con el aria-label generado.' },
    { name: 'segment', description: 'Cada tramo. [data-tone]; flex-grow = value; ancho mínimo para que un valor pequeño no desaparezca.' },
    { name: 'legend', description: 'Lista <ul> de la leyenda.' },
    { name: 'legend-item', description: 'Cada entrada. [data-tone].' },
    { name: 'swatch', description: 'Muestra de color (decorativa, aria-hidden).' },
    { name: 'legend-label', description: 'Etiqueta del segmento.' },
    { name: 'legend-value', description: 'Valor escrito del segmento.' },
    { name: 'empty', description: 'Mensaje cuando no hay nada que repartir.' },
  ],
  examples: [
    {
      title: 'Reparto de un total',
      code: `<StackedBar
  label="Tráfico por origen"
  segments={[
    { key: 'a', label: 'Directo', value: 60, tone: 'primary' },
    { key: 'b', label: 'Búsqueda', value: 30, tone: 'success' },
    { key: 'c', label: 'Otros', value: 10, tone: 'warning' },
  ]}
/>`,
    },
    {
      title: 'Valor propio en vez de porcentaje',
      code: `<StackedBar
  label="Tareas"
  segments={[{ key: 'ok', label: 'Hechas', value: 18 }, { key: 'wip', label: 'En curso', value: 5 }]}
  formatValue={(s) => String(s.value)}
/>`,
    },
  ],
  usage: [
    'Para repartir UN total en pocas partes (2–6). Para un solo valor dentro de un rango usa Meter/Progress; para series en el tiempo, Sparkline.',
    'Cada segmento necesita `key` y `label` únicos: la leyenda y el aria-label dependen de la etiqueta, no del color.',
    'No dependas del color: la leyenda siempre escribe el valor. Elige tonos distintos en luminosidad si son vecinos.',
  ],
  a11y: [
    'La barra es role="img" con aria-label generado con todas las partes ("Etiqueta: Directo 60%, …"); la leyenda es una lista con texto, el color es solo refuerzo.',
  ],
}
