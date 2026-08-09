import { useEffect, type RefObject } from 'react'

/**
 * Cierra una capa abierta (menu, popover) con Escape o con un click fuera de `ref`.
 * `ref` debe envolver trigger + contenido, así clickear cualquiera de los dos NO cierra.
 */
export function useDismissable(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!active) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current
      if (el && !el.contains(e.target as Node)) onDismiss()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [active, ref, onDismiss])
}
