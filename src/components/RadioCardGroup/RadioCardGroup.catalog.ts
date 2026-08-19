import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <RadioCardGroup> + <RadioCard>. Actualizar SIEMPRE que cambien. */
export const radioCardGroupSpec: ComponentSpec = {
  name: 'RadioCardGroup',
  dataSk: 'radio-card-group',
  category: 'Formulario',
  description:
    'Grupo de opciones donde cada una es una TARJETA seleccionable (planes, métodos de pago, layouts). Compuesto: <RadioCardGroup> con <RadioCard title description icon>. Selección única nativa. La forma la da el CSS.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>",
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de la tarjeta seleccionada (del theme).' },
    { name: 'value', type: 'string', required: false, description: 'Opción activa (controlado).' },
    { name: 'defaultValue', type: 'string', required: false, description: 'Opción inicial (uncontrolled).' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Se invoca con el value elegido.' },
    { name: 'name', type: 'string', required: false, description: 'name compartido (autogenerado).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita todas las tarjetas.' },
    { name: 'label', type: 'string', required: false, default: "'Opciones'", description: 'aria-label del grupo.' },
  ],
  parts: [
    { name: 'root', description: 'role=radiogroup [data-sk=radio-card-group].' },
    { name: 'card', description: 'Cada opción ([data-sk=radio-card], [data-state]). <RadioCard value title description icon> — RadioCard extends Omit<InputHTMLAttributes, "type"|"title">.' },
    { name: 'control', description: 'El <input type=radio> oculto por el CSS.' },
    { name: 'title', description: 'Título de la tarjeta.' },
    { name: 'description', description: 'Descripción opcional.' },
    { name: 'icon', description: 'Ícono opcional.' },
    { name: 'indicator', description: 'Marca de selección.' },
  ],
  examples: [
    {
      title: 'Planes',
      code: '<RadioCardGroup defaultValue="pro" onValueChange={setPlan}>\n  <RadioCard value="free" title="Free" description="Para empezar" />\n  <RadioCard value="pro" title="Pro" description="$9/mes" />\n</RadioCardGroup>',
    },
  ],
  usage: [
    'Para elegir UNA opción rica (con título + descripción + ícono). Para opciones simples, usá RadioGroup o SegmentedControl.',
    'Cada <RadioCard> necesita un `value` único.',
    'El estado seleccionado se refleja en [data-state=checked] (el CSS lo resalta).',
  ],
  a11y: ['role=radiogroup; cada tarjeta envuelve un radio nativo → selección única y flechas gratis.'],
}
