import type { ComponentSpec } from '../../catalog/types'

export const zoneCanvasSpec: ComponentSpec = {
  name: 'ZoneCanvas',
  dataSk: 'zone-canvas',
  category: 'Display',
  description:
    'Canvas de contención espacial: zonas (contenedores) arrastrables y redimensionables, cada ' +
    'una con cero o más items que viven adentro — para maquetas de layout físico (plano de un ' +
    'local, distribución de un depósito, mapa de escritorios, etc.).',
  props: [
    { name: 'zones', type: 'Zone[]', required: false, description: 'Controlado. Array de zonas (id, position, size, type, data, draggable, resizable, minSize).' },
    { name: 'defaultZones', type: 'Zone[]', required: false, description: 'No controlado.' },
    {
      name: 'onZonesChange',
      type: '(changes: ZoneChange[]) => void',
      required: false,
      description:
        'Avisa cambios de posición/tamaño en batch. En modo controlado, el consumidor aplica el ' +
        'change a su propio array de zones — el reducer puro `applyZoneChanges` está exportado ' +
        'para eso, no hace falta reinventarlo.',
    },
    {
      name: 'zoneTypes',
      type: 'Record<string, ComponentType<{ id, data }>>',
      required: false,
      description:
        'Mapa type→componente para el contenido propio de una zona (además de sus items). Sin ' +
        'zoneTypes[zone.type], la zona no renderiza nada propio (sólo sus items).',
    },
    {
      name: 'items',
      type: 'Item[]',
      required: false,
      description:
        'Controlado. Array de items (id, zoneId, position, size?, type, data, draggable, ' +
        'resizable, minSize?). `size` es opcional — sin esto, el item se autoajusta a su ' +
        'contenido y el primer resize (si `resizable`, default true) parte del tamaño YA ' +
        'renderizado, sin necesitar fijar uno a mano.',
    },
    { name: 'defaultItems', type: 'Item[]', required: false, description: 'No controlado.' },
    {
      name: 'onItemsChange',
      type: '(changes: ItemChange[]) => void',
      required: false,
      description:
        'Avisa cambios de posición, tamaño, o de "reparent" (cambio de zona) en batch. El ' +
        'reducer puro `applyItemChanges` está exportado para aplicarlo directo, sin reinventar ' +
        'el switch.',
    },
    {
      name: 'itemTypes',
      type: 'Record<string, ComponentType<{ id, data }>>',
      required: false,
      description:
        'Mapa type→componente para el contenido de cada item — HTML real, definido por vos ' +
        '(igual que `nodeTypes` en Flow). Sin itemTypes[item.type], se usa un renderer por defecto.',
    },
  ],
  extends: 'HTMLAttributes<HTMLDivElement>',
  parts: [
    {
      name: 'zone',
      description:
        'Una zona. data-zone-id, data-zone-type (= zone.type, para estilar por tipo — un ' +
        '`[data-zone-type="..."] { border-radius: ... }` te da formas distintas por tipo de ' +
        'zona), data-dragging, data-resizing, data-drop-target (mientras se arrastra un item de ' +
        'OTRA zona por encima). Arrastrable (a menos que draggable={false}), redimensionable con ' +
        '8 handles (a menos que resizable={false}), y movible con las flechas del teclado cuando ' +
        'tiene foco.',
    },
    {
      name: 'resize-handle',
      description:
        'Uno de los 8 handles de redimensionar una zona O un item (mismo mecanismo para ambos). ' +
        'data-handle-position="top|right|bottom|left|top-left|top-right|bottom-left|bottom-right".',
    },
    {
      name: 'zone-body',
      description:
        'Contenedor del contenido propio de la zona (zoneTypes) y de sus items. ' +
        '`overflow: visible` por default — ver usage sobre por qué.',
    },
    {
      name: 'item',
      description:
        'Un item, hijo DOM de su zona dueña. data-item-id, data-item-type (= item.type, para ' +
        'estilar por tipo), data-dragging, data-resizing. Arrastrable dentro de su zona (a menos ' +
        'que draggable={false}), redimensionable con 8 handles (a menos que resizable={false}), ' +
        'y movible con las flechas del teclado cuando tiene foco; soltarlo (con mouse/touch) ' +
        'sobre otra zona lo reparenta ahí.',
    },
  ],
  examples: [
    {
      title: 'Layout genérico con reparent entre zonas',
      code: `function ItemCard({ data }: { id: string; data?: { label: string } }) {
  return <>{data?.label}</>
}
const itemTypes = { card: ItemCard }

function ZoneCanvasDemo() {
  const [zones, setZones] = useState([
    { id: 'a', position: { x: 20, y: 20 }, size: { width: 240, height: 200 } },
    { id: 'b', position: { x: 300, y: 20 }, size: { width: 240, height: 200 } },
  ])
  const [items, setItems] = useState([
    { id: '1', zoneId: 'a', type: 'card', position: { x: 16, y: 16 }, data: { label: 'Uno' } },
    { id: '2', zoneId: 'a', type: 'card', position: { x: 16, y: 60 }, data: { label: 'Dos' } },
  ])

  return (
    <ZoneCanvas
      zones={zones}
      onZonesChange={(changes) => setZones((zs) => applyZoneChanges(zs, changes))}
      items={items}
      itemTypes={itemTypes}
      onItemsChange={(changes) => setItems((its) => applyItemChanges(its, changes))}
    />
  )
}`,
    },
  ],
  usage: [
    'Sin pan/zoom — a diferencia de Flow, las zonas viven en un layout acotado, no en un grafo ' +
      'potencialmente infinito. El canvas raíz es un `overflow: auto` simple.',
    'Genérico a propósito: "zone"/"item" son los nombres — nada de "mesa"/"restaurante" en la ' +
      'API. Sirve igual para un plano de local, un mapa de escritorios, un depósito, un ' +
      'estacionamiento, etc. (ver el ejemplo de arriba, y el demo del playground que sí usa un ' +
      'layout de restaurante como ilustración — es sólo un caso de uso, no el modelo del componente).',
    'Los items son hijos DOM de su zona dueña — no del canvas — porque la contención es el punto ' +
      'central del componente (a diferencia de Flow, donde los nodos son canvas-relative).',
    'Color/forma de una zona o item son 100% CSS, y para tener formas distintas por TIPO en el ' +
      'mismo canvas (una zona circular, otra rectangular) usá `[data-zone-type="..."]` / ' +
      '`[data-item-type="..."]` en tu propio CSS — reflejan `zone.type`/`item.type` directo, sin ' +
      'ningún prop nuevo.',
    'Encoger una zona NUNCA mueve ni recorta sus items (`zone-body` es `overflow: visible` por ' +
      'default) — si un item queda fuera de los nuevos límites, se ve desbordando visualmente, no ' +
      'desaparece ni se reacomoda solo. Si tu caso de uso necesita reacomodar o recortar, hacelo ' +
      'vos en `onZonesChange` (o pisá `overflow` en tu propio CSS).',
    'Arrastrar un item lo clampea sólo contra los límites de su zona de ORIGEN durante el gesto ' +
      '— al soltarlo sobre otra zona, se emite un único change `reparent` con la posición ya ' +
      'recalculada relativa a la zona nueva (no una sucesión de position changes contra la zona ' +
      'equivocada mientras cruza el límite).',
    'Los items TAMBIÉN se redimensionan con 8 handles (mismo mecanismo que las zonas) — sin ' +
      '`size`, el primer resize parte del tamaño con el que el item ya se autoajustó a su ' +
      'contenido, sin necesitar fijar uno a mano. El resize de un item no está atado al tamaño ' +
      'de su zona — puede terminar más grande que ella (se ve desbordando, igual que al encoger ' +
      'la zona).',
    'v1 NO incluye: pan/zoom del canvas, snap-to-grid, detección de colisión entre items de una ' +
      'misma zona, selección múltiple, anidar zonas dentro de zonas, rotación de items, undo/redo, ' +
      'ni redimensionar una zona o item por teclado (sólo moverlos). Todo eso es ' +
      'responsabilidad del consumidor o queda para una versión futura — no asumas que existe.',
  ],
  a11y: [
    'Una zona o un item arrastrable tiene tabIndex — foco + flechas del teclado lo mueven (4px ' +
      'por pulsación), sin necesitar el mouse. Un item movido por teclado se clampea contra su ' +
      'zona actual, igual que al arrastrarlo con el mouse.',
    'Redimensionar una zona o item (los 8 handles) y reparentar un item a OTRA zona SÍ requieren ' +
      'mouse/touch — no hay todavía un flujo por teclado para ninguno de los tres.',
  ],
}
