import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Countdown>. Actualizar SIEMPRE que cambie Countdown.tsx. */
export const countdownSpec: ComponentSpec = {
  name: 'Countdown',
  dataSk: 'countdown',
  category: 'Display',
  description:
    'Cuenta regresiva a un momento (lanzamiento, oferta, deadline). Muestra días/horas/minutos/segundos y avisa al llegar a cero. La forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'to', type: 'string | number', required: true, description: 'Objetivo: ISO string o timestamp (ms).' },
    { name: 'onComplete', type: '() => void', required: false, description: 'Se invoca al llegar a cero (una vez).' },
    { name: 'hideDaysWhenZero', type: 'boolean', required: false, description: 'Oculta el bloque de días si son 0.' },
    { name: 'labels', type: '{ days?, hours?, minutes?, seconds? }', required: false, description: 'Etiquetas custom de cada unidad.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=countdown] (role=timer). Lleva [data-done] al terminar.' },
    { name: 'segment', description: 'Cada bloque. Lleva [data-unit=days|hours|minutes|seconds].' },
    { name: 'value', description: 'El número (días sin pad; el resto con 2 dígitos).' },
    { name: 'label', description: 'La etiqueta de la unidad.' },
  ],
  examples: [
    { title: 'A una fecha', code: '<Countdown to="2026-12-31T23:59:59" onComplete={() => festejar()} />' },
    { title: 'Sin días', code: '<Countdown to={Date.now() + 3600_000} hideDaysWhenZero />' },
  ],
  usage: [
    'Pasá `to` como ISO ("2026-12-31T23:59:59") o timestamp en ms.',
    'onComplete se dispara una sola vez al llegar a cero.',
    'Tickea cada segundo; hideDaysWhenZero para cuentas cortas.',
  ],
  a11y: ['role=timer; considerá un aria-live aparte si el conteo debe anunciarse.'],
}
