import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <PinInput>. Actualizar SIEMPRE que cambie PinInput.tsx. */
export const pinInputSpec: ComponentSpec = {
  name: 'PinInput',
  dataSk: 'pin-input',
  category: 'Formulario',
  description:
    'Código segmentado (OTP / verificación): una casilla por carácter, con auto-avance, backspace hacia atrás y pegado que se reparte entre las casillas. Controlado o no. La forma la da el skin.',
  extends: '—',
  props: [
    { name: 'value', type: 'string', required: false, description: 'Código actual (controlado).' },
    { name: 'defaultValue', type: 'string', required: false, default: "''", description: 'Código inicial (uncontrolled).' },
    { name: 'onChange', type: '(value: string) => void', required: false, description: 'Se invoca en cada cambio.' },
    { name: 'onComplete', type: '(value: string) => void', required: false, description: 'Se invoca al llenar todas las casillas.' },
    { name: 'length', type: 'number', required: false, default: '6', description: 'Cantidad de casillas.' },
    { name: 'type', type: "'numeric' | 'text'", required: false, default: "'numeric'", description: 'numeric restringe a dígitos.' },
    { name: 'mask', type: 'boolean', required: false, description: 'Muestra puntos en vez del carácter (códigos sensibles).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Ayuda / error.' },
    { name: 'error', type: 'boolean', required: false, description: 'Marca inválido.' },
  ],
  parts: [
    { name: 'root', description: 'Contenedor [data-sk=pin-input]. Lleva [data-error].' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'group', description: 'Fila de casillas.' },
    { name: 'field', description: 'Cada casilla (<input>). Lleva [data-filled] si tiene carácter.' },
    { name: 'helper', description: 'Ayuda / error.' },
  ],
  examples: [
    { title: 'OTP 6 dígitos', code: '<PinInput length={6} onComplete={(code) => verificar(code)} />' },
    { title: 'Enmascarado', code: '<PinInput length={4} mask value={pin} onChange={setPin} />' },
  ],
  usage: [
    'Para códigos de verificación/OTP. onComplete dispara al llenar la última casilla.',
    'type="numeric" (default) restringe a dígitos; pegá el código y se reparte solo.',
    'La primera casilla tiene autoComplete="one-time-code" para el autollenado de SMS en iOS.',
  ],
  a11y: ['Cada casilla tiene aria-label "Dígito n"; auto-avance y backspace mueven el foco.'],
}
