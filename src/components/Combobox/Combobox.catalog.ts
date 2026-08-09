import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Combobox>. Actualizar SIEMPRE que cambie Combobox.tsx. */
export const comboboxSpec: ComponentSpec = {
  name: 'Combobox',
  dataSk: 'combobox',
  category: 'Formulario',
  description:
    'Input de texto con lista desplegable filtrada (autocomplete): elegís UNA opción escribiendo para filtrar. Teclado ↑↓/Enter/Esc, cierre por click afuera. Sin portal. La forma la da el skin.',
  extends: '—',
  props: [
    { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Opciones disponibles.' },
    { name: 'value', type: 'string', required: false, description: 'value de la opción elegida (controlado).' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Se invoca con el value elegido.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
    { name: 'placeholder', type: 'string', required: false, description: 'Placeholder del input.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita.' },
    { name: 'emptyText', type: 'string', required: false, default: "'Sin resultados'", description: 'Mensaje cuando no filtra nada.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=combobox]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'control', description: 'Wrapper posicionado del input + listbox (el skin lo hace position:relative).' },
    { name: 'field', description: 'El <input role=combobox>.' },
    { name: 'listbox', description: 'Lista (role=listbox), solo cuando abre; absolute bajo el control.' },
    { name: 'option', description: 'Cada opción (role=option). Lleva [data-highlighted] y [data-selected].' },
    { name: 'empty', description: 'Mensaje "sin resultados".' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    {
      title: 'País',
      code: '<Combobox\n  label="País"\n  options={[{ value: "mx", label: "México" }, { value: "ar", label: "Argentina" }]}\n  value={pais}\n  onValueChange={setPais}\n/>',
    },
  ],
  usage: [
    'Para elegir UNA opción de una lista LARGA con búsqueda. Para pocas opciones, usá Select o SegmentedControl. Para varios valores, TagInput.',
    'options es {value,label}[]; el filtrado es por `label` (case-insensitive, "incluye").',
    'Es controlado: guardá `value` y actualizalo en onValueChange.',
  ],
  a11y: [
    'input role=combobox con aria-expanded/aria-controls/aria-autocomplete; opciones role=option con aria-selected.',
    'Teclado: ↑↓ resaltan, Enter elige, Esc cierra; el resaltado va en [data-highlighted].',
  ],
}
