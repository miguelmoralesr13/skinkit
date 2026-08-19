import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <AnimatedNumber>. Actualizar SIEMPRE que cambie AnimatedNumber.tsx. */
export const animatedNumberSpec: ComponentSpec = {
  name: 'AnimatedNumber',
  dataSk: 'animated-number',
  category: 'Display',
  description:
    'Anima el conteo desde el valor anterior hasta el nuevo (métricas, contadores, dashboards). requestAnimationFrame + easing. La forma la da el CSS (tabular-nums).',
  extends: "Omit<HTMLAttributes<HTMLSpanElement>, 'children'>",
  props: [
    { name: 'value', type: 'number', required: true, description: 'Valor objetivo. Al cambiar, anima desde el anterior.' },
    { name: 'duration', type: 'number', required: false, default: '800', description: 'Duración de la animación (ms).' },
    { name: 'decimals', type: 'number', required: false, default: '0', description: 'Decimales a mostrar.' },
    { name: 'format', type: '(n: number) => string', required: false, description: 'Formateador propio (recibe el número interpolado). Reemplaza a decimals.' },
  ],
  parts: [{ name: 'root', description: 'El <span> [data-sk=animated-number].' }],
  examples: [
    { title: 'Contador', code: '<AnimatedNumber value={total} />' },
    { title: 'Moneda', code: '<AnimatedNumber value={monto} format={(n) => `$${n.toFixed(2)}`} />' },
  ],
  usage: [
    'Ideal dentro de Stat / dashboards: al actualizar `value`, cuenta hasta el nuevo número.',
    'Usá `format` para moneda/miles; `decimals` para el caso simple.',
    'El primer render NO anima (arranca en value); anima en los cambios posteriores.',
  ],
}
