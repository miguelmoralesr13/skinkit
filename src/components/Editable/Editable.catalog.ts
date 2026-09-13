import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Editable>. Actualizar SIEMPRE que cambie Editable.tsx. */
export const editableSpec: ComponentSpec = {
  name: 'Editable',
  dataSk: 'editable',
  category: 'Formulario',
  description:
    'Texto editable in-line: se muestra como texto y al click pasa a un campo. Enter (o ⌘/Ctrl+Enter en multilínea) o blur guarda; Esc cancela. Controlado. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: 'string', required: true, description: 'Valor actual (controlado).' },
    { name: 'onChange', type: '(value: string) => void', required: false, description: 'Se invoca al guardar (si cambió).' },
    { name: 'placeholder', type: 'string', required: false, default: "'Vacío' (según locale)", description: 'Texto cuando value está vacío.' },
    { name: 'multiline', type: 'boolean', required: false, description: 'Usa textarea; en ese caso Enter hace salto y ⌘/Ctrl+Enter guarda.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'No se puede editar.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=editable]. Lleva [data-editing] y [data-empty].' },
    { name: 'label', description: 'Etiqueta (opcional).' },
    { name: 'preview', description: 'El texto clickeable (modo lectura).' },
    { name: 'field', description: 'El input/textarea (modo edición).' },
  ],
  examples: [
    { title: 'Título editable', code: '<Editable value={titulo} onChange={setTitulo} placeholder="Sin título" />' },
    { title: 'Multilínea', code: '<Editable value={desc} onChange={setDesc} multiline />' },
  ],
  usage: [
    'Para editar un dato en su lugar (título, nombre) sin abrir un formulario aparte.',
    'Es controlado: guardá el valor y actualizalo en onChange.',
    'En multilínea, Enter hace salto de línea; ⌘/Ctrl+Enter confirma.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `editable` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ editable: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['El preview es role=button (Enter/Espacio entra a editar); Esc cancela, blur/Enter guardan.'],
}
