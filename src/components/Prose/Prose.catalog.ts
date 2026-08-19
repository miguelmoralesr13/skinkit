import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Prose>. Actualizar SIEMPRE que cambie Prose.tsx. */
export const proseSpec: ComponentSpec = {
  name: 'Prose',
  dataSk: 'prose',
  category: 'Display',
  description:
    'Contenedor para texto largo (artículos, markdown renderizado, contenido de un CMS) que da estilo tipográfico legible a su HTML hijo: h1–h6, p, ul/ol, blockquote, code/pre, a, img, hr, table. No trae estilos propios; el CSS del componente estiliza los descendientes por tag.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Densidad tipográfica (escala de fuente/espaciado).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'HTML arbitrario a estilar (o dangerouslySetInnerHTML del markdown).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=prose]. Lleva [data-size]. El CSS del componente estila los descendientes por tag (h2, p, ul, code, a, blockquote…).' },
  ],
  examples: [
    {
      title: 'Artículo',
      code: '<Prose>\n  <h1>Título</h1>\n  <p>Un párrafo con <a href="#">un enlace</a> y <code>código</code>.</p>\n  <ul>\n    <li>Uno</li>\n    <li>Dos</li>\n  </ul>\n  <blockquote>Una cita.</blockquote>\n</Prose>',
    },
    {
      title: 'Markdown renderizado',
      code: '<Prose dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />',
    },
  ],
  usage: [
    'Envolvé bloques de texto largo cuyo HTML no controlás elemento por elemento (markdown, CMS).',
    'Para un layout de UI compuesto por tus propios componentes, NO uses Prose: estilá cada componente.',
    'El estilo de los hijos vive en el CSS; acá no agregues clases a los tags internos.',
  ],
}
