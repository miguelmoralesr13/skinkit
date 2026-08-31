import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Container>. Actualizar SIEMPRE que cambie Container.tsx. */
export const containerSpec: ComponentSpec = {
  name: 'Container',
  dataSk: 'container',
  category: 'Layout',
  description:
    'Envoltorio centrado con ancho máximo por preset (sm/md/lg/xl/full) y padding horizontal responsive. Centra el contenido de una página o sección para que no se estire infinito en pantallas anchas. El CSS vive en la hoja base, no en el CSS por-componente.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", required: false, default: "'lg'", description: 'Ancho máximo: sm 40rem, md 48rem, lg 64rem, xl 80rem, full sin tope.' },
    { name: 'padding', type: 'number | string', required: false, default: '4', description: 'Padding horizontal (número = token --sk-sp-n).' },
    {
      name: 'centerContent',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Centra el contenido en columna, horizontal Y vertical (flex column + align-items:center + justify-content:center). El centrado vertical solo tiene efecto si el Container tiene alto — pasale height/minHeight (ej. style={{ minHeight: "100dvh" }}) o ponelo dentro de un padre con alto definido; sin eso, se ve igual que hoy (contenido pegado arriba) porque no hay espacio vertical para centrar.',
    },
  ],
  parts: [
    { name: 'root', description: '[data-sk=container] [data-size]. Lleva [data-center]. Expone --sk-container-pad; el max-width sale de [data-size].' },
  ],
  examples: [
    { title: 'Contenido de página', code: '<Container size="lg">\n  <h1>Panel</h1>\n  <p>…</p>\n</Container>' },
    {
      title: 'Pantalla completa centrada (login, empty state de página)',
      code: '<Container size="sm" centerContent style={{ minHeight: \'100dvh\' }}>\n  <LoginForm />\n</Container>',
    },
  ],
  usage: [
    'Envolvé el contenido principal de una vista para acotar el ancho de línea en pantallas grandes.',
    'Usá size="full" cuando querés padding horizontal pero sin tope de ancho.',
    'No lo anides sin razón: un Container dentro de otro suele ser redundante.',
    'centerContent SIN minHeight/height solo centra horizontalmente (no hay alto que centrar verticalmente) — para una pantalla tipo login que ocupe todo el viewport, siempre pasá minHeight: "100dvh" (o similar) junto con centerContent.',
  ],
}
