import { useCallback, useState } from 'react'

// Promovido desde useDataTable.ts/useList.ts (antes duplicado ahí, idéntico en ambos) — Flow lo
// necesita una tercera vez (nodes/edges/viewport), ahí sí vale la pena compartirlo.

/** Estado controlable: si `controlled` está definido, manda; si no, estado interno. */
export function useControllable<V>(
  controlled: V | undefined,
  defaultValue: V,
  onChange?: (v: V) => void,
): [V, (v: V) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? (controlled as V) : internal
  const set = useCallback(
    (v: V) => {
      if (!isControlled) setInternal(v)
      onChange?.(v)
    },
    [isControlled, onChange],
  )
  return [value, set]
}
