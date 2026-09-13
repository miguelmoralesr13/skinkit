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
    { name: 'children', type: 'ReactNode', required: false, default: "'Copiar' (según locale)", description: 'Contenido normal.' },
    { name: 'copiedLabel', type: 'ReactNode', required: false, default: "'Copiado' (según locale)", description: 'Contenido tras copiar.' },
    { name: 'timeout', type: 'number', required: false, default: '1500', description: 'ms hasta volver al estado normal.' },
  ],
  parts: [{ name: 'root', description: 'El <button> [data-sk=copy-button]. Lleva [data-copied] tras copiar.' }],
  examples: [
    { title: 'Copiar token', code: '<CopyButton value={token} />' },
    { title: 'Con ícono/label', code: 'import { Check } from \'lucide-react\'\n\n<CopyButton value={url} copiedLabel={<><Check size={14} /> Listo</>}>Copiar URL</CopyButton>' },
  ],
  usage: [
    'Pasá el texto exacto en `value`; el botón se encarga del clipboard y del feedback.',
    'Usa navigator.clipboard (requiere contexto seguro / https o localhost).',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `copyButton` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ copyButton: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
}
