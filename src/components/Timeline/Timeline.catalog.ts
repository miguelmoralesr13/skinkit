import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Timeline>. Actualizar SIEMPRE que cambie Timeline.tsx. */
export const timelineSpec: ComponentSpec = {
  name: 'Timeline',
  dataSk: 'timeline',
  category: 'Display',
  description:
    'Lista vertical de eventos en orden cronológico, con markers y línea conectora (actividad, historial, seguimiento). Compuesto: <Timeline> con <Timeline.Item>. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLOListElement>',
  props: [
    {
      name: 'align',
      type: "'left' | 'right' | 'alternate'",
      required: false,
      default: "'left'",
      description: 'Dónde va la línea: left (contenido a la derecha), right (espejo) o alternate (zigzag: los ítems alternan lados).',
    },
  ],
  parts: [
    { name: 'root', description: 'El <ol> [data-sk=timeline]. Item extends Omit<LiHTMLAttributes, "title">.' },
    { name: 'item', description: 'Cada evento (<li>). Lleva [data-tone]. <Timeline.Item title time marker tone>.' },
    { name: 'marker', description: 'Punto/ícono del evento.' },
    { name: 'connector', description: 'Línea hacia el siguiente evento.' },
    { name: 'content', description: 'Columna de texto.' },
    { name: 'title', description: 'Título del evento.' },
    { name: 'time', description: 'Marca temporal (opcional).' },
  ],
  examples: [
    {
      title: 'Actividad',
      code: '<Timeline>\n  <Timeline.Item title="Proyecto creado" time="hace 3 d" tone="primary" />\n  <Timeline.Item title="Primer screen" time="hace 2 d">\n    Se generó la pantalla de login.\n  </Timeline.Item>\n  <Timeline.Item title="Deploy" time="hoy" tone="primary" />\n</Timeline>',
    },
  ],
  usage: [
    'Ordená los ítems del más reciente al más antiguo (o al revés) de forma consistente.',
    'Poné el título en `title` y la fecha en `time`; el detalle largo va como children.',
    'tone por ítem (primary/secondary/tertiary/accent/success/warning/info/danger) resalta hitos o estados; el color lo pone el theme.',
    'align="alternate" (zigzag) luce mejor con títulos cortos; para textos largos, dejá left.',
  ],
}
