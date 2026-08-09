import { useCallback, useMemo, useRef, type ReactNode } from 'react'
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldArrayPath,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cx } from '../../lib/cx'
import { Button } from '../Button'
import { Fieldset } from '../Fieldset'
import { Grid } from '../Grid'
import { evaluateCondition, type ConditionContext } from './conditions'
import { FieldRenderer } from './FieldRenderer'
import type { DynamicFormProps, FieldConfig, FormValues } from './types'
import { buildZodSchema } from './zod-builder'

function defaultForType(type: FieldConfig['type']): unknown {
  if (type === 'checkbox' || type === 'switch') return false
  if (type === 'multiselect' || type === 'tags') return []
  if (type === 'number' || type === 'slider') return undefined
  return ''
}

/** Valores iniciales desde la config (recursivo) + los provistos por prop. */
function buildDefaults(fields: FieldConfig[], provided?: FormValues): FormValues {
  const out: FormValues = {}
  for (const f of fields) {
    const given = provided?.[f.name]
    if (f.type === 'object') out[f.name] = buildDefaults(f.fields ?? [], given as FormValues)
    else if (f.type === 'array') out[f.name] = (given as unknown[]) ?? []
    else out[f.name] = given ?? f.defaultValue ?? defaultForType(f.type)
  }
  return out
}

type RenderField = (field: FieldConfig, prefix: string) => ReactNode

/** Item de un array: necesita su propio useFieldArray, por eso es un componente aparte. */
function ArrayField({
  field,
  name,
  control,
  disabled,
  cols,
  gap,
  renderField,
}: {
  field: FieldConfig
  name: string
  control: Control<FormValues>
  disabled: boolean
  cols: DynamicFormProps['schema']['cols']
  gap?: number
  renderField: RenderField
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as FieldArrayPath<FormValues>,
  })
  const atMax = field.maxItems != null && fields.length >= field.maxItems

  return (
    <Grid.Item colSpan={field.colSpan ?? 12}>
      <Fieldset legend={field.label} disabled={disabled} data-part="array">
        {fields.map((item, i) => (
          <div data-part="array-item" key={item.id}>
            <Grid cols={cols} gap={gap} alignItems="start">
              {(field.itemFields ?? []).map((sub) => renderField(sub, `${name}.${i}`))}
            </Grid>
            <div data-part="array-item-actions">
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
                {field.removeLabel ?? 'Quitar'}
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outlined"
          size="sm"
          disabled={disabled || atMax}
          onClick={() => append(buildDefaults(field.itemFields ?? []) as never)}
        >
          {field.addLabel ?? 'Agregar'}
        </Button>
      </Fieldset>
    </Grid.Item>
  )
}

/**
 * DynamicForm — formulario generado desde JSON, sobre react-hook-form + Zod.
 *
 * - Autónomo por defecto (crea useForm + resolver Zod) o con un `form` externo.
 * - Validación con Zod, DINÁMICA: el schema se reconstruye en cada validación según los valores
 *   (reglas con `when`) y los campos ocultos (`visibleWhen`) no se validan.
 * - Mostrar/ocultar y habilitar/deshabilitar por condición (valores internos o `externalValues`).
 * - Grilla configurable (Grid), subformularios (`type:'object'`) y listas (`type:'array'`).
 *
 * Headless: compone componentes ya skineados + Grid; sólo agrega chrome mínimo ([data-sk=dynamic-form]).
 */
export function DynamicForm({
  schema,
  onSubmit,
  defaultValues,
  externalValues,
  form: externalForm,
  submitLabel,
  actions,
  className,
  ...rest
}: DynamicFormProps) {
  // refs para que el resolver sea estable pero siempre lea la config/externos actuales
  const fieldsRef = useRef(schema.fields)
  fieldsRef.current = schema.fields
  const externalRef = useRef(externalValues)
  externalRef.current = externalValues

  const resolver = useCallback<Resolver<FormValues>>((values, context, options) => {
    const zSchema = buildZodSchema(fieldsRef.current, { values, external: externalRef.current })
    return zodResolver(zSchema)(values, context, options)
  }, [])

  // valores iniciales una sola vez (la config es estática)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValues = useMemo(() => buildDefaults(schema.fields, defaultValues), [])

  const internalForm = useForm<FormValues>({ defaultValues: initialValues, resolver, mode: 'onBlur' })
  const form = externalForm ?? internalForm

  const watched = useWatch({ control: form.control })
  const ctx: ConditionContext = {
    values: (watched as FormValues) ?? form.getValues(),
    external: externalValues,
  }

  const renderField: RenderField = (field, prefix) => {
    const name = prefix ? `${prefix}.${field.name}` : field.name

    if (field.visibleWhen && !evaluateCondition(field.visibleWhen, ctx)) return null

    const disabled =
      typeof field.disabled === 'boolean'
        ? field.disabled
        : field.disabled
          ? evaluateCondition(field.disabled, ctx)
          : false

    if (field.type === 'object') {
      return (
        <Grid.Item key={name} colSpan={field.colSpan ?? 12}>
          <Fieldset legend={field.label} disabled={disabled}>
            <Grid cols={schema.cols} gap={schema.gap} alignItems="start">
              {(field.fields ?? []).map((sub) => renderField(sub, name))}
            </Grid>
          </Fieldset>
        </Grid.Item>
      )
    }

    if (field.type === 'array') {
      return (
        <ArrayField
          key={name}
          field={field}
          name={name}
          control={form.control}
          disabled={disabled}
          cols={schema.cols}
          gap={schema.gap}
          renderField={renderField}
        />
      )
    }

    // checkbox/switch: fila completa por defecto (no quedan "a ras" de inputs con label arriba)
    const isBool = field.type === 'checkbox' || field.type === 'switch'
    return (
      <Grid.Item key={name} colSpan={field.colSpan ?? (isBool ? 12 : undefined)}>
        <FieldRenderer field={field} name={name} control={form.control} disabled={disabled} />
      </Grid.Item>
    )
  }

  const submit = form.handleSubmit((values) => onSubmit?.(values))

  return (
    <form
      data-sk="dynamic-form"
      className={cx('sk-dynamic-form', className)}
      onSubmit={submit}
      noValidate
      {...rest}
    >
      <Grid cols={schema.cols} gap={schema.gap} alignItems="start" data-part="fields">
        {schema.fields.map((f) => renderField(f, ''))}
      </Grid>

      {submitLabel !== null && (
        <div data-part="actions">
          {actions}
          <Button type="submit">{submitLabel ?? 'Enviar'}</Button>
        </div>
      )}
    </form>
  )
}
