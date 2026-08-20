import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <BottomNav>. Actualizar SIEMPRE que cambie BottomNav.tsx. */
export const bottomNavSpec: ComponentSpec = {
  name: 'BottomNav',
  dataSk: 'bottom-nav',
  category: 'Navegación',
  description:
    'Barra de navegación inferior (tab bar tipo mobile): ícono + label por item, con estado activo. Compound: BottomNav + BottomNav.Item. No se posiciona sola (no es fixed): la ubica el consumidor o el AppShell (área footer). La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del ítem activo (del theme).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Los BottomNav.Item.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=bottom-nav] (<nav>).' },
    { name: 'item', description: '[data-part=item]. <BottomNav.Item active icon href> — link; [data-active] + aria-current. Adentro: [data-part=item-icon], [data-part=item-label].' },
  ],
  examples: [
    {
      title: 'Tab bar de 4',
      code: 'import { Home, Search, Bell, User } from \'lucide-react\'\n\n<BottomNav>\n  <BottomNav.Item href="#" icon={<Home size={18} />} active>Inicio</BottomNav.Item>\n  <BottomNav.Item href="#" icon={<Search size={18} />}>Buscar</BottomNav.Item>\n  <BottomNav.Item href="#" icon={<Bell size={18} />}>Alertas</BottomNav.Item>\n  <BottomNav.Item href="#" icon={<User size={18} />}>Perfil</BottomNav.Item>\n</BottomNav>',
    },
  ],
  usage: [
    'Pensada para mobile; en desktop preferí Sidebar/Topbar.',
    'Para fijarla abajo usá el área footer del AppShell, o position:fixed vía className en tu app.',
    'Marcá el item actual con `active`.',
  ],
}
