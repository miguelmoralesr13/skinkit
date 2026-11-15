import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <SortableList>. Actualizar SIEMPRE que cambie SortableList.tsx. */
export const sortableListSpec: ComponentSpec = {
  name: 'SortableList',
  dataSk: 'sortable-list',
  category: 'Formulario',
  description:
    'Lista editable y reordenable (pasos de un procedimiento, tareas de una plantilla): agrega, quita y reordena cada elemento con arrastre, con botones Subir/Bajar y con teclado; la numeración se recalcula y cada cambio se anuncia con aria-live. Controlado: tú posees `value`.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'>",
  props: [
    { name: 'value', type: 'T[]', required: true, description: 'Elementos, en orden (controlado).' },
    { name: 'onChange', type: '(next: T[]) => void', required: true, description: 'Recibe la lista completa nueva tras reordenar o quitar.' },
    { name: 'renderItem', type: '(item: T, ctx: { index: number; total: number; dragging: boolean }) => ReactNode', required: true, description: 'Contenido de cada elemento (un campo, texto…).' },
    { name: 'getKey', type: '(item: T, index: number) => string | number', required: false, description: 'Clave estable. Por omisión item.id; si no existe, el índice (con campos editables pasa siempre un id estable).' },
    { name: 'itemLabel', type: '(item: T, index: number) => string', required: false, default: "'elemento N' (según locale)", description: 'Nombre accesible de cada elemento para sus botones y anuncios.' },
    { name: 'onAdd', type: '() => void', required: false, description: 'Muestra el botón «Agregar»; tú añades el elemento nuevo a `value`.' },
    { name: 'addLabel', type: 'ReactNode', required: false, default: "'Agregar' (según locale)", description: 'Texto del botón agregar.' },
    { name: 'removable', type: 'boolean', required: false, default: 'true', description: 'Muestra «Quitar» por elemento.' },
    { name: 'minItems', type: 'number', required: false, default: '0', description: 'No deja quitar por debajo de este número.' },
    { name: 'label', type: 'string', required: false, description: 'Nombre accesible de la lista.' },
    { name: 'empty', type: 'ReactNode', required: false, default: "'Sin elementos' (según locale)", description: 'Contenido cuando no hay elementos.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Desactiva agregar, quitar y reordenar.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=sortable-list].' },
    { name: 'list', description: '<ol> numerada.' },
    { name: 'item', description: '<li>. [data-dragging] mientras se arrastra, [data-over] sobre el destino.' },
    { name: 'index', description: 'Número de posición (recalculado).' },
    { name: 'content', description: 'Lo que dibuja renderItem.' },
    { name: 'actions', description: 'Grupo de botones del elemento.' },
    { name: 'handle', description: 'Asa de arrastre (Alt+↑/↓ también mueve).' },
    { name: 'move-up', description: 'Botón Subir (aria-disabled en el primero).' },
    { name: 'move-down', description: 'Botón Bajar (aria-disabled en el último).' },
    { name: 'remove', description: 'Botón Quitar.' },
    { name: 'add', description: 'Botón Agregar.' },
    { name: 'empty', description: 'Mensaje de lista vacía.' },
    { name: 'status', description: 'Región aria-live oculta que anuncia movimientos y bajas.' },
  ],
  examples: [
    {
      title: 'Pasos de un procedimiento',
      code: `const [pasos, setPasos] = useState([{ id: 'a', texto: 'Preparar' }, { id: 'b', texto: 'Ejecutar' }])
<SortableList
  label="Pasos"
  value={pasos}
  onChange={setPasos}
  onAdd={() => setPasos([...pasos, { id: crypto.randomUUID(), texto: '' }])}
  renderItem={(p, { index }) => (
    <Textarea aria-label={'Paso ' + (index + 1)} value={p.texto}
      onChange={(e) => setPasos(pasos.map((x) => (x.id === p.id ? { ...x, texto: e.target.value } : x)))} />
  )}
/>`,
    },
  ],
  usage: [
    'Para listas donde el ORDEN importa y el usuario las edita (pasos, tareas). Para elegir entre opciones usa Select/ChipGroup.',
    'Es controlado: guarda en tu estado lo que llega en onChange. Pasa ids estables (getKey) si dibujas campos, o perderán foco/valor al reordenar.',
    'Responsive por contenedor (no por ventana): en un contenedor de 28rem o menos los botones Subir/Bajar/Quitar bajan a su propia fila bajo el campo; el marcado no cambia. La raíz declara `container-type: inline-size` (si la pones en un padre que se ajusta a su contenido, dale ancho).',
    'El arrastre HTML5 no funciona con el dedo en la mayoría de móviles: Subir/Bajar cubren ese caso (siempre están).',
  ],
  a11y: [
    'Lista <ol> con numeración; cada botón nombra su elemento ("Subir elemento 2"). En el primero/último, Subir/Bajar quedan aria-disabled sin perder el foco.',
    'Teclado: Alt+↑/↓ sobre el asa mueve; Tab recorre los botones. Cada movimiento o baja se anuncia en una región aria-live.',
  ],
}
