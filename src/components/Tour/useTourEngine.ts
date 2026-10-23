import { useMemo, useState } from 'react'
import { validateTourConfig } from './validateConfig'
import { isSubFlowEntry, type TourActiveStep, type TourConfig, type TourFrame } from './types'

const MAX_CASCADE_DEPTH = 100 // defensa extra: los ciclos ya se rechazan en validateTourConfig

export interface UseTourEngineResult {
  activeStep: TourActiveStep | null
  /** false en el primer paso del frame actual — un sub-flujo recién entrado no "vuelve" al padre. */
  canGoPrev: boolean
  isActive: boolean
  /** Arranca `flowId` (con `from`, desde el paso con ese id: para retomar). Si ya hay un flujo activo, se encola
   * (no colisionan dos overlays a la vez). */
  start: (flowId: string, opts?: { from?: string }) => void
  next: () => void
  prev: () => void
  /** Cierra el flujo activo (el "×" del usuario) — la cola sigue su curso normalmente. */
  skip: () => void
  /** Reset total: activo + cola. Para logout/cambio de ruta, no para el botón de cierre del usuario. */
  stop: () => void
}

export function useTourEngine(config: TourConfig): UseTourEngineResult {
  const flowMap = useMemo(() => validateTourConfig(config), [config])
  const [stack, setStack] = useState<TourFrame[]>([])
  const [queue, setQueue] = useState<string[]>([])

  // Si la entrada actual del frame de arriba es {subFlow}, empuja un frame nuevo y repite —
  // así un flujo puede empezar DIRECTO en un sub-flujo, y ese sub-flujo en otro (anidamiento).
  const resolveCascade = (input: TourFrame[]): TourFrame[] => {
    const result = [...input]
    let guard = 0
    while (result.length > 0 && guard++ < MAX_CASCADE_DEPTH) {
      const top = result[result.length - 1]
      const flow = flowMap.get(top.flowId)
      const entry = flow?.entries[top.entryIndex]
      if (entry && isSubFlowEntry(entry)) result.push({ flowId: entry.subFlow, entryIndex: 0 })
      else break
    }
    return result
  }

  // Cuando el frame de arriba se quedó sin entries, lo saca de la pila y avanza al padre UNA
  // posición (la que lo invocó vía {subFlow}) — en LOOP: si el padre queda exhausto también
  // (ej. un flujo que era solo [{subFlow: x}]), sigue subiendo hasta encontrar algo o vaciarse.
  const popExhausted = (input: TourFrame[]): TourFrame[] => {
    const result = [...input]
    while (result.length > 0) {
      const top = result[result.length - 1]
      const flow = flowMap.get(top.flowId)
      if (!flow || top.entryIndex >= flow.entries.length) {
        result.pop()
        if (result.length > 0) {
          const parent = result[result.length - 1]
          result[result.length - 1] = {
            ...parent,
            entryIndex: parent.entryIndex + 1,
          }
        }
      } else break
    }
    return result
  }

  const settle = (input: TourFrame[]): TourFrame[] => resolveCascade(popExhausted(input))

  /** Si `candidate` quedó vacío (tour terminado/saltado) y hay algo en cola, arranca lo próximo. */
  const settleWithQueue = (candidate: TourFrame[]): { stack: TourFrame[]; queue: string[] } => {
    let s = candidate
    let q = queue
    while (s.length === 0 && q.length > 0) {
      const [nextId, ...rest] = q
      q = rest
      if (flowMap.has(nextId)) s = settle([{ flowId: nextId, entryIndex: 0 }])
    }
    return { stack: s, queue: q }
  }

  const start = (flowId: string, opts?: { from?: string }) => {
    const flow = flowMap.get(flowId)
    if (!flow) return
    if (stack.length === 0) {
      const found = opts?.from ? flow.entries.findIndex((e) => !isSubFlowEntry(e) && e.id === opts.from) : 0
      setStack(settle([{ flowId, entryIndex: Math.max(0, found) }]))
      return
    }
    // ya activo en la raíz (por profundo que esté el sub-flujo actual) -> no duplicar
    if (stack[0]?.flowId === flowId) return
    if (!queue.includes(flowId)) setQueue([...queue, flowId])
  }

  const next = () => {
    if (stack.length === 0) return
    const advanced = [...stack]
    const top = advanced[advanced.length - 1]
    advanced[advanced.length - 1] = { ...top, entryIndex: top.entryIndex + 1 }
    const { stack: finalStack, queue: finalQueue } = settleWithQueue(settle(advanced))
    setStack(finalStack)
    setQueue(finalQueue)
  }

  // Deliberadamente NO simétrico entre frames: solo retrocede dentro del frame actual, no-op en
  // la primera entrada. Ningún tour library mainstream soporta "volver" a través de un sub-flujo
  // ya terminado, y es confuso aunque se pudiera — ver plan/diseño.
  const prev = () => {
    if (stack.length === 0) return
    const top = stack[stack.length - 1]
    if (top.entryIndex === 0) return
    const updated = [...stack]
    updated[updated.length - 1] = { ...top, entryIndex: top.entryIndex - 1 }
    setStack(resolveCascade(updated))
  }

  const skip = () => {
    if (stack.length === 0) return
    const { stack: finalStack, queue: finalQueue } = settleWithQueue([])
    setStack(finalStack)
    setQueue(finalQueue)
  }

  const stop = () => {
    setStack([])
    setQueue([])
  }

  const activeFrame = stack[stack.length - 1]
  const activeFlow = activeFrame ? flowMap.get(activeFrame.flowId) : undefined
  const activeEntry = activeFlow && activeFrame ? activeFlow.entries[activeFrame.entryIndex] : undefined
  const activeStep: TourActiveStep | null =
    activeEntry && !isSubFlowEntry(activeEntry) && activeFrame
      ? { flowId: activeFrame.flowId, step: activeEntry }
      : null

  return {
    activeStep,
    canGoPrev: !!activeFrame && activeFrame.entryIndex > 0,
    isActive: stack.length > 0,
    start,
    next,
    prev,
    skip,
    stop,
  }
}
