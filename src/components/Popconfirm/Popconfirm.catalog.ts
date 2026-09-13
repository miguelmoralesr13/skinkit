import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Popconfirm>. Actualizar SIEMPRE que cambie Popconfirm.tsx. */
export const popconfirmSpec: ComponentSpec = {
  name: 'Popconfirm',
  dataSk: 'popconfirm',
  category: 'Overlay',
  description:
    'Confirmación liviana anclada a un disparador (ej. "¿Borrar?" al lado del botón Borrar), a diferencia del ConfirmDialog que es un modal. Compone Popover + Button. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'Pregunta/título de la confirmación.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Detalle bajo el título.' },
    { name: 'confirmLabel', type: 'string', required: false, default: "'Confirmar' (según locale)", description: 'Texto del botón de confirmar.' },
    { name: 'cancelLabel', type: 'string', required: false, default: "'Cancelar' (según locale)", description: 'Texto del botón de cancelar.' },
    { name: 'onConfirm', type: '() => void', required: false, description: 'Se llama al confirmar; luego cierra.' },
    { name: 'onCancel', type: '() => void', required: false, description: 'Se llama al cancelar; luego cierra.' },
    { name: 'danger', type: 'boolean', required: false, description: 'Acción peligrosa: el CSS pinta el confirmar con --sk-danger.' },
    { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", required: false, default: "'top'", description: 'Lado donde se despliega respecto del disparador.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'El disparador (texto/ícono); se renderiza dentro del botón del Popover.' },
    { name: 'className', type: 'string', required: false, description: 'Clase adicional para la raíz ([data-sk=popconfirm]). Aditivo: nunca reemplaza la clase base.' },
    { name: 'classNames', type: 'PopconfirmClassNames', required: false, description: 'Clases adicionales por sub-parte (title/description/actions/confirm). Aditivo: nunca reemplazan las clases base.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=popconfirm] (dentro del Popover.Content). Lleva [data-tone=danger].' },
    { name: 'title', description: '[data-part=title].' },
    { name: 'description', description: '[data-part=description].' },
    { name: 'actions', description: '[data-part=actions]: fila con Cancelar y Confirmar (Button).' },
    { name: 'confirm', description: '[data-part=confirm] va sobre el Button de confirmar (para el estilo danger).' },
  ],
  examples: [
    {
      title: 'Borrar con confirmación inline',
      code: '<Popconfirm title="¿Borrar el elemento?" danger confirmLabel="Borrar" onConfirm={() => remove(id)}>\n  Borrar\n</Popconfirm>',
    },
  ],
  usage: [
    'Para confirmar una acción puntual sin interrumpir con un modal. Para decisiones importantes o con más contenido, usá ConfirmDialog.',
    'El disparador es contenido inline (texto/ícono); no metas un <button>/<Button> adentro (el Popover ya lo envuelve en un botón).',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `popconfirm` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ popconfirm: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['El disparador expone aria-haspopup/aria-expanded; el panel es role=dialog (vía Popover).'],
}
