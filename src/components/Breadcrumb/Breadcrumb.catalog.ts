import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Breadcrumb>. Actualizar SIEMPRE que cambie Breadcrumb.tsx. */
export const breadcrumbSpec: ComponentSpec = {
  name: 'Breadcrumb',
  dataSk: 'breadcrumb',
  category: 'Navegación',
  description:
    'Rastro de navegación jerárquica (Inicio / Sección / Página actual). Compuesto: <Breadcrumb> con <Breadcrumb.Item>. El separador lo dibuja el CSS, no el markup.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'label', type: 'string', required: false, default: "'Breadcrumb'", description: 'aria-label del <nav>.' },
  ],
  parts: [
    { name: 'root', description: '<nav aria-label>.' },
    { name: 'list', description: 'El <ol>.' },
    { name: 'item', description: 'Cada <li>. Lleva [data-current] en el actual. <Breadcrumb.Item>.' },
    { name: 'link', description: 'El <a> de los ítems navegables.' },
    { name: 'current', description: 'El <span> del ítem actual (aria-current="page").' },
  ],
  examples: [
    {
      title: 'Rastro',
      code: '<Breadcrumb>\n  <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>\n  <Breadcrumb.Item href="/proyectos">Proyectos</Breadcrumb.Item>\n  <Breadcrumb.Item current>Pigmento</Breadcrumb.Item>\n</Breadcrumb>',
    },
  ],
  usage: [
    'El último ítem (página actual) va con `current` → se renderiza como texto, no como enlace.',
    'Los demás llevan `href` (y cualquier prop de <a>).',
    'El separador (/, ›, etc.) lo pone el CSS entre ítems; no lo agregues al texto.',
  ],
  a11y: [
    '<nav aria-label> + <ol>; el ítem actual usa aria-current="page".',
  ],
}
