import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <RangeSlider>. Actualizar SIEMPRE que cambie RangeSlider.tsx. */
export const rangeSliderSpec: ComponentSpec = {
  name: 'RangeSlider',
  dataSk: 'range-slider',
  category: 'Formulario',
  description:
    'Control de dos extremos para elegir un intervalo numérico (rango de horas, de precios, de edades). Cada pulgar es un role=slider con teclado y arrastre por puntero; tocar el riel mueve el pulgar más cercano; los extremos nunca se cruzan. Controlado o no. La forma la da el CSS.',
  extends: '—',
  props: [
    { name: 'value', type: '[number, number]', required: false, description: 'Extremos [inicio, fin] (controlado).' },
    { name: 'defaultValue', type: '[number, number]', required: false, default: '[min, max]', description: 'Extremos iniciales (no controlado).' },
    { name: 'onChange', type: '(value: [number, number]) => void', required: false, description: 'En cada cambio, también al arrastrar.' },
    { name: 'onChangeEnd', type: '(value: [number, number]) => void', required: false, description: 'Al soltar el pulgar o terminar un gesto de teclado.' },
    { name: 'min', type: 'number', required: false, default: '0', description: 'Mínimo del rango.' },
    { name: 'max', type: 'number', required: false, default: '100', description: 'Máximo del rango.' },
    { name: 'step', type: 'number', required: false, default: '1', description: 'Paso; los valores se ajustan a él.' },
    { name: 'minDistance', type: 'number', required: false, default: '0', description: 'Separación mínima entre extremos.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita.' },
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta (nombra al grupo).' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Texto de ayuda.' },
    { name: 'showValue', type: 'boolean', required: false, description: 'Muestra «inicio – fin» junto a la etiqueta.' },
    { name: 'formatValue', type: '(n: number) => string', required: false, description: 'Formato de cada número (etiqueta visible y aria-valuetext), p. ej. horas «18:00».' },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del tramo y los pulgares.' },
    { name: 'wrap', type: 'boolean', required: false, default: 'false', description: "Opt-in. Eje circular (horas del día): el rango puede cruzar el final del eje. `value=[inicio, fin]` con `fin < inicio` significa que cruza ([22, 2] en 0–24 = 22:00 a 02:00). Los valores viven en [min, max): `max` equivale a `min`; `fin === inicio` es vacío. `minDistance` se mide sobre el arco. Los pulgares nunca se rebasan entre sí (el arco no se invierte)." },
    { name: 'startLabel', type: 'string', required: false, default: "'Inicio' (según locale)", description: 'Nombre accesible del pulgar de inicio.' },
    { name: 'endLabel', type: 'string', required: false, default: "'Fin' (según locale)", description: 'Nombre accesible del pulgar de fin.' },
    { name: 'classNames', type: 'RangeSliderClassNames', required: false, description: 'Clases adicionales por sub-parte (header, label, value, track, range, thumbStart, thumbEnd, helper).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=range-slider] (role=group). Lleva [data-tone], [data-disabled], [data-dragging] y las variables --sk-range-start / --sk-range-end (%).' },
    { name: 'header', description: 'Fila de etiqueta + valores.' },
    { name: 'label', description: 'Etiqueta.' },
    { name: 'value', description: '«inicio – fin» (si showValue).' },
    { name: 'track', description: 'El riel (recibe el puntero).' },
    { name: 'range', description: 'El tramo entre los dos pulgares (con `wrap` y arco que cruza, va del pulgar de inicio al final del riel).' },
    { name: 'range-wrap', description: 'Solo con `wrap` y arco que cruza: el segundo tramo, del principio del riel al pulgar de fin. Root lleva [data-wrap] y [data-crossing].' },
    { name: 'thumb-start', description: 'Pulgar de inicio (role=slider).' },
    { name: 'thumb-end', description: 'Pulgar de fin (role=slider).' },
    { name: 'helper', description: 'Ayuda.' },
  ],
  examples: [
    { title: 'Horario', code: '<RangeSlider label="Horario" min={0} max={24} step={0.5} value={horas} onChange={setHoras} showValue formatValue={(h) => `${Math.floor(h)}:${h % 1 ? "30" : "00"}`} />' },
    { title: 'Horario que cruza la medianoche', code: '<RangeSlider wrap label="Turno" min={0} max={24} step={0.5} minDistance={1} value={[22, 2]} onChange={setTurno} showValue formatValue={hora} />' },
    { title: 'No controlado', code: '<RangeSlider defaultValue={[20, 60]} />' },
  ],
  usage: [
    'Para un intervalo (de–a). Para un solo valor usa Slider.',
    'Los extremos nunca se cruzan; `minDistance` impone una separación mínima.',
    'Para ejes cíclicos (horas del día) activa `wrap`: el rango puede ir de 22:00 a 02:00; sin `wrap` el comportamiento no cambia.',
    'i18n: los nombres accesibles de los pulgares salen del diccionario `rangeSlider` del locale; se pisan con startLabel/endLabel.',
  ],
  a11y: [
    'Cada pulgar es role=slider con aria-valuemin/max/now/valuetext. Teclado: flechas ±paso, RePág/AvPág ±10 pasos, Inicio/Fin a los límites (con `wrap`, al arco más corto/largo permitido). Con `wrap`, aria-valuenow/valuetext de cada pulgar son su hora normalizada en [min, max); el «inicio – fin» visible (showValue) describe el arco completo.',
  ],
}
