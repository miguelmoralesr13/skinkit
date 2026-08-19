import { type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type TimelineItemTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
export type TimelineAlign = 'left' | 'right' | 'alternate'

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** Dónde va la línea: left (default), right (espejo) o alternate (zigzag). */
  align?: TimelineAlign
}

/**
 * Timeline headless, compuesto: <Timeline> · <Timeline.Item>. Lista vertical de eventos con
 * markers y línea conectora. La forma (marker, línea) la da el CSS.
 *
 * Contrato:
 *   [data-sk="timeline"]  [data-align]   raíz (<ol>) · left | right | alternate
 *   [data-part="item"]          cada evento (<li>) · [data-tone]
 *   [data-part="marker"]        punto/ícono del evento
 *   [data-part="connector"]     línea al evento siguiente
 *   [data-part="content"]       columna de texto
 *   [data-part="title"]         título del evento
 *   [data-part="time"]          marca temporal (opcional)
 */
export function Timeline({ align = 'left', className, children, ...rest }: TimelineProps) {
  return (
    <ol data-sk="timeline" data-align={align} className={cx('sk-timeline', className)} {...rest}>
      {children}
    </ol>
  )
}

export interface TimelineItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title?: ReactNode
  time?: ReactNode
  /** Ícono dentro del marker (si no, el CSS dibuja un punto). */
  marker?: ReactNode
  tone?: TimelineItemTone
}

function TimelineItem({
  title,
  time,
  marker,
  tone = 'default',
  className,
  children,
  ...rest
}: TimelineItemProps) {
  return (
    <li
      data-part="item"
      data-tone={tone}
      className={cx('sk-timeline__item', className)}
      {...rest}
    >
      <span data-part="connector" aria-hidden="true" />
      <span data-part="marker" aria-hidden="true">
        {marker}
      </span>
      <div data-part="content">
        {title != null || time != null ? (
          <div data-part="head">
            {title != null ? <span data-part="title">{title}</span> : null}
            {time != null ? <span data-part="time">{time}</span> : null}
          </div>
        ) : null}
        {children}
      </div>
    </li>
  )
}

Timeline.Item = TimelineItem
