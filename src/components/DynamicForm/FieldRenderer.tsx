import { Controller, type Control, type FieldPath } from 'react-hook-form'
import { cx } from '../../lib/cx'
import { Input } from '../Input'
import { Textarea } from '../Textarea'
import { Select } from '../Select'
import { Checkbox } from '../Checkbox'
import { Switch } from '../Switch'
import { Slider } from '../Slider'
import { PasswordInput } from '../PasswordInput'
import { NumberInput } from '../NumberInput'
import { RadioGroup, Radio } from '../Radio'
import { Combobox } from '../Combobox'
import { MultiSelect } from '../MultiSelect'
import { TagInput } from '../TagInput'
import { PinInput } from '../PinInput'
import { RadioCardGroup, RadioCard } from '../RadioCardGroup'
import { DatePicker } from '../DatePicker'
import type { FieldConfig, FormValues } from './types'

export interface FieldRendererProps {
  field: FieldConfig
  /** Path completo (con punto) del campo en el form. */
  name: string
  control: Control<FormValues>
  disabled?: boolean
}

/**
 * Renderiza UN campo hoja (no object/array) vía <Controller>, normalizando las dos familias de
 * componentes de skinkit: wrappers nativos (onChange = evento) y widgets controlados (emiten valor).
 */
export function FieldRenderer({ field, name, control, disabled }: FieldRendererProps) {
  return (
    <Controller
      name={name as FieldPath<FormValues>}
      control={control}
      render={({ field: f, fieldState }) => {
        const errorMsg = fieldState.error?.message
        const helper = errorMsg ?? field.helper
        const hasError = !!errorMsg
        const opts = field.options ?? []
        const common = { label: field.label, disabled, id: name, className: field.className }

        switch (field.type) {
          case 'textarea':
            return (
              <Textarea
                {...common}
                helper={helper}
                error={hasError}
                placeholder={field.placeholder}
                rows={field.rows}
                value={(f.value as string) ?? ''}
                onChange={f.onChange}
                onBlur={f.onBlur}
                ref={f.ref}
              />
            )

          case 'password':
            return (
              <PasswordInput
                {...common}
                helper={helper}
                error={hasError}
                placeholder={field.placeholder}
                value={(f.value as string) ?? ''}
                onChange={f.onChange}
                onBlur={f.onBlur}
                ref={f.ref}
              />
            )

          case 'number':
            return (
              <NumberInput
                {...common}
                helper={helper}
                error={hasError}
                min={field.min}
                max={field.max}
                step={field.step}
                value={f.value as number | undefined}
                onChange={f.onChange}
              />
            )

          case 'slider':
            return (
              <Slider
                {...common}
                helper={helper}
                min={field.min}
                max={field.max}
                step={field.step}
                showValue
                value={(f.value as number | undefined) ?? field.min ?? 0}
                onChange={(e) => f.onChange(Number(e.target.value))}
                ref={f.ref}
              />
            )

          case 'select':
            return (
              <Select
                {...common}
                helper={helper}
                error={hasError}
                value={(f.value as string) ?? ''}
                onChange={f.onChange}
                onBlur={f.onBlur}
                ref={f.ref}
              >
                <option value="">{field.placeholder ?? 'Elegí…'}</option>
                {opts.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )

          case 'combobox':
            return (
              <Combobox
                {...common}
                helper={helper}
                error={hasError}
                placeholder={field.placeholder}
                options={opts}
                value={(f.value as string) ?? ''}
                onValueChange={f.onChange}
              />
            )

          case 'multiselect':
            return (
              <MultiSelect
                {...common}
                helper={helper}
                error={hasError}
                placeholder={field.placeholder}
                options={opts}
                value={(f.value as string[]) ?? []}
                onValueChange={f.onChange}
              />
            )

          case 'tags':
            return (
              <TagInput
                {...common}
                helper={helper}
                error={hasError}
                placeholder={field.placeholder}
                max={field.max}
                value={(f.value as string[]) ?? []}
                onChange={f.onChange}
              />
            )

          case 'pin':
            return (
              <PinInput
                label={field.label}
                disabled={disabled}
                className={field.className}
                helper={helper}
                error={hasError}
                length={field.max}
                value={(f.value as string) ?? ''}
                onChange={f.onChange}
              />
            )

          case 'date':
            return (
              <DatePicker
                {...common}
                helper={helper}
                error={hasError}
                placeholder={field.placeholder}
                value={(f.value as string) ?? ''}
                onChange={f.onChange}
              />
            )

          case 'checkbox':
            return (
              <div data-part="field" className={cx('sk-dynamic-form__field', field.className)}>
                <Checkbox
                  label={field.label}
                  disabled={disabled}
                  checked={!!f.value}
                  onChange={(e) => f.onChange(e.target.checked)}
                  ref={f.ref}
                />
                {hasError && <div data-part="field-error">{errorMsg}</div>}
              </div>
            )

          case 'switch':
            return (
              <div data-part="field" className={cx('sk-dynamic-form__field', field.className)}>
                <Switch
                  label={field.label}
                  disabled={disabled}
                  checked={!!f.value}
                  onChange={(e) => f.onChange(e.target.checked)}
                  ref={f.ref}
                />
                {hasError && <div data-part="field-error">{errorMsg}</div>}
              </div>
            )

          case 'radio':
            return (
              <div data-part="field" className={cx('sk-dynamic-form__field', field.className)}>
                {field.label && <div data-part="field-label">{field.label}</div>}
                <RadioGroup
                  value={(f.value as string) ?? ''}
                  onValueChange={f.onChange}
                  disabled={disabled}
                >
                  {opts.map((o) => (
                    <Radio key={o.value} value={o.value} label={o.label} />
                  ))}
                </RadioGroup>
                {hasError && <div data-part="field-error">{errorMsg}</div>}
              </div>
            )

          case 'radio-card':
            return (
              <div data-part="field" className={cx('sk-dynamic-form__field', field.className)}>
                {field.label && <div data-part="field-label">{field.label}</div>}
                <RadioCardGroup
                  value={(f.value as string) ?? ''}
                  onValueChange={f.onChange}
                  disabled={disabled}
                >
                  {opts.map((o) => (
                    <RadioCard key={o.value} value={o.value} title={o.label} />
                  ))}
                </RadioCardGroup>
                {hasError && <div data-part="field-error">{errorMsg}</div>}
              </div>
            )

          default:
            // text / email
            return (
              <Input
                {...common}
                helper={helper}
                error={hasError}
                type={field.type === 'email' ? 'email' : 'text'}
                placeholder={field.placeholder}
                value={(f.value as string) ?? ''}
                onChange={f.onChange}
                onBlur={f.onBlur}
                ref={f.ref}
              />
            )
        }
      }}
    />
  )
}
