export { TourProvider, useTour } from './Tour'
export type { TourProviderProps } from './Tour'
export type {
  TourActiveStep,
  TourConfig,
  TourFlowDef,
  TourFlowEntry,
  TourPlacement,
  TourStepDef,
  TourStepRenderContext,
  TourTrigger,
} from './types'
export type { UseTourEngineResult } from './useTourEngine'
// El spec NO se re-exporta acá; se registra en src/catalog/index.ts.
