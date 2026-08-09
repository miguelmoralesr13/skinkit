import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Skeleton>. Actualizar SIEMPRE que cambie Skeleton.tsx. */
export const skeletonSpec: ComponentSpec = {
  name: 'Skeleton',
  dataSk: 'skeleton',
  category: 'Display',
  description:
    'Placeholder de carga: un bloque que "respira" ocupando el lugar del contenido que aún no llegó. Puro decorativo (aria-hidden). La animación y el radio los da el skin.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    {
      name: 'variant',
      type: "'text' | 'circle' | 'rect'",
      required: false,
      default: "'text'",
      description: 'Forma base. text = línea con radio chico; circle = redondo (avatares); rect = bloque.',
    },
    { name: 'width', type: 'number | string', required: false, description: 'Ancho (número = px). Es tamaño de contenido, va por style.' },
    { name: 'height', type: 'number | string', required: false, description: 'Alto (número = px).' },
  ],
  parts: [{ name: 'root', description: 'El bloque. Lleva [data-variant].' }],
  examples: [
    { title: 'Líneas de texto', code: '<Skeleton width="80%" />\n<Skeleton width="60%" />' },
    { title: 'Avatar', code: '<Skeleton variant="circle" width={40} height={40} />' },
    { title: 'Imagen', code: '<Skeleton variant="rect" width="100%" height={160} />' },
  ],
  usage: [
    'Reflejá la forma del contenido real (una línea por línea de texto, un círculo por avatar).',
    'Es decorativo (aria-hidden): acompañalo de un texto/región con aria-busy para lectores.',
    'width/height los pasás vos (tamaño de contenido); el radio y el shimmer los pone el skin.',
  ],
}
