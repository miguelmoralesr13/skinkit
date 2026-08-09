/**
 * Utilidades para props responsive de los componentes de layout.
 *
 * Un valor responsive es un valor plano (aplica en todos lados) o un objeto por breakpoint:
 *   cols={3}                      → 3 columnas siempre
 *   cols={{ base: 1, md: 2, lg: 3 }}  → 1, luego 2 desde 768px, 3 desde 1024px
 *
 * Los componentes NO estilan: sólo convierten estas props en CSS vars `${prefix}-<bp>`, y la
 * hoja base (styles/layout.css) las resuelve con media queries. Breakpoints:
 *   sm 40em (640px) · md 48em (768px) · lg 64em (1024px) · xl 80em (1280px)
 */
export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>

const BREAKPOINTS: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl']

function isResponsiveObject<T>(v: Responsive<T>): v is Partial<Record<Breakpoint, T>> {
  return typeof v === 'object' && v !== null
}

/** Transforma cada valor de una prop responsive conservando su forma (plano u objeto por bp). */
export function mapResponsive<T, U>(
  value: Responsive<T> | undefined,
  fn: (t: T) => U,
): Responsive<U> | undefined {
  if (value == null) return undefined
  if (isResponsiveObject(value)) {
    const out: Partial<Record<Breakpoint, U>> = {}
    for (const bp of BREAKPOINTS) {
      const v = value[bp]
      if (v != null) out[bp] = fn(v)
    }
    return out
  }
  return fn(value)
}

/** Convierte una prop responsive en un objeto de CSS vars `${prefix}-<bp>`. */
export function responsiveVars<T>(
  prefix: string,
  value: Responsive<T> | undefined,
): Record<string, string> {
  if (value == null) return {}
  const out: Record<string, string> = {}
  if (isResponsiveObject(value)) {
    for (const bp of BREAKPOINTS) {
      const v = value[bp]
      if (v != null) out[`${prefix}-${bp}`] = String(v)
    }
  } else {
    out[`${prefix}-base`] = String(value)
  }
  return out
}

/** Escala de espacio: número → token `--sk-sp-n`; string → tal cual (escape hatch). */
export function space(v: number | string | undefined): string | undefined {
  if (v == null) return undefined
  return typeof v === 'number' ? `var(--sk-sp-${v})` : v
}

/** Longitud CSS: número → px; string → tal cual. */
export function len(v: number | string | undefined): string | undefined {
  if (v == null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}
