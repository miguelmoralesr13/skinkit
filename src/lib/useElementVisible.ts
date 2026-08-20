import { useEffect, useRef } from 'react'

// Espera a que un selector CSS (a) exista en el DOM y (b) esté visible en viewport, y dispara UNA
// vez. Compartido por Tour: lo usan tanto el trigger de flujo (arrancar solo cuando aparece algo
// en pantalla) como la espera de `target` de un step individual — mismo problema en dos lugares.
// Mismo patrón guard+observe+cleanup que ya usa useDataTable.ts para su IntersectionObserver de
// scroll infinito, extendido con un MutationObserver porque acá el elemento puede no existir
// TODAVÍA quando se monta (a diferencia del sentinel de DataTable, que el propio componente
// renderiza).

export interface UseElementVisibleOptions {
  /** Si no llega a estar visible en este tiempo (ms), se llama a onTimeout y se deja de esperar.
   * Sin límite si se omite. */
  timeoutMs?: number
  onTimeout?: () => void
}

export function useElementVisible(
  selector: string | null,
  onVisible: () => void,
  opts: UseElementVisibleOptions = {},
): void {
  const onVisibleRef = useRef(onVisible)
  onVisibleRef.current = onVisible
  const onTimeoutRef = useRef(opts.onTimeout)
  onTimeoutRef.current = opts.onTimeout

  useEffect(() => {
    if (!selector || typeof document === 'undefined') return

    let settled = false
    let mutationObserver: MutationObserver | undefined
    let intersectionObserver: IntersectionObserver | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const cleanup = () => {
      mutationObserver?.disconnect()
      intersectionObserver?.disconnect()
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }

    const fire = () => {
      if (settled) return
      settled = true
      cleanup()
      onVisibleRef.current()
    }

    const watchVisibility = (el: Element) => {
      if (typeof IntersectionObserver === 'undefined') {
        fire() // sin soporte: asumimos visible apenas existe, mejor que nunca disparar
        return
      }
      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) fire()
      })
      intersectionObserver.observe(el)
    }

    const existing = document.querySelector(selector)
    if (existing) {
      watchVisibility(existing)
    } else if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        const el = document.querySelector(selector as string)
        if (el) {
          mutationObserver?.disconnect()
          watchVisibility(el)
        }
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    if (opts.timeoutMs !== undefined) {
      timeoutId = setTimeout(() => {
        if (settled) return
        settled = true
        cleanup()
        onTimeoutRef.current?.()
      }, opts.timeoutMs)
    }

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, opts.timeoutMs])
}
