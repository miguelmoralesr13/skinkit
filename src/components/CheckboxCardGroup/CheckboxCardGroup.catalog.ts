import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <CheckboxCardGroup> + <CheckboxCard>. Actualizar SIEMPRE que cambien. */
export const checkboxCardGroupSpec: ComponentSpec = {
  name: 'CheckboxCardGroup',
  dataSk: 'checkbox-card-group',
  category: 'Formulario',
  description:
    'Grupo de opciones donde cada una es una TARJETA seleccionable, con selección MÚLTIPLE (gemelo de RadioCardGroup, que es de una sola). Mismo look (título + descripción + ícono) en cuadrícula navegable, pero podés marcar varias. Compuesto: <CheckboxCardGroup> con <CheckboxCard value title description icon>. Cada tarjeta envuelve un checkbox nativo. La forma la da el CSS.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>",
  props: [
    { name: 'value', type: 'string[]', required: false, description: 'Valores seleccionados (controlado).' },
    { name: 'defaultValue', type: 'string[]', required: false, default: '[]', description: 'Valores iniciales (uncontrolled).' },
    { name: 'onValueChange', type: '(value: string[]) => void', required: false, description: 'Se invoca con el array completo de valores seleccionados tras cada toggle.' },
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color de las tarjetas seleccionadas (del theme).' },
    { name: 'columns', type: 'number', required: false, default: '1', description: 'Columnas del grid (emite --sk-checkbox-card-group-cols).' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Deshabilita todas las tarjetas.' },
    { name: 'label', type: 'string', required: false, default: "'Opciones'", description: 'aria-label del grupo.' },
    { name: 'CheckboxCard.value', type: 'string', required: true, description: 'Valor único de la tarjeta.' },
    { name: 'CheckboxCard.title', type: 'ReactNode', required: true, description: 'Título de la tarjeta.' },
    { name: 'CheckboxCard.description', type: 'ReactNode', required: false, description: 'Descripción opcional.' },
    { name: 'CheckboxCard.icon', type: 'ReactNode', required: false, description: 'Ícono opcional.' },
  ],
  parts: [
    { name: 'root', description: 'role=group [data-sk=checkbox-card-group]. [data-tone] + --sk-checkbox-card-group-cols para el grid.' },
    { name: 'card', description: 'Cada opción ([data-sk=checkbox-card], [data-state=checked|unchecked]). <CheckboxCard value title description icon> — extends Omit<InputHTMLAttributes, "type"|"title">.' },
    { name: 'control', description: 'El <input type=checkbox> oculto por el CSS (sigue focuseable).' },
    { name: 'icon', description: 'Ícono opcional.' },
    { name: 'body', description: 'Contenedor de título + descripción.' },
    { name: 'title', description: 'Título de la tarjeta.' },
    { name: 'description', description: 'Descripción opcional.' },
    { name: 'indicator', description: 'Marca de selección (checkbox con check al estar checked).' },
  ],
  examples: [
    {
      title: 'Features (multi)',
      code: 'import { Zap, Shield, Bell } from \'lucide-react\'\n\n<CheckboxCardGroup defaultValue={[\'a\']} columns={2} onValueChange={setFeatures}>\n  <CheckboxCard value="a" title="Analytics" description="Métricas en vivo" icon={<Zap />} />\n  <CheckboxCard value="b" title="Seguridad" description="2FA + SSO" icon={<Shield />} />\n  <CheckboxCard value="c" title="Alertas" description="Push + email" icon={<Bell />} />\n</CheckboxCardGroup>',
    },
  ],
  usage: [
    'Para elegir VARIAS opciones ricas (título + descripción + ícono) en cuadrícula. Para una sola, usá RadioCardGroup. Para multi sin tarjetas (combobox + chips), usá MultiSelect.',
    'Cada <CheckboxCard> necesita un `value` único; `onValueChange` recibe el array completo.',
    'El estado seleccionado se refleja en [data-state=checked] (el CSS lo resalta).',
    'Ajustá la cuadrícula con `columns` (o pisando --sk-checkbox-card-group-cols).',
  ],
  a11y: [
    'role=group; cada tarjeta envuelve un checkbox nativo → selección múltiple, Space para (des)marcar y Tab entre tarjetas gratis.',
    'El checkbox queda visualmente oculto pero focuseable; el foco se ve en el indicador (focus-visible).',
  ],
}
