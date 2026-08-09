import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Tabs>. Actualizar SIEMPRE que cambie Tabs.tsx. */
export const tabsSpec: ComponentSpec = {
  name: 'Tabs',
  dataSk: 'tabs',
  category: 'Navegación',
  description:
    'Navegación por pestañas: muestra un panel a la vez de un conjunto. Compuesto: <Tabs> con <Tabs.List>, <Tabs.Tab> y <Tabs.Panel>. Headless; el estado, ARIA y el teclado los da el componente.',
  extends: 'Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Tab activo (modo controlado). Usalo con onValueChange.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      description: 'Tab activo inicial (modo uncontrolled). Normalmente lo querés setear.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      description: 'Se dispara con el value del tab elegido.',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=tabs].' },
    { name: 'list', description: 'Barra de tabs (role=tablist). Sub-componente <Tabs.List>.' },
    { name: 'tab', description: 'Cada pestaña (role=tab). Lleva [data-state=active|inactive]. <Tabs.Tab value>.' },
    { name: 'panel', description: 'Contenido del tab activo (role=tabpanel). <Tabs.Panel value>.' },
  ],
  examples: [
    {
      title: 'Uncontrolled',
      code: '<Tabs defaultValue="perfil">\n  <Tabs.List>\n    <Tabs.Tab value="perfil">Perfil</Tabs.Tab>\n    <Tabs.Tab value="cuenta">Cuenta</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel value="perfil">Datos del perfil…</Tabs.Panel>\n  <Tabs.Panel value="cuenta">Ajustes de la cuenta…</Tabs.Panel>\n</Tabs>',
    },
    {
      title: 'Controlado',
      code: '<Tabs value={tab} onValueChange={setTab}> … </Tabs>',
    },
  ],
  usage: [
    'Cada <Tabs.Tab> y su <Tabs.Panel> se emparejan por el mismo `value`.',
    'Seteá `defaultValue` (o `value`) al value del primer tab para que arranque con uno activo.',
    'Usalo para alternar VISTAS del mismo contexto; no para pasos de un flujo (eso es un wizard).',
    'Las flechas ← → (y ↑ ↓ Home End) mueven y activan tabs; no reimplementes teclado en CSS.',
  ],
  a11y: [
    'role tablist/tab/tabpanel con aria-selected y aria-controls/aria-labelledby cableados.',
    'Roving tabindex: solo el tab activo es tabbable; las flechas cambian de tab (activación automática).',
    'El panel inactivo no se renderiza (no queda en el árbol ni en el orden de tabulación).',
  ],
}
