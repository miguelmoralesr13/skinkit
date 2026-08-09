import { useCallback, useState } from 'react'

export type AccordionType = 'single' | 'multiple'

/**
 * Estado de apertura del accordion (uncontrolled). Normaliza a un array de valores
 * abiertos y aplica la regla de `type`: single = a lo sumo uno; multiple = varios.
 */
export function useAccordion(type: AccordionType, defaultValue?: string | string[]) {
  const [open, setOpen] = useState<string[]>(() => {
    if (defaultValue == null) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const isOpen = useCallback((value: string) => open.includes(value), [open])

  const toggle = useCallback(
    (value: string) => {
      setOpen((prev) => {
        const has = prev.includes(value)
        if (type === 'single') return has ? [] : [value]
        return has ? prev.filter((v) => v !== value) : [...prev, value]
      })
    },
    [type],
  )

  return { isOpen, toggle }
}
