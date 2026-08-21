import { useCallback, useState } from 'react'
import type { Item, ItemChange, Zone, ZoneChange } from './types'

/** Reducer puro — exportado (a diferencia del equivalente privado en Flow) para que un consumidor
 * controlado, o el ejemplo del catálogo, lo pueda usar de verdad en vez de reinventar el switch. */
export function applyZoneChanges(zones: Zone[], changes: ZoneChange[]): Zone[] {
  let next = zones
  for (const change of changes) {
    if (change.type === 'position') {
      next = next.map((z) => (z.id === change.id ? { ...z, position: change.position } : z))
    } else if (change.type === 'size') {
      next = next.map((z) =>
        z.id === change.id ? { ...z, position: change.position, size: change.size } : z,
      )
    }
  }
  return next
}

/** Reducer puro — ídem, exportado. */
export function applyItemChanges(items: Item[], changes: ItemChange[]): Item[] {
  let next = items
  for (const change of changes) {
    if (change.type === 'position') {
      next = next.map((i) => (i.id === change.id ? { ...i, position: change.position } : i))
    } else if (change.type === 'reparent') {
      next = next.map((i) =>
        i.id === change.id ? { ...i, zoneId: change.zoneId, position: change.position } : i,
      )
    } else if (change.type === 'size') {
      next = next.map((i) =>
        i.id === change.id ? { ...i, position: change.position, size: change.size } : i,
      )
    }
  }
  return next
}

export interface HoverState {
  itemId: string
  zoneId: string
}

export interface UseZoneCanvasStateOptions {
  zones?: Zone[]
  defaultZones?: Zone[]
  onZonesChange?: (changes: ZoneChange[]) => void

  items?: Item[]
  defaultItems?: Item[]
  onItemsChange?: (changes: ItemChange[]) => void
}

export interface ZoneCanvasStateModel {
  zones: Zone[]
  commitZoneChanges: (changes: ZoneChange[]) => void
  getZone: (id: string) => Zone | undefined

  items: Item[]
  commitItemChanges: (changes: ItemChange[]) => void
  itemsByZone: (zoneId: string) => Item[]

  /** Item siendo arrastrado + zona bajo el cursor en este momento (o null) — sólo mientras dura
   * el gesto. Cada Zone lee esto para mostrar `data-drop-target` cuando corresponde. */
  hover: HoverState | null
  setHover: (hover: HoverState | null) => void
}

/**
 * Orquesta todo el estado de <ZoneCanvas>: zones/items (controlado o no, batch de `changes` igual
 * que Flow — el callback no encaja en useControllable, se resuelve a mano) y el hover en curso de
 * un drag de item entre zonas.
 */
export function useZoneCanvasState(opts: UseZoneCanvasStateOptions): ZoneCanvasStateModel {
  const {
    zones: zonesProp,
    defaultZones = [],
    onZonesChange,
    items: itemsProp,
    defaultItems = [],
    onItemsChange,
  } = opts

  const [zonesState, setZonesState] = useState(defaultZones)
  const zones = zonesProp ?? zonesState
  const commitZoneChanges = useCallback(
    (changes: ZoneChange[]) => {
      if (zonesProp === undefined) setZonesState((zs) => applyZoneChanges(zs, changes))
      onZonesChange?.(changes)
    },
    [zonesProp, onZonesChange],
  )
  const getZone = useCallback((id: string) => zones.find((z) => z.id === id), [zones])

  const [itemsState, setItemsState] = useState(defaultItems)
  const items = itemsProp ?? itemsState
  const commitItemChanges = useCallback(
    (changes: ItemChange[]) => {
      if (itemsProp === undefined) setItemsState((its) => applyItemChanges(its, changes))
      onItemsChange?.(changes)
    },
    [itemsProp, onItemsChange],
  )
  const itemsByZone = useCallback((zoneId: string) => items.filter((i) => i.zoneId === zoneId), [items])

  const [hover, setHover] = useState<HoverState | null>(null)

  return { zones, commitZoneChanges, getZone, items, commitItemChanges, itemsByZone, hover, setHover }
}
