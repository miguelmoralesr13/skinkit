import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <RangeCalendar>. Actualizar SIEMPRE que cambie RangeCalendar.tsx. */
export const rangeCalendarSpec: ComponentSpec = {
  name: 'RangeCalendar',
  dataSk: 'calendar',
  category: 'Formulario',
  description:
    'Grilla de mes para elegir un RANGO de fechas (dos clicks: inicio, luego fin; los días del medio se resaltan). Reusa el look del Calendar (emite [data-sk=calendar][data-range]). Controlado. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: '{ start: string | null; end: string | null }', required: false, description: 'Rango seleccionado (ISO). Controlado.' },
    { name: 'onChange', type: '(range: { start: string | null; end: string | null }) => void', required: false, description: 'Se invoca en cada click (primer click: start + end null; segundo: rango completo).' },
    { name: 'min', type: 'string', required: false, description: 'Fecha mínima (ISO).' },
    { name: 'max', type: 'string', required: false, description: 'Fecha máxima (ISO).' },
    { name: 'weekStartsOn', type: '0 | 1', required: false, default: '0', description: '0 = domingo, 1 = lunes.' },
    { name: 'locale', type: 'string', required: false, default: "'es'", description: 'Locale (Intl).' },
    { name: 'classNames', type: '{ header?: string; prev?: string; next?: string; title?: string; weekdays?: string; weekday?: string; grid?: string; day?: string }', required: false, description: 'Clases adicionales por sub-parte (aditivas, nunca reemplazan la clase base). La misma clase de "weekday"/"day" aplica a todas sus instancias repetidas.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=calendar][data-range]. Hereda las parts del Calendar.' },
    { name: 'day', description: 'Cada día; suma [data-range-start] [data-range-end] [data-in-range] a los estados del Calendar.' },
  ],
  examples: [
    { title: 'Rango', code: 'const [r, setR] = useState({ start: null, end: null })\n<RangeCalendar value={r} onChange={setR} />' },
  ],
  usage: [
    'Primer click = inicio (end queda null); segundo click posterior = fin. Un click anterior al inicio reinicia el rango.',
    'Es controlado: guardá {start,end} y actualizalo en onChange.',
    'Para el patrón campo+popup, usá DateRangePicker (lo envuelve).',
  ],
  a11y: ['Reusa la grilla accesible del Calendar; los extremos del rango van con aria-selected.'],
}
