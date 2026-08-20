// Esquema JSON de <TourProvider> — plano y serializable a propósito (nada de funciones/JSX):
// "configurable con un JSON" es un requisito explícito, no solo una conveniencia de API.

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto'

export interface TourStepDef {
  id: string
  /** Selector CSS del elemento a destacar. */
  target: string
  title?: string
  body?: string
  placement?: TourPlacement
  /** Padding del "agujero" del spotlight alrededor del target, en px. */
  spotlightPadding?: number
  /** Cuánto esperar (ms) a que `target` aparezca en el DOM antes de saltear el paso. Default ~3500. */
  waitTimeout?: number
}

/** Una entrada de flujo es un paso literal, o una referencia a OTRO flujo (subFlow, por id) —
 * así un flujo se arma con sub-flujos reutilizables sin duplicar sus pasos. */
export type TourFlowEntry = TourStepDef | { subFlow: string }

export type TourTrigger = { type: 'elementVisible'; target: string } | { type: 'manual' }

export interface TourFlowDef {
  id: string
  entries: TourFlowEntry[]
  /** Default: 'manual' (arranca solo con start(id)). */
  trigger?: TourTrigger
}

export interface TourConfig {
  flows: TourFlowDef[]
}

/** Un nivel de la pila de ejecución: en qué flujo y en qué entrada de ese flujo está parado. */
export interface TourFrame {
  flowId: string
  entryIndex: number
}

export interface TourActiveStep {
  /** Flujo (o sub-flujo) al que pertenece el paso actual — no necesariamente el flujo raíz. */
  flowId: string
  step: TourStepDef
}

export function isSubFlowEntry(entry: TourFlowEntry): entry is { subFlow: string } {
  return 'subFlow' in entry
}
