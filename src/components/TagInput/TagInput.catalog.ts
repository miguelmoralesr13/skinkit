import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <TagInput>. Actualizar SIEMPRE que cambie TagInput.tsx. */
export const tagInputSpec: ComponentSpec = {
  name: 'TagInput',
  dataSk: 'tag-input',
  category: 'Formulario',
  description:
    'Campo que crea chips/etiquetas: tipear + Enter o coma agrega, Backspace (vacío) borra el último, cada chip se quita. Controlado o no. Ideal para keywords, destinatarios, filtros. La forma la da el skin.',
  extends: '—',
  props: [
    { name: 'value', type: 'string[]', required: false, description: 'Tags actuales (controlado). Usalo con onChange.' },
    { name: 'defaultValue', type: 'string[]', required: false, default: '[]', description: 'Tags iniciales (uncontrolled).' },
    { name: 'onChange', type: '(tags: string[]) => void', required: false, description: 'Se invoca con la lista completa tras agregar/quitar.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder cuando no hay tags.' },
    { name: 'max', type: 'number', required: false, description: 'Máximo de tags.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita el campo.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido ([data-error]).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=tag-input]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'control', description: 'Caja con los tags + el input.' },
    { name: 'tag', description: 'Cada chip (también [data-sk=tag]); parts label/remove.' },
    { name: 'field', description: 'El <input> de texto.' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Keywords', code: '<TagInput label="Etiquetas" defaultValue={["react","css"]} placeholder="Agregá y Enter" onChange={setTags} />' },
  ],
  usage: [
    'Enter o coma confirma el tag; Backspace con el input vacío borra el último.',
    'No permite duplicados; `max` limita la cantidad.',
    'Los chips reusan el contrato de Tag ([data-sk=tag]), así el skin los pinta igual.',
  ],
  a11y: ['Cada botón de quitar trae aria-label "Quitar <tag>".'],
}
