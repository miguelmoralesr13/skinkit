import { type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type ListTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Color del ítem activo (del theme). 'primary' (default) no emite data-tone. */
  tone?: ListTone
}

/**
 * List headless, compuesto: <List> · <List.Item>. Lista de filas con ícono/título/descripción/
 * meta, opcionalmente clickeables (activas). La forma la da el skin.
 *
 * Contrato:
 *   [data-sk="list"]        raíz (<ul>)
 *   [data-part="item"]      [data-active] [data-interactive]   cada fila (<li>)
 *   [data-part="icon"]      ícono
 *   [data-part="title"]     título
 *   [data-part="description"] descripción
 *   [data-part="meta"]      texto/acción a la derecha
 */
export function List({ tone = 'primary', className, children, ...rest }: ListProps) {
  return (
    <ul
      data-sk="list"
      role="list"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-list', className)}
      {...rest}
    >
      {children}
    </ul>
  )
}

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  /** Texto o acción a la derecha. */
  meta?: ReactNode
  active?: boolean
  /** Si se pasa, la fila es clickeable (foco + Enter). */
  onSelect?: () => void
}

function ListItem({
  icon,
  title,
  description,
  meta,
  active,
  onSelect,
  className,
  children,
  ...rest
}: ListItemProps) {
  const interactive = onSelect != null
  return (
    <li
      data-part="item"
      data-active={active ? '' : undefined}
      data-interactive={interactive ? '' : undefined}
      className={cx('sk-list__item', className)}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-current={active ? 'true' : undefined}
      onClick={interactive ? () => onSelect!() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect!()
              }
            }
          : undefined
      }
      {...rest}
    >
      {icon != null ? (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div data-part="content">
        {title != null ? <div data-part="title">{title}</div> : null}
        {description != null ? <div data-part="description">{description}</div> : null}
        {children}
      </div>
      {meta != null ? <div data-part="meta">{meta}</div> : null}
    </li>
  )
}

List.Item = ListItem
