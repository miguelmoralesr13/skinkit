// Extrae, en runtime, las variables CSS locales `--sk-{dataSk}[-{parte}]-{propiedad}` que
// declaró el componente seleccionado (ver src/styles/components/<dataSk>.css). No hay script de
// build ni archivo generado a propósito: siempre lee el .css real, nunca se puede desincronizar.
// Costo irrelevante — un archivo de ~15-80 líneas, parseado una vez por componente visitado.

export type ComponentVarProperty = 'bg' | 'fg' | 'border' | 'radius' | 'shadow'

export interface ComponentVarSpec {
  /** Nombre completo de la variable, ej. '--sk-button-bg'. */
  name: string
  /** [data-part] al que pertenece, o undefined si es del root [data-sk]. */
  part?: string
  property: ComponentVarProperty
  /** Valor tal cual declarado en el CSS (ej. 'var(--color-sk-primary)' o '14px'). */
  defaultRef: string
}

const PROPERTY_SUFFIXES: ComponentVarProperty[] = ['bg', 'fg', 'border', 'radius', 'shadow']

function inferProperty(varName: string): ComponentVarProperty | null {
  for (const suffix of PROPERTY_SUFFIXES) {
    if (varName.endsWith(`-${suffix}`)) return suffix
  }
  return null
}

interface RawDecl {
  selector: string
  prop: string
  value: string
}

/**
 * Parseo simple por líneas — no hace falta un AST completo: las reglas acá son planas, sin
 * anidamiento (@apply/color-mix/calc no anidan llaves). Trackea el selector del bloque actual y,
 * dentro de él, matchea declaraciones `--sk-...: valor;`.
 */
function parseDeclarations(css: string): RawDecl[] {
  const decls: RawDecl[] = []
  let depth = 0
  let selectorBuffer = ''
  let currentSelector = ''

  for (const rawLine of css.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('/*') || line.startsWith('*')) continue

    if (depth === 0) {
      const braceIdx = line.indexOf('{')
      if (braceIdx === -1) {
        selectorBuffer += ` ${line}`
        continue
      }
      selectorBuffer += ` ${line.slice(0, braceIdx)}`
      currentSelector = selectorBuffer.trim()
      selectorBuffer = ''
      depth = 1
      continue
    }

    if (line.startsWith('}')) {
      depth = 0
      currentSelector = ''
      continue
    }

    const match = line.match(/^(--sk-[a-z0-9-]+)\s*:\s*(.+?);?\s*$/)
    if (match) decls.push({ selector: currentSelector, prop: match[1], value: match[2] })
  }

  return decls
}

/**
 * Un bloque cuenta como "base" (editable por defecto) solo si su selector es exactamente
 * [data-sk='<dataSk>'] o [data-sk='<dataSk>'] [data-part='<parte>'] — sin :hover,
 * [data-variant=...], [data-tone=...], [data-state=...], [data-error], :disabled, etc. Evita
 * listar la misma variable N veces (una por cada tono/variante que la redeclara) y evita ofrecer
 * como "editable por defecto" algo que solo aplica en un estado puntual.
 */
function matchBaseSelector(selector: string, dataSk: string): { part?: string } | null {
  const escaped = dataSk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (new RegExp(`^\\[data-sk='${escaped}'\\]$`).test(selector)) return {}
  const partMatch = selector.match(new RegExp(`^\\[data-sk='${escaped}'\\]\\s*\\[data-part='([a-z0-9-]+)'\\]$`))
  if (partMatch) return { part: partMatch[1] }
  return null
}

const cssModules = import.meta.glob('../../src/styles/components/*.css', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

const cache = new Map<string, Promise<ComponentVarSpec[]>>()

export function getComponentVars(dataSk: string): Promise<ComponentVarSpec[]> {
  const cached = cache.get(dataSk)
  if (cached) return cached

  const promise = (async () => {
    const entry = Object.entries(cssModules).find(([path]) => path.endsWith(`/${dataSk}.css`))
    if (!entry) return []

    const css = await entry[1]()
    const specs: ComponentVarSpec[] = []
    const seen = new Set<string>()

    for (const decl of parseDeclarations(css)) {
      const base = matchBaseSelector(decl.selector, dataSk)
      if (!base) continue
      if (seen.has(decl.prop)) continue

      const property = inferProperty(decl.prop)
      if (!property) continue

      seen.add(decl.prop)
      specs.push({ name: decl.prop, part: base.part, property, defaultRef: decl.value })
    }

    return specs
  })()

  cache.set(dataSk, promise)
  return promise
}
