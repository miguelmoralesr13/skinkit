import { createContext, useContext, type ReactNode } from 'react'
import { cx } from '../lib/cx'

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
}

/**
 * Envuelve el árbol y marca la raíz del reset base ([data-skinkit-root]). Ya no fija
 * [data-theme]/[data-skin]: el look es uno solo (Tailwind, ver src/styles/tokens.css) y se
 * personaliza pisando variables `--color-sk-*`/`--radius-sk-*`/etc. — con CSS plano o con tu
 * propio build de Tailwind (ver `skinkit/tailwind-preset`), no eligiendo entre presets.
 */
export function SkinkitProvider({ className, children, colorScheme }: SkinkitProviderProps) {
  return (
    <SkinkitColorSchemeContext.Provider value={colorScheme}>
      <div data-skinkit-root="" data-color-scheme={colorScheme} className={cx('skinkit-root', className)}>
        {children}
      </div>
    </SkinkitColorSchemeContext.Provider>
  )
}
