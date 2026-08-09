import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <VisuallyHidden>. Actualizar SIEMPRE que cambie VisuallyHidden.tsx. */
export const visuallyHiddenSpec: ComponentSpec = {
  name: 'VisuallyHidden',
  dataSk: 'visually-hidden',
  category: 'Display',
  description:
    'Oculta contenido a la vista pero lo deja para lectores de pantalla (labels solo-audio, texto de contexto). Utilidad de accesibilidad; su ocultamiento vive en la base (no depende del skin).',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [{ name: 'children', type: 'ReactNode', required: true, description: 'Contenido que solo leen los lectores.' }],
  parts: [{ name: 'root', description: 'El <span> [data-sk=visually-hidden] (ocultado por la base).' }],
  examples: [
    { title: 'Label de ícono', code: '<button><Icon /><VisuallyHidden>Cerrar</VisuallyHidden></button>' },
    { title: 'Contexto', code: '<VisuallyHidden>Resultados de búsqueda:</VisuallyHidden>' },
  ],
  usage: [
    'Para texto que debe existir para lectores pero no verse (aria alternativo cuando aria-label no alcanza).',
    'No lo uses para esconder cosas por diseño: para eso usá `hidden`/display:none (eso SÍ las saca de lectores).',
  ],
  a11y: ['Técnica clip (no display:none) → el contenido sigue anunciado por lectores y es focuseable si contiene foco.'],
}
