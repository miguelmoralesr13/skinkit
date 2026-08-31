import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Card>. Actualizar SIEMPRE que cambie Card.tsx. */
export const cardSpec: ComponentSpec = {
  name: 'Card',
  dataSk: 'card',
  category: 'Display',
  description:
    'Contenedor de contenido agrupado, con cabecera y pie opcionales. Headless: la forma (borde, sombra, radio) la da el CSS.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    {
      name: 'header',
      type: 'ReactNode',
      required: false,
      description: 'Contenido de la cabecera. Si se omite, no se renderiza la parte header.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      required: false,
      description: 'Contenido del pie. Si se omite, no se renderiza la parte footer.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      description: 'Cuerpo de la card (parte body).',
    },
    {
      name: 'classNames',
      type: '{ header?: string; body?: string; footer?: string }',
      required: false,
      description:
        'Clases adicionales por parte interna (header/body/footer). Se agregan, nunca reemplazan la clase base.',
    },
  ],
  parts: [
    { name: 'root', description: 'El contenedor.' },
    { name: 'header', description: 'Cabecera (solo si se pasa `header`).' },
    { name: 'body', description: 'Cuerpo — el children.' },
    { name: 'footer', description: 'Pie (solo si se pasa `footer`).' },
  ],
  examples: [
    {
      title: 'Con cabecera y pie',
      code: '<Card header="Título" footer={<Button size="sm">Acción</Button>}>Contenido</Card>',
    },
    { title: 'Solo cuerpo', code: '<Card>Contenido simple</Card>' },
  ],
  usage: [
    'Usala para agrupar información relacionada; no la anides en profundidad (una card dentro de otra rara vez ayuda).',
    'header/footer son opcionales: si no los pasás, esas partes no existen en el DOM.',
    'No metas la lógica de layout de la pantalla en la Card; es un contenedor de contenido, no una grilla.',
  ],
}
