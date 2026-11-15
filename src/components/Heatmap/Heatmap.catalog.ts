import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Heatmap>. Actualizar SIEMPRE que cambie Heatmap.tsx. */
export const heatmapSpec: ComponentSpec = {
  name: 'Heatmap',
  dataSk: 'heatmap',
  category: 'Display',
  description:
    'Mapa de calor / matriz de cohortes: filas × columnas donde la intensidad de cada celda refuerza el número escrito. Una celda sin dato («aún no aplica») se distingue de un 0. Es una <table> accesible.',
  extends: "Omit<TableHTMLAttributes<HTMLTableElement>, 'children'>",
  props: [
    { name: 'rows', type: '{ key: string; label: ReactNode }[]', required: true, description: 'Filas (encabezado de fila, <th scope=row>).' },
    { name: 'columns', type: '{ key: string; label: ReactNode }[]', required: true, description: 'Columnas (<th scope=col>).' },
    { name: 'values', type: '(number | null | undefined)[][]', required: true, description: 'Matriz values[fila][columna]. null/undefined = «aún no aplica» (NO es 0).' },
    { name: 'min', type: 'number', required: false, description: 'Valor de intensidad mínima. Por omisión 0 (o el menor si hay negativos).' },
    { name: 'max', type: 'number', required: false, description: 'Valor de intensidad máxima. Por omisión el mayor de la matriz.' },
    { name: 'formatValue', type: '(value, rowKey, columnKey) => string', required: false, description: 'Cómo se escribe cada número (ej. porcentaje). Por omisión String(value).' },
    { name: 'label', type: 'string', required: false, description: 'Título de la tabla (<caption> visible solo para lectores).' },
    { name: 'cornerLabel', type: 'ReactNode', required: false, description: 'Contenido de la esquina superior izquierda.' },
    { name: 'notApplicableLabel', type: 'string', required: false, default: "'Aún no aplica' (según locale)", description: 'Texto accesible/tooltip de una celda sin dato.' },
  ],
  parts: [
    { name: 'root', description: 'La <table> [data-sk=heatmap].' },
    { name: 'caption', description: '<caption> oculto visualmente.' },
    { name: 'corner', description: 'Celda de la esquina.' },
    { name: 'column-header', description: '<th scope=col>.' },
    { name: 'row-header', description: '<th scope=row>.' },
    { name: 'cell', description: '<td>. [data-state=value|zero|empty], [data-level=0..4] y --sk-heatmap-intensity (0–1) para el color.' },
  ],
  examples: [
    {
      title: 'Cohortes con celdas que aún no aplican',
      code: `<Heatmap
  label="Retención por cohorte"
  cornerLabel="Cohorte"
  rows={[{ key: 'ene', label: 'Enero' }, { key: 'feb', label: 'Febrero' }]}
  columns={[{ key: 'm0', label: 'M0' }, { key: 'm1', label: 'M1' }, { key: 'm2', label: 'M2' }]}
  values={[[100, 42, 30], [100, 38, null]]}
  formatValue={(v) => v + '%'}
/>`,
    },
  ],
  usage: [
    'Para matrices pequeñas/medianas (cohortes, hora × día) donde importa ver el patrón y leer el número.',
    'Usa null/undefined para «aún no aplica»; usa 0 solo cuando el dato existe y vale cero.',
    'El color es refuerzo: el número siempre está escrito. Para tablas sin patrón de intensidad usa DataTable.',
  ],
  a11y: [
    'Es una <table> real con <caption>, <th scope> y celdas de texto; la celda sin dato incluye texto oculto «Aún no aplica». La intensidad nunca es el único canal.',
  ],
}
