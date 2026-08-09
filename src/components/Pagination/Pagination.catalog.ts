import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Pagination>. Actualizar SIEMPRE que cambie Pagination.tsx. */
export const paginationSpec: ComponentSpec = {
  name: 'Pagination',
  dataSk: 'pagination',
  category: 'Navegación',
  description:
    'Navegación entre páginas: anterior/siguiente, números y elipsis. El componente resuelve qué páginas mostrar; la forma la da el skin. Vos controlás page y respondés a onPageChange.',
  extends: "Omit<HTMLAttributes<HTMLElement>, 'onChange'>",
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de la página actual (del theme).' },
    { name: 'page', type: 'number', required: true, description: 'Página actual (1-based).' },
    { name: 'count', type: 'number', required: true, description: 'Cantidad total de páginas.' },
    { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Se invoca con la nueva página.' },
    { name: 'siblingCount', type: 'number', required: false, default: '1', description: 'Páginas visibles a cada lado de la actual.' },
    { name: 'label', type: 'string', required: false, default: "'Paginación'", description: 'aria-label del <nav>.' },
  ],
  parts: [
    { name: 'root', description: '<nav aria-label>.' },
    { name: 'prev', description: 'Botón anterior (disabled en la primera).' },
    { name: 'next', description: 'Botón siguiente (disabled en la última).' },
    { name: 'page', description: 'Botón de página. Lleva [data-current] + aria-current en la actual.' },
    { name: 'ellipsis', description: 'Marcador … (no interactivo).' },
  ],
  examples: [
    { title: 'Controlado', code: '<Pagination page={page} count={20} onPageChange={setPage} />' },
    { title: 'Más vecinos', code: '<Pagination page={page} count={50} siblingCount={2} onPageChange={setPage} />' },
  ],
  usage: [
    'Es controlado: guardá `page` en tu estado y actualizalo en onPageChange.',
    'count es el TOTAL de páginas, no de ítems. Calculalo con Math.ceil(totalItems / pageSize).',
    'Con pocas páginas no aparecen elipsis; con muchas, se colapsan los extremos automáticamente.',
  ],
  a11y: [
    '<nav aria-label>; la página actual usa aria-current="page"; prev/next tienen aria-label.',
  ],
}
