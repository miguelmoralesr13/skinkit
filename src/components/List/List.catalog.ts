import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <List>. Actualizar SIEMPRE que cambie List.tsx. */
export const listSpec: ComponentSpec = {
  name: 'List',
  dataSk: 'list',
  category: 'Navegación',
  description:
    'Lista de filas con ícono/título/descripción/meta, opcionalmente clickeables y activas (navegación lateral, resultados, settings). Compuesto: <List> con <List.Item>. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLUListElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },
  ],
  parts: [
    { name: 'root', description: 'El <ul> [data-sk=list].' },
    { name: 'item', description: 'Cada fila (<li>). Lleva [data-active] y [data-interactive]. <List.Item icon title description meta active onSelect>.' },
    { name: 'icon', description: 'Ícono a la izquierda.' },
    { name: 'title', description: 'Título.' },
    { name: 'description', description: 'Descripción.' },
    { name: 'meta', description: 'Texto/acción a la derecha.' },
  ],
  examples: [
    {
      title: 'Ajustes',
      code: '<List>\n  <List.Item icon={<UserIcon />} title="Cuenta" description="Perfil y seguridad" active onSelect={ir} />\n  <List.Item icon={<BellIcon />} title="Notificaciones" meta="3" onSelect={ir} />\n</List>',
    },
  ],
  usage: [
    'Con `onSelect` la fila se vuelve clickeable (foco + Enter/Espacio) y podés marcar la actual con `active`.',
    'Sin onSelect es una lista estática de presentación.',
    'Para acciones en un dropdown usá Menu; para pasos, Stepper; esto es una lista de filas.',
  ],
  a11y: ['Las filas interactivas son role=button, focuseables, con aria-current en la activa.'],
}
