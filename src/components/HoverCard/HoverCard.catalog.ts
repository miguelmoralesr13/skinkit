import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <HoverCard>. Actualizar SIEMPRE que cambie HoverCard.tsx. */
export const hoverCardSpec: ComponentSpec = {
  name: 'HoverCard',
  dataSk: 'hover-card',
  category: 'Overlay',
  description:
    'Muestra contenido RICO al pasar el mouse o enfocar (preview de usuario, definición). Compuesto: <HoverCard> con Trigger/Content. A diferencia de Tooltip (texto breve) o Popover (click), abre por hover con delays para poder mover el mouse al contenido. Sin portal.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    { name: 'side', type: "'bottom' | 'top' | 'left' | 'right'", required: false, default: "'bottom'", description: 'Lado donde aparece.' },
    { name: 'openDelay', type: 'number', required: false, default: '200', description: 'ms hasta abrir al entrar.' },
    { name: 'closeDelay', type: 'number', required: false, default: '150', description: 'ms hasta cerrar al salir (permite ir al contenido).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=hover-card]. Lleva [data-side].' },
    { name: 'trigger', description: 'Disparador (hover/focus). <HoverCard.Trigger>.' },
    { name: 'content', description: 'Tarjeta flotante (solo abierta). <HoverCard.Content>.' },
  ],
  examples: [
    {
      title: 'Preview de usuario',
      code: '<HoverCard>\n  <HoverCard.Trigger><a href="#">@ana</a></HoverCard.Trigger>\n  <HoverCard.Content>\n    <Avatar fallback="AN" /> <strong>Ana Pérez</strong>\n    <p>Diseñadora · 320 seguidores</p>\n  </HoverCard.Content>\n</HoverCard>',
    },
  ],
  usage: [
    'Para contenido rico no esencial que se explora al pasar el mouse. Si es solo una etiqueta, usá Tooltip; si requiere click, Popover.',
    'Los delays evitan parpadeos y dejan mover el mouse del trigger al contenido.',
    'El trigger conviene que sea focuseable (link/botón) para abrir con teclado.',
  ],
  a11y: ['Abre en hover Y focus; el trigger referencia el contenido con aria-describedby cuando está abierto.'],
}
