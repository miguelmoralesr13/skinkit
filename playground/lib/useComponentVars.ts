import { useEffect, useState } from 'react'
import { getComponentVars, type ComponentVarSpec } from './extractComponentVars'

/** Wrapper de estado sobre getComponentVars — refetchea (con cache) cada vez que cambia dataSk. */
export function useComponentVars(dataSk: string): ComponentVarSpec[] | null {
  const [vars, setVars] = useState<ComponentVarSpec[] | null>(null)

  useEffect(() => {
    let cancelled = false
    setVars(null)
    getComponentVars(dataSk).then((result) => {
      if (!cancelled) setVars(result)
    })
    return () => {
      cancelled = true
    }
  }, [dataSk])

  return vars
}
