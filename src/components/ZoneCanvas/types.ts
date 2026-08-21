import type { ComponentType, HTMLAttributes, ReactNode } from 'react'
import type { ResizeHandlePosition } from '../../lib/resizeBox'

export type { ResizeHandlePosition }

export interface CanvasPosition {
  x: number
  y: number
}

export interface CanvasSize {
  width: number
  height: number
}

export interface Zone<T = unknown> {
  id: string
  /** Top-left, en espacio del canvas (px). */
  position: CanvasPosition
  size: CanvasSize
  /** Key en `zoneTypes` — sin esto, la zona no renderiza contenido propio (sólo sus items). */
  type?: string
  data?: T
  /** Default: true. */
  draggable?: boolean
  /** Default: true. */
  resizable?: boolean
  /** Default: { width: 80, height: 80 }. */
  minSize?: CanvasSize
}

export interface Item<T = unknown> {
  id: string
  /** Zona dueña — el link de contenencia. */
  zoneId: string
  /** Relativo al top-left de SU zona (px) — no al canvas. */
  position: CanvasPosition
  /** Tamaño explícito — opcional. Sin esto, el item se autoajusta a su contenido (como siempre)
   * y el primer resize (si `resizable`, default true) parte del tamaño YA renderizado. */
  size?: CanvasSize
  /** Key en `itemTypes` — sin esto, se usa un renderer por defecto. */
  type?: string
  data?: T
  /** Default: true. */
  draggable?: boolean
  /** Default: true. */
  resizable?: boolean
  /** Default: { width: 60, height: 32 }. */
  minSize?: CanvasSize
}

/** `dragging`/`resizing: false` en el último change de un gesto (el "commit" final). */
export type ZoneChange =
  | { type: 'position'; id: string; position: CanvasPosition; dragging: boolean }
  | { type: 'size'; id: string; position: CanvasPosition; size: CanvasSize; resizing: boolean }

/** `reparent` es una variante propia (no un `position` con `zoneId` opcional) — mantiene el par
 * (zoneId, position) atómico en un solo change, sin ambigüedad. */
export type ItemChange =
  | { type: 'position'; id: string; position: CanvasPosition; dragging: boolean }
  | { type: 'reparent'; id: string; zoneId: string; position: CanvasPosition }
  | { type: 'size'; id: string; position: CanvasPosition; size: CanvasSize; resizing: boolean }

export interface ZoneComponentProps<T = unknown> {
  id: string
  data: T | undefined
}

export interface ItemComponentProps<T = unknown> {
  id: string
  data: T | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZoneTypes = Record<string, ComponentType<ZoneComponentProps<any>>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ItemTypes = Record<string, ComponentType<ItemComponentProps<any>>>

export interface ZoneCanvasProps extends HTMLAttributes<HTMLDivElement> {
  zones?: Zone[]
  defaultZones?: Zone[]
  onZonesChange?: (changes: ZoneChange[]) => void

  items?: Item[]
  defaultItems?: Item[]
  onItemsChange?: (changes: ItemChange[]) => void

  /** Mapa type→componente para el contenido propio de cada zona (además de sus items). */
  zoneTypes?: ZoneTypes
  /** Mapa type→componente para el contenido de cada item — HTML real, definido por vos. */
  itemTypes?: ItemTypes

  children?: ReactNode
}
