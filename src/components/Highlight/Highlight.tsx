import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type HighlightTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
  /** Texto completo. */
  text: string
  /** Subcadena(s) a resaltar (una string o varias). */
  query: string | string[]
  /** Color del resaltador (del theme). 'primary' (default) no emite data-tone. */
  tone?: HighlightTone
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlight headless — resalta las coincidencias de `query` dentro de `text` (resultados de
 * búsqueda). Envuelve cada match en <mark data-part="match">. Case-insensitive. El color del
 * resaltado lo da el skin.
 *
 * Contrato:
 *   [data-sk="highlight"]   raíz (<span>)
 *   [data-part="match"]     cada coincidencia (<mark>)
 */
export const Highlight = forwardRef<HTMLSpanElement, HighlightProps>(function Highlight(
  { text, query, tone = 'primary', className, ...rest },
  ref,
) {
  const terms = (Array.isArray(query) ? query : [query]).map((t) => t.trim()).filter(Boolean)

  let parts: ReactNode[]
  if (terms.length === 0) {
    parts = [text]
  } else {
    const re = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
    parts = text.split(re).map((chunk, i) =>
      i % 2 === 1 ? (
        <mark data-part="match" key={i}>
          {chunk}
        </mark>
      ) : (
        chunk
      ),
    )
  }

  return (
    <span
      ref={ref}
      data-sk="highlight"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-highlight', className)}
      {...rest}
    >
      {parts}
    </span>
  )
})
