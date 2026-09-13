import {
  createContext,
  useContext,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useControllable } from '../../lib/useControllable'

interface CheckboxCardCtx {
  value: string[]
  toggle: (value: string) => void
  disabled?: boolean
}
const CheckboxCardContext = createContext<CheckboxCardCtx | null>(null)

export type CheckboxCardTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface CheckboxCardGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Valores seleccionados (controlado). */
  value?: string[]
  /** Valores iniciales (uncontrolled). */
  defaultValue?: string[]
  disabled?: boolean
  onValueChange?: (value: string[]) => void
  label?: string
  /** Color de la tarjeta seleccionada (del theme). 'primary' (default) no emite data-tone. */
  tone?: CheckboxCardTone
  /** Columnas del grid (default 1). Emite --sk-checkbox-card-group-cols. */
  columns?: number
}

/**
 * CheckboxCardGroup headless — grupo de opciones donde cada una es una TARJETA seleccionable, con
 * selección MÚLTIPLE (gemelo de RadioCardGroup, que es single). Compuesto: <CheckboxCardGroup> con
 * <CheckboxCard title description icon>. Cada tarjeta envuelve un checkbox nativo (Space toggle,
 * Tab entre tarjetas). La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="checkbox-card-group"]  raíz (role=group) · [data-tone] · --sk-checkbox-card-group-cols
 *   [data-sk="checkbox-card"] [data-state]  cada tarjeta (checked|unchecked)
 */
export function CheckboxCardGroup({
  value,
  defaultValue = [],
  disabled,
  onValueChange,
  label = 'Opciones',
  tone = 'primary',
  columns,
  className,
  style,
  children,
  ...rest
}: CheckboxCardGroupProps) {
  const [selected, setSelected] = useControllable<string[]>(value, defaultValue, onValueChange)
  const toggle = (v: string) => {
    setSelected(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  }
  const ctx: CheckboxCardCtx = { value: selected, toggle, disabled }

  const mergedStyle: CSSProperties | undefined =
    columns != null ? ({ '--sk-checkbox-card-group-cols': columns, ...style } as CSSProperties) : style

  return (
    <div
      data-sk="checkbox-card-group"
      data-tone={tone === 'primary' ? undefined : tone}
      role="group"
      aria-label={label}
      className={cx('sk-checkbox-card-group', className)}
      style={mergedStyle}
      {...rest}
    >
      <CheckboxCardContext.Provider value={ctx}>{children}</CheckboxCardContext.Provider>
    </div>
  )
}

export interface CheckboxCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title'> {
  value: string
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
}

/**
 * Contrato de <CheckboxCard>:
 *   [data-sk="checkbox-card"]  [data-state]  raíz (<label>)
 *   [data-part="control"]      el <input type=checkbox> (el CSS lo oculta)
 *   [data-part="icon"]         ícono opcional
 *   [data-part="body"]         título + descripción
 *   [data-part="title"]        título
 *   [data-part="description"]  descripción opcional
 *   [data-part="indicator"]    marca de selección (checkbox)
 */
export function CheckboxCard({
  value,
  title,
  description,
  icon,
  className,
  disabled,
  onChange,
  ...rest
}: CheckboxCardProps) {
  const group = useContext(CheckboxCardContext)
  const checked = group ? group.value.includes(value) : false

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    group?.toggle(value)
  }

  return (
    <label
      data-sk="checkbox-card"
      data-state={checked ? 'checked' : 'unchecked'}
      className={cx('sk-checkbox-card', className)}
    >
      <input
        type="checkbox"
        data-part="control"
        value={value}
        disabled={disabled ?? group?.disabled}
        checked={checked}
        onChange={handleChange}
        {...rest}
      />
      {icon != null ? (
        <span data-part="icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span data-part="body">
        <span data-part="title">{title}</span>
        {description != null ? <span data-part="description">{description}</span> : null}
      </span>
      <span data-part="indicator" aria-hidden="true" />
    </label>
  )
}
