import { useEffect, type RefObject } from 'react'

/**
 * Cierra una capa abierta (menu, popover) con Escape o con un click fuera de `ref`.
 * `ref` debe envolver trigger + contenido, así clickear cualquiera de los dos NO cierra.
 */
export function useDismissable(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  /** Otros nodos que también cuentan como «dentro» (p. ej. un contenido en portal). */
  extraRefs?: RefObject<HTMLElement | null>[],
): void {
  useEffect(() => {
    if (!active) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current
      const target = e.target as Node
      if (extraRefs?.some((r) => r.current?.contains(target))) return
      if (el && !el.contains(target)) onDismiss()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [active, ref, onDismiss, extraRefs])
}
