import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Textarea>. Actualizar SIEMPRE que cambie Textarea.tsx. */
export const textareaSpec: ComponentSpec = {
  name: 'Textarea',
  dataSk: 'textarea',
  category: 'Formulario',
  description:
    'Campo de texto multilínea con label y helper opcionales y estado de error. Espejo de <Input> para textos largos (comentarios, descripciones). Headless: la forma la da el CSS.',
  extends: 'TextareaHTMLAttributes<HTMLTextAreaElement>',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      description: 'Etiqueta del campo. Se conecta al textarea vía htmlFor/id automáticamente.',
    },
    {
      name: 'helper',
      type: 'ReactNode',
      required: false,
      description: 'Texto de ayuda debajo. En error, el CSS lo pinta con color de error.',
    },
    {
      name: 'error',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Marca el campo como inválido (agrega [data-error] y aria-invalid).',
    },
  ],
  parts: [
    { name: 'root', description: 'Contenedor. Lleva [data-error] cuando error=true.' },
    { name: 'label', description: 'La etiqueta.' },
    { name: 'field', description: 'El <textarea>.' },
    { name: 'helper', description: 'Texto de ayuda / error.' },
  ],
  examples: [
    { title: 'Con label y helper', code: '<Textarea label="Comentario" rows={4} helper="Máx. 500 caracteres." />' },
    { title: 'En error', code: '<Textarea label="Descripción" error helper="Este campo es obligatorio." />' },
  ],
  usage: [
    'Usalo para texto de varias líneas; para una sola línea, usá Input.',
    'Controlá el alto inicial con la prop nativa `rows`.',
    'Pasá siempre `label` (o aria-label) para accesibilidad.',
    'value/onChange/placeholder/disabled/maxLength son nativas y pasan directo al textarea.',
  ],
  a11y: [
    'label ↔ textarea cableado con htmlFor/id (autogenerado si no pasás id).',
    'error setea aria-invalid; helper se enlaza con aria-describedby.',
  ],
}
