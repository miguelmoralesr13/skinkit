import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * InputGroup headless — junta un Input (u otro control) con addons a los lados (texto, ícono o un
 * botón), unidos visualmente en una sola pieza. No estila: el CSS cose los bordes (aplana las
 * esquinas internas) y pinta los addons.
 *
 * Contrato:
 *   [data-sk="input-group"]   contenedor en fila
 *   [data-part="addon"]       <InputGroup.Addon> — prefijo/sufijo (texto/ícono)
 *   Poné el Input (o un Button) entre los addons; el CSS lo integra.
 */
export function InputGroup({ className, children, ...rest }: InputGroupProps) {
  return (
    <div data-sk="input-group" className={cx('sk-input-group', className)} {...rest}>
      {children}
    </div>
  )
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

function InputGroupAddon({ className, children, ...rest }: InputGroupAddonProps) {
  return (
    <span data-part="addon" className={cx('sk-input-group__addon', className)} {...rest}>
      {children}
    </span>
  )
}

InputGroup.Addon = InputGroupAddon
