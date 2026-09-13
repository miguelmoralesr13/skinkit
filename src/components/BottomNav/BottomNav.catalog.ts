import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <BottomNav>. Actualizar SIEMPRE que cambie BottomNav.tsx. */
export const bottomNavSpec: ComponentSpec = {
  name: 'BottomNav',
  dataSk: 'bottom-nav',
  category: 'Navegación',
  description:
    'Barra de navegación inferior (tab bar tipo mobile): ícono + label por item, con estado activo. Un item puede abrir un submenú en bottom sheet. Compound: BottomNav + BottomNav.Item + BottomNav.Sheet + BottomNav.SheetItem. No se posiciona sola (no es fixed): la ubica el consumidor o el AppShell (área footer). Skinnable por tokens (`--sk-bottom-nav-*`): NO hay prop `skin`, cada look (brutal, sketch, glass, elevado…) se arma pisando esas variables. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del ítem activo (del theme). La skin puede pisarlo con --sk-bottom-nav-item-fg-active.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Los BottomNav.Item.' },
    { name: 'BottomNav.Item.icon', type: 'ReactNode', required: false, description: 'Ícono del item (arriba del label).' },
    { name: 'BottomNav.Item.active', type: 'boolean', required: false, description: 'Marca el item como activo ([data-active] + aria-current). Manual (lib agnóstica de router).' },
    { name: 'BottomNav.Item.submenu', type: 'ReactNode', required: false, description: 'Si se pasa, el item deja de ser <a> y se vuelve un <button> que abre un bottom sheet con este contenido (normalmente BottomNav.SheetItem).' },
    { name: 'BottomNav.Item.submenuTitle', type: 'ReactNode', required: false, description: 'Encabezado del bottom sheet del submenú (y nombre accesible del diálogo si es texto).' },
    { name: 'BottomNav.Sheet.open', type: 'boolean', required: true, description: 'Estado abierto del sheet (sólo si lo usás suelto; BottomNav.Item lo maneja solo).' },
    { name: 'BottomNav.Sheet.onClose', type: '() => void', required: true, description: 'Se invoca al pedir cierre (Esc / overlay).' },
    { name: 'BottomNav.Sheet.title', type: 'ReactNode', required: false, description: 'Encabezado del sheet.' },
    { name: 'BottomNav.SheetItem.icon', type: 'ReactNode', required: false, description: 'Ícono de la fila del sheet.' },
    { name: 'BottomNav.SheetItem.active', type: 'boolean', required: false, description: 'Fila activa del sheet ([data-active] + aria-current).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=bottom-nav] (<nav>). Lleva [data-tone].' },
    { name: 'item', description: '[data-part=item]. <BottomNav.Item active icon href|submenu> — <a> (link) o <button> (si abre submenú); [data-active] + aria-current. Adentro: [data-part=item-icon], [data-part=item-label]. El indicador de activo es un ::before (off salvo que la skin defina --sk-bottom-nav-indicator-color).' },
    { name: 'sheet-item', description: '[data-part=sheet-item]. <BottomNav.SheetItem active icon href> — fila del bottom sheet del submenú; [data-active] + aria-current. Adentro: [data-part=sheet-item-icon], [data-part=sheet-item-label]. El sheet mismo reusa <Dialog placement="bottom"> (portalizado).' },
  ],
  examples: [
    {
      title: 'Tab bar de 4',
      code: 'import { Home, Search, Bell, User } from \'lucide-react\'\n\n<BottomNav>\n  <BottomNav.Item href="#" icon={<Home />} active>Inicio</BottomNav.Item>\n  <BottomNav.Item href="#" icon={<Search />}>Buscar</BottomNav.Item>\n  <BottomNav.Item href="#" icon={<Bell />}>Alertas</BottomNav.Item>\n  <BottomNav.Item href="#" icon={<User />}>Perfil</BottomNav.Item>\n</BottomNav>',
    },
    {
      title: 'Item con submenú (bottom sheet)',
      code: 'import { Home, Plus, FileText, Image, Video } from \'lucide-react\'\n\n<BottomNav>\n  <BottomNav.Item href="#" icon={<Home />} active>Inicio</BottomNav.Item>\n  <BottomNav.Item icon={<Plus />} submenu={<>\n    <BottomNav.SheetItem href="#" icon={<FileText />}>Documento</BottomNav.SheetItem>\n    <BottomNav.SheetItem href="#" icon={<Image />}>Foto</BottomNav.SheetItem>\n    <BottomNav.SheetItem href="#" icon={<Video />}>Video</BottomNav.SheetItem>\n  </>} submenuTitle="Crear nuevo">Crear</BottomNav.Item>\n</BottomNav>',
    },
    {
      title: 'Skin brutalista (overrides de tokens)',
      code: '/* En tu CSS (no en la lib): armás la skin pisando tokens. */\n.skin-brutal [data-sk="bottom-nav"] {\n  --sk-bottom-nav-radius: 0;\n  --sk-bottom-nav-border-width: 3px;\n  --sk-bottom-nav-border: #000;\n  --sk-bottom-nav-shadow: 0 -4px 0 #000;\n  --sk-bottom-nav-item-bg-active: #ffde00;\n  --sk-bottom-nav-item-fg-active: #000;\n  --sk-bottom-nav-item-radius: 0;\n}\n\n<div className="skin-brutal"><BottomNav>{/* … */}</BottomNav></div>',
    },
  ],
  usage: [
    'Pensada para mobile; en desktop preferí Sidebar/Topbar.',
    'Para fijarla abajo usá el área footer del AppShell, o position:fixed vía className en tu app.',
    'Marcá el item actual con `active` (es manual — la lib es agnóstica de router).',
    'Un item con `submenu` se vuelve <button> (no link) y abre un bottom sheet: usalo para un “+” de crear, un menú de “más”, etc. El sheet reusa Dialog (portal, focus trap, Esc, scroll-lock, overlay) — no reimplementes eso.',
    'Skinnable SÓLO por tokens (no hay prop `skin`, a diferencia de lib-ftt-skinkit): pisá --sk-bottom-nav-* para armar cada look. Disponibles: fondo (`-bg`), borde (`-border`/`-border-width`), `-shadow`, `-radius`, `-pad`, `-gap`; item (`-item-bg/-bg-hover/-bg-active`, `-item-fg/-fg-hover/-fg-active`, `-item-radius/-item-pad/-item-gap/-item-font`, `-icon-size`); indicador de activo (`-indicator-color/-size/-width`, off por defecto); y del sheet (`-sheet-item-fg/-fg-active/-bg-hover/-radius`, `-sheet-gap`).',
    'El “fondo tenue por tono” (soft/tinted) se logra con --sk-bottom-nav-item-bg-active, ej. color-mix(in srgb, var(--color-sk-primary) 14%, transparent).',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `bottomNav` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ bottomNav: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'BottomNav.Item sin submenú es un <a> real con aria-current="page" cuando `active`.',
    'BottomNav.Item con submenú es un <button> con aria-haspopup="dialog" + aria-expanded; el bottom sheet es un Dialog (role=dialog, aria-modal, focus trap, cierre con Esc/overlay).',
    'Conservá el ícono Y el label: la tab bar necesita ambos para ser legible y accesible.',
  ],
}
