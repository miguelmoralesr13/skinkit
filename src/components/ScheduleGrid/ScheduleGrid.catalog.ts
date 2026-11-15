import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ScheduleGrid>. Actualizar SIEMPRE que cambie ScheduleGrid.tsx. */
export const scheduleGridSpec: ComponentSpec = {
  name: 'ScheduleGrid',
  dataSk: 'schedule-grid',
  category: 'Display',
  description:
    'Rejilla filas × columnas con encabezados fijos, varias entradas por celda y un estado por entrada (agenda semanal por persona, recursos por franja). Las celdas vacías pueden ser botones para agregar. Scroll horizontal propio y navegación por teclado tipo grid.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'children'>",
  props: [
    { name: 'rows', type: '{ key: string; label: ReactNode; description?: ReactNode; text?: string }[]', required: true, description: 'Filas; su label es el encabezado de fila (role=rowheader).' },
    { name: 'columns', type: '{ key: string; label: ReactNode; description?: ReactNode; text?: string }[]', required: true, description: 'Columnas; su label es el encabezado de columna.' },
    { name: 'entries', type: '(rowKey: string, columnKey: string) => ScheduleGridEntry[]', required: true, description: 'Entradas de cada celda: { key, label, state?, stateLabel? }. [] = celda vacía.' },
    { name: 'renderEntry', type: '(entry, rowKey, columnKey) => ReactNode', required: false, description: 'Dibujo propio de cada entrada.' },
    { name: 'onCellClick', type: '(rowKey: string, columnKey: string) => void', required: false, description: 'Convierte las celdas VACÍAS en botones «agregar».' },
    { name: 'onEntryClick', type: '(entry, rowKey, columnKey) => void', required: false, description: 'Si se pasa, cada entrada es un botón.' },
    { name: 'label', type: 'string', required: false, default: "'Cuadrícula' (según locale)", description: 'Nombre accesible del grid.' },
    { name: 'cornerLabel', type: 'ReactNode', required: false, description: 'Contenido de la esquina superior izquierda.' },
    { name: 'addLabel', type: '(row, column) => string', required: false, default: "'Agregar en {fila}, {columna}' (según locale)", description: 'aria-label del botón de celda vacía.' },
    { name: 'emptyCellContent', type: 'ReactNode', required: false, default: "'+'", description: 'Contenido visible del botón de celda vacía.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=schedule-grid]; define --sk-schedule-grid-columns.' },
    { name: 'scroll', description: 'Contenedor con scroll horizontal propio.' },
    { name: 'grid', description: 'role="grid".' },
    { name: 'row', description: 'role="row".' },
    { name: 'corner', description: 'Esquina fija (columnheader).' },
    { name: 'column-header', description: 'Encabezado de columna (columnheader), fijo arriba.' },
    { name: 'row-header', description: 'Encabezado de fila (rowheader), fijo a la izquierda.' },
    { name: 'description', description: 'Texto secundario dentro de un encabezado.' },
    { name: 'cell', description: 'role="gridcell". [data-empty] si no tiene entradas.' },
    { name: 'entry', description: 'Cada entrada. [data-state=default|success|warning|danger|info|muted].' },
    { name: 'add', description: 'Botón de celda vacía (solo con onCellClick).' },
  ],
  examples: [
    {
      title: 'Agenda semanal con estados',
      code: `<ScheduleGrid
  label="Agenda de la semana"
  rows={[{ key: 'p1', label: 'Ana' }, { key: 'p2', label: 'Luis' }]}
  columns={[{ key: 'lun', label: 'Lun' }, { key: 'mar', label: 'Mar' }]}
  entries={(r, c) =>
    r === 'p1' && c === 'lun' ? [{ key: 'e1', label: '09:00–13:00', state: 'success', stateLabel: 'Confirmado' }] : []
  }
  onCellClick={(r, c) => abrirFormulario(r, c)}
/>`,
    },
  ],
  usage: [
    'Para ver filas × columnas con CONTENIDO dentro de cada celda (turnos, reservas). Para filas planas de texto usa DataTable; para elegir fechas, Calendar.',
    'Cada fila y columna necesita `key` único. `entries` se llama por celda: mantenlo barato.',
    'Pasa `stateLabel` en las entradas cuyo estado importa: el color por sí solo no basta.',
  ],
  a11y: [
    'role="grid" con row/columnheader/rowheader/gridcell. Una sola parada de Tab; flechas, Inicio/Fin (Ctrl+ = extremos de la cuadrícula) mueven entre celdas; Enter/Espacio activan el botón de la celda.',
    'El botón de celda vacía lleva aria-label con fila y columna.',
  ],
}
