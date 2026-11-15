import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Keypad>. Actualizar SIEMPRE que cambie Keypad.tsx. */
export const keypadSpec: ComponentSpec = {
  name: 'Keypad',
  dataSk: 'keypad',
  category: 'Formulario',
  description:
    'Teclado numérico en pantalla para teclear cantidades (importes, propinas, cantidades) de pie, con teclas grandes (≥ 44 px) y sin el teclado del sistema. Emite un ENTERO de la unidad menor: cada dígito se desplaza a la derecha y `decimals` solo decide cómo se muestra (con decimals=2, 1250 se muestra «12.50»), de modo que nunca hay flotantes. Soporta teclado físico. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: 'number', required: false, description: 'Cantidad como entero de la unidad menor (controlado).' },
    { name: 'defaultValue', type: 'number', required: false, default: '0', description: 'Cantidad inicial (no controlado).' },
    { name: 'onChange', type: '(value: number) => void', required: false, description: 'En cada tecla. Siempre un entero.' },
    { name: 'onSubmit', type: '(value: number) => void', required: false, description: 'Enter (teclado físico) o botón de aceptar; con esta prop se muestra el botón.' },
    { name: 'decimals', type: 'number', required: false, default: '0', description: 'Cifras decimales del display. La conversión decimal es del componente.' },
    { name: 'shortcuts', type: 'number[]', required: false, description: 'Cantidades rápidas (en la unidad menor): una fila de botones que fijan el valor.' },
    { name: 'maxDigits', type: 'number', required: false, default: '9', description: 'Tope de dígitos; más teclas se ignoran.' },
    { name: 'prefix', type: 'ReactNode', required: false, description: 'Texto antes del número del display (símbolo de moneda, etc.).' },
    { name: 'suffix', type: 'ReactNode', required: false, description: 'Texto después del número del display.' },
    { name: 'format', type: '(value: number) => ReactNode', required: false, description: 'Formato propio del display y de los atajos. Default: Intl.NumberFormat del locale con `decimals`.' },
    { name: 'allowZero', type: 'boolean', required: false, default: 'false', description: 'Permite aceptar con valor 0 (por omisión el botón y Enter esperan una cantidad).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita teclas y atajos.' },
    { name: 'autoFocus', type: 'boolean', required: false, description: 'Toma el foco al montarse, listo para el teclado físico.' },
    { name: 'captureKeys', type: 'boolean', required: false, description: 'Escucha el teclado físico en toda la página (salvo en campos de texto): para pantallas de caja donde nada tiene el foco.' },
    { name: 'showDisplay', type: 'boolean', required: false, default: 'true', description: 'Muestra el display con la cantidad.' },
    { name: 'submitLabel', type: 'ReactNode', required: false, default: "'Aceptar' (según locale)", description: 'Texto del botón de aceptar.' },
    { name: 'label', type: 'string', required: false, default: "'Teclado numérico' (según locale)", description: 'Nombre accesible del grupo.' },
    { name: 'classNames', type: '{ display?; keys?; key?; shortcuts?; shortcut?; submit? }', required: false, description: 'Clases adicionales por sub-parte (aditivas).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=keypad] (role=group, enfocable). Lleva [data-disabled].' },
    { name: 'display', description: '<output aria-live=polite> con la cantidad. [data-zero] si es 0. Hijos: prefix, amount, suffix.' },
    { name: 'keys', description: 'Rejilla 3×4 (role=group).' },
    { name: 'key', description: 'Cada tecla [data-key=0-9|clear|backspace].' },
    { name: 'shortcuts', description: 'Fila de cantidades rápidas.' },
    { name: 'shortcut', description: 'Cada atajo [data-value].' },
    { name: 'submit', description: 'Botón de aceptar (solo con onSubmit).' },
  ],
  examples: [
    { title: 'Importe en caja', code: '<Keypad value={importe} onChange={setImporte} decimals={2} prefix="$" shortcuts={[10000, 20000, 50000]} onSubmit={(centavos) => cobrar(centavos)} />' },
    { title: 'Cantidad entera', code: '<Keypad defaultValue={1} maxDigits={3} onSubmit={(n) => agregar(n)} />' },
  ],
  usage: [
    'Para teclear cantidades de pie (POS, propinas, cantidades): teclas grandes y sin teclado del sistema. Para pocas unidades con −/+, usa NumberInput.',
    'El valor es entero de la unidad menor; guárdalo así y convierte solo para mostrar. Con decimals={2}, onChange(1250) significa 12.50.',
    'Para un PIN o código (cadena con ceros a la izquierda) usa PinInput con `keypad`, no este componente.',
    'i18n: los textos por defecto (aria-labels, botón de aceptar) salen del diccionario `keypad` del `locale` del SkinkitProvider (es/en); se pisan con `messages` o con la prop explícita.',
  ],
  a11y: [
    'Grupo con nombre accesible y display aria-live=polite. Teclado físico: dígitos, Retroceso (borrar), Supr (limpiar), Enter (aceptar). Las teclas llevan aria-label (borrar, limpiar) y tamaño táctil ≥ 44 px.',
  ],
}
