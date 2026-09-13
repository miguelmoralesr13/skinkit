import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <MultiSelect>. Actualizar SIEMPRE que cambie MultiSelect.tsx. */
export const multiSelectSpec: ComponentSpec = {
  name: 'MultiSelect',
  dataSk: 'multi-select',
  category: 'Formulario',
  description:
    'Como Combobox pero de VARIOS valores: los elegidos se muestran como chips, con buscador y lista para (des)marcar. Teclado ↑↓/Enter/Esc; Backspace (vacío) quita el último. Sin portal. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Opciones disponibles.' },
    { name: 'value', type: 'string[]', required: false, description: 'Valores elegidos (controlado).' },
    { name: 'defaultValue', type: 'string[]', required: false, default: '[]', description: 'Valores iniciales (uncontrolled).' },
    { name: 'onValueChange', type: '(value: string[]) => void', required: false, description: 'Se invoca con la lista completa tras (des)marcar.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder cuando no hay elegidos.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita.' },
    { name: 'emptyText', type: 'string', required: false, default: "'Sin resultados' (según locale)", description: 'Mensaje sin coincidencias.' },
    {
      name: 'classNames',
      type: 'MultiSelectClassNames',
      required: false,
      description:
        'Clases por sub-parte, siempre aditivas a la clase base (nunca la reemplazan). Claves: label (etiqueta del campo), control, tag (cada chip — misma clase en todas las instancias), tagLabel (texto dentro del chip — distinto de label del campo, evita colisión de nombres ya que [data-part=label] aparece dos veces en el markup), tagRemove (botón × del chip), field (input de búsqueda), listbox, option (cada opción — misma clase en todas las instancias), check (indicador dentro de la opción), empty (mensaje sin resultados), helper.',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=multi-select]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'control', description: 'Caja con chips + input (posicionada; contiene el listbox).' },
    { name: 'tag', description: 'Cada chip (también [data-sk=tag]).' },
    { name: 'field', description: 'El <input> de búsqueda.' },
    { name: 'listbox', description: 'Lista (role=listbox aria-multiselectable), solo abierta.' },
    { name: 'option', description: 'Cada opción (role=option). Lleva [data-selected] y [data-highlighted]; con [data-part=check].' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    {
      title: 'Tecnologías',
      code: '<MultiSelect\n  label="Stack"\n  options={[{ value: "react", label: "React" }, { value: "vue", label: "Vue" }]}\n  value={stack}\n  onValueChange={setStack}\n/>',
    },
  ],
  usage: [
    'Para elegir VARIOS de una lista. Para uno solo, usá Combobox o Select. Para valores libres (sin lista fija), TagInput.',
    'Clickear o Enter (des)marca; el chip × quita; Backspace con el input vacío quita el último.',
    'Los chips reusan el contrato de Tag ([data-sk=tag]).',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `multiSelect` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ multiSelect: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: ['input role=combobox + listbox aria-multiselectable; cada opción role=option con aria-selected.'],
}
