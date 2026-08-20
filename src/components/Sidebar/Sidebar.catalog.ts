import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Sidebar>. Actualizar SIEMPRE que cambie Sidebar.tsx. */
export const sidebarSpec: ComponentSpec = {
  name: 'Sidebar',
  dataSk: 'sidebar',
  category: 'Navegación',
  description:
    'Navegación vertical de aplicación. Compound: Sidebar + Sidebar.Header + Sidebar.Section + Sidebar.Group (colapsable) + Sidebar.Item + Sidebar.Footer. `collapsed` deja un rail de sólo íconos (lo resuelve el CSS); scrollea internamente con Header/Footer fijos. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del ítem activo (del theme).' },
    { name: 'collapsed', type: 'boolean', required: false, description: 'Rail colapsado (sólo íconos). Los Sidebar.Group pierden su trigger de expandir/colapsar en este modo (ver usage).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Sidebar.Header / Sidebar.Section / Sidebar.Group / Sidebar.Item / Sidebar.Footer.' },
    { name: 'Sidebar.Group.icon', type: 'ReactNode', required: false, description: 'Ícono del trigger del grupo.' },
    { name: 'Sidebar.Group.label', type: 'ReactNode', required: true, description: 'Texto del trigger del grupo.' },
    { name: 'Sidebar.Group.badge', type: 'ReactNode', required: false, description: 'Badge del trigger del grupo (ej. contador).' },
    { name: 'Sidebar.Group.defaultOpen', type: 'boolean', required: false, default: 'false', description: 'Estado inicial no controlado.' },
    { name: 'Sidebar.Group.open', type: 'boolean', required: false, description: 'Estado controlado — si se pasa, vos manejás la apertura/cierre.' },
    { name: 'Sidebar.Group.onOpenChange', type: '(open: boolean) => void', required: false, description: 'Se llama al abrir/cerrar (controlado o no).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=sidebar] (<aside>). Lleva [data-collapsed]. Scrollea internamente (overflow-y-auto); Header/Footer quedan sticky arriba/abajo.' },
    { name: 'header', description: '[data-part=header]. <Sidebar.Header> — slot fijo arriba (logo, selector de workspace).' },
    { name: 'footer', description: '[data-part=footer]. <Sidebar.Footer> — slot fijo abajo (perfil de usuario).' },
    { name: 'section', description: '[data-part=section]. <Sidebar.Section label> — grupo ESTÁTICO (siempre visible); [data-part=section-label] su título.' },
    { name: 'group', description: '[data-part=group]. <Sidebar.Group icon label badge> — grupo COLAPSABLE de Sidebar.Item anidados. [data-state=open|closed] en el wrapper.' },
    { name: 'group-trigger', description: '[data-part=group-trigger]. Botón que abre/cierra el grupo — [data-state=open|closed] + aria-expanded. Reusa [data-part=item-icon]/item-label/item-badge por dentro.' },
    { name: 'group-indicator', description: '[data-part=group-indicator]. Chevron que rota 90° al abrir (mismo truco que Accordion).' },
    { name: 'group-panel', description: '[data-part=group-panel]. Contenedor de los Sidebar.Item anidados — [data-state=open|closed], usa `hidden` nativo cuando está cerrado (no anima altura vía JS, igual que Accordion.Panel).' },
    { name: 'item', description: '[data-part=item]. <Sidebar.Item active icon badge href> — link; [data-active] + aria-current. Adentro: [data-part=item-icon], [data-part=item-label], [data-part=item-badge].' },
  ],
  examples: [
    {
      title: 'Sidebar con secciones',
      code: 'import { Home, Mail, Settings } from \'lucide-react\'\n\n<Sidebar>\n  <Sidebar.Section label="Principal">\n    <Sidebar.Item href="#" icon={<Home size={18} />} active>Inicio</Sidebar.Item>\n    <Sidebar.Item href="#" icon={<Mail size={18} />} badge="3">Mensajes</Sidebar.Item>\n  </Sidebar.Section>\n  <Sidebar.Section label="Cuenta">\n    <Sidebar.Item href="#" icon={<Settings size={18} />}>Ajustes</Sidebar.Item>\n  </Sidebar.Section>\n</Sidebar>',
    },
    { title: 'Rail colapsado', code: 'import { Home } from \'lucide-react\'\n\n<Sidebar collapsed>\n  <Sidebar.Item href="#" icon={<Home size={18} />} active>Inicio</Sidebar.Item>\n</Sidebar>' },
    {
      title: 'Enterprise: Header + Group anidado + Footer',
      code: 'import { Home, Settings, User } from \'lucide-react\'\n\n<Sidebar>\n  <Sidebar.Header>\n    <strong>Acme Inc.</strong>\n  </Sidebar.Header>\n  <Sidebar.Section label="Principal">\n    <Sidebar.Item href="#" icon={<Home size={18} />} active>Inicio</Sidebar.Item>\n  </Sidebar.Section>\n  <Sidebar.Group icon={<Settings size={18} />} label="Configuración" defaultOpen>\n    <Sidebar.Item href="#">Perfil</Sidebar.Item>\n    <Sidebar.Item href="#">Facturación</Sidebar.Item>\n    <Sidebar.Item href="#">Equipo</Sidebar.Item>\n  </Sidebar.Group>\n  <Sidebar.Footer>\n    <Sidebar.Item href="#" icon={<User size={18} />}>Jane Doe</Sidebar.Item>\n  </Sidebar.Footer>\n</Sidebar>',
    },
  ],
  usage: [
    'Con `collapsed` el CSS oculta los labels y deja sólo íconos; conservá los íconos para que el rail siga siendo navegable.',
    'Agrupá items estáticos con Sidebar.Section (con o sin label). Para nav anidada que el usuario puede expandir/contraer, usá Sidebar.Group en su lugar.',
    'Sidebar.Group es no controlado por default (cada grupo abre/cierra independiente — a diferencia de Accordion, varios grupos pueden estar abiertos a la vez). Pasá `open`/`onOpenChange` sólo si necesitás manejar el estado vos (ej. recordarlo en localStorage).',
    'Un Sidebar.Group dentro de un Sidebar `collapsed` pierde su trigger de expandir (queda sólo el ícono, sin chevron ni panel) — todavía no hay flyout-al-hacer-hover en esta versión. Si tu rail colapsado necesita sub-menús, mantené el sidebar en modo completo o esperá a esa feature.',
    'El estado `active` es manual — esta librería es agnóstica de router. Calculalo vos (ej. `pathname === href` con `usePathname()`/`useLocation()` de tu router) y pasalo a cada Sidebar.Item.',
    'Sidebar.Header y Sidebar.Footer quedan fijos arriba/abajo mientras el resto scrollea — usalos para un logo/selector de workspace arriba y un perfil de usuario abajo.',
    'Para que el scroll interno (y por lo tanto el sticky de Header/Footer) funcione, Sidebar necesita una altura acotada real. Adentro de AppShell esto ya está resuelto (su celda de grilla fija min-block-size:0). Si usás Sidebar SUELTO dentro de tu propio contenedor flex (ej. `<div style={{height, display:"flex"}}>`), agregale `style={{minHeight: 0}}` a Sidebar — si no, el gotcha clásico de flexbox (los flex-items tienen min-height:auto por default) hace que el `<aside>` crezca a su contenido en vez de scrollear.',
    'Combinalo con AppShell (área sidebar) y Topbar para el layout completo.',
  ],
  a11y: [
    'Sidebar.Group.trigger es un <button> real con aria-expanded — Enter/Espacio abren/cierran sin JS extra.',
    'Sidebar.Group.panel usa `hidden` nativo cuando está cerrado (saca el contenido del tab order), igual que Accordion.Panel — no lo reemplaces por un `display:none` en CSS propio o perdés esa garantía.',
    'Sidebar.Item sigue siendo un <a> real con aria-current="page" cuando `active` — no un botón disfrazado.',
  ],
}
