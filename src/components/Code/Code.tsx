import { Check, Copy } from 'lucide-react'
import { useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { highlight } from './highlight'

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** Bloque multilínea (<pre>) en vez de inline (<code>). */
  block?: boolean
  /** En bloque: muestra un botón de copiar. */
  copyable?: boolean
  /**
   * Lenguaje para resaltar sintaxis (JS/TS por defecto; "bash"/"py"/"yaml" para comentarios #).
   * Solo aplica en bloque y con children de tipo string. Los colores salen del theme.
   */
  lang?: string
}

/**
 * Code headless — muestra código, inline (<code>) o en bloque (<pre>). En bloque puede
 * incluir un botón de copiar (usa el texto del propio bloque). La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="code"]   [data-block]   raíz (<code> inline, o <pre> en bloque)
 *   [data-part="content"]             el <code> dentro del <pre> (solo en bloque)
 *   [data-part="copy"]  [data-copied] botón de copiar (si copyable)
 */
export function Code({ block, copyable, lang, className, children, ...rest }: CodeProps) {
  const contentRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  if (!block) {
    return (
      <code data-sk="code" className={cx('sk-code', className)} {...rest}>
        {children as ReactNode}
      </code>
    )
  }

  // Resalta solo si hay lenguaje y el contenido es texto plano.
  const body: ReactNode =
    lang != null && typeof children === 'string' ? highlight(children, lang) : (children as ReactNode)

  const copy = () => {
    const text = contentRef.current?.textContent ?? ''
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <pre data-sk="code" data-block="" className={cx('sk-code', className)} {...rest}>
      <code data-part="content" ref={contentRef}>
        {body}
      </code>
      {copyable ? (
        <button
          type="button"
          data-part="copy"
          data-copied={copied ? '' : undefined}
          aria-label={copied ? 'Copiado' : 'Copiar'}
          onClick={copy}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      ) : null}
    </pre>
  )
}
