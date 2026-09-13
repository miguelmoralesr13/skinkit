import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Tag>. Actualizar SIEMPRE que cambie Tag.tsx. */
export const tagSpec: ComponentSpec = {
  name: 'Tag',
  dataSk: 'tag',
  category: 'Display',
  description:
    'Etiqueta/chip, opcionalmente removible (filtros activos, selecciones, keywords). A diferencia de Badge —puro adorno—, Tag puede llevar un botón de quitar. La forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    {
      name: 'variant',
      type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'",
      required: false,
      default: "'neutral'",
      description: 'Tono según intención. El color real lo pone el theme.',
    },
    {
      name: 'onRemove',
      type: '() => void',
      required: false,
      description: 'Si se pasa, aparece un botón × que lo invoca (chip removible). Vos lo sacás del estado.',
    },
    {
      name: 'classNames',
      type: '{ label?: string; remove?: string }',
      required: false,
      description: 'Clases CSS para las sub-partes internas (label, remove).',
    },
  ],
  parts: [
    { name: 'root', description: 'El <span>. Lleva [data-variant].' },
    { name: 'label', description: 'Texto del tag.' },
    { name: 'remove', description: 'Botón × (solo si hay onRemove).' },
  ],
  examples: [
    { title: 'Simple', code: '<Tag>React</Tag>' },
    { title: 'Removible', code: '<Tag variant="primary" onRemove={() => quitar(id)}>Diseño</Tag>' },
  ],
  usage: [
    'Usá Tag cuando el usuario puede QUITARLO (filtros, selecciones). Para un estado no interactivo, usá Badge.',
    'onRemove no lo saca solo: actualizá tu estado para removerlo del render.',
    'Elegí variant por significado, no por color.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `tag` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ tag: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['El botón de quitar trae aria-label="Quitar".'],
}
