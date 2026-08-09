import { useRef, type HTMLAttributes, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'

export type ToolbarOrientation = 'horizontal' | 'vertical'

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ToolbarOrientation
  label?: string
}

const FOCUSABLE =
  'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Toolbar headless — agrupa controles (Button, Toggle, ButtonGroup…) con role="toolbar" y
 * navegación por flechas entre ellos. La forma la da el skin. Opcional: <Toolbar.Separator>.
 *
 * Contrato:
 *   [data-sk="toolbar"]        [data-orientation]  raíz (role=toolbar)
 *   [data-part="separator"]                        divisor entre grupos (Toolbar.Separator)
 */
export function Toolbar({
  orientation = 'horizontal',
  label,
  className,
  children,
  onKeyDown,
  ...rest
}: ToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    if (![nextKey, prevKey, 'Home', 'End'].includes(e.key)) return

    const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
    if (items.length === 0) return
    const i = items.indexOf(document.activeElement as HTMLElement)
    let next = -1
    if (e.key === nextKey) next = i < 0 ? 0 : (i + 1) % items.length
    else if (e.key === prevKey) next = i < 0 ? items.length - 1 : (i - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    if (next < 0) return
    e.preventDefault()
    items[next]?.focus()
  }

  return (
    <div
      ref={rootRef}
      data-sk="toolbar"
      data-orientation={orientation}
      role="toolbar"
      aria-orientation={orientation}
      aria-label={label}
      className={cx('sk-toolbar', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLSpanElement> {}

function ToolbarSeparator({ className, ...rest }: ToolbarSeparatorProps) {
  return (
    <span
      data-part="separator"
      role="separator"
      aria-orientation="vertical"
      className={cx('sk-toolbar__separator', className)}
      {...rest}
    />
  )
}

Toolbar.Separator = ToolbarSeparator
