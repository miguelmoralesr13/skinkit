import { createContext, useContext, useRef, type RefObject } from 'react'
import { cx } from '../../lib/cx'
import { ZoneCanvasZone } from './ZoneCanvasZone'
import { useZoneCanvasState, type ZoneCanvasStateModel } from './useZoneCanvasState'
import type { ItemTypes, ZoneCanvasProps } from './types'

export interface ZoneCanvasContextValue extends ZoneCanvasStateModel {
  rootRef: RefObject<HTMLDivElement | null>
  itemTypes?: ItemTypes
}
const ZoneCanvasContext = createContext<ZoneCanvasContextValue | null>(null)

/** @internal usado por ZoneCanvasZone/ZoneCanvasItem — no es parte del API público. */
export function useZoneCanvasContext(where: string): ZoneCanvasContextValue {
  const ctx = useContext(ZoneCanvasContext)
  if (!ctx) throw new Error(`skinkit: ${where} debe usarse dentro de <ZoneCanvas>`)
  return ctx
}

/**
 * ZoneCanvas headless — canvas de contención espacial: zonas (contenedores) que se arrastran y
 * redimensionan, cada una con cero o más items que viven adentro (arrastrables dentro de la zona,
 * y "reparentables" a otra zona al soltarlos ahí). Sin conexiones/handles como Flow — esto es
 * puramente contención espacial. La forma la da el CSS — ver zone-canvas.css.
 *
 * Contrato (ver también ZoneCanvasZone.tsx/ZoneCanvasItem.tsx):
 *   [data-sk="zone-canvas"]   raíz, overflow:auto — no tiene pan/zoom (a diferencia de Flow)
 */
export function ZoneCanvas({
  zones,
  defaultZones,
  onZonesChange,
  items,
  defaultItems,
  onItemsChange,
  zoneTypes,
  itemTypes,
  className,
  children,
  ...rest
}: ZoneCanvasProps) {
  const state = useZoneCanvasState({
    zones,
    defaultZones,
    onZonesChange,
    items,
    defaultItems,
    onItemsChange,
  })
  const rootRef = useRef<HTMLDivElement>(null)

  const ctxValue: ZoneCanvasContextValue = { ...state, rootRef, itemTypes }

  return (
    <ZoneCanvasContext.Provider value={ctxValue}>
      <div ref={rootRef} data-sk="zone-canvas" className={cx('sk-zone-canvas', className)} {...rest}>
        {state.zones.map((zone) => (
          <ZoneCanvasZone key={zone.id} zone={zone} zoneTypes={zoneTypes} />
        ))}
        {children}
      </div>
    </ZoneCanvasContext.Provider>
  )
}
