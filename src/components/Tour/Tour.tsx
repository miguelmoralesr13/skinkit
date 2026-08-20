import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useElementVisible } from '../../lib/useElementVisible'
import { TourOverlay } from './TourOverlay'
import type { TourConfig } from './types'
import { useTourEngine, type UseTourEngineResult } from './useTourEngine'

const TourContext = createContext<UseTourEngineResult | null>(null)

/** Acceso al motor del tour activo. Debe usarse dentro de `<TourProvider>`. */
export function useTour(): UseTourEngineResult {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('skinkit: useTour() debe usarse dentro de un <TourProvider>.')
  return ctx
}

interface TourTriggerWatcherProps {
  target: string
  onVisible: () => void
}

// Un componente por flujo con trigger `elementVisible` — no un loop de hooks dentro de
// TourProvider: la cantidad de flujos con auto-trigger puede variar, y las reglas de hooks
// prohíben una cantidad variable de llamadas en un mismo componente. Cada instancia de este
// componente llama useElementVisible UNA vez, siempre — la lista de instancias varía por
// reconciliación normal de React (key), no por conteo de hooks.
function TourTriggerWatcher({ target, onVisible }: TourTriggerWatcherProps) {
  useElementVisible(target, onVisible)
  return null
}

export interface TourProviderProps {
  children: ReactNode
  /** Definición JSON de flujos/pasos/sub-flujos — se valida (ciclos, refs colgantes) al montar. */
  config: TourConfig
}

/**
 * Motor + overlay de un spotlight tour, page-global — mismo molde estructural que Toast
 * (Context + estado en useState/useMemo + portal a un `[data-skinkit-root]` propio en
 * document.body), no el de un compound component ensamblado en JSX como VideoPlayer.
 */
export function TourProvider({ children, config }: TourProviderProps) {
  const engine = useTourEngine(config)

  const autoTriggerFlows = useMemo(
    () =>
      config.flows.filter(
        (flow): flow is typeof flow & { trigger: { type: 'elementVisible'; target: string } } =>
          flow.trigger?.type === 'elementVisible',
      ),
    [config.flows],
  )

  return (
    <TourContext.Provider value={engine}>
      {children}
      {autoTriggerFlows.map((flow) => (
        <TourTriggerWatcher key={flow.id} target={flow.trigger.target} onVisible={() => engine.start(flow.id)} />
      ))}
      <TourOverlay engine={engine} />
    </TourContext.Provider>
  )
}
