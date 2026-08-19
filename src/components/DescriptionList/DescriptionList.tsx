import { type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type DescriptionListOrientation = 'horizontal' | 'vertical'

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** horizontal = término al lado; vertical = término arriba. */
  orientation?: DescriptionListOrientation
}

/**
 * DescriptionList headless, compuesto: <DescriptionList> · <DescriptionList.Item>. Pares
 * término/definición (detalles, metadatos). Semántica <dl><div><dt><dd>. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="dlist"]  [data-orientation]  raíz (<dl>)
 *   [data-part="row"]         par (<div>)
 *   [data-part="term"]        término (<dt>)
 *   [data-part="description"] definición (<dd>)
 */
export function DescriptionList({
  orientation = 'horizontal',
  className,
  children,
  ...rest
}: DescriptionListProps) {
  return (
    <dl
      data-sk="dlist"
      data-orientation={orientation}
      className={cx('sk-dlist', className)}
      {...rest}
    >
      {children}
    </dl>
  )
}

export interface DescriptionItemProps {
  term: ReactNode
  children: ReactNode
  className?: string
}

function DescriptionItem({ term, children, className }: DescriptionItemProps) {
  return (
    <div data-part="row" className={cx('sk-dlist__row', className)}>
      <dt data-part="term">{term}</dt>
      <dd data-part="description">{children}</dd>
    </div>
  )
}

DescriptionList.Item = DescriptionItem
