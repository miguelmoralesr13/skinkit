import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { responsiveVars, space, type Responsive } from '../../lib/responsive'

export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Dirección (responsive). Default 'column'. Ej. { base: 'column', md: 'row' }. */
  direction?: Responsive<StackDirection>
  /** Separación entre hijos (número = token --sk-sp-n; string = valor CSS). */
  gap?: number | string
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
  inline?: boolean
  children?: ReactNode
}

/**
 * Stack headless — layout 1D en flexbox parametrizado por props. La dirección es responsive, así
 * que el patrón "en mobile apilado, en desktop en fila" es sólo `direction={{ base:'column',
 * md:'row' }}`. No estila: emite CSS vars que resuelve la hoja base (styles/layout.css).
 *
 * Contrato: [data-sk="stack"] (+ [data-wrap], [data-inline]).
 */
export function Stack({
  direction,
  gap,
  align,
  justify,
  wrap,
  inline,
  className,
  style,
  children,
  ...rest
}: StackProps) {
  const vars: Record<string, string> = { ...responsiveVars('--sk-stack-dir', direction) }
  const g = space(gap)
  if (g) vars['--sk-stack-gap'] = g
  if (align) vars['--sk-stack-align'] = String(align)
  if (justify) vars['--sk-stack-justify'] = String(justify)

  return (
    <div
      data-sk="stack"
      data-wrap={wrap ? '' : undefined}
      data-inline={inline ? '' : undefined}
      className={cx('sk-stack', className)}
      style={{ ...vars, ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
}
