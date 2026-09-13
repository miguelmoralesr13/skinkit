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
      description:
        'Controlado. Array de nodos (id, position, size?, type, data, selected, draggable, ' +
        'selectable, resizable, minSize?). `size` es opcional — sin esto, el nodo se autoajusta ' +
        'a su contenido y el primer resize (si `resizable`, default true) parte del tamaño YA ' +
        'medido, sin necesitar fijar uno a mano.',
    },
    { name: 'defaultNodes', type: 'FlowNode[]', required: false, description: 'No controlado.' },
    {
      name: 'onNodesChange',
      type: '(changes: NodeChange[]) => void',
      required: false,
      description:
        'Avisa cambios de posición/selección/tamaño en batch (ej. al arrastrar o redimensionar ' +
        'un nodo). En modo controlado, el consumidor aplica el change a su propio array de nodes.',
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
        'Un nodo. data-node-id, data-node-type (= node.type, para estilar por tipo — ver ' +
        'usage), data-selected, data-dragging, data-resizing. Arrastrable (a menos que ' +
        'draggable={false}), redimensionable con 8 handles (a menos que resizable={false}), ' +
        'seleccionable con click (a menos que selectable={false}), y movible con las flechas del ' +
        'teclado cuando tiene foco. El contenido puede ser HTML interactivo real (input/textarea/' +
        'select/button/a/label/[contenteditable], o incluso una <img> como todo el contenido del ' +
        'nodo) — clickear o escribir ahí NUNCA arranca un drag del nodo (marcá cualquier otro ' +
        'elemento custom con `data-flow-no-drag` si tampoco debe arrastrar).',
    },
    {
      name: 'resize-handle',
      description:
        'Uno de los 8 handles de redimensionar un nodo (mismo mecanismo que ZoneCanvas). ' +
        'data-handle-position="top|right|bottom|left|top-left|top-right|bottom-left|bottom-right".',
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
    'Los nodos son HTML real vía `nodeTypes` — nunca se dibujan en un canvas. Podés poner ' +
      'inputs/selects/botones/links/checkboxes reales adentro (incluso otros componentes de ' +
      'skinkit, o directamente una <img> ocupando todo el nodo) — clickear o escribir ahí ' +
      'funciona normal, no arrastra el nodo.',
    'Color, forma, tamaño y sombra de un nodo son 100% CSS — pisá `--sk-flow-node-bg/-border/' +
      '-radius` (o directamente el selector `[data-part="node"]`) para cambiar el look, igual que ' +
      'cualquier otro componente de skinkit. `size` en el nodo es sólo posición/dimensión — nunca ' +
      'estilo.',
    'Para que DISTINTOS tipos de nodo tengan formas distintas en el mismo Flow (círculo, ' +
      'rombo, hexágono...), usá el selector `[data-node-type="tu-tipo"]` en tu propio CSS — ej. ' +
      '`[data-node-type="inicio"] { border-radius: 50%; }` o `clip-path` para un rombo. `data-' +
      'node-type` refleja `node.type` (el mismo string que usás como key de `nodeTypes`), así que ' +
      'no hace falta ningún prop nuevo para esto.',
    'El arrastre y el resize de un nodo son "localmente optimistas": la posición/tamaño visual ' +
      'se mueven local al nodo mientras arrastrás; `onNodesChange` te avisa el cambio para que lo ' +
      'apliques a tu propio array — ninguno de los dos depende de qué tan rápido re-renderice tu app.',
    'Redimensionar un nodo NO requiere fijarle un `size` inicial — el primer resize parte del ' +
      'tamaño con el que el nodo ya se autoajustó a su contenido (medido por ResizeObserver). ' +
      'Un nodo sin `size` y sin redimensionar nunca sigue siendo puramente content-sized, como ' +
      'siempre.',
    '`Flow.Handle` va DENTRO del componente que pusiste en `nodeTypes` — Flow nunca decide ' +
      'cuántos handles tiene un nodo ni dónde van.',
    'Sin `isValidConnection`, cualquier conexión es válida. Flow nunca decide reglas de negocio ' +
      '(tipos compatibles, límite de una entrada, ciclos) — eso es 100% tuyo.',
    'v1 NO incluye: minimap, auto-layout, undo/redo, selección múltiple con lazo (sólo click ' +
      'simple), agrupar nodos/sub-flujos, copiar-pegar, snap-to-grid, más de un estilo de ruta de ' +
      'edge (siempre bezier), ni labels sobre un edge. Todo eso es responsabilidad del consumidor ' +
      'o queda para una versión futura — no asumas que existe.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `flow` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ flow: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'Un nodo seleccionable/arrastrable tiene tabIndex — foco + flechas del teclado lo mueven ' +
      '(4px por pulsación), sin necesitar el mouse.',
    'Crear una conexión SÍ requiere mouse/touch (arrastrar de handle a handle) — no hay todavía ' +
      'un flujo por teclado para conectar dos nodos. Redimensionar un nodo (los 8 handles) ' +
      'tampoco tiene todavía un flujo por teclado — sólo mover lo tiene.',
  ],
}
