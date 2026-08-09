import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Kbd>. Actualizar SIEMPRE que cambie Kbd.tsx. */
export const kbdSpec: ComponentSpec = {
  name: 'Kbd',
  dataSk: 'kbd',
  category: 'Display',
  description:
    'Representa una tecla o atajo de teclado (⌘K, Ctrl+S, Enter). Puro presentacional, sobre el elemento semántico <kbd>. La forma la da el skin.',
  extends: 'HTMLAttributes<HTMLElement>',
  props: [],
  parts: [{ name: 'root', description: 'El <kbd>.' }],
  examples: [
    { title: 'Una tecla', code: '<Kbd>Enter</Kbd>' },
    { title: 'Atajo', code: '<span><Kbd>⌘</Kbd> <Kbd>K</Kbd></span>' },
  ],
  usage: [
    'Uno por tecla: para un combo, poné varios <Kbd> con un separador ("+", espacio).',
    'Usalo dentro de texto o en menús para mostrar atajos.',
  ],
}
