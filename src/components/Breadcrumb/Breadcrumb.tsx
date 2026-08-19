import { type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** aria-label del nav. */
  label?: string
}

/**
 * Breadcrumb headless, compuesto: <Breadcrumb> · <Breadcrumb.Item>. Rastro de navegación
 * jerárquica. El separador entre ítems lo dibuja el CSS (::before), no el markup.
 *
 * Contrato:
 *   [data-sk="breadcrumb"]   raíz (<nav aria-label>)
 *   [data-part="list"]        <ol>
 *   [data-part="item"]        <li>  · [data-current] en el actual
 *   [data-part="link"]        <a> (ítems navegables)
 *   [data-part="current"]     <span> del ítem actual (aria-current="page")
 */
export function Breadcrumb({ label = 'Breadcrumb', className, children, ...rest }: BreadcrumbProps) {
  return (
    <nav
      data-sk="breadcrumb"
      aria-label={label}
      className={cx('sk-breadcrumb', className)}
      {...rest}
    >
      <ol data-part="list">{children}</ol>
    </nav>
  )
}

export interface BreadcrumbItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marca el ítem actual: se renderiza como texto (no enlace) con aria-current="page". */
  current?: boolean
  children: ReactNode
}

function BreadcrumbItem({ current, className, children, href, ...rest }: BreadcrumbItemProps) {
  return (
    <li data-part="item" data-current={current ? '' : undefined} className={cx('sk-breadcrumb__item', className)}>
      {current ? (
        <span data-part="current" aria-current="page">
          {children}
        </span>
      ) : (
        <a data-part="link" href={href} {...rest}>
          {children}
        </a>
      )}
    </li>
  )
}

Breadcrumb.Item = BreadcrumbItem
