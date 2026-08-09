import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

export type BlockquoteTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface BlockquoteProps extends HTMLAttributes<HTMLElement> {
  /** Autor / fuente de la cita. */
  author?: ReactNode
  /** URL de la fuente (atributo cite del <blockquote>). */
  cite?: string
  /** Color de la barra de acento (del theme). 'primary' (default) no emite data-tone. */
  tone?: BlockquoteTone
}

/**
 * Blockquote headless — cita en bloque con autor/fuente opcional. Semántica <figure> +
 * <blockquote> + <figcaption>. La forma (barra, comillas, tipografía) la da el skin.
 *
 * Contrato:
 *   [data-sk="blockquote"]   raíz (<figure>)
 *   [data-part="quote"]      la cita (<blockquote>)
 *   [data-part="author"]     autor/fuente (<figcaption>, opcional)
 */
export const Blockquote = forwardRef<HTMLElement, BlockquoteProps>(function Blockquote(
  { author, cite, tone = 'primary', className, children, ...rest },
  ref,
) {
  return (
    <figure
      ref={ref}
      data-sk="blockquote"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-blockquote', className)}
      {...rest}
    >
      <blockquote data-part="quote" cite={cite}>
        {children}
      </blockquote>
      {author != null ? (
        <figcaption data-part="author">{author}</figcaption>
      ) : null}
    </figure>
  )
})
