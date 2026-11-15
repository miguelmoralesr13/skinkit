import { useEffect, useLayoutEffect, useState } from 'react'
import { useSkinkitColorScheme, useSkinkitRefinements } from './SkinkitProvider'

/** Marca de las raíces que crean los overlays en su portal: se excluyen al buscar el origen. */
const useIsoLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect

export const OVERLAY_ROOT_ATTR = 'data-sk-overlay-root'

type Scheme = 'light' | 'dark'

/** Modo efectivo de la raíz de la app: su `data-color-scheme` o, si el consumidor lo fijó con su
 *  propio CSS (p. ej. `html[data-modo=dark] [data-skinkit-root] { color-scheme: dark }`), el
 *  `color-scheme` computado — solo cuando es exactamente `light` o `dark` (con `light dark` el
 *  modo lo decide el sistema y no hay nada que copiar). */
function leerModoDeLaRaiz(): Scheme | undefined {
  if (typeof document === 'undefined') return undefined
  const raiz = document.querySelector<HTMLElement>(`[data-skinkit-root]:not([${OVERLAY_ROOT_ATTR}])`)
  if (!raiz) return undefined
  const attr = raiz.getAttribute('data-color-scheme')
  if (attr === 'light' || attr === 'dark') return attr
  const computado = getComputedStyle(raiz).colorScheme.trim()
  return computado === 'light' || computado === 'dark' ? computado : undefined
}

/**
 * Props para la `[data-skinkit-root]` que un overlay (Dialog, Toast, CommandMenu, Tour, flyout del
 * Sidebar…) crea en su portal. Por omisión devuelve solo el `colorScheme` forzado del provider (el
 * comportamiento de siempre). Con `inheritColorScheme` en el provider (GAP-006) además copia el modo
 * de la raíz de la app que originó el overlay (atributo o `color-scheme` computado), porque un
 * portal escapa del árbol y `light-dark()` se resolvería con el del sistema. Con los demás
 * refinamientos del provider, replica sus atributos en la raíz del portal para que apliquen ahí.
 */
export function useOverlayRootProps(activo = true): Record<string, string | undefined> {
  const forzado = useSkinkitColorScheme()
  const ref = useSkinkitRefinements()
  const heredar = ref.inheritColorScheme && !forzado
  const [modo, setModo] = useState<Scheme | undefined>(() => (heredar && activo ? leerModoDeLaRaiz() : undefined))

  useIsoLayoutEffect(() => {
    if (!heredar || !activo) return
    const actualizar = () => setModo(leerModoDeLaRaiz())
    actualizar()
    const obs = new MutationObserver(actualizar)
    const raiz = document.querySelector(`[data-skinkit-root]:not([${OVERLAY_ROOT_ATTR}])`)
    const opts = { attributes: true, attributeFilter: ['data-color-scheme', 'class', 'data-modo', 'data-theme', 'style'] }
    obs.observe(document.documentElement, opts)
    if (raiz) obs.observe(raiz, opts)
    return () => obs.disconnect()
  }, [heredar, activo])

  return {
    'data-color-scheme': forzado ?? (heredar ? modo : undefined),
    [OVERLAY_ROOT_ATTR]: heredar ? '' : undefined,
    'data-sk-variant-priority': ref.variantPriority ? '' : undefined,
    'data-sk-nav-scope': ref.scopedNav ? '' : undefined,
    'data-sk-body-scope': ref.scopedBody ? '' : undefined,
  }
}
