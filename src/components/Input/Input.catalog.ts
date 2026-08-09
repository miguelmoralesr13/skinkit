import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Input>. Actualizar SIEMPRE que cambie Input.tsx. */
export const inputSpec: ComponentSpec = {
  name: 'Input',
  dataSk: 'input',
  category: 'Formulario',
  description:
    'Campo de texto con label y helper opcionales, y estado de error. Headless: la forma la da el skin. El label ya viene cableado con htmlFor.',
  extends: 'InputHTMLAttributes<HTMLInputElement>',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      description: 'Etiqueta del campo. Se conecta al input vía htmlFor/id automáticamente.',
    },
    {
      name: 'helper',
      type: 'ReactNode',
      required: false,
      description: 'Texto de ayuda debajo. En error, el skin lo pinta con color de error.',
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
    { name: 'field', description: 'El <input>.' },
    { name: 'helper', description: 'Texto de ayuda / error.' },
  ],
  examples: [
    { title: 'Con label y helper', code: '<Input label="Correo" placeholder="tu@correo.com" helper="No lo compartimos." />' },
    { title: 'En error', code: '<Input label="Correo" error helper="Formato inválido." />' },
  ],
  usage: [
    'Pasá siempre `label` para accesibilidad; si por diseño no hay label visible, usá aria-label en su lugar.',
    'Usá `error` + `helper` juntos: el helper comunica QUÉ está mal.',
    'Props nativas (value/onChange/type/placeholder/disabled) pasan directo al input.',
  ],
  a11y: [
    'label ↔ input cableado con htmlFor/id (autogenerado si no pasás id).',
    'error setea aria-invalid; helper se enlaza con aria-describedby.',
  ],
}
