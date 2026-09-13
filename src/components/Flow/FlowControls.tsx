import { Maximize, Minus, Plus, RotateCcw } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { useFlow } from './useFlow'
import { useSkinkitMessages } from '../../i18n/context'

export type FlowControlsProps = HTMLAttributes<HTMLDivElement>

/** Botones de zoom in/out/fit-view/reset — usa `useFlow()`, el mismo hook público disponible
 * para cualquier consumidor. Se renderiza como hijo de <Flow>, fuera de la capa transformada
 * (pan/zoom no lo afecta). */
export function FlowControls({ className, ...rest }: FlowControlsProps) {
  const m = useSkinkitMessages()
  const { zoomIn, zoomOut, fitView, resetViewport } = useFlow()
  return (
    <div data-part="controls" className={cx('sk-flow__controls', className)} {...rest}>
      <button
        type="button"
        data-part="control-button"
        data-action="zoom-in"
        aria-label={m.flow.zoomIn}
        onClick={() => zoomIn()}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        data-part="control-button"
        data-action="zoom-out"
        aria-label={m.flow.zoomOut}
        onClick={() => zoomOut()}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        data-part="control-button"
        data-action="fit-view"
        aria-label={m.flow.fitView}
        onClick={() => fitView()}
      >
        <Maximize size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        data-part="control-button"
        data-action="reset"
        aria-label={m.flow.resetView}
        onClick={() => resetViewport()}
      >
        <RotateCcw size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
