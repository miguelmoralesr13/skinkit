import { useEffect, useState } from 'react'
import { SkinkitProvider } from '../src'
import { getComponentSpec, CATEGORY_ORDER } from '../src/catalog'
import { STORY_GROUPS } from './stories'

const SKINS = ['soft', 'brutal', 'minimal', 'glass', 'retro', 'elevated', 'clay', 'outline', 'sketch', 'spotlight', 'terminal', 'gradient', 'aurora', 'glow', 'holo']
const THEMES = ['paper', 'dusk', 'forest']

export function App() {
  const [theme, setTheme] = useState('paper')
  const [skin, setSkin] = useState('soft')
  const [comp, setComp] = useState(0)
  const [storyIdx, setStoryIdx] = useState(0)
  // Modo comparar: renderiza el componente en TODAS las skins a la vez, lado a lado, para que
  // cualquier coincidencia (una skin que se ve como soft) salte a la vista. La verificación es
  // visual, no por script — dos skins nunca deben verse iguales.
  const [compare, setCompare] = useState(false)

  const group = STORY_GROUPS[comp]
  const story = group.stories[storyIdx]
  const spec = getComponentSpec(group.component)

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

  // Puente de control para el script de capturas (scripts/capture-skins.mjs). Sólo expone lo
  // mínimo para recorrer el catálogo de forma determinista; no afecta el uso manual.
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
      setCompare: (v: boolean) => setCompare(v),
      setTheme: (t: string) => setTheme(t),
    }
  }, [])

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

      {/* Centro: toolbar + tabs + canvas */}
      <main className="sb-main">
        <div className="sb-toolbar">
          <strong>{group.component}</strong>
          <div className="sb-spacer" />
          <label>
            theme
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {THEMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            skin
            <select
              value={skin}
              disabled={compare}
              onChange={(e) => setSkin(e.target.value)}
            >
              {SKINS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={compare}
              onChange={(e) => setCompare(e.target.checked)}
            />
            comparar skins
          </label>
        </div>

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
          {compare ? (
            <div className="sb-compare">
              {SKINS.map((s) => (
                <div className="sb-compare-item" key={s}>
                  <div className="sb-compare-label">{s}</div>
                  <SkinkitProvider theme={theme} skin={s} className="sb-compare-cell">
                    <div className="sb-story">{story.render()}</div>
                  </SkinkitProvider>
                </div>
              ))}
            </div>
          ) : (
            <SkinkitProvider theme={theme} skin={skin} className="sb-stage">
              <div className="sb-story">{story.render()}</div>
            </SkinkitProvider>
          )}
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
