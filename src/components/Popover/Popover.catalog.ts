import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Popover>. Actualizar SIEMPRE que cambie Popover.tsx. */
export const popoverSpec: ComponentSpec = {
  name: 'Popover',
  dataSk: 'popover',
  category: 'Overlay',
  description:
    'Contenido flotante arbitrario que abre al click (mini-form, detalle, ayuda rica). Compuesto: <Popover> con Trigger/Content. Sin portal (conserva theme/skin). Cierra con Esc o click afuera.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'side', type: "'bottom' | 'top' | 'left' | 'right'", required: false, default: "'bottom'", description: 'Lado donde aparece el contenido respecto del trigger.' },
    { name: 'open', type: 'boolean', required: false, description: 'Abierto (controlado). Usalo con onOpenChange para cerrarlo por código.' },
    { name: 'defaultOpen', type: 'boolean', required: false, default: 'false', description: 'Estado inicial (uncontrolled).' },
    { name: 'onOpenChange', type: '(open: boolean) => void', required: false, description: 'Se invoca al abrir/cerrar.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=popover]. Lleva [data-side].' },
    { name: 'trigger', description: 'Disparador (aria-haspopup=dialog). Lleva [data-state]. <Popover.Trigger>.' },
    { name: 'content', description: 'Panel flotante role=dialog (solo cuando abre). <Popover.Content>.' },
  ],
  examples: [
    {
      title: 'Ayuda rica',
      code: '<Popover side="right">\n  <Popover.Trigger>¿Ayuda?</Popover.Trigger>\n  <Popover.Content>\n    <p>Texto de ayuda con <a href="#">un link</a>.</p>\n  </Popover.Content>\n</Popover>',
    },
  ],
  usage: [
    'Para contenido interactivo/rico (links, inputs). Para una etiqueta breve no interactiva, usá Tooltip.',
    'Para un menú de acciones, usá Menu (trae role=menu y teclado de ítems).',
    'Vive en el árbol: puede recortarse por overflow/scroll (sin portal, a propósito).',
  ],
  a11y: [
    'trigger con aria-haspopup=dialog / aria-expanded; content role=dialog con aria-labelledby.',
    'Esc y click afuera cierran.',
  ],
}
