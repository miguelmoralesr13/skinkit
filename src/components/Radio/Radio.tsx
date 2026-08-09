import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

interface RadioGroupCtx {
  name: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}
const RadioGroupContext = createContext<RadioGroupCtx | null>(null)

export type RadioTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** name compartido por todos los radios (autogenerado si no se pasa). */
  name?: string
  /** Color de selección (del theme) para todos los radios del grupo. */
  tone?: RadioTone
  /** Valor seleccionado (controlado). */
  value?: string
  /** Valor inicial (uncontrolled). */
  defaultValue?: string
  /** Deshabilita todos los radios del grupo. */
  disabled?: boolean
  /** Callback con el value del radio elegido. */
  onValueChange?: (value: string) => void
}

/**
 * RadioGroup headless. Agrupa <Radio> bajo un mismo `name` — la selección única y la
 * navegación por flechas las da el grupo nativo del navegador; el grupo solo cablea
 * name/valor y expone role="radiogroup".
 *
 * Contrato:
 *   [data-sk="radio-group"]   raíz (role=radiogroup)
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { name, value, defaultValue, disabled, onValueChange, tone = 'primary', className, children, ...rest },
  ref,
) {
  const autoName = useId()
  const ctx: RadioGroupCtx = {
    name: name ?? autoName,
    value,
    defaultValue,
    disabled,
    onValueChange,
  }

  return (
    <div
      ref={ref}
      data-sk="radio-group"
      data-tone={tone === 'primary' ? undefined : tone}
      role="radiogroup"
      className={cx('sk-radio-group', className)}
      {...rest}
    >
      <RadioGroupContext.Provider value={ctx}>{children}</RadioGroupContext.Provider>
    </div>
  )
})

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Valor de este radio; requerido dentro de un RadioGroup. */
  value: string
  /** Texto junto al control. */
  label?: ReactNode
  /** Color de selección (del theme) para este radio suelto. Dentro de RadioGroup usá su `tone`. */
  tone?: RadioTone
}

/**
 * Radio headless (una opción). Dentro de un <RadioGroup> toma name/checked del grupo;
 * suelto, funciona con props nativas. El skin oculta el input y pinta el `box`/`indicator`.
 *
 * Contrato:
 *   [data-sk="radio"]        raíz (<label>)
 *   [data-part="control"]    el <input type=radio> (el skin lo oculta visualmente)
 *   [data-part="box"]        círculo/caja visual
 *   [data-part="indicator"]  punto de selección
 *   [data-part="label"]      texto
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, tone = 'primary', className, name, disabled, onChange, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext)
  const isControlled = group?.value !== undefined

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    if (e.target.checked) group?.onValueChange?.(value)
  }

  return (
    <label
      data-sk="radio"
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-radio', className)}
    >
      <input
        ref={ref}
        type="radio"
        data-part="control"
        value={value}
        name={name ?? group?.name}
        disabled={disabled ?? group?.disabled}
        checked={isControlled ? group!.value === value : undefined}
        defaultChecked={!isControlled ? group?.defaultValue === value : undefined}
        onChange={handleChange}
        {...rest}
      />
      <span data-part="box" aria-hidden="true">
        <span data-part="indicator" />
      </span>
      {label ? <span data-part="label">{label}</span> : null}
    </label>
  )
})
