import {
  createContext,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useDismissable } from '../../lib/useDismissable'
import type { ButtonVariant, ButtonSize } from '../Button'
import { useSkinkitMessages } from '../../i18n/context'

interface SplitCtx {
  close: () => void
  itemClassName?: string
}
const SplitContext = createContext<SplitCtx | null>(null)

function useSplitCtx(part: string): SplitCtx {
  const ctx = useContext(SplitContext)
  if (!ctx) throw new Error(`skinkit: <SplitButton.${part}> debe usarse dentro de <SplitButton>`)
  return ctx
}

export type SplitButtonTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface SplitButtonClassNames {
  main?: string
  trigger?: string
  content?: string
  item?: string
}

export interface SplitButtonProps {
  /** Acción principal (botón grande). */
  onClick?: () => void
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  /** Color del botón (del theme). 'primary' (default) no emite data-tone. */
  tone?: SplitButtonTone
  disabled?: boolean
  /** Contenido del menú: <SplitButton.Item>. */
  menu?: ReactNode
  triggerLabel?: string
  className?: string
  /** Clases adicionales por parte interna (main/trigger/content/item). No reemplaza la clase base. */
  classNames?: SplitButtonClassNames
}

/**
 * SplitButton headless — acción principal + un dropdown con acciones secundarias.
 * Compuesto: <SplitButton menu={<><SplitButton.Item/>…</>}>. Sin portal; cierra con Esc /
 * click afuera / elegir. La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="split-button"]   [data-variant] [data-size]  raíz
 *   [data-part="main"]         botón de la acción principal
 *   [data-part="trigger"]      [data-state]  abre el menú
 *   [data-part="content"]      role=menu (solo abierto)
 *   [data-part="item"]         role=menuitem
 */
export function SplitButton({
  onClick,
  children,
  variant = 'filled',
  size = 'md',
  tone = 'primary',
  disabled,
  menu,
  triggerLabel: triggerLabelProp,
  className,
  classNames,
}: SplitButtonProps) {
  const m = useSkinkitMessages()
  const triggerLabel = triggerLabelProp ?? m.splitButton.moreActions
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const close = () => setOpen(false)
  useDismissable(open, rootRef, close)

  return (
    <div
      ref={rootRef}
      data-sk="split-button"
      data-variant={variant}
      data-size={size}
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-split-button', className)}
    >
      <button
        type="button"
        data-part="main"
        disabled={disabled}
        onClick={onClick}
        className={cx('sk-split-button__main', classNames?.main)}
      >
        {children}
      </button>
      <button
        type="button"
        data-part="trigger"
        data-state={open ? 'open' : 'closed'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cx('sk-split-button__trigger', classNames?.trigger)}
      >
        ▾
      </button>
      {open ? (
        <div data-part="content" role="menu" className={cx('sk-split-button__content', classNames?.content)}>
          <SplitContext.Provider value={{ close, itemClassName: classNames?.item }}>{menu}</SplitContext.Provider>
        </div>
      ) : null}
    </div>
  )
}

export interface SplitButtonItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onSelect?: () => void
}

function SplitButtonItem({ className, children, onSelect, onClick, ...rest }: SplitButtonItemProps) {
  const ctx = useSplitCtx('Item')
  return (
    <button
      type="button"
      data-part="item"
      role="menuitem"
      className={cx('sk-split-button__item', ctx.itemClassName, className)}
      onClick={(e) => {
        onClick?.(e)
        onSelect?.()
        ctx.close()
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

SplitButton.Item = SplitButtonItem
