import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Avatar>. Actualizar SIEMPRE que cambie Avatar.tsx. */
export const avatarSpec: ComponentSpec = {
  name: 'Avatar',
  dataSk: 'avatar',
  category: 'Display',
  description:
    'Imagen de perfil de una persona/entidad, con fallback a iniciales o ícono cuando no hay imagen o falla la carga. La forma (tamaño, redondeo) la da el CSS.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    {
      name: 'src',
      type: 'string',
      required: false,
      description: 'URL de la imagen. Si falta o falla la carga, se muestra el fallback.',
    },
    {
      name: 'alt',
      type: 'string',
      required: false,
      default: "''",
      description: 'Texto alternativo. También etiqueta el fallback (aria-label) si no hay imagen.',
    },
    {
      name: 'fallback',
      type: 'ReactNode',
      required: false,
      description: 'Qué mostrar sin imagen: iniciales ("MA") o un ícono.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: "'md'",
      description: 'Tamaño del avatar.',
    },
    {
      name: 'tone',
      type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'",
      required: false,
      default: "'neutral'",
      description: 'Color del fondo de fallback (del theme).',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor. Lleva [data-size].' },
    { name: 'image', description: 'La <img>; se renderiza solo si hay src y cargó bien.' },
    { name: 'fallback', description: 'Contenido alternativo (iniciales/ícono) cuando no hay imagen.' },
  ],
  examples: [
    { title: 'Con imagen', code: '<Avatar src="/u/ana.jpg" alt="Ana Pérez" fallback="AP" />' },
    { title: 'Solo iniciales', code: '<Avatar alt="Miguel Ángel" fallback="MA" />' },
    { title: 'Grande', code: '<Avatar size="lg" src="/u/jc.jpg" alt="Juan C." fallback="JC" />' },
  ],
  usage: [
    'Pasá SIEMPRE un `fallback` (iniciales) para cubrir el caso sin imagen o con error de carga.',
    'Usá `alt` con el nombre de la persona; queda como aria-label del fallback también.',
    'Para el redondeo (círculo vs. cuadrado) no toques props: lo decide el CSS.',
  ],
  a11y: [
    'Sin imagen, el fallback se expone como role="img" con aria-label=alt (si hay alt).',
    'Con alt vacío la imagen es decorativa (alt="").',
  ],
}
