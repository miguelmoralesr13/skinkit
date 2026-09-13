import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

export type CopyButtonTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Texto a copiar al portapapeles. */
  value: string
  /** Color de acento (borde/texto, del theme). 'primary' (default) no emite data-tone. */
  tone?: CopyButtonTone
  /** Contenido normal (default "Copiar"). */
  children?: ReactNode
  /** Contenido tras copiar (default "Copiado"). */
  copiedLabel?: ReactNode
  /** ms hasta volver al estado normal. */
  timeout?: number
}

/**
 * CopyButton headless — copia `value` al portapapeles y muestra feedback de "copiado".
 * La forma la da el CSS; el estado se expone en [data-copied].
 *
 * Contrato:
 *   [data-sk="copy-button"]   [data-copied]   raíz (el CSS puede cambiar el look al copiar)
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, children: childrenProp, copiedLabel: copiedLabelProp, timeout = 1500, tone = 'primary', className, onClick, type, ...rest },
  ref,
) {
  const m = useSkinkitMessages()
  const copiedLabel = copiedLabelProp ?? m.copyButton.copied
  const children = childrenProp ?? m.copyButton.copy
  const [copied, setCopied] = useState(false)

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      data-sk="copy-button"
      data-copied={copied ? '' : undefined}
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-copy-button', className)}
      onClick={(e) => {
        onClick?.(e)
        void navigator.clipboard?.writeText(value).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), timeout)
        })
      }}
      {...rest}
    >
      {copied ? copiedLabel : children}
    </button>
  )
})
