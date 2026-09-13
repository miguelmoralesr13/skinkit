import {
  createContext,
  useContext,
  useId,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

interface RadioCardCtx {
  name: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}
const RadioCardContext = createContext<RadioCardCtx | null>(null)

export type RadioCardTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface RadioCardGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  label?: string
  /** Color de la tarjeta seleccionada (del theme). 'primary' (default) no emite data-tone. */
  tone?: RadioCardTone
}

/**
 * RadioCardGroup headless — grupo de opciones donde cada una es una TARJETA seleccionable
 * (planes, métodos de pago). Compuesto: <RadioCardGroup> con <RadioCard>. Selección única
 * nativa (radios ocultos). La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="radio-card-group"]   raíz (role=radiogroup)
 *   [data-sk="radio-card"] [data-state]  cada tarjeta (checked|unchecked)
 */
export function RadioCardGroup({
  name,
  value,
  defaultValue,
  disabled,
  onValueChange,
  label: labelProp,
  tone = 'primary',
  className,
  children,
  ...rest
}: RadioCardGroupProps) {
  const m = useSkinkitMessages()
  const label = labelProp ?? m.radioCardGroup.label
  const autoName = useId()
  const ctx: RadioCardCtx = {
    name: name ?? autoName,
    value,
    defaultValue,
    disabled,
    onValueChange,
  }

  return (
    <div
      data-sk="radio-card-group"
      data-tone={tone === 'primary' ? undefined : tone}
      role="radiogroup"
      aria-label={label}
      className={cx('sk-radio-card-group', className)}
      {...rest}
    >
      <RadioCardContext.Provider value={ctx}>{children}</RadioCardContext.Provider>
    </div>
  )
}

export interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title'> {
  value: string
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
}

/**
 * Contrato de <RadioCard>:
 *   [data-sk="radio-card"]   [data-state]  raíz (<label>)
 *   [data-part="control"]    el <input type=radio> (el CSS lo oculta)
 *   [data-part="icon"]       ícono opcional
 *   [data-part="title"]      título
 *   [data-part="description"] descripción opcional
 *   [data-part="indicator"]  marca de selección
 */
export function RadioCard({
  value,
  title,
  description,
  icon,
  className,
  name,
  disabled,
  onChange,
  ...rest
}: RadioCardProps) {
  const group = useContext(RadioCardContext)
  const isControlled = group?.value !== undefined
  const checked = isControlled ? group!.value === value : undefined

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    if (e.target.checked) group?.onValueChange?.(value)
  }

  return (
    <label
      data-sk="radio-card"
      data-state={checked ? 'checked' : 'unchecked'}
      className={cx('sk-radio-card', className)}
    >
      <input
        type="radio"
        data-part="control"
        value={value}
        name={name ?? group?.name}
        disabled={disabled ?? group?.disabled}
        checked={checked}
        defaultChecked={!isControlled ? group?.defaultValue === value : undefined}
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
