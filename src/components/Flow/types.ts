import type { ComponentType, HTMLAttributes, ReactNode } from 'react'
import type { ResizeHandlePosition } from '../../lib/resizeBox'

export type { ResizeHandlePosition }

export interface FlowPosition {
  x: number
  y: number
}

export interface FlowSize {
  width: number
  height: number
}

export interface FlowNode<T = unknown> {
  id: string
  position: FlowPosition
  /** Tamaño explícito — opcional. Sin esto, el nodo se autoajusta a su contenido (igual que
   * siempre) y NO es redimensionable (no hay una caja de la que partir). Al redimensionarlo una
   * vez (con los handles), el nodo pasa a tener un tamaño explícito de ahí en más. */
  size?: FlowSize
  /** Key en `nodeTypes`; sin esto, se usa el renderer por defecto. */
  type?: string
  data?: T
  selected?: boolean
  /** Default: true. */
  draggable?: boolean
  /** Default: true. */
  selectable?: boolean
  /** Default: true. Sin `size`, el primer resize parte del tamaño YA renderizado (medido por
   * ResizeObserver) — no hace falta fijar un tamaño inicial a mano para poder redimensionar. */
  resizable?: boolean
  /** Default: { width: 120, height: 40 }. */
  minSize?: FlowSize
}

export interface FlowEdge<T = unknown> {
  id: string
  source: string
  target: string
  /** Requerido sólo si el nodo origen tiene más de un handle. */
  sourceHandle?: string
  targetHandle?: string
  data?: T
  selected?: boolean
}

export interface FlowViewport {
  x: number
  y: number
  zoom: number
}

export type HandlePosition = 'top' | 'right' | 'bottom' | 'left'
export type HandleKind = 'source' | 'target'

export interface Connection {
  source: string
  sourceHandle?: string
  target: string
  targetHandle?: string
}

/** `dragging`/`resizing: false` en el último change de un gesto (equivalente al "commit" final). */
export type NodeChange =
  | { type: 'position'; id: string; position: FlowPosition; dragging: boolean }
  | { type: 'select'; id: string; selected: boolean }
  | { type: 'size'; id: string; position: FlowPosition; size: FlowSize; resizing: boolean }

export type EdgeChange = { type: 'select'; id: string; selected: boolean }

export interface FlowNodeComponentProps<T = unknown> {
  id: string
  data: T | undefined
  selected: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeTypes = Record<string, ComponentType<FlowNodeComponentProps<any>>>

export interface FlowClassNames {
  node?: string
  edge?: string
}

export interface FlowProps extends HTMLAttributes<HTMLDivElement> {
  nodes?: FlowNode[]
  defaultNodes?: FlowNode[]
  onNodesChange?: (changes: NodeChange[]) => void

  edges?: FlowEdge[]
  defaultEdges?: FlowEdge[]
  onEdgesChange?: (changes: EdgeChange[]) => void

  viewport?: FlowViewport
  defaultViewport?: FlowViewport
  onViewportChange?: (viewport: FlowViewport) => void

  /** Mapa type→componente para el contenido de cada nodo. Sin `nodeTypes[node.type]`, se usa un
   * renderer por defecto (data.label si existe, si no el id). */
  nodeTypes?: NodeTypes

  minZoom?: number
  maxZoom?: number

  onConnect?: (connection: Connection) => void
  /** 100% responsabilidad del consumidor — Flow sólo da geometría/gesto, nunca reglas de negocio
   * (compatibilidad de tipos, límite de una sola entrada, ciclos). */
  isValidConnection?: (connection: Connection) => boolean

  /** Clases extra por sub-parte, aplicadas junto a la clase fija (`sk-flow__node`/`sk-flow__edge`)
   * vía cx() — nunca la reemplazan. Ver también `FlowHandleProps.className`, que el consumidor
   * pasa directo a `<Flow.Handle>` porque él controla dónde va cada handle. */
  classNames?: FlowClassNames

  children?: ReactNode
}
