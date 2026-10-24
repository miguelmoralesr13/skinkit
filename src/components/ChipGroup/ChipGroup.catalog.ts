import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <ChipGroup>. Actualizar SIEMPRE que cambie ChipGroup.tsx. */
export const chipGroupSpec: ComponentSpec = {
  name: 'ChipGroup',
  dataSk: 'chip-group',
  category: 'Formulario',
  description:
    'Selección con botones en forma de píldora (tipo de escuela, niveles, filtros rápidos). Cada chip es un Toggle con aria-pressed. Elige una (siempre queda una) o varias con `multiple`.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'role'>",
  props: [
    { name: 'label', type: 'string', required: true, description: 'Nombre accesible del grupo (aria-label).' },
    { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]', required: true, description: 'Opciones disponibles.' },
    { name: 'value', type: 'string[]', required: true, description: 'Valores elegidos (controlado).' },
    { name: 'onValueChange', type: '(next: string[]) => void', required: true, description: 'Se invoca con la nueva selección completa.' },
    { name: 'multiple', type: 'boolean', required: false, default: 'false', description: 'Permite varias. Sin él, elegir una reemplaza a la anterior y nunca queda vacío.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, description: 'Tamaño de los chips (del Toggle).' },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, description: 'Color del chip elegido (del Toggle).' },
  ],
  parts: [
    { name: 'root', description: 'El <div role="group">. Lleva [data-mode=single|multiple].' },
    { name: 'chip', description: 'Cada <Toggle>. Lleva [data-part="chip"] y [data-state=on|off].' },
  ],
  examples: [
    {
      title: 'Una sola (tipo de escuela)',
      code: "<ChipGroup\n  label=\"Tipo de escuela\"\n  options={[{ value: 'priv', label: 'Privada' }, { value: 'pub', label: 'Pública' }]}\n  value={tipo}\n  onValueChange={setTipo}\n/>",
    },
    {
      title: 'Varias (niveles)',
      code: "<ChipGroup\n  multiple\n  label=\"Niveles\"\n  options={[{ value: 'pri', label: 'Primaria' }, { value: 'sec', label: 'Secundaria' }]}\n  value={niveles}\n  onValueChange={setNiveles}\n/>",
    },
  ],
  usage: [
    'Para 2–8 opciones cortas visibles a la vez. Con más, usá Select/Combobox; para una sola opción con descripción, RadioCardGroup.',
    'Siempre pasá `label`: nombra el grupo para lectores de pantalla.',
    'Sin `multiple` la selección es de un solo valor y no se puede vaciar; si necesitás poder limpiar, usá `multiple` y valida en tu formulario.',
  ],
  a11y: ['role="group" con aria-label; cada chip es un botón con aria-pressed; foco y Enter/Espacio nativos.'],
}
