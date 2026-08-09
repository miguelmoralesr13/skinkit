import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Resizable>. Actualizar SIEMPRE que cambie Resizable.tsx. */
export const resizableSpec: ComponentSpec = {
  name: 'Resizable',
  dataSk: 'resizable',
  category: 'Display',
  description:
    'Varios paneles con divisores arrastrables (editor+preview, IDE de 3 columnas, grillas). Compuesto: <Resizable> con N <Resizable.Panel>; los divisores se insertan solos entre paneles. Horizontal o vertical, y ANIDABLE (un Resizable dentro de un Panel = grilla). La forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'direction', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Orientación de los paneles y los divisores.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=resizable]. Lleva [data-direction].' },
    { name: 'panel', description: 'Cada panel (<Resizable.Panel defaultSize min>). Su flex-grow sale de --sk-panel-size.' },
    { name: 'handle', description: 'Divisor auto-insertado entre paneles (role=separator, arrastrable y focuseable).' },
  ],
  examples: [
    {
      title: 'Editor + preview',
      code: '<Resizable>\n  <Resizable.Panel defaultSize={40}>Editor…</Resizable.Panel>\n  <Resizable.Panel>Preview…</Resizable.Panel>\n</Resizable>',
    },
    {
      title: '3 columnas',
      code: '<Resizable>\n  <Resizable.Panel defaultSize={20} min={10}>Nav</Resizable.Panel>\n  <Resizable.Panel>Editor</Resizable.Panel>\n  <Resizable.Panel defaultSize={25}>Inspector</Resizable.Panel>\n</Resizable>',
    },
    {
      title: 'Grilla (anidado)',
      code: '<Resizable direction="vertical">\n  <Resizable.Panel>\n    <Resizable>\n      <Resizable.Panel>A</Resizable.Panel>\n      <Resizable.Panel>B</Resizable.Panel>\n    </Resizable>\n  </Resizable.Panel>\n  <Resizable.Panel>C</Resizable.Panel>\n</Resizable>',
    },
  ],
  usage: [
    'Poné N <Resizable.Panel> como hijos; los divisores aparecen solos entre ellos.',
    'defaultSize (%) por panel; sin él, se reparte lo que queda en partes iguales. `min` (%) limita cada uno.',
    'Anidá un <Resizable> (con la otra dirección) dentro de un Panel para armar grillas.',
    'El divisor se arrastra con mouse/touch; enfocado, las flechas lo ajustan.',
  ],
  a11y: ['Cada divisor es role=separator con aria-orientation y teclado (flechas).'],
}
