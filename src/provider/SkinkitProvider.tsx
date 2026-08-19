import { type ReactNode } from 'react'
import { cx } from '../lib/cx'

export interface SkinkitProviderProps {
  className?: string
  children: ReactNode
}

/**
 * Envuelve el árbol y marca la raíz del reset base ([data-skinkit-root]). Ya no fija
 * [data-theme]/[data-skin]: el look es uno solo (Tailwind, ver src/styles/tokens.css) y se
 * personaliza pisando variables `--color-sk-*`/`--radius-sk-*`/etc. — con CSS plano o con tu
 * propio build de Tailwind (ver `skinkit/tailwind-preset`), no eligiendo entre presets.
 */
export function SkinkitProvider({ className, children }: SkinkitProviderProps) {
  return (
    <div data-skinkit-root="" className={cx('skinkit-root', className)}>
      {children}
    </div>
  )
}
