import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Calendar>. Actualizar SIEMPRE que cambie Calendar.tsx. */
export const calendarSpec: ComponentSpec = {
  name: 'Calendar',
  dataSk: 'calendar',
  category: 'Formulario',
  description:
    'Grilla de un mes para elegir una fecha. Navegación de mes, estados today/selected/outside/disabled, teclado (flechas, Home/End, RePág/AvPág, Enter). Nombres vía Intl (locale). Controlado (value ISO). La forma la da el skin.',
  extends: '—',
  props: [
    { name: 'value', type: 'string', required: false, description: 'Fecha seleccionada en ISO yyyy-mm-dd (controlado).' },
    { name: 'onChange', type: '(iso: string) => void', required: false, description: 'Se invoca con la fecha elegida (ISO).' },
    { name: 'min', type: 'string', required: false, description: 'Fecha mínima (ISO); días previos quedan disabled.' },
    { name: 'max', type: 'string', required: false, description: 'Fecha máxima (ISO).' },
    { name: 'weekStartsOn', type: '0 | 1', required: false, default: '0', description: '0 = domingo, 1 = lunes.' },
    { name: 'locale', type: 'string', required: false, default: "'es'", description: 'Locale para nombres de mes/día (Intl).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=calendar].' },
    { name: 'header', description: 'Mes/año + navegación.' },
    { name: 'prev', description: 'Botón mes anterior.' },
    { name: 'next', description: 'Botón mes siguiente.' },
    { name: 'title', description: 'Título "agosto 2026".' },
    { name: 'weekdays', description: 'Fila de nombres de día.' },
    { name: 'grid', description: 'Grilla (role=grid).' },
    { name: 'day', description: 'Cada día. Lleva [data-today] [data-selected] [data-outside].' },
  ],
  examples: [
    { title: 'Controlado', code: '<Calendar value={fecha} onChange={setFecha} />' },
    { title: 'Con rango', code: '<Calendar value={fecha} onChange={setFecha} min="2026-08-01" max="2026-08-31" weekStartsOn={1} />' },
  ],
  usage: [
    'Es controlado: guardá el ISO en tu estado y actualizalo en onChange.',
    'Para abrirlo en un popup (date picker), combiná Calendar dentro de un Popover.',
    'weekStartsOn=1 para semanas que arrancan el lunes; locale cambia los nombres.',
  ],
  a11y: [
    'role=grid con gridcells; el día enfocado es tabbable (roving); Enter/Espacio selecciona.',
    'Cada día tiene aria-label con la fecha completa; aria-selected marca el elegido.',
  ],
}
