import { createContext, useContext, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { SkinkitI18nProvider } from '../i18n/context'
import type { SkinkitMessagesOverrides } from '../i18n/types'

/** Opciones opt-in del provider (todas apagadas por omisión). Las lee `useOverlayRootProps`. */
export interface SkinkitRefinements {
  inheritColorScheme: boolean
  variantPriority: boolean
  scopedNav: boolean
  scopedBody: boolean
}
const SIN_REFINAMIENTOS: SkinkitRefinements = {
  inheritColorScheme: false,
  variantPriority: false,
  scopedNav: false,
  scopedBody: false,
}
const SkinkitRefinementsContext = createContext<SkinkitRefinements>(SIN_REFINAMIENTOS)

/** Opciones opt-in activas en el SkinkitProvider ancestro (todo `false` sin provider/sin opt-in). */
export function useSkinkitRefinements(): SkinkitRefinements {
  return useContext(SkinkitRefinementsContext)
}

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
  /** Activa de una vez los cuatro refinamientos de abajo (cada uno se puede activar suelto). Por
   * omisión TODO está apagado y el aspecto/marcado es idéntico al de versiones anteriores. */
  refinements?: boolean
  /** Los overlays (Dialog, Toast, CommandMenu, Tour, flyout del Sidebar) copian en su portal el modo
   * claro/oscuro de la raíz de la app, aunque lo fije tu propio CSS y no `colorScheme`. */
  inheritColorScheme?: boolean
  /** `variant` manda sobre el fondo del Button y `tone` solo sobre el color: `ghost`/`outlined` con
   * cualquier tono quedan transparentes y se tiñen con el tono (emite `data-sk-variant-priority`). */
  variantPriority?: boolean
  /** Los items del Sidebar no se aplican a los de un `Menu` anidado y el disparador abierto del Menu
   * fija su `color` (emite `data-sk-nav-scope`). */
  scopedNav?: boolean
  /** El relleno del cuerpo de Card/Dialog no se aplica al cuerpo de un `Alert` anidado (emite
   * `data-sk-body-scope`). */
  scopedBody?: boolean
}

/**
 * Envuelve el árbol y marca la raíz del reset base ([data-skinkit-root]). Ya no fija
 * [data-theme]/[data-skin]: el look es uno solo (Tailwind, ver src/styles/tokens.css) y se
 * personaliza pisando variables `--color-sk-*`/`--radius-sk-*`/etc. — con CSS plano o con tu
 * propio build de Tailwind (ver `skinkit/tailwind-preset`), no eligiendo entre presets.
 * También fija el idioma de los textos internos (`locale`/`messages`, ver src/i18n/).
 */
export function SkinkitProvider({
  className,
  children,
  colorScheme,
  locale,
  messages,
  refinements,
  inheritColorScheme,
  variantPriority,
  scopedNav,
  scopedBody,
}: SkinkitProviderProps) {
  const refs: SkinkitRefinements =
    refinements || inheritColorScheme || variantPriority || scopedNav || scopedBody
      ? {
          inheritColorScheme: !!(refinements || inheritColorScheme),
          variantPriority: !!(refinements || variantPriority),
          scopedNav: !!(refinements || scopedNav),
          scopedBody: !!(refinements || scopedBody),
        }
      : SIN_REFINAMIENTOS
  return (
    <SkinkitRefinementsContext.Provider value={refs}>
    <SkinkitColorSchemeContext.Provider value={colorScheme}>
      <SkinkitI18nProvider locale={locale} messages={messages}>
        <div
          data-skinkit-root=""
          data-color-scheme={colorScheme}
          data-sk-variant-priority={refs.variantPriority ? '' : undefined}
          data-sk-nav-scope={refs.scopedNav ? '' : undefined}
          data-sk-body-scope={refs.scopedBody ? '' : undefined}
          className={cx('skinkit-root', className)}
        >
          {children}
        </div>
      </SkinkitI18nProvider>
    </SkinkitColorSchemeContext.Provider>
    </SkinkitRefinementsContext.Provider>
  )
}
