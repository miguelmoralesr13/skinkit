import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <DateRangePicker>. Actualizar SIEMPRE que cambie DateRangePicker.tsx. */
export const dateRangePickerSpec: ComponentSpec = {
  name: 'DateRangePicker',
  dataSk: 'date-picker',
  category: 'Formulario',
  description:
    'Campo que abre un RangeCalendar en un Popover para elegir un rango de fechas; se cierra al completar el rango y muestra "inicio – fin". Construido sobre Popover + RangeCalendar. Controlado. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: '{ start: string | null; end: string | null }', required: false, description: 'Rango seleccionado (ISO). Controlado.' },
    { name: 'onChange', type: '(range: { start: string | null; end: string | null }) => void', required: false, description: 'Se invoca al cambiar el rango.' },
    { name: 'placeholder', type: 'string', required: false, default: "'Elegir rango' (según locale)", description: 'Texto sin rango.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita el campo.' },
    { name: 'min', type: 'string', required: false, description: 'Fecha mínima (ISO).' },
    { name: 'max', type: 'string', required: false, description: 'Fecha máxima (ISO).' },
    { name: 'weekStartsOn', type: '0 | 1', required: false, default: '0', description: '0 = domingo, 1 = lunes.' },
    { name: 'locale', type: 'string', required: false, default: "locale del SkinkitProvider ('es' si no hay)", description: 'Locale (Intl).' },
    { name: 'portal', type: 'boolean', required: false, default: 'false', description: 'Opt-in. Monta el calendario en un portal a document.body con posición fija: no lo recorta el overflow de un ancestro (p. ej. un Dialog angosto) y se desplaza o voltea para caber en la ventana. Sin la prop, el panel cuelga del campo como siempre.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=date-picker][data-range]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'trigger', description: 'El campo (trigger del Popover) con el rango.' },
    { name: 'value', description: 'Texto "inicio – fin" o placeholder ([data-placeholder] si vacío).' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Rango', code: 'const [r, setR] = useState({ start: null, end: null })\n<DateRangePicker label="Período" value={r} onChange={setR} weekStartsOn={1} />' },
  ],
  usage: [
    'Para elegir un período (desde–hasta). Para una sola fecha, usá DatePicker.',
    'Es controlado: guardá {start,end}; se cierra solo cuando el rango queda completo.',
    'Mientras falta el fin, muestra "inicio – …".',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `dateRangePicker` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ dateRangePicker: { … } }}>` o con la prop explícita del componente, que siempre gana.',
    'Dentro de un `Dialog` o de un contenedor con overflow, pasa `portal` para que el calendario no se recorte contra el borde.',
  ],
  a11y: ['El trigger abre el calendario (aria-haspopup=dialog); RangeCalendar aporta la grilla accesible.'],
}
