import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Tree>. Actualizar SIEMPRE que cambie Tree.tsx. */
export const treeSpec: ComponentSpec = {
  name: 'Tree',
  dataSk: 'tree',
  category: 'Navegación',
  description:
    'Árbol jerárquico expandible (explorador de archivos, categorías anidadas). Compuesto: <Tree> con <Tree.Item> anidables. Estado de expansión centralizado por `value`; teclado ↑↓/→←/Enter. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLUListElement>',
  props: [
    { name: 'defaultExpanded', type: 'string[]', required: false, default: '[]', description: 'values de los nodos abiertos al inicio.' },
    { name: 'label', type: 'string', required: false, description: 'aria-label del árbol.' },
    {
      name: 'classNames',
      type: '{ row?: string; indicator?: string; icon?: string; label?: string; group?: string }',
      required: false,
      description:
        'Solo en <Tree.Item>: clases para sus sub-partes internas (row, indicator, icon, label, group). Misma clase para todas las instancias — sin callback por-item. La raíz del nodo ([data-part=item]) ya usa su propio className.',
    },
  ],
  parts: [
    { name: 'root', description: 'role=tree [data-sk=tree].' },
    { name: 'item', description: 'Cada nodo (role=treeitem). Lleva [data-state] si tiene hijos. <Tree.Item value label icon>.' },
    { name: 'row', description: 'Fila clickeable del nodo (foco + teclado).' },
    { name: 'indicator', description: 'Flecha expandir/colapsar ([data-leaf] si es hoja).' },
    { name: 'label', description: 'Texto del nodo.' },
    { name: 'group', description: '<ul role=group> de los hijos (solo si expandido).' },
  ],
  examples: [
    {
      title: 'Archivos',
      code: '<Tree defaultExpanded={["src"]}>\n  <Tree.Item value="src" label="src">\n    <Tree.Item value="app" label="App.tsx" />\n    <Tree.Item value="styles" label="styles" >\n      <Tree.Item value="soft" label="soft.css" />\n    </Tree.Item>\n  </Tree.Item>\n</Tree>',
    },
  ],
  usage: [
    'Cada <Tree.Item> necesita un `value` único; los hijos van como children anidados.',
    'defaultExpanded lista los `value` abiertos al inicio.',
    'Los nodos sin hijos son hojas (no expanden). Teclado: ↑↓ mueven, → expande/entra, ← colapsa, Enter alterna.',
  ],
  a11y: ['role tree/treeitem/group con aria-expanded; el foco va en la fila (data-part=row).'],
}
