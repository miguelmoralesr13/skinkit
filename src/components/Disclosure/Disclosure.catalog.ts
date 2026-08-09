import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Disclosure>. Actualizar SIEMPRE que cambie Disclosure.tsx. */
export const disclosureSpec: ComponentSpec = {
  name: 'Disclosure',
  dataSk: 'disclosure',
  category: 'Navegación',
  description:
    'Sección colapsable suelta (mostrar/ocultar contenido): como un ítem de Accordion pero standalone. Compuesto: <Disclosure> con Trigger/Content. Controlado o no; ARIA incluido. La forma la da el skin.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'>",
  props: [
    { name: 'open', type: 'boolean', required: false, description: 'Abierto (controlado). Usalo con onOpenChange.' },
    { name: 'defaultOpen', type: 'boolean', required: false, default: 'false', description: 'Estado inicial (uncontrolled).' },
    { name: 'onOpenChange', type: '(open: boolean) => void', required: false, description: 'Se invoca al abrir/cerrar.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=disclosure]. Lleva [data-state=open|closed].' },
    { name: 'trigger', description: 'Botón (aria-expanded). Lleva [data-state]. <Disclosure.Trigger>.' },
    { name: 'indicator', description: 'Adorno abrir/cerrar (chevron, +/−) que dibuja el skin.' },
    { name: 'content', description: 'Contenido colapsable (role=region, hidden cuando cerrado). <Disclosure.Content>.' },
  ],
  examples: [
    {
      title: 'FAQ',
      code: '<Disclosure>\n  <Disclosure.Trigger>¿Cómo funciona?</Disclosure.Trigger>\n  <Disclosure.Content>Detalle de la respuesta…</Disclosure.Content>\n</Disclosure>',
    },
  ],
  usage: [
    'Para UNA sección que se muestra/oculta. Para VARIAS relacionadas con una sola abierta a la vez, usá Accordion.',
    'Es controlado si pasás `open`; si no, usá `defaultOpen`.',
    'El contenido colapsa con el atributo hidden (correcto para foco/a11y): un skin que quiera animar la altura debe manejar [data-state] sin depender de hidden.',
  ],
  a11y: [
    'trigger con aria-expanded/aria-controls; content role=region con aria-labelledby; hidden cuando cerrado.',
  ],
}
