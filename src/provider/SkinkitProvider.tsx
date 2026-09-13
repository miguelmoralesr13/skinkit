import { createContext, useContext, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { SkinkitI18nProvider } from '../i18n/context'
import type { SkinkitMessagesOverrides } from '../i18n/types'

const SkinkitColorSchemeContext = createContext<'light' | 'dark' | undefined>(undefined)

/**
 * El `colorScheme` forzado por el SkinkitProvider ancestro más cercano, si hay uno. Lo consumen
 * los componentes que hacen `createPortal` a `document.body` (Dialog, CommandMenu, Toast,
 * TourOverlay) para replicarlo en el `[data-skinkit-root]` propio que crean ahí — un portal
 * escapa del árbol de DOM, así que no hereda `color-scheme` del provider original y, sin esto,
 * ignoraría un `colorScheme` forzado (quedaría siguiendo el del sistema operativo).
 */
export function useSkinkitColorScheme(): 'light' | 'dark' | undefined {
  return useContext(SkinkitColorSchemeContext)
}

export interface SkinkitProviderProps {
  className?: string
  children: ReactNode
  /** Fuerza modo claro/oscuro. Sin especificar, sigue el color-scheme del sistema operativo —
   * ver `color-scheme`/`light-dark()` en src/styles/tokens.css. Persistir la elección (ej.
   * localStorage) es responsabilidad de quien consume skinkit, no de este provider. */
  colorScheme?: 'light' | 'dark'
  /** Idioma de los textos por defecto de la librería (aria-labels, placeholders, "Sin
   * resultados", botones de diálogos…) y locale para `Intl` en Calendar/DatePicker. Tag BCP-47;
   * diccionarios incluidos: `es` (default) y `en`. Otro idioma → textos en `es` salvo que se pasen
   * por `messages`. Una prop explícita en un componente (`emptyText`, `aria-label`…) siempre gana. */
  locale?: string
  /** Overrides parciales por componente sobre el diccionario del `locale`:
   * `{ dataTable: { empty: 'Nada por acá' } }`. Con `locale` sin diccionario incluido, acá va la
   * traducción completa (la forma es `SkinkitMessages`, ver `skinkitMessagesEs`). */
  messages?: SkinkitMessagesOverrides
}

/**
 * Envuelve el árbol y marca la raíz del reset base ([data-skinkit-root]). Ya no fija
 * [data-theme]/[data-skin]: el look es uno solo (Tailwind, ver src/styles/tokens.css) y se
 * personaliza pisando variables `--color-sk-*`/`--radius-sk-*`/etc. — con CSS plano o con tu
 * propio build de Tailwind (ver `skinkit/tailwind-preset`), no eligiendo entre presets.
 * También fija el idioma de los textos internos (`locale`/`messages`, ver src/i18n/).
 */
export function SkinkitProvider({ className, children, colorScheme, locale, messages }: SkinkitProviderProps) {
  return (
    <SkinkitColorSchemeContext.Provider value={colorScheme}>
      <SkinkitI18nProvider locale={locale} messages={messages}>
        <div data-skinkit-root="" data-color-scheme={colorScheme} className={cx('skinkit-root', className)}>
          {children}
        </div>
      </SkinkitI18nProvider>
    </SkinkitColorSchemeContext.Provider>
  )
}
