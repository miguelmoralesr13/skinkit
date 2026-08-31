import type { FormHTMLAttributes, ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { Responsive } from '../../lib/responsive'

/** Valores del formulario (objeto arbitrario, con anidados). */
export type FormValues = Record<string, unknown>

/** Tipos de campo soportados (mapean a un componente de skinkit). */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'radio-card'
  | 'slider'
  | 'combobox'
  | 'multiselect'
  | 'tags'
  | 'pin'
  | 'date'
  | 'object' // subformulario anidado
  | 'array' // lista de subformularios

export interface FieldOption {
  value: string
  label: string
}

/**
 * Condición evaluada contra el contexto (valores del form ∪ externalValues). Referenciás un campo
 * interno con `field` (path con punto) o un valor externo con `external`, y un operador.
 * Componibles con and/or/not.
 */
export type Condition =
  | { field: string; eq: unknown }
  | { field: string; neq: unknown }
  | { field: string; in: unknown[] }
  | { field: string; gt: number }
  | { field: string; gte: number }
  | { field: string; lt: number }
  | { field: string; lte: number }
  | { field: string; truthy: boolean }
  | { field: string; matches: string }
  | { external: string; eq: unknown }
  | { external: string; neq: unknown }
  | { external: string; in: unknown[] }
  | { external: string; truthy: boolean }
  | { and: Condition[] }
  | { or: Condition[] }
  | { not: Condition }

/** Una regla de validación, opcionalmente activa sólo cuando `when` se cumple (validación dinámica). */
export interface ValidationRule {
  /** Tipo de regla. */
  type:
    | 'required'
    | 'min' // número: valor mínimo
    | 'max' // número: valor máximo
    | 'minLength'
    | 'maxLength'
    | 'pattern' // regex (string)
    | 'email'
    | 'url'
  /** Valor de la regla (según el tipo). */
  value?: number | string
  /** Mensaje de error. */
  message?: string
  /** Si se pasa, la regla sólo aplica cuando la condición es verdadera. */
  when?: Condition
}

export interface FieldConfig {
  /** Nombre/clave del campo (relativo a su grupo). Path final con punto para anidados. */
  name: string
  type: FieldType
  label?: ReactNode
  placeholder?: string
  helper?: ReactNode
  /** Opciones para select/radio/radio-card/combobox/multiselect. */
  options?: FieldOption[]
  /** Columnas que ocupa en la grilla del form (responsive). */
  colSpan?: Responsive<number>
  /** Valor inicial. */
  defaultValue?: unknown
  /** Deshabilitado (fijo o condicional). */
  disabled?: boolean | Condition
  /** Se muestra sólo si la condición es verdadera; oculto ⇒ no se valida. */
  visibleWhen?: Condition
  /** Reglas de validación (se compilan a Zod). */
  validation?: ValidationRule[]
  /** Props extra según el tipo (min/max/step del slider/number, length del pin, etc.). */
  min?: number
  max?: number
  step?: number
  rows?: number
  /** Clase adicional para ESTE campo (aditiva, no reemplaza la clase base del componente renderizado). */
  className?: string

  // ── anidados ──
  /** type 'object': campos del subformulario. */
  fields?: FieldConfig[]
  /** type 'array': campos de cada item. */
  itemFields?: FieldConfig[]
  minItems?: number
  maxItems?: number
  addLabel?: string
  removeLabel?: string
}

export interface FormConfig {
  fields: FieldConfig[]
  /** Columnas de la grilla del formulario (responsive). Default 1. */
  cols?: Responsive<number>
  /** Separación de la grilla (token de espacio). Default 4. */
  gap?: number
}

/** Clases adicionales por sub-parte de DynamicForm (aditivas, no reemplazan las clases base). */
export interface DynamicFormClassNames {
  /** El contenedor Grid que envuelve todos los campos (`[data-part="fields"]`). */
  fields?: string
  /** La barra de acciones al pie (`[data-part="actions"]`). */
  actions?: string
}

export interface DynamicFormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
  /** Configuración del formulario (JSON). */
  schema: FormConfig
  /** Se llama con los valores validados al enviar. */
  onSubmit?: (values: FormValues) => void | Promise<void>
  /** Valores iniciales (además de los defaultValue de cada campo). */
  defaultValues?: FormValues
  /** Contexto externo para condiciones (`{ external: 'plan' }`), ej. plan del usuario, rol, etc. */
  externalValues?: Record<string, unknown>
  /** Instancia externa de react-hook-form. Si se omite, el DynamicForm crea la suya. */
  form?: UseFormReturn<FormValues>
  /** Texto del botón de envío. Si es null, no se renderiza el botón (form externo maneja submit). */
  submitLabel?: ReactNode
  /** Contenido extra en la barra de acciones (ej. un botón "Cancelar"). */
  actions?: ReactNode
  /** Clases adicionales por sub-parte (fields/actions). Cada campo tiene además su propio `className` en el schema. */
  classNames?: DynamicFormClassNames
}
