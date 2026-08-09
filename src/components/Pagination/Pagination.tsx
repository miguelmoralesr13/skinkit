import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

export type PaginationTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Página actual (1-based). */
  page: number
  /** Color de la página actual (del theme). 'primary' (default) no emite data-tone. */
  tone?: PaginationTone
  /** Cantidad total de páginas. */
  count: number
  /** Se invoca con la nueva página. */
  onPageChange: (page: number) => void
  /** Páginas visibles a cada lado de la actual (default 1). */
  siblingCount?: number
  label?: string
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** Calcula qué páginas mostrar, con 'dots' donde va la elipsis. */
function paginationRange(current: number, total: number, siblings: number): (number | 'dots')[] {
  const totalSlots = siblings * 2 + 5
  if (totalSlots >= total) return range(1, total)

  const left = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)
  const showLeftDots = left > 2
  const showRightDots = right < total - 1
  const edgeCount = 3 + 2 * siblings

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), 'dots', total]
  if (showLeftDots && !showRightDots) return [1, 'dots', ...range(total - edgeCount + 1, total)]
  return [1, 'dots', ...range(left, right), 'dots', total]
}

/**
 * Pagination headless — navegación entre páginas con anterior/siguiente, números y elipsis.
 * La lógica de qué páginas mostrar la resuelve el componente; la forma la da el skin.
 *
 * Contrato:
 *   [data-sk="pagination"]    raíz (<nav aria-label>)
 *   [data-part="prev"]        botón anterior (disabled en la primera)
 *   [data-part="next"]        botón siguiente (disabled en la última)
 *   [data-part="page"]        botón de página · [data-current] + aria-current en la actual
 *   [data-part="ellipsis"]    marcador … (no interactivo)
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, count, onPageChange, siblingCount = 1, label = 'Paginación', tone = 'primary', className, ...rest },
  ref,
) {
  const pages = paginationRange(page, count, siblingCount)
  const go = (p: number) => {
    if (p >= 1 && p <= count && p !== page) onPageChange(p)
  }

  return (
    <nav
      ref={ref}
      data-sk="pagination"
      data-tone={tone === 'primary' ? undefined : tone}
      aria-label={label}
      className={cx('sk-pagination', className)}
      {...rest}
    >
      <button
        type="button"
        data-part="prev"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === 'dots' ? (
          <span key={`dots-${i}`} data-part="ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            data-part="page"
            data-current={p === page ? '' : undefined}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Página ${p}`}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        data-part="next"
        aria-label="Página siguiente"
        disabled={page >= count}
        onClick={() => go(page + 1)}
      >
        ›
      </button>
    </nav>
  )
})
