import type { CSSProperties, HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { space } from '../../lib/responsive'

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Tamaño fijo en el eje principal del flex padre (número = token --sk-sp-n; string = valor CSS).
   * Si se omite, el spacer CRECE (flex: 1) y empuja a sus hermanos a los extremos.
   */
  size?: number | string
}

/**
 * Spacer headless — espacio en un layout flex (Stack/Grid). Sin `size` crece para empujar a los
 * hermanos a los extremos; con `size` reserva un hueco fijo. No estila: emite una var que resuelve
 * la hoja base.
 *
 * Contrato: [data-sk="spacer"] (+ [data-fixed]).
 */
export function Spacer({ size, className, style, ...rest }: SpacerProps) {
  const vars: Record<string, string> = {}
  const s = space(size)
  if (s) vars['--sk-spacer-size'] = s

  return (
    <div
      data-sk="spacer"
      data-fixed={s ? '' : undefined}
      aria-hidden="true"
      className={cx('sk-spacer', className)}
      style={{ ...vars, ...(style as CSSProperties) }}
      {...rest}
    />
  )
}
