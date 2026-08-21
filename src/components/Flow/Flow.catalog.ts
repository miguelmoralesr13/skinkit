import type { ComponentSpec } from '../../catalog/types'

export const flowSpec: ComponentSpec = {
  name: 'Flow',
  dataSk: 'flow',
  category: 'Display',
  description:
    'Diagramador de nodos y edges: canvas pannable/zoomable con nodos HTML reales (no canvas) ' +
    'conectables entre sí — para construir o visualizar flujos.',
  props: [
    {
      name: 'nodes',
      type: 'FlowNode[]',
      required: false,
      description: 'Controlado. Array de nodos (id, position, type, data, selected, draggable, selectable).',
    },
    { name: 'defaultNodes', type: 'FlowNode[]', required: false, description: 'No controlado.' },
    {
      name: 'onNodesChange',
      type: '(changes: NodeChange[]) => void',
      required: false,
      description:
        'Avisa cambios de posición/selección en batch (ej. al arrastrar un nodo). En modo ' +
        'controlado, el consumidor aplica el change a su propio array de nodes.',
    },
    { name: 'edges', type: 'FlowEdge[]', required: false, description: 'Controlado. Array de edges (id, source, target, sourceHandle?, targetHandle?, data, selected).' },
    { name: 'defaultEdges', type: 'FlowEdge[]', required: false, description: 'No controlado.' },
    {
      name: 'onEdgesChange',
      type: '(changes: EdgeChange[]) => void',
      required: false,
      description: 'Avisa cambios de selección de un edge.',
    },
    { name: 'viewport', type: '{ x: number; y: number; zoom: number }', required: false, description: 'Controlado. Pan (x,y) + zoom actual del canvas.' },
    { name: 'defaultViewport', type: '{ x: number; y: number; zoom: number }', required: false, default: '{ x: 0, y: 0, zoom: 1 }', description: 'No controlado.' },
    { name: 'onViewportChange', type: '(viewport) => void', required: false, description: 'Avisa cada cambio de pan/zoom.' },
    {
      name: 'nodeTypes',
      type: 'Record<string, ComponentType<{ id, data, selected }>>',
      required: false,
      description:
        'Mapa type→componente para el contenido de cada nodo (nodo HTML real, definido por vos). ' +
        'Sin nodeTypes[node.type], se usa un renderer por defecto.',
    },
    { name: 'minZoom', type: 'number', required: false, default: '0.25', description: 'Zoom mínimo permitido.' },
    { name: 'maxZoom', type: 'number', required: false, default: '2', description: 'Zoom máximo permitido.' },
    {
      name: 'onConnect',
      type: '(connection: Connection) => void',
      required: false,
      description: 'Se dispara al soltar una conexión sobre un handle válido (source→target).',
    },
    {
      name: 'isValidConnection',
      type: '(connection: Connection) => boolean',
      required: false,
      description:
        '100% responsabilidad del consumidor — Flow nunca decide reglas de negocio (tipos ' +
        'compatibles, límite de una entrada, ciclos). Sin esto, cualquier conexión es válida.',
    },
    {
      name: 'classNames',
      type: '{ node?: string; edge?: string }',
      required: false,
      description:
        'Clases extra por sub-parte (node/edge), aplicadas junto a la clase fija ' +
        '(sk-flow__node/sk-flow__edge) — nunca la reemplazan. Para `<Flow.Handle>` usá su propio ' +
        'prop `className` (ver ese componente), ya que el consumidor lo coloca directamente dentro ' +
        'de su `nodeTypes` y Flow no lo renderiza.',
    },
  ],
  extends: 'HTMLAttributes<HTMLDivElement>',
  parts: [
    { name: 'background', description: 'Fondo punteado del canvas, sigue el pan/zoom.' },
    { name: 'viewport', description: 'Capa transformada (translate+scale) — nodos/edges viven adentro.' },
    {
      name: 'node',
      description:
        'Un nodo. data-node-id, data-selected, data-dragging. Arrastrable (a menos que ' +
        'draggable={false}), seleccionable con click (a menos que selectable={false}), y ' +
        'movible con las flechas del teclado cuando tiene foco.',
    },
    {
      name: 'handle',
      description:
        '<Flow.Handle kind="source|target" position="top|right|bottom|left" id? className?>, ' +
        'colocado por el consumidor DENTRO de su propio componente de nodo. data-node-id, ' +
        'data-handle-id, data-handle-kind, data-handle-position, data-state (idle/valid/invalid ' +
        '— sólo mientras se arrastra una conexión y este handle está bajo el cursor). `className` ' +
        'se aplica junto a la clase fija sk-flow__handle (nunca la reemplaza) — pasado directo ' +
        'porque, a diferencia de node/edge, Flow no renderiza el handle: lo coloca el consumidor.',
    },
    {
      name: 'edge',
      description: 'Un <path> real entre dos handles. data-edge-id, data-selected (click para alternar).',
    },
    {
      name: 'connection',
      description: 'El <path> de una conexión en progreso (arrastrando desde un handle, todavía sin soltar).',
    },
    {
      name: 'controls',
      description:
        '<Flow.Controls /> — botones de zoom in/out/fit-view/reset. Hijo de <Flow>, fuera de la ' +
        'capa transformada (pan/zoom no lo afecta).',
    },
    { name: 'control-button', description: 'Cada botón dentro de controls. data-action.' },
  ],
  examples: [
    {
      title: 'Flujo mínimo con nodeTypes propio',
      code: `function TaskNode({ data }: { id: string; data?: { label: string }; selected: boolean }) {
  return (
    <>
      <Flow.Handle kind="target" position="left" />
      {data?.label}
      <Flow.Handle kind="source" position="right" />
    </>
  )
}
const nodeTypes = { task: TaskNode }

function FlowDemo() {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'task', position: { x: 40, y: 40 }, data: { label: 'Recibir pedido' } },
    { id: '2', type: 'task', position: { x: 320, y: 40 }, data: { label: 'Preparar' } },
    { id: '3', type: 'task', position: { x: 600, y: 40 }, data: { label: 'Entregar' } },
  ])
  const [edges, setEdges] = useState([
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
  ])

  return (
    <Flow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(nds, changes))}
      edges={edges}
      onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(eds, changes))}
      onConnect={(c) => setEdges((eds) => [...eds, { id: crypto.randomUUID(), ...c }])}
    >
      <Flow.Controls />
    </Flow>
  )
}`,
    },
  ],
  usage: [
    'Los nodos son HTML real vía `nodeTypes` — nunca se dibujan en un canvas.',
    'El arrastre de un nodo es "localmente optimista": la posición visual se mueve local al ' +
      'nodo mientras arrastrás; `onNodesChange` te avisa el cambio para que lo apliques a tu ' +
      'propio array — el drag nunca depende de qué tan rápido re-renderice tu app.',
    '`Flow.Handle` va DENTRO del componente que pusiste en `nodeTypes` — Flow nunca decide ' +
      'cuántos handles tiene un nodo ni dónde van.',
    'Sin `isValidConnection`, cualquier conexión es válida. Flow nunca decide reglas de negocio ' +
      '(tipos compatibles, límite de una entrada, ciclos) — eso es 100% tuyo.',
    'v1 NO incluye: minimap, auto-layout, undo/redo, selección múltiple con lazo (sólo click ' +
      'simple), agrupar nodos/sub-flujos, copiar-pegar, snap-to-grid, más de un estilo de ruta de ' +
      'edge (siempre bezier), ni labels sobre un edge. Todo eso es responsabilidad del consumidor ' +
      'o queda para una versión futura — no asumas que existe.',
  ],
  a11y: [
    'Un nodo seleccionable/arrastrable tiene tabIndex — foco + flechas del teclado lo mueven ' +
      '(4px por pulsación), sin necesitar el mouse.',
    'Crear una conexión SÍ requiere mouse/touch (arrastrar de handle a handle) — no hay todavía ' +
      'un flujo por teclado para conectar dos nodos.',
  ],
}
