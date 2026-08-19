import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <NumberInput>. Actualizar SIEMPRE que cambie NumberInput.tsx. */
export const numberInputSpec: ComponentSpec = {
  name: 'NumberInput',
  dataSk: 'number-input',
  category: 'Formulario',
  description:
    'Campo numérico con botones −/+ que respetan min/max/step (cantidades, contadores). Controlado o no. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: 'number', required: false, description: 'Valor (controlado). Usalo con onChange.' },
    { name: 'defaultValue', type: 'number', required: false, default: '0', description: 'Valor inicial (uncontrolled).' },
    { name: 'onChange', type: '(value: number) => void', required: false, description: 'Se invoca con el nuevo valor (ya clampeado a min/max).' },
    { name: 'min', type: 'number', required: false, description: 'Mínimo (deshabilita − al llegar).' },
    { name: 'max', type: 'number', required: false, description: 'Máximo (deshabilita + al llegar).' },
    { name: 'step', type: 'number', required: false, default: '1', description: 'Incremento de cada botón.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta (htmlFor cableado).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Texto de ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido ([data-error] + aria-invalid).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita campo y botones.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor. Lleva [data-error].' },
    { name: 'label', description: 'La etiqueta.' },
    { name: 'control', description: 'Fila − campo +.' },
    { name: 'decrement', description: 'Botón − (disabled en el mínimo).' },
    { name: 'field', description: 'El <input type=number>.' },
    { name: 'increment', description: 'Botón + (disabled en el máximo).' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'Cantidad', code: '<NumberInput label="Cantidad" min={1} max={99} defaultValue={1} />' },
    { title: 'Controlado', code: '<NumberInput value={qty} onChange={setQty} min={0} step={5} />' },
  ],
  usage: [
    'Para cantidades acotadas con ajuste fino. Para un rango aproximado, usá Slider.',
    'min/max deshabilitan los botones en los extremos y clampean el valor tipeado.',
    'Es controlado si pasás `value`; si no, usá `defaultValue`.',
  ],
  a11y: ['Botones con aria-label Disminuir/Aumentar; el input es type=number; error setea aria-invalid.'],
}
