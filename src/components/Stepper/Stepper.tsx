import { Check } from 'lucide-react'
import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepState = 'complete' | 'current' | 'upcoming'
export type StepperTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  /** Índice del paso actual (0-based). */
  active?: number
  orientation?: StepperOrientation
  /** Color de los pasos activos/completos (del theme). 'primary' (default) no emite data-tone. */
  tone?: StepperTone
}

/**
 * Stepper headless, compuesto: <Stepper> · <Stepper.Step>. Indica el progreso en un flujo de
 * pasos. Stepper calcula el estado de cada Step según `active`; la forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="stepper"]     [data-orientation]   raíz (<ol>)
 *   [data-part="step"]      [data-state]         cada paso (complete|current|upcoming)
 *   [data-part="marker"]                          círculo con número o ícono Check
 *   [data-part="label"]                           texto del paso
 *   [data-part="connector"]                       línea entre pasos
 */
export function Stepper({
  active = 0,
  orientation = 'horizontal',
  tone = 'primary',
  className,
  children,
  ...rest
}: StepperProps) {
  const steps = Children.toArray(children)
  return (
    <ol
      data-sk="stepper"
      data-orientation={orientation}
      data-tone={tone === 'primary' ? undefined : tone}
      className={cx('sk-stepper', className)}
      {...rest}
    >
      {steps.map((child, i) => {
        if (!isValidElement<StepProps>(child)) return child
        const state: StepState = i < active ? 'complete' : i === active ? 'current' : 'upcoming'
        return cloneElement(child, { _state: state, _index: i })
      })}
    </ol>
  )
}

export interface StepProps extends HTMLAttributes<HTMLLIElement> {
  label?: ReactNode
  /** @internal — lo inyecta <Stepper>. */
  _state?: StepState
  /** @internal — lo inyecta <Stepper>. */
  _index?: number
}

function Step({ label, _state = 'upcoming', _index, className, children, ...rest }: StepProps) {
  return (
    <li
      data-part="step"
      data-state={_state}
      className={cx('sk-stepper__step', className)}
      aria-current={_state === 'current' ? 'step' : undefined}
      {...rest}
    >
      <span data-part="connector" aria-hidden="true" />
      <span data-part="marker">
        {_state === 'complete' ? <Check size={14} /> : _index != null ? _index + 1 : null}
      </span>
      <span data-part="label">{label ?? children}</span>
    </li>
  )
}

Stepper.Step = Step
