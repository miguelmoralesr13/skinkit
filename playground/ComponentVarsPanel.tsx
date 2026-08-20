import { useEffect, useState, type RefObject } from 'react'
import type { ComponentVarSpec } from './lib/extractComponentVars'

export interface ComponentVarsPanelProps {
  dataSk: string
  componentLabel: string
  vars: ComponentVarSpec[] | null
  /** Contenedor donde se renderiza la story actual — se usa para leer el color/valor real
   * resuelto de cada variable (getComputedStyle), no el texto crudo `var(--color-sk-primary)`. */
  storyContainerRef: RefObject<HTMLDivElement | null>
  /** Cambia cuando puede haber cambiado qué se renderiza dentro de storyContainerRef (switch de
   * story o de componente) — dispara una relectura de los valores por defecto resueltos. */
  refreshKey: string
  overrides: Record<string, string>
  onChange: (name: string, value: string) => void
}

interface VarGroup {
  part?: string
  specs: ComponentVarSpec[]
}

function groupByPart(vars: ComponentVarSpec[]): VarGroup[] {
  const groups: VarGroup[] = []
  for (const v of vars) {
    let group = groups.find((g) => g.part === v.part)
    if (!group) {
      group = { part: v.part, specs: [] }
      groups.push(group)
    }
    group.specs.push(v)
  }
  return groups
}

function resolveDefault(
  container: HTMLDivElement | null,
  dataSk: string,
  spec: ComponentVarSpec,
): string | null {
  if (!container) return null
  const selector = spec.part
    ? `[data-sk='${dataSk}'] [data-part='${spec.part}']`
    : `[data-sk='${dataSk}']`
  const el = container.querySelector(selector)
  if (!el) return null
  const value = getComputedStyle(el).getPropertyValue(spec.name).trim()
  return value || null
}

function VarField({
  spec,
  value,
  onChange,
}: {
  spec: ComponentVarSpec
  value: string | undefined
  onChange: (value: string) => void
}) {
  if (spec.property === 'bg' || spec.property === 'fg' || spec.property === 'border') {
    return (
      <label className="sb-color-field" title={spec.name}>
        <input
          type="color"
          value={value && value.startsWith('#') ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{spec.property}</span>
      </label>
    )
  }
  return (
    <label className="sb-shadow-field" title={spec.name}>
      <span>{spec.property}</span>
      <input type="text" value={value ?? spec.defaultRef} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

export function ComponentVarsPanel({
  dataSk,
  componentLabel,
  vars,
  storyContainerRef,
  refreshKey,
  overrides,
  onChange,
}: ComponentVarsPanelProps) {
  const [resolvedDefaults, setResolvedDefaults] = useState<Record<string, string>>({})
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!vars) return
    const next: Record<string, string> = {}
    for (const v of vars) {
      const resolved = resolveDefault(storyContainerRef.current, dataSk, v)
      if (resolved) next[v.name] = resolved
    }
    setResolvedDefaults(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vars, refreshKey])

  // Componente distinto → volver a la primera sección (no arrastrar la selección de otro).
  useEffect(() => {
    setSelectedIndex(0)
  }, [dataSk])

  if (vars === null) {
    return (
      <div className="sb-personalize sb-personalize-component">
        <p className="sb-desc">Leyendo {dataSk}.css…</p>
      </div>
    )
  }

  if (vars.length === 0) {
    return (
      <div className="sb-personalize sb-personalize-component">
        <p className="sb-desc">
          {componentLabel} no tiene variables locales de color/forma (no tiene archivo en
          <code> src/styles/components/</code>, o no declara ninguna <code>--sk-*</code>).
        </p>
      </div>
    )
  }

  const groups = groupByPart(vars)

  // Un solo grupo (la mayoría de los componentes) → sin chrome de lista, los campos van directo.
  if (groups.length === 1) {
    return (
      <div className="sb-personalize sb-personalize-component">
        <div className="sb-personalize-group">
          <div className="sb-personalize-title">General</div>
          <div className="sb-personalize-row sb-personalize-row-wrap">
            {groups[0].specs.map((spec) => (
              <VarField
                key={spec.name}
                spec={spec}
                value={overrides[spec.name] ?? resolvedDefaults[spec.name]}
                onChange={(value) => onChange(spec.name, value)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Muchas partes (ej. DataTable, ~20) → maestro-detalle: lista a la izquierda, controles de la
  // seleccionada a la derecha. Un grid que envuelve todo se vuelve ilegible a esta escala.
  const active = groups[selectedIndex] ?? groups[0]

  return (
    <div className="sb-personalize sb-personalize-component">
      <div className="sb-varpanel">
        <div className="sb-varpanel-list">
          {groups.map((group, i) => {
            const overriddenCount = group.specs.filter((s) => overrides[s.name] !== undefined).length
            return (
              <button
                key={group.part ?? '__root'}
                type="button"
                className={`sb-varpanel-item${i === selectedIndex ? ' is-active' : ''}`}
                onClick={() => setSelectedIndex(i)}
              >
                <span>{group.part ?? 'General'}</span>
                <span className="sb-varpanel-item-count">
                  {overriddenCount > 0 ? `${overriddenCount}/${group.specs.length}` : group.specs.length}
                </span>
              </button>
            )
          })}
        </div>
        <div className="sb-varpanel-detail">
          <div className="sb-personalize-group">
            <div className="sb-personalize-title">{active.part ? `Parte: ${active.part}` : 'General'}</div>
            <div className="sb-personalize-row sb-personalize-row-wrap">
              {active.specs.map((spec) => (
                <VarField
                  key={spec.name}
                  spec={spec}
                  value={overrides[spec.name] ?? resolvedDefaults[spec.name]}
                  onChange={(value) => onChange(spec.name, value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
