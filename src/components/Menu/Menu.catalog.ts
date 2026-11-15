import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Menu>. Actualizar SIEMPRE que cambie Menu.tsx. */
export const menuSpec: ComponentSpec = {
  name: 'Menu',
  dataSk: 'menu',
  category: 'Overlay',
  description:
    'Menú desplegable de acciones (dropdown). Compuesto: <Menu> con Trigger/Content/Item. Sin portal. Abre al click; cierra con Esc, click afuera o elegir un ítem. Teclado ↑↓ entre ítems.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'side', type: "'bottom' | 'top'", required: false, default: "'bottom'", description: 'Lado donde se despliega el contenido respecto del trigger.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=menu]. Lleva [data-side].' },
    { name: 'trigger', description: 'Botón que abre/cierra (aria-haspopup). Lleva [data-state]. <Menu.Trigger>.' },
    { name: 'content', description: 'Panel role=menu (solo cuando abre). <Menu.Content>.' },
    { name: 'item', description: 'Cada acción role=menuitem. <Menu.Item> (prop onSelect). Cierra el menú al elegir.' },
  ],
  examples: [
    {
      title: 'Acciones',
      code: '<Menu>\n  <Menu.Trigger>Opciones ▾</Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item onSelect={duplicar}>Duplicar</Menu.Item>\n    <Menu.Item onSelect={archivar}>Archivar</Menu.Item>\n    <Menu.Item onSelect={eliminar}>Eliminar</Menu.Item>\n  </Menu.Content>\n</Menu>',
    },
  ],
  usage: [
    'Opt-in `<SkinkitProvider scopedNav>` (o `refinements`): el disparador abierto fija `color` junto con su fondo y los items de un Menu anidado en un Sidebar ya no reciben el estilo de los items del Sidebar.',
    'Para un conjunto de ACCIONES sobre algo. Para elegir un valor de una lista, usá Select.',
    'Cada <Menu.Item> cierra el menú al elegirse; poné la acción en onSelect.',
    'El trigger puede envolver un Button u otro elemento clickeable.',
  ],
  a11y: [
    'trigger con aria-haspopup=menu / aria-expanded; content role=menu; items role=menuitem.',
    'Al abrir, el foco va al primer ítem; ↑↓ Home End navegan; Esc cierra.',
  ],
}
