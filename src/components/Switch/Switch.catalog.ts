import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Switch>. Actualizar SIEMPRE que cambie Switch.tsx. */
export const switchSpec: ComponentSpec = {
  name: 'Switch',
  dataSk: 'switch',
  category: 'Formulario',
  description:
    'Interruptor on/off para activar/desactivar algo de efecto inmediato (preferencias, settings). Headless: es un checkbox nativo con role="switch"; el CSS pinta el riel y la perilla.',
  extends: 'Omit<InputHTMLAttributes<HTMLInputElement>, "type">',
  props: [
    { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'", required: false, default: "'primary'", description: 'Color del estado encendido (del theme).' },
    {
      name: 'label',
      type: 'ReactNode',
      required: false,
      description: 'Texto junto al interruptor. Va dentro del <label>, así clickearlo togglea.',
    },
  ],
  parts: [
    { name: 'control', description: 'El <input type=checkbox role=switch>. El CSS lo oculta visualmente.' },
    { name: 'track', description: 'Riel de fondo; cambia de color con :checked.' },
    { name: 'thumb', description: 'Perilla que el CSS desliza según :checked.' },
    { name: 'label', description: 'Texto.' },
  ],
  examples: [
    { title: 'Con label', code: '<Switch label="Notificaciones" />' },
    { title: 'Controlado', code: '<Switch label="Modo oscuro" checked={dark} onChange={(e) => setDark(e.target.checked)} />' },
  ],
  usage: [
    'Usá Switch para acciones de efecto INMEDIATO (encender/apagar). Si el cambio recién se aplica al enviar un formulario, usá Checkbox.',
    'Pasá `label` (o aria-label) siempre.',
    'checked/defaultChecked/onChange/disabled son nativas y pasan directo al input.',
  ],
  a11y: [
    'role="switch" comunica estado on/off a lectores de pantalla (además de aria-checked nativo del checkbox).',
    'El label envuelve al control: clickear el texto togglea.',
  ],
}
