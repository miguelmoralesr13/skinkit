import { useCallback, useRef, useState, type RefObject } from 'react'
import { useControllable } from '../../lib/useControllable'
import type {
  Connection,
  EdgeChange,
  FlowEdge,
  FlowNode,
  FlowViewport,
  HandlePosition,
  NodeChange,
} from './types'

export interface HandleRegistration {
  position: HandlePosition
}

export interface NodeSize {
  width: number
  height: number
}

export interface HandleRef {
  nodeId: string
  handleId?: string
}

/** Extremo libre de una conexión en progreso — en flow-space (adentro del viewport transformado,
 * como cualquier edge real), sigue al cursor mientras se arrastra desde un handle. `hover` es el
 * handle bajo el cursor en este momento (o null) — como el pointer capture queda en el handle de
 * origen, ningún otro handle recibe sus propios eventos de puntero durante el gesto; por eso el
 * hover se calcula a mano (document.elementFromPoint) en el propio onPointerMove del origen y se
 * guarda acá para que CADA handle pueda leer si es él el que está en hover. */
export interface PendingConnection {
  nodeId: string
  handleId?: string
  point: { x: number; y: number }
  hover: HandleRef | null
}

export interface UseFlowStateOptions {
  nodes?: FlowNode[]
  defaultNodes?: FlowNode[]
  onNodesChange?: (changes: NodeChange[]) => void

  edges?: FlowEdge[]
  defaultEdges?: FlowEdge[]
  onEdgesChange?: (changes: EdgeChange[]) => void

  viewport?: FlowViewport
  defaultViewport?: FlowViewport
  onViewportChange?: (viewport: FlowViewport) => void

  onConnect?: (connection: Connection) => void
  isValidConnection?: (connection: Connection) => boolean
}

const DEFAULT_VIEWPORT: FlowViewport = { x: 0, y: 0, zoom: 1 }

export interface FlowStateModel {
  nodes: FlowNode[]
  applyNodeChanges: (changes: NodeChange[]) => void
  getNode: (id: string) => FlowNode | undefined

  edges: FlowEdge[]
  applyEdgeChanges: (changes: EdgeChange[]) => void

  viewport: FlowViewport
  setViewport: (v: FlowViewport) => void

  handleRegistry: RefObject<Map<string, HandleRegistration>>
  registerHandle: (nodeId: string, handleId: string, reg: HandleRegistration) => () => void

  nodeSizes: RefObject<Map<string, NodeSize>>
  setNodeSize: (nodeId: string, size: NodeSize) => void
  /** Sube cuando cambia un tamaño cacheado — los componentes que dibujan edges lo usan como dep
   * de render (el Map en sí no dispara re-render). */
  nodeSizeVersion: number

  pendingConnection: PendingConnection | null
  startConnection: (nodeId: string, handleId: string | undefined, point: { x: number; y: number }) => void
  updateConnection: (point: { x: number; y: number }, hover: HandleRef | null) => void
  endConnection: (target: HandleRef | null) => void
  isValidConnection?: (connection: Connection) => boolean
}

function applyNodeChangesToArray(nodes: FlowNode[], changes: NodeChange[]): FlowNode[] {
  let next = nodes
  for (const change of changes) {
    if (change.type === 'position') {
      next = next.map((n) => (n.id === change.id ? { ...n, position: change.position } : n))
    } else if (change.type === 'select') {
      next = next.map((n) => (n.id === change.id ? { ...n, selected: change.selected } : n))
    }
  }
  return next
}

function applyEdgeChangesToArray(edges: FlowEdge[], changes: EdgeChange[]): FlowEdge[] {
  let next = edges
  for (const change of changes) {
    if (change.type === 'select') {
      next = next.map((e) => (e.id === change.id ? { ...e, selected: change.selected } : e))
    }
  }
  return next
}

/**
 * Orquesta todo el estado de <Flow>: nodes/edges/viewport (controlado o no), el registro de
 * handles, el tamaño cacheado de cada nodo, y la conexión en progreso. Ver Flow.tsx para el uso.
 *
 * nodes/edges se resuelven a mano (no con useControllable): su callback es un batch de `changes`,
 * no `(value) => void` — misma idea de controlado/no-controlado, forma de callback distinta.
 * viewport sí es un value/onChange simple → usa useControllable tal cual.
 */
export function useFlowState(opts: UseFlowStateOptions): FlowStateModel {
  const {
    nodes: nodesProp,
    defaultNodes = [],
    onNodesChange,
    edges: edgesProp,
    defaultEdges = [],
    onEdgesChange,
    viewport: viewportProp,
    defaultViewport = DEFAULT_VIEWPORT,
    onViewportChange,
    onConnect,
    isValidConnection,
  } = opts

  const [nodesState, setNodesState] = useState(defaultNodes)
  const nodes = nodesProp ?? nodesState
  const applyNodeChanges = useCallback(
    (changes: NodeChange[]) => {
      if (nodesProp === undefined) setNodesState((nds) => applyNodeChangesToArray(nds, changes))
      onNodesChange?.(changes)
    },
    [nodesProp, onNodesChange],
  )
  const getNode = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes])

  const [edgesState, setEdgesState] = useState(defaultEdges)
  const edges = edgesProp ?? edgesState
  const applyEdgeChanges = useCallback(
    (changes: EdgeChange[]) => {
      if (edgesProp === undefined) setEdgesState((eds) => applyEdgeChangesToArray(eds, changes))
      onEdgesChange?.(changes)
    },
    [edgesProp, onEdgesChange],
  )

  const [viewport, setViewport] = useControllable(viewportProp, defaultViewport, onViewportChange)

  // Map en un ref: registrar/desregistrar un handle no necesita re-render por sí solo — un edge
  // se recalcula porque `nodes`/`viewport` cambiaron, nunca porque cambió este Map.
  const handleRegistry = useRef(new Map<string, HandleRegistration>())
  const registerHandle = useCallback((nodeId: string, handleId: string, reg: HandleRegistration) => {
    const key = `${nodeId}:${handleId}`
    handleRegistry.current.set(key, reg)
    return () => {
      handleRegistry.current.delete(key)
    }
  }, [])

  const nodeSizes = useRef(new Map<string, NodeSize>())
  const [nodeSizeVersion, setNodeSizeVersion] = useState(0)
  const setNodeSize = useCallback((nodeId: string, size: NodeSize) => {
    const prev = nodeSizes.current.get(nodeId)
    if (prev && prev.width === size.width && prev.height === size.height) return
    nodeSizes.current.set(nodeId, size)
    setNodeSizeVersion((v) => v + 1)
  }, [])

  const [pendingConnection, setPendingConnection] = useState<PendingConnection | null>(null)
  const startConnection = useCallback(
    (nodeId: string, handleId: string | undefined, point: { x: number; y: number }) => {
      setPendingConnection({ nodeId, handleId, point, hover: null })
    },
    [],
  )
  const updateConnection = useCallback((point: { x: number; y: number }, hover: HandleRef | null) => {
    setPendingConnection((p) => (p ? { ...p, point, hover } : p))
  }, [])
  const endConnection = useCallback(
    (target: HandleRef | null) => {
      setPendingConnection((p) => {
        if (p && target && target.nodeId !== p.nodeId) {
          const connection: Connection = {
            source: p.nodeId,
            sourceHandle: p.handleId,
            target: target.nodeId,
            targetHandle: target.handleId,
          }
          if (!isValidConnection || isValidConnection(connection)) onConnect?.(connection)
        }
        return null
      })
    },
    [isValidConnection, onConnect],
  )

  return {
    nodes,
    applyNodeChanges,
    getNode,
    edges,
    applyEdgeChanges,
    viewport,
    setViewport,
    handleRegistry,
    registerHandle,
    nodeSizes,
    setNodeSize,
    nodeSizeVersion,
    pendingConnection,
    startConnection,
    updateConnection,
    endConnection,
    isValidConnection,
  }
}
