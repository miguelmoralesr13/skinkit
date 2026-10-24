import { forwardRef, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { Toggle, type ToggleSize, type ToggleTone } from '../Toggle'

export interface ChipGroupOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'role'> {
  /** Nombre accesible del grupo (aria-label). */
  label: string
  options: ChipGroupOption[]
  /** Valores elegidos (controlado). */
  value: string[]
  onValueChange: (next: string[]) => void
  /** Varias a la vez. Si es false, siempre hay exactamente una elegida. */
  multiple?: boolean
  size?: ToggleSize
  tone?: ToggleTone
}

/**
 * ChipGroup headless — selección con botones en forma de píldora (tipo de escuela, niveles, filtros).
 * Cada chip es un Toggle (aria-pressed). Con `multiple` se pueden elegir varias; sin él, elegir una
 * reemplaza a la anterior y no se puede quedar sin selección.
 *
 * Contrato:
 *   [data-sk="chip-group"] [data-mode]   raíz, role="group" (single|multiple)
 *   [data-part="chip"]                   cada Toggle ([data-state] on|off)
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
  { label, options, value, onValueChange, multiple = false, size, tone, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      data-sk="chip-group"
      data-mode={multiple ? 'multiple' : 'single'}
      className={cx('sk-chip-group', className)}
      {...rest}
    >
      {options.map((o) => {
        const on = value.includes(o.value)
        return (
          <Toggle
            key={o.value}
            data-part="chip"
            pressed={on}
            size={size}
            tone={tone}
            disabled={o.disabled}
            onPressedChange={(pressed) => {
              if (!multiple) return onValueChange([o.value])
              onValueChange(pressed ? [...value, o.value] : value.filter((v) => v !== o.value))
            }}
          >
            {o.label}
          </Toggle>
        )
      })}
    </div>
  )
})
