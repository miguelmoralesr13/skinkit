import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Sidebar>. Actualizar SIEMPRE que cambie Sidebar.tsx. */
export const sidebarSpec: ComponentSpec = {
  name: 'Sidebar',
  dataSk: 'sidebar',
  category: 'Navegación',
  description:
    'Navegación vertical de aplicación. Compound: Sidebar + Sidebar.Section + Sidebar.Item (ícono, label, badge, activo). `collapsed` deja un rail de sólo íconos (lo resuelve el CSS). La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del ítem activo (del theme).' },
    { name: 'collapsed', type: 'boolean', required: false, description: 'Rail colapsado (sólo íconos).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Sidebar.Section / Sidebar.Item.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=sidebar] (<aside>). Lleva [data-collapsed].' },
    { name: 'section', description: '[data-part=section]. <Sidebar.Section label> — grupo; [data-part=section-label] su título.' },
    { name: 'item', description: '[data-part=item]. <Sidebar.Item active icon badge href> — link; [data-active] + aria-current. Adentro: [data-part=item-icon], [data-part=item-label], [data-part=item-badge].' },
  ],
  examples: [
    {
      title: 'Sidebar con secciones',
      code: '<Sidebar>\n  <Sidebar.Section label="Principal">\n    <Sidebar.Item href="#" icon="🏠" active>Inicio</Sidebar.Item>\n    <Sidebar.Item href="#" icon="✉️" badge="3">Mensajes</Sidebar.Item>\n  </Sidebar.Section>\n  <Sidebar.Section label="Cuenta">\n    <Sidebar.Item href="#" icon="⚙️">Ajustes</Sidebar.Item>\n  </Sidebar.Section>\n</Sidebar>',
    },
    { title: 'Rail colapsado', code: '<Sidebar collapsed>\n  <Sidebar.Item href="#" icon="🏠" active>Inicio</Sidebar.Item>\n</Sidebar>' },
  ],
  usage: [
    'Con `collapsed` el CSS oculta los labels y deja sólo íconos; conservá los íconos para que el rail siga siendo navegable.',
    'Agrupá items con Sidebar.Section (con o sin label).',
    'Combinalo con AppShell (área sidebar) y Topbar para el layout completo.',
  ],
}
