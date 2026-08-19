import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <AspectRatio>. Actualizar SIEMPRE que cambie AspectRatio.tsx. */
export const aspectRatioSpec: ComponentSpec = {
  name: 'AspectRatio',
  dataSk: 'aspect-ratio',
  category: 'Display',
  description:
    'Mantiene una proporción ancho/alto para su contenido (imagen, video, iframe, mapa), evitando saltos de layout mientras carga. Usa la propiedad CSS aspect-ratio.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'ratio', type: 'number', required: false, default: '16 / 9', description: 'Proporción ancho/alto (ej. 16/9, 1 para cuadrado, 4/3).' },
    { name: 'children', type: 'ReactNode', required: false, description: 'El medio (img/iframe/video). El CSS lo hace llenar/recortar.' },
  ],
  parts: [{ name: 'root', description: 'Caja con la proporción (aspect-ratio por style).' }],
  examples: [
    { title: 'Imagen 16:9', code: '<AspectRatio ratio={16 / 9}>\n  <img src="/cover.jpg" alt="" />\n</AspectRatio>' },
    { title: 'Cuadrado', code: '<AspectRatio ratio={1}>\n  <img src="/avatar.jpg" alt="" />\n</AspectRatio>' },
  ],
  usage: [
    'Ideal para reservar el espacio de imágenes/videos y evitar CLS (saltos) al cargar.',
    'El hijo (img/iframe) lo estira y recorta el CSS (object-fit: cover).',
    'Pasá el ratio como número: 16/9, 4/3, 1…',
  ],
}
