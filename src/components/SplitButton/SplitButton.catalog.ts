import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <SplitButton>. Actualizar SIEMPRE que cambie SplitButton.tsx. */
export const splitButtonSpec: ComponentSpec = {
  name: 'SplitButton',
  dataSk: 'split-button',
  category: 'Acción',
  description:
    'Acción principal (botón grande) + un dropdown con acciones secundarias, pegados. El menú se pasa por la prop `menu` con <SplitButton.Item>. Sin portal; cierra con Esc/click afuera/elegir.',
  extends: '—',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },    { name: 'onClick', type: '() => void', required: false, description: 'Acción principal (click en el botón grande).' },
    { name: 'children', type: 'ReactNode', required: true, description: 'Label de la acción principal.' },
    { name: 'menu', type: 'ReactNode', required: false, description: 'Contenido del dropdown: <SplitButton.Item> (con prop onSelect).' },
    { name: 'variant', type: "'filled' | 'outlined' | 'ghost'", required: false, default: "'filled'", description: 'Estilo (igual que Button).' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Tamaño.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita ambos botones.' },
    { name: 'triggerLabel', type: 'string', required: false, default: "'Más acciones' (según locale)", description: 'aria-label del disparador del menú.' },
    { name: 'classNames', type: '{ main?: string; trigger?: string; content?: string; item?: string }', required: false, description: 'Clases adicionales por parte interna (main/trigger/content/item). Aditivo, no reemplaza la clase base. `item` aplica a todas las instancias de <SplitButton.Item> (no hay callback por-item).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=split-button]. Lleva [data-variant] y [data-size].' },
    { name: 'main', description: 'Botón de la acción principal.' },
    { name: 'trigger', description: 'Botón que abre el menú. Lleva [data-state].' },
    { name: 'content', description: 'Menú (role=menu), solo abierto.' },
    { name: 'item', description: 'Cada acción (role=menuitem). <SplitButton.Item onSelect>.' },
  ],
  examples: [
    {
      title: 'Guardar + opciones',
      code: '<SplitButton onClick={guardar} menu={<>\n  <SplitButton.Item onSelect={guardarComo}>Guardar como…</SplitButton.Item>\n  <SplitButton.Item onSelect={duplicar}>Duplicar</SplitButton.Item>\n</>}>Guardar</SplitButton>',
    },
  ],
  usage: [
    'La acción MÁS común va en el botón principal (onClick); las variantes en el menú.',
    'Cada <SplitButton.Item> cierra el menú al elegirse; poné la acción en onSelect.',
    'Si no hay una acción principal clara, usá Menu en vez de SplitButton.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `splitButton` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ splitButton: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['El disparador tiene aria-haspopup=menu/aria-expanded; el menú role=menu; items role=menuitem.'],
}
