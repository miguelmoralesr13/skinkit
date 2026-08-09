import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Stat>. Actualizar SIEMPRE que cambie Stat.tsx. */
export const statSpec: ComponentSpec = {
  name: 'Stat',
  dataSk: 'stat',
  category: 'Display',
  description:
    'Métrica de dashboard: etiqueta, valor grande y variación opcional (delta) coloreada por tendencia. La forma la da el skin.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'Qué mide (ej. "Ingresos").' },
    { name: 'value', type: 'ReactNode', required: true, description: 'El valor grande (ej. "$12.4k").' },
    { name: 'delta', type: 'ReactNode', required: false, description: 'Variación (ej. "+12%"). Se colorea según trend.' },
    { name: 'trend', type: "'up' | 'down' | 'neutral'", required: false, default: "'neutral'", description: 'Tendencia del delta. up/down/neutral → color del skin.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Ícono opcional a la izquierda.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=stat].' },
    { name: 'icon', description: 'Ícono opcional.' },
    { name: 'label', description: 'Etiqueta de la métrica.' },
    { name: 'value', description: 'El valor grande.' },
    { name: 'delta', description: 'Variación. Lleva [data-trend=up|down|neutral].' },
  ],
  examples: [
    { title: 'Con tendencia', code: '<Stat label="Ingresos" value="$12.4k" delta="+12%" trend="up" />' },
    { title: 'Baja', code: '<Stat label="Churn" value="3.1%" delta="-0.4pp" trend="down" />' },
  ],
  usage: [
    'Usalo en grids de KPIs. Poné varios dentro de Cards para un dashboard.',
    'trend colorea el delta: no hay token "success/verde" propio, así que up usa el color primary y down el danger (revisá que comunique lo correcto para tu caso).',
  ],
}
