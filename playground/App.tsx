import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { SkinkitProvider } from '../src'
import { getComponentSpec, CATEGORY_ORDER } from '../src/catalog'
import { STORY_GROUPS } from './stories'
import { ComponentVarsPanel } from './ComponentVarsPanel'
import { useComponentVars } from './lib/useComponentVars'

// Todo lo de acá abajo son los tokens REALES de src/styles/tokens.css con su valor por defecto
// REAL — el panel no inventa nada nuevo, solo expone lo que ya está definido para poder
// pisarlo en vivo. Agregar un token acá no crea nada: si no existe en tokens.css no hace nada.
// Agrupados igual que tokens.css: marca, contraste (on-*), superficie/texto, sintaxis de código.
const COLOR_GROUPS: Array<{ title: string; tokens: Array<{ key: string; label: string; default: string }> }> = [
  {
    title: 'Marca',
    tokens: [
      { key: '--color-sk-primary', label: 'Primary', default: '#2f6df6' },
      { key: '--color-sk-primary-hover', label: 'Primary hover', default: '#1f57d0' },
      { key: '--color-sk-secondary', label: 'Secondary', default: '#7c3aed' },
      { key: '--color-sk-tertiary', label: 'Tertiary', default: '#0d9488' },
      { key: '--color-sk-accent', label: 'Accent', default: '#db2777' },
      { key: '--color-sk-success', label: 'Success', default: '#16a34a' },
      { key: '--color-sk-warning', label: 'Warning', default: '#d97706' },
      { key: '--color-sk-info', label: 'Info', default: '#0284c7' },
      { key: '--color-sk-danger', label: 'Danger', default: '#d64545' },
    ],
  },
  {
    title: 'Contraste (on-*, texto sobre cada tono)',
    tokens: [
      { key: '--color-sk-on-primary', label: 'On primary', default: '#ffffff' },
      { key: '--color-sk-on-secondary', label: 'On secondary', default: '#ffffff' },
      { key: '--color-sk-on-tertiary', label: 'On tertiary', default: '#ffffff' },
      { key: '--color-sk-on-accent', label: 'On accent', default: '#ffffff' },
      { key: '--color-sk-on-success', label: 'On success', default: '#ffffff' },
      { key: '--color-sk-on-warning', label: 'On warning', default: '#ffffff' },
      { key: '--color-sk-on-info', label: 'On info', default: '#ffffff' },
      { key: '--color-sk-on-danger', label: 'On danger', default: '#ffffff' },
    ],
  },
  {
    title: 'Superficie y texto',
    tokens: [
      { key: '--color-sk-surface', label: 'Surface', default: '#ffffff' },
      { key: '--color-sk-surface-2', label: 'Surface 2', default: '#f4f4f2' },
      { key: '--color-sk-text', label: 'Text', default: '#1a1a1a' },
      { key: '--color-sk-text-muted', label: 'Text muted', default: '#6b6b6b' },
      { key: '--color-sk-border', label: 'Border', default: '#e2e2df' },
    ],
  },
  {
    title: 'Sintaxis de código (componente Code)',
    tokens: [
      { key: '--color-sk-code-comment', label: 'Comment', default: '#8a8f98' },
      { key: '--color-sk-code-string', label: 'String', default: '#0a7d43' },
      { key: '--color-sk-code-number', label: 'Number', default: '#b5540b' },
      { key: '--color-sk-code-keyword', label: 'Keyword', default: '#a3238e' },
      { key: '--color-sk-code-function', label: 'Function', default: '#2f6df6' },
    ],
  },
]
const BRAND_TONES = COLOR_GROUPS[0].tokens.filter((t) => t.key !== '--color-sk-primary-hover')
const ON_TONES = COLOR_GROUPS[1].tokens

const RADIUS_TOKENS: Array<{ key: string; label: string; default: number; max: number }> = [
  { key: '--radius-sk-sm', label: 'sm', default: 8, max: 24 },
  { key: '--radius-sk-md', label: 'md', default: 12, max: 32 },
  { key: '--radius-sk-lg', label: 'lg', default: 16, max: 48 },
  { key: '--radius-sk-pill', label: 'pill', default: 999, max: 999 },
]

const TEXT_SIZE_TOKENS: Array<{ key: string; label: string; default: number; max: number }> = [
  { key: '--text-sk-sm', label: 'sm', default: 13, max: 24 },
  { key: '--text-sk-md', label: 'md', default: 15, max: 28 },
  { key: '--text-sk-lg', label: 'lg', default: 17, max: 32 },
]

// Cada nivel es editable libremente (texto) — los presets de abajo solo rellenan los 3 de una,
// como punto de partida rápido, no reemplazan la edición individual.
const SHADOW_TOKENS: Array<{ key: string; label: string; default: string }> = [
  { key: '--shadow-sk-sm', label: 'sm', default: '0 2px 8px rgba(0, 0, 0, 0.12)' },
  { key: '--shadow-sk-md', label: 'md', default: '0 4px 14px rgba(0, 0, 0, 0.16)' },
  { key: '--shadow-sk-lg', label: 'lg', default: '0 4px 20px rgba(0, 0, 0, 0.06)' },
]

const SHADOW_PRESETS: Record<string, { sm: string; md: string; lg: string }> = {
  sutil: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 2px 6px rgba(0, 0, 0, 0.10)',
    lg: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  medio: {
    sm: SHADOW_TOKENS[0].default,
    md: SHADOW_TOKENS[1].default,
    lg: SHADOW_TOKENS[2].default,
  },
  fuerte: {
    sm: '0 4px 12px rgba(0, 0, 0, 0.22)',
    md: '0 8px 24px rgba(0, 0, 0, 0.28)',
    lg: '0 10px 32px rgba(0, 0, 0, 0.14)',
  },
}

// --spacing NO es un token "sk-" propio — es la base del scale de spacing default de Tailwind
// (spacing(N) = N × --spacing). TODOS los componentes usan gap-*/p-*/px-* de Tailwind (no un
// --spacing-sk-* propio, ver nota en tokens.css), así que pisar esta ÚNICA variable reescala
// gap/padding/margin en TODOS los componentes a la vez, sin tocar un solo archivo de componente.
const SPACING_DEFAULT_PX = 4

const SANS_FONT_PRESETS = [
  { label: 'Inter (default)', value: "'Inter', system-ui, -apple-system, sans-serif" },
  { label: 'System UI', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Georgia (serif)', value: "Georgia, 'Times New Roman', serif" },
]

const MONO_FONT_PRESETS = [
  { label: 'JetBrains Mono (default)', value: "'JetBrains Mono', ui-monospace, 'SF Mono', monospace" },
  { label: 'Fira Code', value: "'Fira Code', ui-monospace, monospace" },
  { label: 'Courier New', value: "'Courier New', monospace" },
]

export function App() {
  const [comp, setComp] = useState(0)
  const [storyIdx, setStoryIdx] = useState(0)
  const [panelOpen, setPanelOpen] = useState(false)
  // Sistema = sin forzar nada, sigue prefers-color-scheme (ver color-scheme en tokens.css).
  const [colorScheme, setColorScheme] = useState<'system' | 'light' | 'dark'>('system')
  // Panel de personalización: demuestra el mecanismo real de override (pisar variables
  // --color-sk-*/--radius-sk-*/--shadow-sk-*/--text-sk-*/--font-sk-* en un wrapper), no un
  // selector de "looks" prearmados. `overrides` solo guarda lo que el usuario tocó — lo demás
  // sigue resolviendo al default de tokens.css.
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  // Panel de edición por componente: pisa las variables LOCALES --sk-{dataSk}-* de un solo
  // componente (ver src/styles/components/<dataSk>.css), no los tokens globales de arriba. Clave
  // por dataSk para que cambiar de componente y volver conserve lo editado en cada uno.
  const [componentPanelOpen, setComponentPanelOpen] = useState(false)
  const [componentOverrides, setComponentOverrides] = useState<Record<string, Record<string, string>>>({})
  const storyRef = useRef<HTMLDivElement>(null)

  const group = STORY_GROUPS[comp]
  const story = group.stories[storyIdx]
  const spec = getComponentSpec(group.component)
  const dataSk = spec?.dataSk ?? ''
  const componentVars = useComponentVars(dataSk)

  const setToken = (key: string, value: string) => setOverrides((prev) => ({ ...prev, [key]: value }))
  const setComponentVar = (name: string, value: string) =>
    setComponentOverrides((prev) => ({ ...prev, [dataSk]: { ...(prev[dataSk] ?? {}), [name]: value } }))
  const currentComponentOverrides = componentOverrides[dataSk] ?? {}
  const hasComponentOverrides = Object.keys(currentComponentOverrides).length > 0
  const resetComponentOverrides = () =>
    setComponentOverrides((prev) => {
      const next = { ...prev }
      delete next[dataSk]
      return next
    })

  // Por qué NO se aplica como `style` inline en un ancestro (como el panel global de arriba):
  // cada [data-sk='<dataSk>'] YA declara su propia variable local (ver src/styles/components/),
  // y esa declaración — al estar puesta directamente sobre el elemento — siempre le gana a
  // cualquier valor heredado de un ancestro, sin importar qué tan cerca esté. La única forma real
  // de pisarla es con una regla CSS que matchee el MISMO selector (o más específico), que es
  // justo el patrón documentado para consumidores reales. Acá se genera esa regla al vuelo, con
  // !important porque además hay que ganarle a :hover/[data-variant]/[data-tone] (más específicos)
  // — aceptable en esta herramienta de desarrollo, no es el CSS que se publica en el paquete.
  const componentOverrideCss = useMemo(() => {
    if (!dataSk || !componentVars || !hasComponentOverrides) return ''
    const bySelector = new Map<string, string[]>()
    for (const v of componentVars) {
      const value = currentComponentOverrides[v.name]
      if (value === undefined) continue
      const selector = v.part ? `[data-sk='${dataSk}'] [data-part='${v.part}']` : `[data-sk='${dataSk}']`
      const decls = bySelector.get(selector) ?? []
      decls.push(`${v.name}: ${value} !important;`)
      bySelector.set(selector, decls)
    }
    return Array.from(bySelector.entries())
      .map(([selector, decls]) => `${selector} { ${decls.join(' ')} }`)
      .join('\n')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSk, componentVars, currentComponentOverrides, hasComponentOverrides])
  const applyShadowPreset = (name: string) =>
    setOverrides((prev) => ({
      ...prev,
      '--shadow-sk-sm': SHADOW_PRESETS[name].sm,
      '--shadow-sk-md': SHADOW_PRESETS[name].md,
      '--shadow-sk-lg': SHADOW_PRESETS[name].lg,
    }))
  const hasOverrides = Object.keys(overrides).length > 0

  const resetAll = () => setOverrides({})

  // Rail agrupado por categoría (en el orden de CATEGORY_ORDER), preservando el índice
  // original de cada grupo en STORY_GROUPS para la selección.
  const railSections = CATEGORY_ORDER.map((category) => ({
    category,
    items: STORY_GROUPS.map((grp, i) => ({ grp, i })).filter(
      ({ grp }) => getComponentSpec(grp.component)?.category === category,
    ),
  })).filter((section) => section.items.length > 0)

  const selectComponent = (i: number) => {
    setComp(i)
    setStoryIdx(0)
  }

  // Puente de control para el script de capturas (scripts/capture-components.mjs). Sólo expone
  // lo mínimo para recorrer el catálogo de forma determinista; no afecta el uso manual.
  useEffect(() => {
    ;(window as unknown as { __skinkitPlayground?: unknown }).__skinkitPlayground = {
      count: STORY_GROUPS.length,
      name: (i: number) => STORY_GROUPS[i]?.component,
      storyCount: (i: number) => STORY_GROUPS[i]?.stories.length ?? 0,
      select: (i: number) => {
        setComp(i)
        setStoryIdx(0)
      },
      setStory: (si: number) => setStoryIdx(si),
    }
  }, [])

  const overrideStyle = { ...overrides } as CSSProperties

  return (
    <div className="sb">
      {/* Panel de props/docs (izquierda, ancho fijo → el canvas no cambia de tamaño) */}
      <aside className="sb-docs">
        {spec ? (
          <>
            <p className="sb-desc">{spec.description}</p>

            <h4>Props</h4>
            <div className="sb-props">
              {spec.props.map((p) => (
                <div className="sb-prop" key={p.name}>
                  <div className="sb-prop-head">
                    <code className="sb-prop-name">
                      {p.name}
                      {p.required ? ' *' : ''}
                    </code>
                    <code className="sb-prop-type">{p.type}</code>
                  </div>
                  {p.default !== undefined && (
                    <div className="sb-prop-default">default: {p.default}</div>
                  )}
                  <div className="sb-prop-desc">{p.description}</div>
                </div>
              ))}
              {spec.extends && (
                <p className="sb-extends">
                  + hereda <code>{spec.extends}</code>
                </p>
              )}
            </div>

            <h4>Parts</h4>
            <ul className="sb-list">
              {spec.parts.map((pt) => (
                <li key={pt.name}>
                  <code>{pt.name}</code> — {pt.description}
                </li>
              ))}
            </ul>

            <h4>Uso</h4>
            <ul className="sb-list">
              {spec.usage.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="sb-desc">Sin ficha de catálogo.</p>
        )}
      </aside>

      {/* Centro: toolbar + panel de personalización + tabs + canvas */}
      <main className="sb-main">
        <div className="sb-toolbar">
          <strong>{group.component}</strong>
          <div className="sb-spacer" />
          <div className="sb-scheme-toggle" role="group">
            {(['system', 'light', 'dark'] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={`sb-scheme-btn${colorScheme === s ? ' is-active' : ''}`}
                onClick={() => setColorScheme(s)}
              >
                {s === 'system' ? 'Sistema' : s === 'light' ? 'Claro' : 'Oscuro'}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`sb-personalize-toggle${panelOpen ? ' is-active' : ''}`}
            onClick={() => setPanelOpen((v) => !v)}
          >
            Personalizar {hasOverrides ? '●' : ''}
          </button>
          {hasOverrides && (
            <button type="button" className="sb-reset" onClick={resetAll}>
              reset
            </button>
          )}
          <button
            type="button"
            className={`sb-personalize-toggle${componentPanelOpen ? ' is-active' : ''}`}
            onClick={() => setComponentPanelOpen((v) => !v)}
          >
            Editar {group.component} {hasComponentOverrides ? '●' : ''}
          </button>
          {hasComponentOverrides && (
            <button type="button" className="sb-reset" onClick={resetComponentOverrides}>
              reset
            </button>
          )}
        </div>

        {panelOpen && (
          <div className="sb-personalize" style={overrideStyle}>
            {COLOR_GROUPS.map((group_) => (
              <div className="sb-personalize-group" key={group_.title}>
                <div className="sb-personalize-title">{group_.title}</div>
                <div className="sb-personalize-colors">
                  {group_.tokens.map((t) => (
                    <label key={t.key} className="sb-color-field">
                      <input
                        type="color"
                        value={overrides[t.key] ?? t.default}
                        onChange={(e) => setToken(t.key, e.target.value)}
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="sb-personalize-group">
              <div className="sb-personalize-title">Forma — --radius-sk-*</div>
              <div className="sb-personalize-row">
                {RADIUS_TOKENS.map((t) => (
                  <label key={t.key} className="sb-range-field">
                    <span className="sb-range-field-head">
                      <i className="sb-radius-swatch" style={{ borderRadius: `var(${t.key})` }} />
                      {t.label}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={t.max}
                      value={parseInt(overrides[t.key] ?? String(t.default), 10)}
                      onChange={(e) => setToken(t.key, `${e.target.value}px`)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="sb-personalize-group">
              <div className="sb-personalize-title">Tamaño de texto — --text-sk-*</div>
              <div className="sb-personalize-row">
                {TEXT_SIZE_TOKENS.map((t) => (
                  <label key={t.key} className="sb-range-field">
                    <span className="sb-range-field-head" style={{ fontSize: `var(${t.key})` }}>
                      Aa {t.label}
                    </span>
                    <input
                      type="range"
                      min={8}
                      max={t.max}
                      value={parseInt(overrides[t.key] ?? String(t.default), 10)}
                      onChange={(e) => setToken(t.key, `${e.target.value}px`)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="sb-personalize-group">
              <div className="sb-personalize-title">Sombra — --shadow-sk-* (libre, por nivel)</div>
              <div className="sb-personalize-row sb-personalize-row-wrap">
                {SHADOW_TOKENS.map((t) => (
                  <label key={t.key} className="sb-shadow-field">
                    <span>{t.label}</span>
                    <input
                      type="text"
                      value={overrides[t.key] ?? t.default}
                      onChange={(e) => setToken(t.key, e.target.value)}
                    />
                  </label>
                ))}
                <span className="sb-shadow-presets">
                  presets:
                  {Object.keys(SHADOW_PRESETS).map((key) => (
                    <button key={key} type="button" className="sb-chip" onClick={() => applyShadowPreset(key)}>
                      {key}
                    </button>
                  ))}
                </span>
              </div>
            </div>

            <div className="sb-personalize-group">
              <div className="sb-personalize-title">Spacing — --spacing (Tailwind, no es "sk-")</div>
              <div className="sb-personalize-row">
                <label className="sb-range-field">
                  <span className="sb-range-field-head">base</span>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={0.5}
                    value={parseFloat(overrides['--spacing'] ?? String(SPACING_DEFAULT_PX))}
                    onChange={(e) => setToken('--spacing', `${e.target.value}px`)}
                  />
                </label>
                <span className="sb-spacing-hint">
                  {overrides['--spacing'] ?? `${SPACING_DEFAULT_PX}px`} × N = todo el gap/padding/margin de
                  Tailwind en cualquier componente (gap-2, px-5, p-4...)
                </span>
              </div>
            </div>

            <div className="sb-personalize-group">
              <div className="sb-personalize-title">Tipografía — --font-sk-sans / --font-sk-mono</div>
              <div className="sb-personalize-row">
                <select
                  value={overrides['--font-sk-sans'] ?? SANS_FONT_PRESETS[0].value}
                  onChange={(e) => setToken('--font-sk-sans', e.target.value)}
                >
                  {SANS_FONT_PRESETS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <select
                  value={overrides['--font-sk-mono'] ?? MONO_FONT_PRESETS[0].value}
                  onChange={(e) => setToken('--font-sk-mono', e.target.value)}
                >
                  {MONO_FONT_PRESETS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vista previa fija — SIEMPRE ejercita todos los tokens del panel, sin importar qué
                componente esté seleccionado en el rail. Muchos componentes solo usan un
                subconjunto de tokens (ej. Button solo usa --radius-sk-pill, nunca sm/md/lg), así
                que tocar un control mientras se mira ESE componente puede parecer que "no hace
                nada" aunque el token sí se actualizó — acá siempre hay algo que reacciona. */}
            <div className="sb-personalize-group sb-personalize-preview">
              <div className="sb-personalize-title">Vista previa (usa TODOS los tokens de arriba)</div>
              <div className="sb-preview-row">
                <button type="button" className="sb-preview-btn" data-sk="button" title="primary + on-primary + pill + shadow-sm (hover → primary-hover)">
                  Primary
                </button>
                <div className="sb-preview-card" data-sk="card">
                  <div data-part="body">Card — lg + shadow + surface/border</div>
                </div>
                <div className="sb-preview-tones">
                  {BRAND_TONES.map((t, i) => (
                    <span
                      key={t.key}
                      className="sb-preview-chip"
                      style={{ background: `var(${t.key})`, color: `var(${ON_TONES[i].key})` }}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sb-preview-row">
                <span className="sb-preview-text">Texto — --color-sk-text</span>
                <span className="sb-preview-text sb-preview-text-muted">Texto muted — --color-sk-text-muted</span>
                <code className="sb-preview-code">
                  <span style={{ color: 'var(--color-sk-code-keyword)' }}>const</span>{' '}
                  <span style={{ color: 'var(--color-sk-code-function)' }}>skin</span> = {'{'}{' '}
                  <span style={{ color: 'var(--color-sk-code-string)' }}>&apos;ok&apos;</span>:{' '}
                  <span style={{ color: 'var(--color-sk-code-number)' }}>1</span> {'}'}{' '}
                  <span style={{ color: 'var(--color-sk-code-comment)' }}>// sintaxis</span>
                </code>
              </div>
            </div>
          </div>
        )}

        {componentPanelOpen && (
          <ComponentVarsPanel
            dataSk={dataSk}
            componentLabel={group.component}
            vars={componentVars}
            storyContainerRef={storyRef}
            refreshKey={`${dataSk}:${storyIdx}`}
            overrides={currentComponentOverrides}
            onChange={setComponentVar}
          />
        )}
        {componentOverrideCss && <style>{componentOverrideCss}</style>}

        <div className="sb-tabs" role="tablist">
          {group.stories.map((st, si) => (
            <button
              key={st.name}
              role="tab"
              aria-selected={si === storyIdx}
              className={`sb-tab${si === storyIdx ? ' is-active' : ''}`}
              onClick={() => setStoryIdx(si)}
            >
              {st.name}
            </button>
          ))}
        </div>

        <div className="sb-canvas">
          <SkinkitProvider
            className="sb-stage"
            colorScheme={colorScheme === 'system' ? undefined : colorScheme}
          >
            <div className="sb-story" ref={storyRef} style={overrideStyle}>
              {story.render()}
            </div>
          </SkinkitProvider>
        </div>
      </main>

      {/* Rail de componentes (derecha, escala a muchos) */}
      <aside className="sb-rail">
        <div className="sb-brand">skinkit</div>
        {railSections.map((section) => (
          <div className="sb-rail-section" key={section.category}>
            <div className="sb-rail-title">{section.category}</div>
            {section.items.map(({ grp, i }) => (
              <button
                key={grp.component}
                className={`sb-rail-item${i === comp ? ' is-active' : ''}`}
                onClick={() => selectComponent(i)}
              >
                {grp.component}
              </button>
            ))}
          </div>
        ))}
      </aside>
    </div>
  )
}
