import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <PasswordInput>. Actualizar SIEMPRE que cambie PasswordInput.tsx. */
export const passwordInputSpec: ComponentSpec = {
  name: 'PasswordInput',
  dataSk: 'password-input',
  category: 'Formulario',
  description:
    'Campo de contraseña con botón de mostrar/ocultar (alterna type password/text). Espejo de Input. La forma la da el skin.',
  extends: "Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>",
  props: [
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta (htmlFor cableado).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido ([data-error] + aria-invalid).' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=password-input]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'control', description: 'Fila campo + toggle.' },
    { name: 'field', description: 'El <input> (password/text).' },
    { name: 'toggle', description: 'Botón mostrar/ocultar. Lleva [data-visible] cuando se ve.' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Con label', code: '<PasswordInput label="Contraseña" placeholder="••••••••" />' },
    { title: 'En error', code: '<PasswordInput label="Contraseña" error helper="Mínimo 8 caracteres." />' },
  ],
  usage: [
    'value/onChange/placeholder/autoComplete pasan directo al input (usá autoComplete="new-password"/"current-password").',
    'El toggle solo cambia la visibilidad; no toca el valor.',
  ],
  a11y: ['El toggle trae aria-label y aria-pressed; el error setea aria-invalid.'],
}
