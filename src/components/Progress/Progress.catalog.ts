import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Progress>. Actualizar SIEMPRE que cambie Progress.tsx. */
export const progressSpec: ComponentSpec = {
  name: 'Progress',
  dataSk: 'progress',
  category: 'Display',
  description:
    'Barra de progreso, determinada (con valor) o indeterminada (animada). role="progressbar" con ARIA. El relleno se calcula solo (variable --sk-progress 0–1); la forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'value', type: 'number', required: false, description: 'Valor actual (0..max). Omitir para indeterminado.' },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'", required: false, default: "'primary'", description: 'Color del indicador (del theme).' },
    { name: 'max', type: 'number', required: false, default: '100', description: 'Valor máximo.' },
    { name: 'indeterminate', type: 'boolean', required: false, description: 'Progreso sin valor conocido; el skin lo anima.' },
  ],
  parts: [
    { name: 'root', description: 'role=progressbar. Lleva [data-indeterminate] si aplica; expone --sk-progress (0–1).' },
    { name: 'track', description: 'Riel de fondo.' },
    { name: 'indicator', description: 'Relleno; ancho por --sk-progress, o animado si indeterminado.' },
  ],
  examples: [
    { title: 'Determinado', code: '<Progress value={70} />' },
    { title: 'Con max', code: '<Progress value={3} max={5} />' },
    { title: 'Indeterminado', code: '<Progress indeterminate />' },
  ],
  usage: [
    'Usá valor cuando conocés el progreso (subida, pasos). Sin valor → indeterminado (espera de duración desconocida).',
    'Para una espera chica sin barra, usá Spinner.',
    'El relleno se dimensiona con la variable CSS --sk-progress: no la seteés a mano.',
  ],
  a11y: ['role=progressbar con aria-valuemin/max y aria-valuenow (ausente en indeterminado).'],
}
