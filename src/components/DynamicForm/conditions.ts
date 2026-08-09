import type { Condition } from './types'

/** Contexto contra el que se evalúan las condiciones: valores del form ∪ valores externos. */
export interface ConditionContext {
  /** Valores actuales del formulario (planos y anidados). */
  values: Record<string, unknown>
  /** Valores externos (prop externalValues del DynamicForm). */
  external?: Record<string, unknown>
}

/** Lee un path con punto (`address.city`) de un objeto anidado. */
export function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

function readOperand(cond: Condition, ctx: ConditionContext): unknown {
  if ('field' in cond) return getPath(ctx.values, cond.field)
  if ('external' in cond) return getPath(ctx.external ?? {}, cond.external)
  return undefined
}

/** Evalúa una condición contra el contexto. */
export function evaluateCondition(cond: Condition | undefined, ctx: ConditionContext): boolean {
  if (!cond) return true

  if ('and' in cond) return cond.and.every((c) => evaluateCondition(c, ctx))
  if ('or' in cond) return cond.or.some((c) => evaluateCondition(c, ctx))
  if ('not' in cond) return !evaluateCondition(cond.not, ctx)

  const actual = readOperand(cond, ctx)

  if ('eq' in cond) return actual === cond.eq
  if ('neq' in cond) return actual !== cond.neq
  if ('in' in cond) return cond.in.includes(actual)
  if ('truthy' in cond) return Boolean(actual) === cond.truthy
  if ('gt' in cond) return typeof actual === 'number' && actual > cond.gt
  if ('gte' in cond) return typeof actual === 'number' && actual >= cond.gte
  if ('lt' in cond) return typeof actual === 'number' && actual < cond.lt
  if ('lte' in cond) return typeof actual === 'number' && actual <= cond.lte
  if ('matches' in cond) return typeof actual === 'string' && new RegExp(cond.matches).test(actual)

  return true
}

/** Junta los paths de campos internos que una condición referencia (para saber qué observar). */
export function collectFields(cond: Condition | undefined, out: Set<string> = new Set()): Set<string> {
  if (!cond) return out
  if ('and' in cond) {
    cond.and.forEach((c) => collectFields(c, out))
  } else if ('or' in cond) {
    cond.or.forEach((c) => collectFields(c, out))
  } else if ('not' in cond) {
    collectFields(cond.not, out)
  } else if ('field' in cond) {
    out.add(cond.field)
  }
  return out
}
