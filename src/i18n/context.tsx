import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { es } from './es'
import { en } from './en'
import type { SkinkitBuiltinLocale, SkinkitMessages, SkinkitMessagesOverrides } from './types'

/** Diccionarios incluidos, por idioma base (sin región). */
export const SKINKIT_MESSAGES: Record<SkinkitBuiltinLocale, SkinkitMessages> = { es, en }

export const DEFAULT_SKINKIT_LOCALE = 'es'

export interface SkinkitI18n {
  /** Tag BCP-47 tal cual lo recibió el provider (`'es'`, `'en-US'`, `'pt-BR'`…). Es lo que hay
   * que pasarle a `Intl.*` — Calendar/DatePicker lo usan para nombres de mes/día. */
  locale: string
  /** Textos ya resueltos: diccionario del idioma (o `es` si no hay) + overrides del provider. */
  messages: SkinkitMessages
}

const SkinkitI18nContext = createContext<SkinkitI18n>({
  locale: DEFAULT_SKINKIT_LOCALE,
  messages: es,
})

/** `'en-US'` → `'en'`. Si no hay diccionario para ese idioma, cae a `es`. */
export function resolveBuiltinLocale(locale: string): SkinkitBuiltinLocale {
  const base = locale.toLowerCase().split(/[-_]/)[0]
  return base in SKINKIT_MESSAGES ? (base as SkinkitBuiltinLocale) : DEFAULT_SKINKIT_LOCALE
}

/** Diccionario base + overrides parciales por componente (merge de dos niveles, alcanza: la forma es plana por grupo). */
export function mergeMessages(base: SkinkitMessages, overrides?: SkinkitMessagesOverrides): SkinkitMessages {
  if (!overrides) return base
  const out = { ...base } as Record<string, Record<string, string>>
  for (const key of Object.keys(overrides) as (keyof SkinkitMessages)[]) {
    const patch = overrides[key]
    if (patch) out[key] = { ...out[key], ...(patch as Record<string, string>) }
  }
  return out as unknown as SkinkitMessages
}

/** Reemplaza `{nombre}` por su valor. Los placeholders sin valor quedan tal cual. */
export function formatMessage(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}

export interface SkinkitI18nProviderProps {
  locale?: string
  messages?: SkinkitMessagesOverrides
  children: ReactNode
}

/** Interno: lo monta `SkinkitProvider`. Exportado sólo para quien quiera cambiar idioma en un subárbol sin otro root. */
export function SkinkitI18nProvider({ locale = DEFAULT_SKINKIT_LOCALE, messages, children }: SkinkitI18nProviderProps) {
  const value = useMemo<SkinkitI18n>(
    () => ({ locale, messages: mergeMessages(SKINKIT_MESSAGES[resolveBuiltinLocale(locale)], messages) }),
    [locale, messages],
  )
  return <SkinkitI18nContext.Provider value={value}>{children}</SkinkitI18nContext.Provider>
}

/** Locale + textos del `SkinkitProvider` ancestro más cercano (o `es` si no hay ninguno). */
export function useSkinkitI18n(): SkinkitI18n {
  return useContext(SkinkitI18nContext)
}

/** Atajo: sólo los textos. Es lo que usan los componentes para sus defaults. */
export function useSkinkitMessages(): SkinkitMessages {
  return useContext(SkinkitI18nContext).messages
}
