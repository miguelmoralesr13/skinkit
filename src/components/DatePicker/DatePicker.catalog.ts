import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <DatePicker>. Actualizar SIEMPRE que cambie DatePicker.tsx. */
export const datePickerSpec: ComponentSpec = {
  name: 'DatePicker',
  dataSk: 'date-picker',
  category: 'Formulario',
  description:
    'Campo que abre un Calendar en un Popover para elegir una fecha; se cierra al elegir y muestra la fecha formateada. Construido sobre Popover + Calendar. Controlado (value ISO). La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: 'string', required: false, description: 'Fecha seleccionada en ISO yyyy-mm-dd (controlado).' },
    { name: 'onChange', type: '(iso: string) => void', required: false, description: 'Se invoca con la fecha elegida (ISO).' },
    { name: 'placeholder', type: 'string', required: false, default: "'Elegir fecha' (según locale)", description: 'Texto del campo sin fecha.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido ([data-error]).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita el campo.' },
    { name: 'min', type: 'string', required: false, description: 'Fecha mínima (ISO).' },
    { name: 'max', type: 'string', required: false, description: 'Fecha máxima (ISO).' },
    { name: 'weekStartsOn', type: '0 | 1', required: false, default: '0', description: '0 = domingo, 1 = lunes.' },
    { name: 'locale', type: 'string', required: false, default: "locale del SkinkitProvider ('es' si no hay)", description: 'Locale para el formato y los nombres (Intl).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=date-picker]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'trigger', description: 'El campo (trigger del Popover) que muestra la fecha.' },
    { name: 'value', description: 'Texto de la fecha o placeholder ([data-placeholder] si está vacío).' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Básico', code: '<DatePicker label="Fecha" value={fecha} onChange={setFecha} />' },
    { title: 'Con rango', code: '<DatePicker value={fecha} onChange={setFecha} min="2026-01-01" max="2026-12-31" weekStartsOn={1} />' },
  ],
  usage: [
    'Es el patrón "input + calendario en popup". Si querés el calendario SIEMPRE visible, usá Calendar directo.',
    'Es controlado: guardá el ISO y actualizalo en onChange; se cierra solo al elegir.',
    'El formato de la fecha mostrada sale de Intl (locale).',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `datePicker` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ datePicker: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['El trigger abre el calendario (aria-haspopup=dialog); el Calendar aporta la grilla accesible; Esc cierra.'],
}
