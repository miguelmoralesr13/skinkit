import { isSubFlowEntry, type TourConfig, type TourFlowDef } from './types'

/**
 * Valida el config al montar <TourProvider>: ids de flujo únicos, cada `subFlow` referenciado
 * existe, y no hay ciclos (incluida auto-referencia) en el grafo de sub-flujos — todo esto se
 * chequea UNA vez acá, no en cada `next()`, para no arriesgar un loop infinito en runtime por un
 * config con un ciclo. Devuelve un Map por id para lookups O(1) durante la navegación.
 */
export function validateTourConfig(config: TourConfig): Map<string, TourFlowDef> {
  const flowMap = new Map<string, TourFlowDef>()

  for (const flow of config.flows) {
    if (flowMap.has(flow.id)) {
      throw new Error(`skinkit: <TourProvider> — hay dos flujos con el mismo id "${flow.id}".`)
    }
    if (flow.entries.length === 0) {
      throw new Error(`skinkit: <TourProvider> — el flujo "${flow.id}" no tiene entries.`)
    }
    flowMap.set(flow.id, flow)
  }

  const visiting = new Set<string>()
  const visited = new Set<string>()

  function visit(flowId: string, path: string[]) {
    if (visited.has(flowId)) return
    if (visiting.has(flowId)) {
      throw new Error(
        `skinkit: <TourProvider> — ciclo de subFlow: ${[...path, flowId].join(' → ')}. Un flujo no puede referenciarse a sí mismo, directa ni indirectamente.`,
      )
    }
    const flow = flowMap.get(flowId)
    if (!flow) {
      throw new Error(
        `skinkit: <TourProvider> — subFlow "${flowId}" (referenciado desde "${path[path.length - 1] ?? '?'}") no existe en config.flows.`,
      )
    }
    visiting.add(flowId)
    for (const entry of flow.entries) {
      if (isSubFlowEntry(entry)) visit(entry.subFlow, [...path, flowId])
    }
    visiting.delete(flowId)
    visited.add(flowId)
  }

  for (const flow of config.flows) visit(flow.id, [])

  return flowMap
}
