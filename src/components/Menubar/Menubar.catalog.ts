import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Menubar>. Actualizar SIEMPRE que cambie Menubar.tsx. */
export const menubarSpec: ComponentSpec = {
  name: 'Menubar',
  dataSk: 'menubar',
  category: 'Navegación',
  description:
    'Barra de menús tipo app (Archivo / Editar / Ver), donde cada menú de nivel superior abre un dropdown. Un solo menú abierto a la vez; con uno abierto, pasar el mouse sobre otro cambia el foco; flechas ←/→ mueven entre menús y Esc cierra. Compound: Menubar + Menubar.Menu + Menubar.Item.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'children', type: 'ReactNode', required: true, description: 'Los <Menubar.Menu>.' },
    {
      name: 'classNames',
      type: '{ trigger?: string; content?: string }',
      required: false,
      description:
        'Solo en <Menubar.Menu>: clases para sus sub-partes internas — trigger (el botón de nivel superior) y content (el dropdown). La raíz del menú ya usa su propio className.',
    },
  ],
  parts: [
    { name: 'root', description: '[data-sk=menubar]. role=menubar, contenedor en fila.' },
    { name: 'menu', description: '[data-sk=menubar-menu]. <Menubar.Menu label={ReactNode}> — un menú; [data-state=open|closed].' },
    { name: 'trigger', description: '[data-part=trigger] dentro del menú. Botón de nivel superior; [data-state=open|closed].' },
    { name: 'content', description: '[data-part=content] dentro del menú. El dropdown (role=menu). Posicionalo absolute bajo el trigger.' },
    { name: 'item', description: '[data-sk=menubar-item]. <Menubar.Item onSelect={() => void}> — opción (role=menuitem); cierra el menú al elegirse.' },
  ],
  examples: [
    {
      title: 'Barra Archivo / Editar',
      code: '<Menubar>\n  <Menubar.Menu label="Archivo">\n    <Menubar.Item onSelect={nuevo}>Nuevo</Menubar.Item>\n    <Menubar.Item onSelect={abrir}>Abrir…</Menubar.Item>\n    <Menubar.Item onSelect={guardar}>Guardar</Menubar.Item>\n  </Menubar.Menu>\n  <Menubar.Menu label="Editar">\n    <Menubar.Item onSelect={deshacer}>Deshacer</Menubar.Item>\n    <Menubar.Item onSelect={rehacer}>Rehacer</Menubar.Item>\n  </Menubar.Menu>\n</Menubar>',
    },
  ],
  usage: [
    'Para la barra de menús persistente de una app (Archivo/Editar/Ver). Para UN solo dropdown suelto (ej. un botón "Acciones"), usá Menu.',
    'El dropdown [data-part=content] se posiciona respecto al menú: dale al menú position:relative y al content position:absolute en el CSS.',
    'Un solo menú abierto a la vez; el hover entre menús solo cambia cuando ya hay uno abierto.',
  ],
  a11y: [
    'role=menubar en la raíz, role=menu en cada dropdown, role=menuitem en cada opción.',
    'Teclado: ←/→ entre menús, Esc cierra. El trigger expone aria-haspopup y aria-expanded.',
  ],
}
