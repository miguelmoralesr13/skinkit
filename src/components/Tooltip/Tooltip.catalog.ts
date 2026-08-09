import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Tooltip>. Actualizar SIEMPRE que cambie Tooltip.tsx. */
export const tooltipSpec: ComponentSpec = {
  name: 'Tooltip',
  dataSk: 'tooltip',
  category: 'Feedback',
  description:
    'Burbuja de ayuda que aparece al pasar el mouse o enfocar un elemento. Sin portal (vive en el árbol → conserva el scope de theme/skin). Mostrar/ocultar y posición los da el skin.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      required: true,
      description: 'Contenido del tooltip. Texto corto y descriptivo.',
    },
    {
      name: 'side',
      type: "'top' | 'bottom' | 'left' | 'right'",
      required: false,
      default: "'top'",
      description: 'Lado donde aparece la burbuja respecto del trigger.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'El elemento disparador. Debe ser focuseable (ej. un Button) para verlo con teclado.',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor. Lleva [data-side].' },
    { name: 'trigger', description: 'Envuelve al disparador; aria-describedby apunta al contenido.' },
    { name: 'content', description: 'La burbuja (role=tooltip). El skin la muestra en :hover/:focus-within.' },
  ],
  examples: [
    { title: 'En un botón', code: '<Tooltip label="Guardar cambios"><Button>Guardar</Button></Tooltip>' },
    { title: 'A la derecha', code: '<Tooltip label="Más info" side="right"><Button variant="ghost">?</Button></Tooltip>' },
  ],
  usage: [
    'El trigger (children) debe ser focuseable para que aparezca con teclado; envolvé un Button/enlace, no texto plano.',
    'Usá `label` para info breve y NO esencial: el contenido crítico no debe vivir solo en un tooltip.',
    'No metas interacción adentro del tooltip (links/botones): no está pensado para ser navegable.',
  ],
  a11y: [
    'El contenido es role="tooltip" y se enlaza con aria-describedby desde el trigger.',
    'Aparece en hover Y en focus (no solo hover), cubriendo mouse y teclado.',
  ],
}
