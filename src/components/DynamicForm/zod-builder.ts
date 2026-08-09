import { z } from 'zod'
import { evaluateCondition, type ConditionContext } from './conditions'
import type { FieldConfig, ValidationRule } from './types'

/** Reglas activas: las que no tienen `when` o cuyo `when` se cumple en el contexto actual. */
function activeRules(field: FieldConfig, ctx: ConditionContext): ValidationRule[] {
  return (field.validation ?? []).filter((r) => !r.when || evaluateCondition(r.when, ctx))
}

/** '' o null/undefined → undefined (para que los opcionales no fallen con string vacío). */
const emptyToUndef = (v: unknown) => (v === '' || v == null ? undefined : v)

function stringSchema(rules: ValidationRule[], required: boolean, requiredMsg?: string): z.ZodType {
  let s = z.string()
  for (const r of rules) {
    if (r.type === 'minLength') s = s.min(Number(r.value), r.message)
    else if (r.type === 'maxLength') s = s.max(Number(r.value), r.message)
    else if (r.type === 'pattern') s = s.regex(new RegExp(String(r.value)), r.message)
    else if (r.type === 'email') s = s.email(r.message)
    else if (r.type === 'url') s = s.url(r.message)
  }
  if (required) return s.min(1, requiredMsg ?? 'Requerido')
  // opcional: string vacío se trata como ausente
  return z.preprocess(emptyToUndef, s.optional())
}

function numberSchema(rules: ValidationRule[], required: boolean): z.ZodType {
  let n = z.coerce.number({ message: 'Debe ser un número' })
  for (const r of rules) {
    if (r.type === 'min') n = n.min(Number(r.value), r.message)
    else if (r.type === 'max') n = n.max(Number(r.value), r.message)
  }
  if (required) return z.preprocess(emptyToUndef, n)
  return z.preprocess(emptyToUndef, n.optional())
}

function arraySchema(rules: ValidationRule[], required: boolean, requiredMsg?: string): z.ZodType {
  let a = z.array(z.string())
  if (required) a = a.min(1, requiredMsg ?? 'Elegí al menos una opción')
  for (const r of rules) {
    if (r.type === 'minLength') a = a.min(Number(r.value), r.message)
    else if (r.type === 'maxLength') a = a.max(Number(r.value), r.message)
  }
  return required ? a : a.optional()
}

function fieldSchema(field: FieldConfig, ctx: ConditionContext): z.ZodType {
  const rules = activeRules(field, ctx)
  const requiredRule = rules.find((r) => r.type === 'required')
  const required = !!requiredRule
  const reqMsg = requiredRule?.message

  switch (field.type) {
    case 'number':
    case 'slider':
      return numberSchema(rules, required)

    case 'checkbox':
    case 'switch':
      return required
        ? z.boolean().refine((v) => v === true, { message: reqMsg ?? 'Requerido' })
        : z.boolean().optional()

    case 'multiselect':
    case 'tags':
      return arraySchema(rules, required, reqMsg)

    case 'object':
      return buildZodSchema(field.fields ?? [], ctx)

    case 'array': {
      const item = buildZodSchema(field.itemFields ?? [], ctx)
      let arr = z.array(item)
      if (field.minItems != null) arr = arr.min(field.minItems, reqMsg)
      if (field.maxItems != null) arr = arr.max(field.maxItems)
      return required && field.minItems == null ? arr.min(1, reqMsg ?? 'Agregá al menos uno') : arr
    }

    default:
      // text/email/password/textarea/date/pin/radio/radio-card/select/combobox
      return stringSchema(rules, required, reqMsg)
  }
}

/**
 * Construye un `z.object` desde los campos, según el contexto actual (valores + externos).
 * - Los campos ocultos (`visibleWhen` falso) se OMITEN → no se validan.
 * - Las reglas con `when` sólo aplican si la condición se cumple → validación dinámica.
 */
export function buildZodSchema(fields: FieldConfig[], ctx: ConditionContext): z.ZodObject {
  const shape: Record<string, z.ZodType> = {}
  for (const field of fields) {
    if (field.visibleWhen && !evaluateCondition(field.visibleWhen, ctx)) continue
    shape[field.name] = fieldSchema(field, ctx)
  }
  return z.object(shape)
}
