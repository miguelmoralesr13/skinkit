import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Fieldset>. Actualizar SIEMPRE que cambie Fieldset.tsx. */
export const fieldsetSpec: ComponentSpec = {
  name: 'Fieldset',
  dataSk: 'fieldset',
  category: 'Formulario',
  description:
    'Agrupa campos relacionados bajo una leyenda. Usa <fieldset>/<legend> nativos: `disabled` deshabilita en cascada TODOS los controles de adentro. La forma la da el CSS.',
  extends: 'FieldsetHTMLAttributes<HTMLFieldSetElement>',
  props: [
    { name: 'legend', type: 'ReactNode', required: false, description: 'Título del grupo (<legend>).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error del grupo.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca el grupo como inválido ([data-error]).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Nativo: deshabilita todos los controles internos.' },
  ],
  parts: [
    { name: 'root', description: 'El <fieldset> [data-sk=fieldset]. Lleva [data-error].' },
    { name: 'legend', description: 'La leyenda (<legend>).' },
    { name: 'content', description: 'Los campos.' },
    { name: 'helper', description: 'Ayuda / error del grupo.' },
  ],
  examples: [
    {
      title: 'Dirección',
      code: '<Fieldset legend="Dirección" helper="Todos los campos son obligatorios.">\n  <Input label="Calle" />\n  <Input label="Ciudad" />\n</Fieldset>',
    },
  ],
  usage: [
    'Agrupá campos que van juntos (una dirección, un método de pago).',
    'disabled es NATIVO y cae en cascada: deshabilitás el grupo entero con una sola prop.',
    'Para un grupo de radios/checkboxes, envolvelos acá y usá la legend como su etiqueta.',
  ],
  a11y: ['<fieldset>/<legend> nativos: la leyenda nombra el grupo para lectores de pantalla.'],
}
