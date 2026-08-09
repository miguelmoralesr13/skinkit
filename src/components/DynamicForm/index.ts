export { DynamicForm } from './DynamicForm'
export { buildZodSchema } from './zod-builder'
export { evaluateCondition, getPath } from './conditions'
export type { ConditionContext } from './conditions'
export type {
  DynamicFormProps,
  FormConfig,
  FieldConfig,
  FieldType,
  FieldOption,
  Condition,
  ValidationRule,
  FormValues,
} from './types'
// El spec NO se re-exporta acá; se registra en src/catalog/index.ts.
