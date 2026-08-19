import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Marquee>. Actualizar SIEMPRE que cambie Marquee.tsx. */
export const marqueeSpec: ComponentSpec = {
  name: 'Marquee',
  dataSk: 'marquee',
  category: 'Display',
  description:
    'Tira de contenido que se desplaza en loop continuo (logos, avisos, ticker). El contenido se duplica para un loop sin costura; la animación la corre el CSS.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'direction', type: "'left' | 'right'", required: false, default: "'left'", description: 'Sentido del desplazamiento.' },
    { name: 'speed', type: 'number', required: false, default: '20', description: 'Segundos por vuelta (menos = más rápido).' },
    { name: 'pauseOnHover', type: 'boolean', required: false, description: 'Pausa al pasar el mouse.' },
    { name: 'children', type: 'ReactNode', required: true, description: 'El contenido (se duplica internamente).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=marquee]. Lleva [data-direction] y [data-pause-hover]; expone --sk-marquee-duration.' },
    { name: 'track', description: 'Pista animada (dos copias del contenido).' },
    { name: 'group', description: 'Cada copia del contenido.' },
  ],
  examples: [
    { title: 'Logos', code: '<Marquee speed={25} pauseOnHover>\n  <img src="/a.svg" /> <img src="/b.svg" /> <img src="/c.svg" />\n</Marquee>' },
  ],
  usage: [
    'Poné el contenido UNA vez; el componente lo duplica para el loop sin salto.',
    'speed en segundos por vuelta; direction cambia el sentido.',
    'Usalo con moderación: el movimiento constante puede distraer (respeta prefers-reduced-motion si te importa).',
  ],
}
