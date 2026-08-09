import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Accordion>. Actualizar SIEMPRE que cambie Accordion.tsx. */
export const accordionSpec: ComponentSpec = {
  name: 'Accordion',
  dataSk: 'accordion',
  category: 'Navegación',
  description:
    'Lista de secciones colapsables. Componente compuesto: Accordion + Accordion.Item + Accordion.Trigger + Accordion.Panel. Headless con estado, ARIA y teclado (↑ ↓ Home End) incluidos; la forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      required: false,
      default: "'single'",
      description: 'single = a lo sumo una sección abierta; multiple = varias a la vez.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      required: false,
      description: 'Sección(es) abiertas al montar. Uncontrolled (el estado lo maneja el componente).',
    },
  ],
  parts: [
    { name: 'root', description: 'El contenedor <Accordion>.' },
    { name: 'item', description: 'Cada <Accordion.Item>. Lleva [data-state=open|closed].' },
    { name: 'trigger', description: 'El botón <Accordion.Trigger>. [data-state] + foco/teclado.' },
    { name: 'label', description: 'Texto dentro del trigger.' },
    { name: 'indicator', description: 'Adorno abrir/cerrar (chevron, +/−…). El skin lo dibuja.' },
    { name: 'panel', description: 'Contenido colapsable <Accordion.Panel>. [data-state].' },
  ],
  examples: [
    {
      title: 'Single (una abierta)',
      code: `<Accordion type="single" defaultValue="a">
  <Accordion.Item value="a">
    <Accordion.Trigger>Pregunta A</Accordion.Trigger>
    <Accordion.Panel>Respuesta A</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="b">
    <Accordion.Trigger>Pregunta B</Accordion.Trigger>
    <Accordion.Panel>Respuesta B</Accordion.Panel>
  </Accordion.Item>
</Accordion>`,
    },
  ],
  usage: [
    'Cada Accordion.Item necesita un `value` único (es la clave de apertura).',
    'Usá type="single" para FAQ/secciones excluyentes; "multiple" cuando el usuario puede querer ver varias.',
    'El orden en el DOM es Trigger → Panel; para mover el indicator (ej. a la izquierda) usá CSS order en el skin, no cambies el markup.',
  ],
  a11y: [
    'Trigger es <button> con aria-expanded/aria-controls; Panel tiene role=region + aria-labelledby.',
    'Teclado: ↑ ↓ mueven foco entre triggers, Home/End al primero/último; Enter/Espacio togglean (nativo).',
    'Panel cerrado usa hidden (correcto para foco); eso bloquea animación de altura — ver skin si se quiere animar.',
  ],
}
