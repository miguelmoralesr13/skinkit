import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useSkinkitColorScheme } from '../../provider/SkinkitProvider'
import { useSkinkitMessages } from '../../i18n/context'

export type ToastVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

/** Clases adicionales por parte interna de un toast individual. No reemplaza la clase base. */
export interface ToastOptionClassNames {
  content?: string
  title?: string
  description?: string
  close?: string
}

export interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  /** ms hasta auto-cerrar. 0 = no se cierra solo. */
  duration?: number
  /** Clase adicional para la raíz de ESTE toast ([data-sk="toast"]). No reemplaza la clase base. */
  className?: string
  /** Clases adicionales por parte interna (content/title/description/close) de ESTE toast. */
  classNames?: ToastOptionClassNames
}

interface ToastItem extends ToastOptions {
  id: string
}

interface ToastContextValue {
  /** Muestra un toast. Devuelve su id (para dismiss manual). */
  toast: (opts: ToastOptions) => string
  /** Cierra un toast por id. */
  dismiss: (id: string) => void
}
const ToastContext = createContext<ToastContextValue | null>(null)

/** Accede a `toast()` / `dismiss()`. Debe usarse dentro de <ToastProvider>. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('skinkit: useToast() debe usarse dentro de <ToastProvider>')
  return ctx
}

export interface ToastProviderProps {
  children: ReactNode
  /** Esquina/lado donde se apilan los toasts. */
  position?: ToastPosition
  /** Duración por defecto si el toast no especifica una. */
  defaultDuration?: number
}

/**
 * ToastProvider — provee `useToast()` y renderiza el viewport de toasts en un portal a
 * <body>. No hace falta reaplicar nada de theming en el portal: los tokens (`--color-sk-*`,
 * `--radius-sk-*`, etc.) viven en `:root` vía Tailwind `@theme`, así que ya están disponibles
 * en cualquier punto del documento. Los toasts son headless: el look lo da el CSS del componente.
 *
 * Contrato de parts:
 *   [data-sk="toast-viewport"]  [data-position]   contenedor apilado (portal)
 *   [data-sk="toast"]           [data-variant]    cada toast (role=status)
 *   [data-part="content"]                          columna de texto
 *   [data-part="title"]                            título
 *   [data-part="description"]                      descripción
 *   [data-part="close"]                            botón de cierre
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
  defaultDuration = 4000,
}: ToastProviderProps) {
  const m = useSkinkitMessages()
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const colorScheme = useSkinkitColorScheme()

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const tm = timers.current[id]
    if (tm) {
      clearTimeout(tm)
      delete timers.current[id]
    }
  }, [])

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = `sk-toast-${idRef.current++}`
      setToasts((prev) => [...prev, { variant: 'neutral', ...opts, id }])
      const duration = opts.duration ?? defaultDuration
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [defaultDuration, dismiss],
  )

  // Limpia timers pendientes al desmontar.
  useEffect(() => {
    const pending = timers.current
    return () => {
      Object.values(pending).forEach(clearTimeout)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div data-skinkit-root="" data-color-scheme={colorScheme} className="skinkit-root">
          <div data-sk="toast-viewport" data-position={position} className="sk-toast-viewport">
            {toasts.map((t) => (
              <div
                key={t.id}
                data-sk="toast"
                data-variant={t.variant}
                role="status"
                className={cx('sk-toast', t.className)}
              >
                <div data-part="content" className={cx('sk-toast__content', t.classNames?.content)}>
                  {t.title ? (
                    <div data-part="title" className={cx('sk-toast__title', t.classNames?.title)}>
                      {t.title}
                    </div>
                  ) : null}
                  {t.description ? (
                    <div
                      data-part="description"
                      className={cx('sk-toast__description', t.classNames?.description)}
                    >
                      {t.description}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  data-part="close"
                  aria-label={m.toast.close}
                  className={cx('sk-toast__close', t.classNames?.close)}
                  onClick={() => dismiss(t.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
