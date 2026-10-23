// Esquema JSON de <TourProvider> — plano y serializable a propósito (nada de funciones/JSX):
// "configurable con un JSON" es un requisito explícito, no solo una conveniencia de API.

/** 'center' centra la tarjeta en la pantalla (paso sin target); 'none' no la posiciona: la ubica quien consume
 * con `className` (p. ej. una tira junto a un botón propio). */
export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto' | 'center' | 'none'

export interface TourStepDef {
  id: string
  /** Selector CSS del elemento a destacar. Sin target el paso es «suelto»: no hay agujero y la tarjeta va
   * centrada (o donde diga `placement`). */
  target?: string
  title?: string
  body?: string
  placement?: TourPlacement
  /** Padding del "agujero" del spotlight alrededor del target, en px. */
  spotlightPadding?: number
  /** Cuánto esperar (ms) a que `target` aparezca en el DOM antes de saltear el paso. Default ~3500. */
  waitTimeout?: number
  /** Qué hacer si `target` no aparece a tiempo: 'skip' (default) salta el paso; 'show' lo muestra como paso
   * suelto (sin agujero) con `targetFound: false` en `renderStep`, para explicar por qué falta. */
  ifMissing?: 'skip' | 'show'
  /** Atenuar el resto de la pantalla. Default: sí con `target`, no sin él. */
  dim?: boolean
  /** 'targetClick': tocar el elemento señalado avanza solo (el toque sigue llegando al elemento real). */
  advanceOn?: 'targetClick'
  /** Clase extra de la tarjeta de este paso (se suma a las demás). */
  className?: string
  /** Datos propios del paso, para `renderStep` (serializable). */
  data?: Record<string, unknown>
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

/** Lo que recibe `renderStep` para dibujar por dentro la tarjeta de un paso. */
export interface TourStepRenderContext {
  step: TourStepDef
  flowId: string
  /** false si el paso se muestra por `ifMissing: 'show'` porque su target no apareció. */
  targetFound: boolean
  canGoPrev: boolean
  next: () => void
  prev: () => void
  skip: () => void
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
