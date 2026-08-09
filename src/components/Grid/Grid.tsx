import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { len, mapResponsive, responsiveVars, space, type Responsive } from '../../lib/responsive'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Cantidad de columnas (responsive). Se ignora si se pasa `minChildWidth`. */
  cols?: Responsive<number>
  /** Modo auto-fit: columnas de al menos este ancho que se reacomodan solas (sin breakpoints). */
  minChildWidth?: number | string
  /** Separación (número = token --sk-sp-n; string = valor CSS). */
  gap?: number | string
  rowGap?: number | string
  columnGap?: number | string
  alignItems?: CSSProperties['alignItems']
  justifyItems?: CSSProperties['justifyItems']
  /** grid-auto-flow. */
  flow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'
  inline?: boolean
  children?: ReactNode
}

/**
 * Grid headless — CSS Grid parametrizada por props (responsive). No estila: sólo emite CSS vars
 * que resuelve la hoja base (styles/layout.css). `cols` acepta un número o un objeto por
 * breakpoint; `minChildWidth` activa el modo auto-fit (se reacomoda sin media queries).
 *
 * Contrato: [data-sk="grid"] (+ [data-auto], [data-inline]); hijos opcionales <Grid.Item>.
 */
export function Grid({
  cols,
  minChildWidth,
  gap,
  rowGap,
  columnGap,
  alignItems,
  justifyItems,
  flow,
  inline,
  className,
  style,
  children,
  ...rest
}: GridProps) {
  // Emitimos el `grid-template-columns` COMPLETO como var por breakpoint. `repeat(var(--n), …)`
  // NO es válido (repeat() no acepta var() como cantidad), pero `grid-template-columns: var(--x)`
  // con --x = "repeat(4, …)" sí: el var se sustituye entero antes de parsear el repeat.
  const min = len(minChildWidth)
  const template: Record<string, string> = min
    ? { '--sk-grid-tpl-base': `repeat(auto-fit, minmax(${min}, 1fr))` }
    : responsiveVars(
        '--sk-grid-tpl',
        mapResponsive(cols, (n) => `repeat(${n}, minmax(0, 1fr))`),
      )
  const vars: Record<string, string> = { ...template }
  const g = space(gap)
  if (g) vars['--sk-grid-gap'] = g
  const rg = space(rowGap)
  if (rg) vars['--sk-grid-row-gap'] = rg
  const cg = space(columnGap)
  if (cg) vars['--sk-grid-col-gap'] = cg
  if (alignItems) vars['--sk-grid-align'] = String(alignItems)
  if (justifyItems) vars['--sk-grid-justify'] = String(justifyItems)
  if (flow) vars['--sk-grid-flow'] = flow

  return (
    <div
      data-sk="grid"
      data-auto={min ? '' : undefined}
      data-inline={inline ? '' : undefined}
      className={cx('sk-grid', className)}
      style={{ ...vars, ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
}

const spanValue = (n: number) => `span ${n} / span ${n}`

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Columnas que abarca (responsive). */
  colSpan?: Responsive<number>
  /** Filas que abarca. */
  rowSpan?: number
  children?: ReactNode
}

function GridItem({ colSpan, rowSpan, className, style, children, ...rest }: GridItemProps) {
  const vars: Record<string, string> = {
    ...responsiveVars('--sk-grid-item-col', mapResponsive(colSpan, spanValue)),
  }
  if (rowSpan != null) vars['--sk-grid-item-row'] = spanValue(rowSpan)
  return (
    <div
      data-sk="grid-item"
      className={cx('sk-grid-item', className)}
      style={{ ...vars, ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
}

Grid.Item = GridItem
