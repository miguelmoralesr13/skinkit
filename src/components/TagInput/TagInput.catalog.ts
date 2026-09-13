import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <TagInput>. Actualizar SIEMPRE que cambie TagInput.tsx. */
export const tagInputSpec: ComponentSpec = {
  name: 'TagInput',
  dataSk: 'tag-input',
  category: 'Formulario',
  description:
    'Campo que crea chips/etiquetas: tipear + Enter o coma agrega, Backspace (vacío) borra el último, cada chip se quita. Controlado o no. Ideal para keywords, destinatarios, filtros. La forma la da el CSS.',
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
    {
      name: 'classNames',
      type: '{ label?: string; control?: string; tag?: string; tagLabel?: string; tagRemove?: string; field?: string; helper?: string }',
      required: false,
      description:
        'Clases adicionales por parte interna. Se agregan, nunca reemplazan la clase base. `label` es la etiqueta del campo (data-part="label" del root) — distinta de `tagLabel`, el texto dentro de cada chip (data-part="label" anidado en el chip); ambas comparten el mismo data-part="label" pero son partes conceptualmente distintas, de ahí los nombres separados. `tag` aplica la misma clase a todos los chips. `tagRemove` es el botón × de cada chip.',
    },
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
    'Los chips reusan el contrato de Tag ([data-sk=tag]), así el CSS los pinta igual.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `tagInput` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ tagInput: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['Cada botón de quitar trae aria-label "Quitar <tag>".'],
}
