import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Stepper>. Actualizar SIEMPRE que cambie Stepper.tsx. */
export const stepperSpec: ComponentSpec = {
  name: 'Stepper',
  dataSk: 'stepper',
  category: 'Navegación',
  description:
    'Indicador de progreso por pasos (wizard, checkout). Compuesto: <Stepper active> con <Stepper.Step>. Stepper calcula complete/current/upcoming según `active`; la forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLOListElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de los pasos activos/completos (del theme).' },
    { name: 'active', type: 'number', required: false, default: '0', description: 'Índice del paso actual (0-based). Pasos previos = complete, posteriores = upcoming.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Dirección del stepper.' },
  ],
  parts: [
    { name: 'root', description: '<ol>. Lleva [data-orientation].' },
    { name: 'step', description: 'Cada paso (<Stepper.Step label>). Lleva [data-state=complete|current|upcoming].' },
    { name: 'marker', description: 'Círculo con número (o ícono Check de lucide-react si completo).' },
    { name: 'label', description: 'Texto del paso.' },
    { name: 'connector', description: 'Línea entre pasos.' },
  ],
  examples: [
    {
      title: 'Checkout',
      code: '<Stepper active={1}>\n  <Stepper.Step label="Carrito" />\n  <Stepper.Step label="Envío" />\n  <Stepper.Step label="Pago" />\n</Stepper>',
    },
  ],
  usage: [
    'active es el índice (0-based) del paso en curso; el resto se calcula solo.',
    'Poné el texto en la prop `label` de cada <Stepper.Step> (o como children).',
    'Es un indicador de progreso, no controla la navegación: vos manejás el avance.',
  ],
  a11y: ['El paso actual usa aria-current="step".'],
}
