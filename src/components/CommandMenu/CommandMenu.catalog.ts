import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <CommandMenu>. Actualizar SIEMPRE que cambie CommandMenu.tsx. */
export const commandMenuSpec: ComponentSpec = {
  name: 'CommandMenu',
  dataSk: 'command-menu',
  category: 'Overlay',
  description:
    'Paleta de comandos (⌘K): overlay con buscador y lista filtrada/agrupada de acciones. Teclado ↑↓ navegan, Enter ejecuta, Esc cierra. Portaliza a <body> y reaplica theme/skin. La forma la da el skin.',
  extends: '—',
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Si está abierta (controlado — abrila vos con ⌘K/Ctrl+K).' },
    { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Se invoca al cerrar (Esc/overlay/elegir).' },
    { name: 'items', type: 'CommandItem[]', required: true, description: 'Comandos: { id, label, group?, keywords?, shortcut?, icon?, disabled?, onSelect }.' },
    { name: 'placeholder', type: 'string', required: false, default: "'Buscar comando…'", description: 'Placeholder del buscador.' },
    { name: 'emptyText', type: 'string', required: false, default: "'Sin resultados'", description: 'Mensaje sin coincidencias.' },
    { name: 'label', type: 'string', required: false, default: "'Comandos'", description: 'aria-label del diálogo.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor portalizado [data-sk=command-menu].' },
    { name: 'overlay', description: 'Fondo (cierra al click).' },
    { name: 'panel', description: 'La caja (role=dialog).' },
    { name: 'input', description: 'Buscador (role=combobox).' },
    { name: 'list', description: 'Resultados (role=listbox).' },
    { name: 'group', description: 'Sección; con [data-part=group-label].' },
    { name: 'item', description: 'Cada comando (role=option). Lleva [data-active]. Con [data-part=icon] y [data-part=shortcut].' },
    { name: 'empty', description: 'Mensaje sin resultados.' },
  ],
  examples: [
    {
      title: 'Paleta',
      code: 'const [open, setOpen] = useState(false)\n// abrila con un listener de ⌘K/Ctrl+K\n<CommandMenu open={open} onOpenChange={setOpen} items={[\n  { id: "new", label: "Nuevo proyecto", group: "Acciones", shortcut: "⌘N", onSelect: nuevo },\n  { id: "settings", label: "Ajustes", group: "Ir a", onSelect: irAjustes },\n]} />',
    },
  ],
  usage: [
    'Es controlado: vos abrís con un atajo (⌘K/Ctrl+K) y cerrás en onOpenChange.',
    'Filtra por `label` y `keywords`; agrupá con `group`. Cada item corre su `onSelect` y cierra.',
    'Para un menú de acciones sobre algo puntual, usá Menu; esto es una paleta global de búsqueda.',
  ],
  a11y: [
    'input role=combobox + lista role=listbox; el ítem activo va con [data-active]/aria-selected.',
    'El foco arranca en el buscador; Esc y click en el overlay cierran.',
  ],
}
