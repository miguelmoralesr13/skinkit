import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Topbar>. Actualizar SIEMPRE que cambie Topbar.tsx. */
export const topbarSpec: ComponentSpec = {
  name: 'Topbar',
  dataSk: 'topbar',
  category: 'Navegación',
  description:
    'Barra superior de aplicación. Compound: Topbar + Topbar.Brand + Topbar.Nav + Topbar.Item + Topbar.Search + Topbar.Actions + Topbar.UserMenu + Topbar.IconButton + Topbar.MenuToggle. Los items son links (<a>) con estado activo (aria-current). La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del ítem de nav activo (del theme).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Brand, Nav, Search, Actions, etc.' },
    { name: 'Topbar.Search.icon', type: 'ReactNode', required: false, description: 'Ícono a la izquierda del input (típicamente una lupa).' },
    { name: 'Topbar.Search.shortcut', type: 'ReactNode', required: false, description: 'Pista de atajo a la derecha (ej. "⌘K"). Sin lógica: sólo texto.' },
    { name: 'Topbar.Search.value / onChange / ...', type: 'InputHTMLAttributes<HTMLInputElement>', required: false, description: 'Sin estado propio — vos controlás el input, igual que un <input> nativo.' },
    { name: 'Topbar.UserMenu.trigger', type: 'ReactNode', required: true, description: 'Contenido del botón que abre el menú (ej. Avatar + nombre + ícono de chevron).' },
    { name: 'Topbar.UserMenu.side', type: "'bottom' | 'top'", required: false, default: "'bottom'", description: 'Lado del panel — pasa directo a Menu.' },
    { name: 'Topbar.UserMenu.children', type: 'ReactNode', required: true, description: 'Topbar.UserMenu.Item\'s (alias de Menu.Item) — el contenido del panel.' },
    { name: 'Topbar.IconButton.icon', type: 'ReactNode', required: true, description: 'Ícono del botón.' },
    { name: 'Topbar.IconButton.badge', type: 'ReactNode | true', required: false, description: '`true` = punto sin texto; string/number = contador. Sin dropdown propio — envolvelo en Menu/Popover si necesitás un panel.' },
    { name: 'Topbar.IconButton.label', type: 'string', required: true, description: 'aria-label obligatorio — el botón es sólo-ícono.' },
    { name: 'Topbar.MenuToggle.label', type: 'string', required: false, default: "'Abrir menú'", description: 'aria-label del botón hamburguesa.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=topbar] (<header>).' },
    { name: 'brand', description: '[data-part=brand]. <Topbar.Brand> — logo/nombre.' },
    { name: 'nav', description: '[data-part=nav]. <Topbar.Nav> — contenedor de items.' },
    { name: 'item', description: '[data-part=item]. <Topbar.Item active icon href> — link; [data-active] + aria-current. [data-part=item-icon] adentro.' },
    { name: 'search', description: '[data-part=search]. <Topbar.Search icon shortcut> — input de búsqueda sin estado propio. Adentro: [data-part=search-icon], [data-part=search-input], [data-part=search-shortcut].' },
    { name: 'actions', description: '[data-part=actions]. <Topbar.Actions> — zona derecha (botones, avatar).' },
    { name: 'user-menu', description: '[data-sk=menu][data-part=user-menu]. <Topbar.UserMenu trigger>...</Topbar.UserMenu> — COMPONE <Menu> (no un dropdown nuevo): usa los mismos [data-part=trigger]/[data-part=content]/[data-part=item] de Menu, ya estilados por menu.css. topbar.css sólo ajusta el layout del trigger para que quede sin el borde/pill genérico.' },
    { name: 'icon-button', description: '[data-part=icon-button]. <Topbar.IconButton icon badge label> — botón sólo-ícono. Adentro: [data-part=icon-button-icon], y [data-part=icon-button-badge] (con [data-dot] cuando badge=true) si hay badge.' },
    { name: 'menu-toggle', description: '[data-part=menu-toggle]. <Topbar.MenuToggle> — hamburguesa CSS-only ([data-part=menu-toggle-icon] adentro), sin lógica: vos manejás el estado.' },
  ],
  examples: [
    {
      title: 'Barra con marca, nav y acciones',
      code: '<Topbar>\n  <Topbar.Brand>Pigmento</Topbar.Brand>\n  <Topbar.Nav>\n    <Topbar.Item href="#" active>Inicio</Topbar.Item>\n    <Topbar.Item href="#">Proyectos</Topbar.Item>\n  </Topbar.Nav>\n  <Topbar.Actions>\n    <Button size="sm">Nuevo</Button>\n  </Topbar.Actions>\n</Topbar>',
    },
    {
      title: 'Enterprise: hamburguesa + breadcrumbs + búsqueda + notificaciones + user menu',
      code: 'import { Search, Bell } from \'lucide-react\'\n\n<Topbar>\n  <Topbar.MenuToggle onClick={() => setCollapsed((v) => !v)} />\n  <Topbar.Brand>Acme</Topbar.Brand>\n  <Breadcrumb>\n    <Breadcrumb.Item href="#">Proyectos</Breadcrumb.Item>\n    <Breadcrumb.Item current>Diseño 2026</Breadcrumb.Item>\n  </Breadcrumb>\n  <Topbar.Search icon={<Search size={16} />} placeholder="Buscar..." shortcut="⌘K" />\n  <Topbar.Actions>\n    <Topbar.IconButton icon={<Bell size={18} />} badge={3} label="Notificaciones" />\n    <Topbar.UserMenu trigger={<><Avatar fallback="JD" size="sm" /> Jane</>}>\n      <Topbar.UserMenu.Item>Perfil</Topbar.UserMenu.Item>\n      <Topbar.UserMenu.Item>Cerrar sesión</Topbar.UserMenu.Item>\n    </Topbar.UserMenu>\n  </Topbar.Actions>\n</Topbar>',
    },
  ],
  usage: [
    'Marcá el item actual con `active` (pone aria-current="page").',
    'Poné botones/avatar en Topbar.Actions; se alinean a la derecha.',
    'Topbar.Search no filtra nada por sí solo — es un input controlado como cualquier otro. Para un command palette completo, abrí un CommandMenu controlado desde su onFocus/onClick.',
    'Topbar.UserMenu compone <Menu>: Topbar.UserMenu.Item es literalmente Menu.Item (mismo cierre en Esc/click afuera/selección, misma navegación por teclado). No reinventa esa lógica.',
    'Topbar.IconButton no trae panel propio — para notificaciones con lista, envolvelo en <Menu>/<Popover> vos mismo, igual que harías con cualquier trigger.',
    'Topbar.MenuToggle es sólo un botón estilado — no colapsa nada por sí solo. Wireá su onClick a tu propio boolean y pasáselo a <Sidebar collapsed> (mismo patrón que ya requiere esa prop).',
    'Para breadcrumbs, usá el componente Breadcrumb existente compuesto directamente adentro de Topbar (ver ejemplo enterprise) — no hay un Topbar.Breadcrumbs separado a propósito, para no duplicar ese contrato.',
    'Para el layout completo de app (con sidebar y main), envolvé todo en AppShell.',
  ],
  a11y: [
    'Topbar.UserMenu hereda toda la accesibilidad de Menu: aria-haspopup/aria-expanded en el trigger, role=menu/menuitem en el panel, foco al primer ítem al abrir, flechas/Home/End para navegar.',
    'Topbar.IconButton y Topbar.MenuToggle son botones sólo-ícono — `label`/`aria-label` es obligatorio (o tiene default) para que un lector de pantalla anuncie qué hacen.',
  ],
}
