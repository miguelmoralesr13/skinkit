import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <CopyButton>. Actualizar SIEMPRE que cambie CopyButton.tsx. */
export const copyButtonSpec: ComponentSpec = {
  name: 'CopyButton',
  dataSk: 'copy-button',
  category: 'Acción',
  description:
    'Copia un texto al portapapeles y muestra feedback "copiado" por un momento. La forma la da el CSS; el estado se expone en [data-copied].',
  extends: "Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'>",
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de acento (del theme).' },    { name: 'value', type: 'string', required: true, description: 'Texto a copiar.' },
    { name: 'children', type: 'ReactNode', required: false, default: "'Copiar'", description: 'Contenido normal.' },
    { name: 'copiedLabel', type: 'ReactNode', required: false, default: "'Copiado'", description: 'Contenido tras copiar.' },
    { name: 'timeout', type: 'number', required: false, default: '1500', description: 'ms hasta volver al estado normal.' },
  ],
  parts: [{ name: 'root', description: 'El <button> [data-sk=copy-button]. Lleva [data-copied] tras copiar.' }],
  examples: [
    { title: 'Copiar token', code: '<CopyButton value={token} />' },
    { title: 'Con ícono/label', code: '<CopyButton value={url} copiedLabel="✓ Listo">Copiar URL</CopyButton>' },
  ],
  usage: [
    'Pasá el texto exacto en `value`; el botón se encarga del clipboard y del feedback.',
    'Usa navigator.clipboard (requiere contexto seguro / https o localhost).',
  ],
}
