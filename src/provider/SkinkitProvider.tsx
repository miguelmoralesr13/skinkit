import { createContext, useContext, type ReactNode } from 'react'
import { cx } from '../lib/cx'

interface SkinkitContextValue {
  theme: string
  skin: string
}

const SkinkitContext = createContext<SkinkitContextValue>({ theme: 'paper', skin: 'soft' })

/** Lee el theme/skin activos desde cualquier componente descendiente. */
export function useSkinkit(): SkinkitContextValue {
  return useContext(SkinkitContext)
}

export interface SkinkitProviderProps {
  /** Dial de re-look: qué paleta de tokens se aplica ([data-theme]). */
  theme?: string
  /** Dial de re-anatomía: qué skin (forma/estructura) se aplica ([data-skin]). */
  skin?: string
  className?: string
  children: ReactNode
}

/**
 * Envuelve el árbol y fija [data-theme] + [data-skin] en un contenedor. Los dos
 * atributos son ortogonales: theme = color, skin = forma. Se combinan libremente.
 */
export function SkinkitProvider({
  theme = 'paper',
  skin = 'soft',
  className,
  children,
}: SkinkitProviderProps) {
  return (
    <div
      data-skinkit-root=""
      data-theme={theme}
      data-skin={skin}
      className={cx('skinkit-root', className)}
    >
      <SkinkitContext.Provider value={{ theme, skin }}>{children}</SkinkitContext.Provider>
    </div>
  )
}
