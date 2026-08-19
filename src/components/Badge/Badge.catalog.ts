import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Badge>. Actualizar SIEMPRE que cambie Badge.tsx. */
export const badgeSpec: ComponentSpec = {
  name: 'Badge',
  dataSk: 'badge',
  category: 'Display',
  description:
    'Etiqueta corta tipo píldora para estado, categoría o conteo (ej. "Nuevo", "3", "Activo"). Puro presentacional; la forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLSpanElement>',
  props: [
    {
      name: 'variant',
      type: "'neutral' | 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'info' | 'danger'",
      required: false,
      default: "'neutral'",
      description:
        'Tono según intención. neutral = informativo; primary = destacado/de marca; danger = error/alerta.',
    },
  ],
  parts: [{ name: 'root', description: 'El <span>. Lleva [data-variant].' }],
  examples: [
    { title: 'Neutral', code: '<Badge>Borrador</Badge>' },
    { title: 'Primary', code: '<Badge variant="primary">Nuevo</Badge>' },
    { title: 'Danger con conteo', code: '<Badge variant="danger">3</Badge>' },
  ],
  usage: [
    'Textos MUY cortos (1–2 palabras o un número). Para mensajes largos usá otro patrón.',
    'No lo uses como botón: no tiene comportamiento ni foco. Si necesitás clic, envolvé en un Button/enlace.',
    'Elegí `variant` por significado, no por color: el color real lo pone el theme.',
  ],
}
