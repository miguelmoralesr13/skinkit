/**
 * Contrato del catálogo — la FUENTE DE LA VERDAD de cada componente.
 *
 * Cada componente tiene un `<Name>.catalog.ts` (aparte del componente) que exporta un
 * ComponentSpec con TODAS sus props, su contrato de parts, ejemplos y recomendaciones de uso.
 * Esto es lo que consume la generación de pantallas con IA: si no está acá, la IA no lo sabe.
 *
 * Regla dura: el catálogo va SIEMPRE en un archivo separado, y se actualiza CADA vez que el
 * componente cambia (props, comportamiento, parts).
 */

export interface PropSpec {
  /** Nombre de la prop tal cual se pasa. */
  name: string
  /** Tipo TS legible (ej. "'filled' | 'outlined' | 'ghost'", "ReactNode", "boolean"). */
  type: string
  /** Si es obligatoria. */
  required: boolean
  /** Valor por defecto, si tiene. */
  default?: string
  /** Qué hace y cuándo usarla. */
  description: string
}

export interface PartSpec {
  /** Valor de [data-part] (o "root" para el elemento con [data-sk]). */
  name: string
  /** Qué es esa parte — la usa el CSS del componente para estilarla. */
  description: string
}

export interface ExampleSpec {
  title: string
  /** JSX mínimo y funcional. */
  code: string
}

/** Categorías para agrupar el catálogo (rail del playground, docs, generación por IA). */
export type ComponentCategory =
  | 'Acción'
  | 'Formulario'
  | 'Display'
  | 'Navegación'
  | 'Overlay'
  | 'Feedback'
  | 'Layout'

/** Orden en que se muestran las categorías. */
export const CATEGORY_ORDER: ComponentCategory[] = [
  'Acción',
  'Formulario',
  'Navegación',
  'Overlay',
  'Feedback',
  'Display',
  'Layout',
]

export interface ComponentSpec {
  /** Nombre de import (ej. "Button", "Accordion"). */
  name: string
  /** Valor de [data-sk] en la raíz (ej. "button"). Compound: el de la raíz. */
  dataSk: string
  /** Categoría para agrupar el catálogo. */
  category: ComponentCategory
  /** Qué es y para qué sirve, en una o dos frases. */
  description: string
  /** TODAS las props públicas propias (además de las nativas heredadas, indicadas en `extends`). */
  props: PropSpec[]
  /** Atributos HTML nativos que hereda (ej. "ButtonHTMLAttributes<HTMLButtonElement>"). */
  extends?: string
  /** Contrato de parts que expone para su CSS. */
  parts: PartSpec[]
  /** Ejemplos de uso. */
  examples: ExampleSpec[]
  /** Recomendaciones: cuándo usarlo, qué hacer y qué NO hacer. */
  usage: string[]
  /** Notas de accesibilidad relevantes para quien lo usa. */
  a11y?: string[]
}
