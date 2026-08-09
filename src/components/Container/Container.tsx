import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { space } from '../../lib/responsive'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Ancho máximo: sm 40rem · md 48rem · lg 64rem · xl 80rem · full sin tope. Default 'lg'. */
  size?: ContainerSize
  /** Padding horizontal (número = token --sk-sp-n; string = valor CSS). */
  padding?: number | string
  /** Centra el contenido en una columna. */
  centerContent?: boolean
  children?: ReactNode
}

/**
 * Container headless — envoltorio centrado con ancho máximo por preset y padding horizontal. No
 * estila colores/forma: sólo marca el contrato y expone vars que resuelve la hoja base.
 *
 * Contrato: [data-sk="container"] [data-size] (+ [data-center]).
 */
export function Container({
  size = 'lg',
  padding,
  centerContent,
  className,
  style,
  children,
  ...rest
}: ContainerProps) {
  const vars: Record<string, string> = {}
  const p = space(padding)
  if (p) vars['--sk-container-pad'] = p

  return (
    <div
      data-sk="container"
      data-size={size}
      data-center={centerContent ? '' : undefined}
      className={cx('sk-container', className)}
      style={{ ...vars, ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
}
