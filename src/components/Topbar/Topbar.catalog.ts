import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Topbar>. Actualizar SIEMPRE que cambie Topbar.tsx. */
export const topbarSpec: ComponentSpec = {
  name: 'Topbar',
  dataSk: 'topbar',
  category: 'Navegación',
  description:
    'Barra superior de aplicación. Compound: Topbar + Topbar.Brand + Topbar.Nav + Topbar.Item + Topbar.Actions. Los items son links (<a>) con estado activo (aria-current). La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del ítem de nav activo (del theme).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Brand, Nav y Actions.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=topbar] (<header>).' },
    { name: 'brand', description: '[data-part=brand]. <Topbar.Brand> — logo/nombre.' },
    { name: 'nav', description: '[data-part=nav]. <Topbar.Nav> — contenedor de items.' },
    { name: 'item', description: '[data-part=item]. <Topbar.Item active icon href> — link; [data-active] + aria-current. [data-part=item-icon] adentro.' },
    { name: 'actions', description: '[data-part=actions]. <Topbar.Actions> — zona derecha (botones, avatar).' },
  ],
  examples: [
    {
      title: 'Barra con marca, nav y acciones',
      code: '<Topbar>\n  <Topbar.Brand>Pigmento</Topbar.Brand>\n  <Topbar.Nav>\n    <Topbar.Item href="#" active>Inicio</Topbar.Item>\n    <Topbar.Item href="#">Proyectos</Topbar.Item>\n  </Topbar.Nav>\n  <Topbar.Actions>\n    <Button size="sm">Nuevo</Button>\n  </Topbar.Actions>\n</Topbar>',
    },
  ],
  usage: [
    'Marcá el item actual con `active` (pone aria-current="page").',
    'Poné botones/avatar en Topbar.Actions; se alinean a la derecha.',
    'Para el layout completo de app (con sidebar y main), envolvé todo en AppShell.',
  ],
}
