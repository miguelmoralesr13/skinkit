import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * AppShell headless — layout de aplicación en grilla: header arriba, sidebar a la izquierda, main
 * al centro (scrollea) y footer abajo. Es CSS estructural (vive en la hoja base, no en el CSS
 * por-componente):
 * los colores/bordes los ponen los componentes que metas adentro (Topbar/Sidebar/BottomNav).
 * Definí la altura vos (ej. height: 100dvh) para una app de pantalla completa.
 *
 * Contrato:
 *   [data-sk="app-shell"]      la grilla
 *   [data-part="header"]       fila superior (sticky) — típicamente un <Topbar>
 *   [data-part="sidebar"]      columna izquierda — típicamente un <Sidebar>
 *   [data-part="main"]         contenido (overflow auto)
 *   [data-part="footer"]       fila inferior — típicamente un <BottomNav>
 */
export function AppShell({ className, children, ...rest }: AppShellProps) {
  return (
    <div data-sk="app-shell" className={cx('sk-app-shell', className)} {...rest}>
      {children}
    </div>
  )
}

function AppShellHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="header" className={cx('sk-app-shell__header', className)} {...rest}>
      {children}
    </div>
  )
}

function AppShellSidebar({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="sidebar" className={cx('sk-app-shell__sidebar', className)} {...rest}>
      {children}
    </div>
  )
}

function AppShellMain({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <main data-part="main" className={cx('sk-app-shell__main', className)} {...rest}>
      {children}
    </main>
  )
}

function AppShellFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-part="footer" className={cx('sk-app-shell__footer', className)} {...rest}>
      {children}
    </div>
  )
}

AppShell.Header = AppShellHeader
AppShell.Sidebar = AppShellSidebar
AppShell.Main = AppShellMain
AppShell.Footer = AppShellFooter
