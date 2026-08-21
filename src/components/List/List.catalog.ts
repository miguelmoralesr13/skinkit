import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <List>. Actualizar SIEMPRE que cambie List.tsx o useList.ts. */
export const listSpec: ComponentSpec = {
  name: 'List',
  dataSk: 'list',
  category: 'Navegación',
  description:
    'Lista de filas con ícono/título/descripción/meta/acciones, opcionalmente clickeables y activas. Dos modos: estático (children, para navegación lateral/settings/resultados chicos) o data-driven (pasando `items` + `renderItem`, que suma búsqueda cliente/server, scroll infinito y virtualización — para listas grandes/buscables). Compuesto: <List> con <List.Item>. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },
    { name: 'items', type: 'T[]', required: false, description: 'Activa el modo data-driven. Sin esto, List renderiza `children` tal cual (modo estático, sin cambios).' },
    { name: 'renderItem', type: '(item: T, index: number) => ReactNode', required: false, description: 'Obligatorio junto con `items` — típicamente devuelve un <List.Item>.' },
    { name: 'rowKey', type: '(item: T, index: number) => string | number', required: false, default: 'índice', description: 'Key de cada fila. Poné una key real si los items pueden reordenarse estando `virtualized`.' },
    { name: 'filterable', type: 'boolean', required: false, default: 'false', description: 'Muestra el input de búsqueda [data-part=search].' },
    { name: 'filterValue', type: 'string', required: false, description: 'Valor controlado del filtro.' },
    { name: 'defaultFilterValue', type: 'string', required: false, default: "''", description: 'Valor inicial no controlado.' },
    { name: 'onFilterChange', type: '(value: string) => void', required: false, description: 'Si se pasa, la búsqueda es SERVER-driven: List no filtra — sólo avisa el query, vos le pasás `items` ya filtrado. Sin esto, filtra con `filterItem` (cliente).' },
    { name: 'filterPlaceholder', type: 'string', required: false, default: "'Buscar…'", description: 'Placeholder del input de búsqueda.' },
    { name: 'filterItem', type: '(item: T, query: string) => boolean', required: false, description: 'Predicado de filtro CLIENTE. Sin esto (y sin onFilterChange), `filterable` muestra el input pero no filtra nada — List no tiene columnas tipadas de las que inferir qué buscar, a diferencia de DataTable.' },
    { name: 'infinite', type: 'boolean', required: false, default: 'false', description: 'Activa el scroll infinito: sentinel + IntersectionObserver (mismo mecanismo que DataTable, ver src/lib/useInfiniteScroll.ts).' },
    { name: 'hasMore', type: 'boolean', required: false, description: 'Si hay más para cargar (con `infinite`).' },
    { name: 'loadingMore', type: 'boolean', required: false, description: 'Muestra el estado de carga en el sentinel.' },
    { name: 'onLoadMore', type: '() => void', required: false, description: 'Se llama al entrar el sentinel en viewport (con hasMore && !loadingMore).' },
    { name: 'virtualized', type: 'boolean', required: false, default: 'false', description: 'Ventanea las filas (mismo useVirtualizer que DataTable) — sólo aplica en modo data-driven.' },
    { name: 'rowHeight', type: 'number', required: false, description: 'Alto fijo de cada fila en px — requerido junto con `virtualized`.' },
    { name: 'height', type: 'number', required: false, description: 'Alto del contenedor con scroll — requerido junto con `virtualized`.' },
    { name: 'loading', type: 'boolean', required: false, default: 'false', description: 'Muestra [data-part=loading] (modo data-driven).' },
    { name: 'emptyContent', type: 'ReactNode', required: false, default: "'Sin resultados'", description: 'Contenido cuando `items` (ya filtrado) queda vacío.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=list]. <ul> en modo estático; <div> en modo data-driven (necesita lugar para el toolbar de búsqueda, que no puede ir dentro de un <ul>).' },
    { name: 'toolbar', description: '[data-part=toolbar]. Sólo modo data-driven + filterable — contiene [data-part=search].' },
    { name: 'items', description: '[data-part=items]. El <ul> real en modo data-driven (scrolleable si virtualized).' },
    { name: 'item', description: 'Cada fila (<li>). Lleva [data-active] y [data-interactive]. <List.Item icon title description meta actions active onSelect>.' },
    { name: 'icon', description: 'Ícono a la izquierda.' },
    { name: 'title', description: 'Título.' },
    { name: 'description', description: 'Descripción.' },
    { name: 'meta', description: 'Texto o UNA acción a la derecha.' },
    { name: 'actions', description: 'Fila de VARIAS acciones (ej. botones ícono de editar/borrar) — se renderiza después de meta.' },
    { name: 'sentinel', description: 'Sólo si `infinite` — dispara onLoadMore al entrar en viewport.' },
    { name: 'loading', description: 'Sólo modo data-driven + `loading`.' },
    { name: 'empty', description: 'Sólo modo data-driven, cuando no hay resultados.' },
  ],
  examples: [
    {
      title: 'Ajustes (modo estático)',
      code: '<List>\n  <List.Item icon={<UserIcon />} title="Cuenta" description="Perfil y seguridad" active onSelect={ir} />\n  <List.Item icon={<BellIcon />} title="Notificaciones" meta="3" onSelect={ir} />\n</List>',
    },
    {
      title: 'Data-driven: búsqueda + scroll infinito + virtualizada',
      code: `import { List } from 'skinkit'
import { User, Pencil, Trash2 } from 'lucide-react'

<List
  items={visibleUsers}
  rowKey={(u) => u.id}
  filterable
  filterItem={(u, q) => u.name.toLowerCase().includes(q.toLowerCase())}
  infinite
  hasMore={hasMore}
  loadingMore={loadingMore}
  onLoadMore={loadMore}
  virtualized
  rowHeight={64}
  height={480}
  renderItem={(u) => (
    <List.Item
      icon={<User size={18} />}
      title={u.name}
      description={u.email}
      actions={
        <>
          <button aria-label="Editar" onClick={() => edit(u)}><Pencil size={16} /></button>
          <button aria-label="Borrar" onClick={() => remove(u)}><Trash2 size={16} /></button>
        </>
      }
    />
  )}
/>`,
    },
    {
      title: 'Búsqueda server-side',
      code: `<List
  items={results}
  filterable
  filterValue={query}
  onFilterChange={setQuery}   // vos hacés el fetch y actualizás \`results\`; List no filtra nada
  renderItem={(r) => <List.Item title={r.title} />}
/>`,
    },
  ],
  usage: [
    'Con `onSelect` la fila se vuelve clickeable (foco + Enter/Espacio) y podés marcar la actual con `active`. Sin onSelect es una fila de sólo presentación — aplica en ambos modos.',
    'Sin `items`, List es 100% igual al modo estático de siempre — todas las props nuevas son opt-in y no afectan ese uso.',
    'Con `items` + `filterable` pero SIN `filterItem` ni `onFilterChange`: el input de búsqueda aparece pero no filtra nada. Pasá uno de los dos.',
    '`onFilterChange` implica búsqueda server-side: List deja de filtrar por su cuenta, sólo te avisa el query — filtrá vos y pasá `items` actualizado.',
    '`virtualized` requiere `rowHeight` (alto fijo por fila) y `height` (alto del contenedor). Filas de alto variable no son compatibles con esta versión (misma limitación que DataTable).',
    'Para acciones en un dropdown usá Menu; para pasos, Stepper; para datos tabulares con columnas, DataTable — List es para filas ícono+título+descripción+acciones, no para tablas.',
  ],
  a11y: [
    'Las filas interactivas son role=button, focuseables, con aria-current en la activa.',
    'El input de búsqueda lleva aria-label="Buscar en la lista".',
  ],
}
