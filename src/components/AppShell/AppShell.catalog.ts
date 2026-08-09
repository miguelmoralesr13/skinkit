import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <AppShell>. Actualizar SIEMPRE que cambie AppShell.tsx. */
export const appShellSpec: ComponentSpec = {
  name: 'AppShell',
  dataSk: 'app-shell',
  category: 'Layout',
  description:
    'Layout de aplicación en grilla: header arriba (sticky), sidebar a la izquierda, main al centro (scrollea) y footer abajo. Es CSS estructural y vive en la hoja base (no en los skins): los colores/bordes los ponen los componentes de adentro (Topbar/Sidebar/BottomNav). Definí la altura (ej. height: 100dvh) para pantalla completa.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [{ name: 'children', type: 'ReactNode', required: false, description: 'AppShell.Header/Sidebar/Main/Footer.' }],
  parts: [
    { name: 'root', description: '[data-sk=app-shell]: la grilla (grid-template-areas).' },
    { name: 'header', description: '[data-part=header] (sticky, arriba). <AppShell.Header> — típicamente un Topbar.' },
    { name: 'sidebar', description: '[data-part=sidebar] (izquierda). <AppShell.Sidebar> — típicamente un Sidebar.' },
    { name: 'main', description: '[data-part=main] (centro, overflow auto). <AppShell.Main> — el contenido.' },
    { name: 'footer', description: '[data-part=footer] (abajo). <AppShell.Footer> — opcional, ej. un BottomNav.' },
  ],
  examples: [
    {
      title: 'Shell completo',
      code: '<AppShell style={{ height: "100dvh" }}>\n  <AppShell.Header><Topbar>…</Topbar></AppShell.Header>\n  <AppShell.Sidebar><Sidebar>…</Sidebar></AppShell.Sidebar>\n  <AppShell.Main>Contenido…</AppShell.Main>\n</AppShell>',
    },
  ],
  usage: [
    'Omití AppShell.Sidebar o AppShell.Footer si no los necesitás; la grilla se acomoda.',
    'Colapsar (rail): usá `collapsed` en el <Sidebar> de adentro. Ocultar del todo: pasá `hidden` a <AppShell.Sidebar> (atributo nativo → la columna del grid colapsa a 0 y el main se ensancha, sin desmontar el sidebar).',
    'El main scrollea solo (overflow auto); el header queda sticky arriba.',
    'Su CSS es de layout (base), skin-agnóstico: el aspecto lo dan los componentes que metas adentro.',
  ],
}
