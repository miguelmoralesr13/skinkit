import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Image>. Actualizar SIEMPRE que cambie Image.tsx. */
export const imageSpec: ComponentSpec = {
  name: 'Image',
  dataSk: 'image',
  category: 'Display',
  description:
    'Imagen con estado de carga, fallback ante error y relación de aspecto. Si `src` falla usa `fallbackSrc`; si eso también falla (o no se pasa) muestra un placeholder. Lazy por defecto. No estila colores/bordes: expone [data-status]/[data-rounded] y los parts.',
  extends: "Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'>",
  props: [
    { name: 'src', type: 'string', required: true, description: 'URL de la imagen.' },
    { name: 'alt', type: 'string', required: true, description: 'Texto alternativo (también aria-label del fallback).' },
    { name: 'fallbackSrc', type: 'string', required: false, description: 'Imagen alternativa si src falla.' },
    { name: 'ratio', type: 'number | string', required: false, description: 'Relación de aspecto: número (16/9=1.78) o string CSS ("16/9").' },
    { name: 'fit', type: 'CSS object-fit', required: false, default: "'cover'", description: 'Cómo encaja la imagen en su caja.' },
    { name: 'rounded', type: 'boolean', required: false, description: 'Esquinas redondeadas (lo aplica el CSS vía [data-rounded]).' },
    { name: 'fallback', type: 'ReactNode', required: false, description: 'Contenido del placeholder cuando falla.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=image]. Lleva [data-status=loading|loaded|error] y [data-rounded].' },
    { name: 'img', description: '[data-part=img]: la imagen.' },
    { name: 'fallback', description: '[data-part=fallback]: placeholder cuando la imagen falla.' },
  ],
  examples: [
    { title: 'Con fallback y ratio', code: '<Image src="/foto.jpg" alt="Perfil" fallbackSrc="/placeholder.png" ratio="16/9" rounded />' },
  ],
  usage: [
    'Usá ratio para reservar el espacio y evitar saltos de layout mientras carga.',
    'El CSS puede animar la aparición con [data-status=loaded] y mostrar un shimmer en loading.',
  ],
}
