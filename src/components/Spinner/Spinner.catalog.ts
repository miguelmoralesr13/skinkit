import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Spinner>. Actualizar SIEMPRE que cambie Spinner.tsx. */
export const spinnerSpec: ComponentSpec = {
  name: 'Spinner',
  dataSk: 'spinner',
  category: 'Display',
  description:
    'Indicador de carga indeterminado (giro continuo) para esperas de duración desconocida. La animación la define el skin; el componente aporta la semántica role="status".',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: "'md'",
      description: 'Tamaño del spinner.',
    },
    {
      name: 'tone',
      type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'",
      required: false,
      default: "'primary'",
      description: 'Color del spinner (del theme).',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      default: "'Cargando…'",
      description: 'Texto para lectores de pantalla. El skin lo oculta visualmente (queda accesible).',
    },
  ],
  parts: [
    { name: 'root', description: 'El indicador (role=status). El skin lo anima con @keyframes sk-spin.' },
    { name: 'label', description: 'Texto para lectores; el skin lo oculta visualmente (visually-hidden).' },
  ],
  examples: [
    { title: 'Básico', code: '<Spinner />' },
    { title: 'Chico con texto propio', code: '<Spinner size="sm" label="Guardando…" />' },
    { title: 'En un botón', code: '<Button disabled><Spinner size="sm" /> Enviando…</Button>' },
  ],
  usage: [
    'Usalo para esperas indeterminadas (no sabés cuánto falta). Si conocés el progreso, usá una barra de progreso.',
    'Dejá el `label` con un texto útil ("Cargando…", "Guardando…"): es lo que anuncia el lector de pantalla.',
    'Sin skin no gira (la animación vive en el skin): es esperado en esta librería.',
  ],
  a11y: [
    'role="status" anuncia el estado de carga de forma no intrusiva (live region polite).',
    'El label va en [data-part="label"] y el skin lo oculta visualmente sin sacarlo del árbol accesible.',
  ],
}
