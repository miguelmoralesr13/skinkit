import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <BackTop>. Actualizar SIEMPRE que cambie BackTop.tsx. */
export const backTopSpec: ComponentSpec = {
  name: 'BackTop',
  dataSk: 'back-top',
  category: 'Navegación',
  description:
    'Botón "volver arriba" que aparece al pasar cierto scroll y sube al tope al hacer click. Observa la ventana o un contenedor scrolleable. La posición fija (esquina) y la animación de aparición las da el skin.',
  extends: 'ButtonHTMLAttributes<HTMLButtonElement>',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },    { name: 'threshold', type: 'number', required: false, default: '240', description: 'Píxeles de scroll a partir de los cuales aparece.' },
    { name: 'target', type: 'RefObject<HTMLElement | null>', required: false, description: 'Contenedor scrolleable a observar/subir. Si se omite, usa la ventana.' },
    { name: 'behavior', type: "'smooth' | 'auto'", required: false, default: "'smooth'", description: 'Suavidad del scroll al subir.' },
    { name: 'children', type: 'ReactNode', required: false, default: "'↑'", description: 'Contenido del botón (ej. un ícono).' },
    { name: 'label', type: 'string', required: false, default: "'Volver arriba'", description: 'aria-label del botón.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=back-top]. El botón. Lleva [data-visible=true|false]; fijalo con position:fixed en el skin.' },
  ],
  examples: [
    { title: 'Sobre la ventana', code: '<BackTop />' },
    {
      title: 'Sobre un contenedor con overflow',
      code: 'const ref = useRef<HTMLDivElement>(null)\n<div ref={ref} style={{ overflow: "auto", maxHeight: 400 }}>…</div>\n<BackTop target={ref} threshold={120} />',
    },
  ],
  usage: [
    'Para scroll de PÁGINA (lo normal): omití target y montalo una sola vez; el skin lo deja position:fixed anclado a la esquina de la ventana. Funciona sin más.',
    'Para un panel con overflow propio (target): NO lo pongas dentro del panel scrolleable — un position:absolute adentro de un scroll-container se desplaza con el contenido. Envolvé el panel en un <div position:relative>, poné el BackTop como HERMANO del panel y pasale style={{ position: "absolute" }}; el target scopa el scroll y el absolute lo fija a la esquina.',
    'Cuando no es visible queda fuera del tab order (tabIndex=-1, aria-hidden).',
  ],
  a11y: ['Es un <button> con aria-label; se oculta del foco y de lectores cuando no está visible.'],
}
