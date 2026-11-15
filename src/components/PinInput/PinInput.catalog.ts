import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <PinInput>. Actualizar SIEMPRE que cambie PinInput.tsx. */
export const pinInputSpec: ComponentSpec = {
  name: 'PinInput',
  dataSk: 'pin-input',
  category: 'Formulario',
  description:
    'Código segmentado (OTP / verificación): una casilla por carácter, con auto-avance, backspace hacia atrás y pegado que se reparte entre las casillas. Controlado o no. La forma la da el CSS.',
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
    {
      name: 'classNames',
      type: '{ label?: string; group?: string; field?: string; helper?: string }',
      required: false,
      description:
        'Clases opcionales por sub-parte (label/group/field/helper). Aditivas: nunca reemplazan la clase base. field se aplica a todas las casillas.',
    },
    { name: 'autoFocus', type: 'boolean', required: false, description: 'Opt-in. Toma el foco al montarse: la primera casilla vacía (o el grupo con `keypad`). Pantallas cuyo único fin es teclear el código.' },
    { name: 'onClear', type: '() => void', required: false, description: 'Opt-in. Se invoca cuando el código queda vacío: se borra del todo, la tecla de limpiar del `keypad` o `ref.current.clear()`.' },
    { name: 'keypad', type: 'boolean', required: false, default: 'false', description: 'Opt-in. Dibuja un teclado numérico en pantalla bajo las casillas (teclas ≥ 44 px) sin depender del teclado del sistema: las casillas quedan de solo lectura (inputMode="none"), el grupo recibe el teclado físico (dígitos, Retroceso, Supr). Solo con type="numeric".' },
    { name: 'ref', type: 'Ref<PinInputHandle>', required: false, description: 'Métodos imperativos: `focus()` y `clear()` (borra, enfoca y avisa con onClear; útil tras un PIN incorrecto).' },
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
    { title: 'PIN con teclado en pantalla', code: '<PinInput length={4} mask keypad autoFocus onComplete={(pin) => entrar(pin)} onClear={() => setError(false)} />' },
  ],
  usage: [
    'Para códigos de verificación/OTP. onComplete dispara al llenar la última casilla.',
    'type="numeric" (default) restringe a dígitos; pegá el código y se reparte solo.',
    'La primera casilla tiene autoComplete="one-time-code" para el autollenado de SMS en iOS.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `pinInput` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ pinInput: { … } }}>` o con la prop explícita del componente, que siempre gana.',
    'Tablet o terminal de pie: `keypad` + `autoFocus` (el teclado del sistema no tapa media pantalla). Tras un PIN incorrecto: `ref.current?.clear()`.',
  ],
  a11y: ['Cada casilla tiene aria-label "Dígito n"; auto-avance y backspace mueven el foco.'],
}
