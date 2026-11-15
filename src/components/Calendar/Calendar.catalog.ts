import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Calendar>. Actualizar SIEMPRE que cambie Calendar.tsx. */
export const calendarSpec: ComponentSpec = {
  name: 'Calendar',
  dataSk: 'calendar',
  category: 'Formulario',
  description:
    'Grilla de un mes para elegir una fecha. Navegación de mes, estados today/selected/outside/disabled, teclado (flechas, Home/End, RePág/AvPág, Enter). Nombres vía Intl (locale). Controlado (value ISO). La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: 'string', required: false, description: 'Fecha seleccionada en ISO yyyy-mm-dd (controlado).' },
    { name: 'onChange', type: '(iso: string) => void', required: false, description: 'Se invoca con la fecha elegida (ISO).' },
    { name: 'min', type: 'string', required: false, description: 'Fecha mínima (ISO); días previos quedan disabled.' },
    { name: 'max', type: 'string', required: false, description: 'Fecha máxima (ISO).' },
    { name: 'weekStartsOn', type: '0 | 1', required: false, default: '0', description: '0 = domingo, 1 = lunes.' },
    { name: 'locale', type: 'string', required: false, default: "locale del SkinkitProvider ('es' si no hay)", description: 'Locale para nombres de mes/día (Intl).' },
    { name: 'classNames', type: 'CalendarClassNames', required: false, description: 'Clases adicionales por sub-parte (header, prev, next, title, weekdays, weekday, grid, day). Aditivo, nunca reemplaza la clase base.' },
    { name: 'mode', type: "'single' | 'multiple'", required: false, default: "'single'", description: "Opt-in `multiple`: selección de días sueltos (toque o Enter/Espacio alterna; arrastrar pinta o borra varios). En `multiple`, `value`/`defaultValue` son `string[]` (ISO) y `onChange` recibe la lista ordenada. `min`/`max` siguen aplicando." },
    { name: 'defaultValue', type: 'string[]', required: false, description: 'Solo con `mode="multiple"`: fechas iniciales (no controlado).' },
    { name: 'marks', type: 'Record<string, string>', required: false, description: "Opt-in. Marcas por día: `{ '2026-10-16': 'exception' }`. El día emite `[data-state=<estado>]` y un punto bajo el número (estados con color de token: success, warning, danger, info, accent, secondary; cualquier otro usa primary; el consumidor lo pisa con `--sk-calendar-mark`)." },
    { name: 'markLabels', type: 'Record<string, string>', required: false, description: "Texto accesible por estado de `marks` (p. ej. `{ exception: 'excepción' }`): se agrega al aria-label del día, para que el color no sea el único canal." },
    { name: 'renderDay', type: '(ctx: CalendarDayContext) => ReactNode', required: false, description: 'Opt-in. Contenido propio de cada día (reemplaza al número). ctx: date, iso, day, state, selected, today, outside, disabled.' },
    { name: 'month', type: 'Date', required: false, description: 'Opt-in. Mes visible controlado (basta cualquier día del mes). Sin él, el mes es interno (arranca en el de la fecha elegida u hoy). Con él, la navegación solo avisa por onMonthChange.' },
    { name: 'onMonthChange', type: '(month: Date) => void', required: false, description: 'Opt-in. Recibe el primer día del mes al que se navega (flechas, RePág/AvPág o elegir un día de otro mes). Funciona con o sin `month`.' },
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
    { title: 'Días sueltos', code: '<Calendar mode="multiple" value={dias} onChange={setDias} min="2026-12-01" />' },
    { title: 'Días marcados', code: '<Calendar value={dia} onChange={setDia} marks={{ \'2026-10-16\': \'exception\' }} markLabels={{ exception: \'excepción\' }} />' },
  ],
  usage: [
    'Es controlado: guardá el ISO en tu estado y actualizalo en onChange.',
    'Para abrirlo en un popup (date picker), combiná Calendar dentro de un Popover.',
    'weekStartsOn=1 para semanas que arrancan el lunes; locale cambia los nombres.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `calendar` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ calendar: { … } }}>` o con la prop explícita del componente, que siempre gana.',
    'Días sueltos (promociones el 24 y 25, tres sábados): `mode="multiple"` con `value={fechas}` y `onChange={setFechas}`. Se puede arrastrar para marcar varios seguidos; con teclado, flechas + Enter/Espacio.',
    'Días con estado (excepciones, eventos, ocupado): `marks={{ [iso]: "exception" }}` + `markLabels`; no dependas solo del color, dale un texto con `markLabels` o un glifo con `renderDay`.',
  ],
  a11y: [
    'role=grid con gridcells; el día enfocado es tabbable (roving); Enter/Espacio selecciona.',
    'Cada día tiene aria-label con la fecha completa; aria-selected marca el elegido.',
  ],
}
