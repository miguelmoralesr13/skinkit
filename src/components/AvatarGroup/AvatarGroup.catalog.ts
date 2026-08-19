import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <AvatarGroup>. Actualizar SIEMPRE que cambie AvatarGroup.tsx. */
export const avatarGroupSpec: ComponentSpec = {
  name: 'AvatarGroup',
  dataSk: 'avatar-group',
  category: 'Display',
  description:
    'Apila varios <Avatar> superpuestos y resume el excedente en un "+N" (equipos, participantes). El solapamiento y el borde de recorte los da el CSS.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'max', type: 'number', required: false, description: 'Máximo de avatares visibles; el resto se resume en "+N". Sin max, muestra todos.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Tamaño del avatar "+N" de overflow (cada Avatar hijo trae el suyo).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=avatar-group].' },
    { name: 'overflow', description: 'El "+N" (un Avatar con fallback).' },
  ],
  examples: [
    {
      title: 'Con overflow',
      code: '<AvatarGroup max={3}>\n  <Avatar alt="Ana" fallback="AN" />\n  <Avatar alt="Beto" fallback="BE" />\n  <Avatar alt="Caro" fallback="CA" />\n  <Avatar alt="Dani" fallback="DA" />\n  <Avatar alt="Eze" fallback="EZ" />\n</AvatarGroup>',
    },
  ],
  usage: [
    'Los hijos deben ser <Avatar>; poné el mismo `size` en todos para que solapen parejo.',
    'Con muchos, usá `max` para no saturar: el resto se cuenta en "+N".',
    'El orden de apilado (quién queda arriba) lo decide el CSS.',
  ],
}
