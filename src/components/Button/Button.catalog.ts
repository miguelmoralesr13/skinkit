import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Button>. Actualizar SIEMPRE que cambie Button.tsx. */
export const buttonSpec: ComponentSpec = {
  name: 'Button',
  dataSk: 'button',
  category: 'Acción',
  description:
    'Botón de acción. Headless: sin estilo propio; su forma la da el CSS del componente. Soporta ícono a izquierda/derecha.',
  extends: 'ButtonHTMLAttributes<HTMLButtonElement>',
  props: [
    {
      name: 'variant',
      type: "'filled' | 'outlined' | 'ghost'",
      required: false,
      default: "'filled'",
      description: 'Jerarquía visual. filled = acción principal; outlined = secundaria; ghost = terciaria/discreta.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      required: false,
      default: "'md'",
      description: 'Tamaño del botón.',
    },
    {
      name: 'tone',
      type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'",
      required: false,
      default: "'primary'",
      description:
        'Tono de color del theme. Emite [data-tone] (primary no lo emite). El CSS pinta cada tono con var(--sk-<tono>)/var(--sk-on-<tono>).',
    },
    {
      name: 'iconLeft',
      type: 'ReactNode',
      required: false,
      description: 'Ícono a la izquierda del texto.',
    },
    {
      name: 'iconRight',
      type: 'ReactNode',
      required: false,
      description: 'Ícono a la derecha del texto.',
    },
    {
      name: 'classNames',
      type: '{ icon?: string; label?: string }',
      required: false,
      description:
        'Clases adicionales por sub-parte (icon/label). Aditivo: se agrega a la clase base, nunca la reemplaza.',
    },
  ],
  parts: [
    { name: 'root', description: 'El <button>. Lleva [data-variant], [data-size] y [data-tone].' },
    { name: 'icon', description: 'Envoltura de cada ícono (izq/der).' },
    { name: 'label', description: 'Envoltura del texto.' },
  ],
  examples: [
    { title: 'Principal', code: '<Button onClick={save}>Guardar</Button>' },
    { title: 'Secundario', code: '<Button variant="outlined">Cancelar</Button>' },
    { title: 'Con ícono', code: '<Button iconLeft={<PlusIcon />}>Nuevo</Button>' },
    { title: 'Tono', code: '<Button tone="success">Aprobar</Button>' },
  ],
  usage: [
    'Usá `variant="filled"` para la acción principal de cada vista; una sola por sección.',
    'No pongas más de un botón filled compitiendo en el mismo bloque.',
    'Para acciones destructivas podés pasar `data-tone="danger"` (se pasa por props al <button> y el CSS lo pinta en rojo); comunicá el riesgo por texto igual.',
    'El disabled es nativo (`disabled`); el CSS lo estila vía :disabled.',
  ],
  a11y: [
    'type por defecto es "button" (no envía formularios sin querer); pasá type="submit" cuando corresponda.',
  ],
}
