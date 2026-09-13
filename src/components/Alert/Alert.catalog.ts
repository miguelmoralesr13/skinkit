import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Alert>. Actualizar SIEMPRE que cambie Alert.tsx. */
export const alertSpec: ComponentSpec = {
  name: 'Alert',
  dataSk: 'alert',
  category: 'Feedback',
  description:
    'Mensaje de feedback en bloque (información, aviso, error) con título, ícono y cierre opcionales. role="alert" para que los lectores lo anuncien. La forma la da el CSS.',
  extends: 'Omit<HTMLAttributes<HTMLDivElement>, "title">',
  props: [
    {
      name: 'variant',
      type: "'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'danger'",
      required: false,
      default: "'neutral'",
      description:
        'Intención del mensaje. neutral = informativo; primary = destacado; success/warning/info/danger = estado. El color lo pone el theme.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      required: false,
      description: 'Título breve en negrita arriba del cuerpo.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      description: 'Ícono a la izquierda (decorativo).',
    },
    {
      name: 'onClose',
      type: '() => void',
      required: false,
      description: 'Si se pasa, aparece un botón de cierre (×) que lo invoca. Vos controlás quitarla del árbol.',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor (role=alert). Lleva [data-variant].' },
    { name: 'icon', description: 'Ícono opcional a la izquierda.' },
    { name: 'content', description: 'Columna de texto (título + cuerpo).' },
    { name: 'title', description: 'Título opcional.' },
    { name: 'body', description: 'Cuerpo del mensaje.' },
    { name: 'close', description: 'Botón de cierre (solo si hay onClose).' },
  ],
  examples: [
    { title: 'Info simple', code: '<Alert>Se guardaron los cambios.</Alert>' },
    { title: 'Error con título', code: '<Alert variant="danger" title="No se pudo guardar">Revisá tu conexión.</Alert>' },
    { title: 'Con cierre', code: '<Alert variant="primary" onClose={() => setOpen(false)}>Novedad disponible.</Alert>' },
  ],
  usage: [
    'Usá `variant` por significado (danger = algo salió mal); el color real lo pone el theme.',
    'No hay variantes success/warning: el contrato de tokens del theme no las define todavía.',
    '`onClose` NO quita la alerta sola: solo dibuja el botón; vos decidís sacarla del render.',
    'Para avisos efímeros no bloqueantes (toasts) este no es el patrón; Alert es en bloque, en la página.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `alert` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ alert: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'role="alert" hace que los lectores lo anuncien apenas aparece (live region assertive).',
    'El botón de cierre trae aria-label="Cerrar"; el ícono es aria-hidden.',
  ],
}
