import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ToastProvider> + useToast(). Actualizar SIEMPRE que cambie Toast.tsx. */
export const toastSpec: ComponentSpec = {
  name: 'Toast',
  dataSk: 'toast',
  category: 'Feedback',
  description:
    'Notificaciones efímeras no bloqueantes que se apilan en una esquina y se cierran solas. Se disparan por código con useToast(); requieren envolver la app en <ToastProvider>. Headless: la forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'ToastProvider.position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'", required: false, default: "'bottom-right'", description: 'Dónde se apilan los toasts.' },
    { name: 'ToastProvider.defaultDuration', type: 'number', required: false, default: '4000', description: 'ms por defecto hasta auto-cerrar.' },
    { name: 'toast().title', type: 'ReactNode', required: false, description: 'Título del toast.' },
    { name: 'toast().description', type: 'ReactNode', required: false, description: 'Texto secundario.' },
    { name: 'toast().variant', type: "'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'neutral'", description: 'Intención: neutral/primary/success/warning/info/danger. El color lo pone el theme.' },
    { name: 'toast().duration', type: 'number', required: false, description: 'ms hasta cerrarse. 0 = no se cierra solo.' },
    { name: 'toast().className', type: 'string', required: false, description: 'Clase adicional para la raíz de ESE toast individual ([data-sk="toast"]). No reemplaza la clase base.' },
    { name: 'toast().classNames', type: '{ content?: string; title?: string; description?: string; close?: string }', required: false, description: 'Clases adicionales por parte interna de ESE toast (content/title/description/close). No reemplazan las clases base.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=toast-viewport] contenedor apilado (portal). Lleva [data-position].' },
    { name: 'toast', description: '[data-sk=toast] cada notificación (role=status). Lleva [data-variant].' },
    { name: 'content', description: 'Columna de texto (título + descripción).' },
    { name: 'title', description: 'Título del toast.' },
    { name: 'description', description: 'Texto secundario.' },
    { name: 'close', description: 'Botón de cierre.' },
  ],
  examples: [
    { title: 'Envolver la app', code: '<ToastProvider position="bottom-right"><App /></ToastProvider>' },
    { title: 'Disparar un toast', code: 'const { toast } = useToast()\ntoast({ title: "Guardado", variant: "primary" })' },
    { title: 'Error persistente', code: 'toast({ title: "Falló la carga", variant: "danger", duration: 0 })' },
    { title: 'Personalizar sub-partes', code: 'toast({ title: "Guardado", className: "mi-toast", classNames: { title: "mi-toast__title" } })' },
  ],
  usage: [
    'Opt-in `<SkinkitProvider inheritColorScheme>`: el portal del viewport copia el modo claro/oscuro de la raíz de la app.',
    'Envolvé la app (o la parte que los dispara) en <ToastProvider> UNA vez; useToast() lee de él.',
    'Usalo para confirmaciones breves y no críticas. Para algo que el usuario DEBE atender, usá Dialog/Alert.',
    'duration: 0 para errores que no deberían desaparecer solos.',
    'Variantes de estado (success/warning/info/danger) además de neutral/primary; el color sale de var(--sk-<tono>) del theme.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `toast` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ toast: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'Cada toast es role="status" (live region polite): se anuncia sin robar el foco.',
    'El botón de cierre trae aria-label="Cerrar".',
  ],
}
