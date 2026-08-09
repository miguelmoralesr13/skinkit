import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Banner>. Actualizar SIEMPRE que cambie Banner.tsx. */
export const bannerSpec: ComponentSpec = {
  name: 'Banner',
  dataSk: 'banner',
  category: 'Feedback',
  description:
    'Aviso a lo ancho, de una línea, arriba de una vista o sección (mantenimiento, novedad, cookies). A diferencia de Alert (bloque con título), es horizontal con acción y cierre opcionales.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'variant', type: "'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'neutral'", description: 'Tono según intención. El color lo pone el theme (var(--sk-<tono>)).' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Ícono a la izquierda.' },
    { name: 'action', type: 'ReactNode', required: false, description: 'Acción a la derecha (Button/enlace).' },
    { name: 'onClose', type: '() => void', required: false, description: 'Si se pasa, aparece un botón × que lo invoca. Vos lo sacás del árbol.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'El mensaje.' },
  ],
  parts: [
    { name: 'root', description: 'role=status. Lleva [data-variant].' },
    { name: 'icon', description: 'Ícono (opcional).' },
    { name: 'content', description: 'El mensaje.' },
    { name: 'actions', description: 'Acción a la derecha (opcional).' },
    { name: 'close', description: 'Botón de cierre (si hay onClose).' },
  ],
  examples: [
    { title: 'Novedad', code: '<Banner variant="primary" action={<Button size="sm">Ver</Button>} onClose={dismiss}>Nueva versión disponible.</Banner>' },
    { title: 'Aviso', code: '<Banner variant="danger">Mantenimiento programado a las 22:00.</Banner>' },
  ],
  usage: [
    'Para avisos globales breves. Si necesitás título + varias líneas, usá Alert.',
    'Pegalo arriba de la vista (o del contenedor) a lo ancho.',
    'onClose solo dibuja el botón; vos removés el banner del render.',
  ],
  a11y: ['role=status (live region polite); el ícono es aria-hidden; cierre con aria-label.'],
}
