import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from 'react'
import { cx } from '../../lib/cx'

export type ResizableDirection = 'horizontal' | 'vertical'

interface DragState {
  l: number
  r: number
  startClient: number
  startL: number
  startR: number
  rootSize: number
}

interface ResizableCtx {
  direction: ResizableDirection
  begin: (l: number, r: number, e: ReactPointerEvent<HTMLDivElement>) => void
  move: (e: ReactPointerEvent<HTMLDivElement>) => void
  end: (e: ReactPointerEvent<HTMLDivElement>) => void
  key: (l: number, r: number, e: KeyboardEvent<HTMLDivElement>) => void
}
const ResizableContext = createContext<ResizableCtx | null>(null)

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Tamaño inicial (%). Si se omite, se reparte lo que queda en partes iguales. */
  defaultSize?: number
  /** Tamaño mínimo (%). */
  min?: number
  /** @internal — lo inyecta <Resizable>. */
  _size?: number
}

function ResizablePanel({
  defaultSize: _defaultSize,
  min: _min,
  _size,
  className,
  children,
  style,
  ...rest
}: ResizablePanelProps) {
  return (
    <div
      data-part="panel"
      className={cx('sk-resizable__panel', className)}
      style={{ ['--sk-panel-size' as string]: String(_size ?? 1), ...(style as CSSProperties) }}
      {...rest}
    >
      {children}
    </div>
  )
}

function ResizableHandle({ l, r }: { l: number; r: number }) {
  const ctx = useContext(ResizableContext)!
  return (
    <div
      data-part="handle"
      role="separator"
      aria-orientation={ctx.direction === 'horizontal' ? 'vertical' : 'horizontal'}
      tabIndex={0}
      onPointerDown={(e) => ctx.begin(l, r, e)}
      onPointerMove={ctx.move}
      onPointerUp={ctx.end}
      onKeyDown={(e) => ctx.key(l, r, e)}
    />
  )
}

export interface ResizableProps extends HTMLAttributes<HTMLDivElement> {
  direction?: ResizableDirection
}

/**
 * Resizable headless, compuesto: <Resizable> · <Resizable.Panel>. Varios paneles con divisores
 * (auto-insertados entre paneles) que se arrastran para redimensionar. Horizontal o vertical, y
 * anidable (un Resizable dentro de un Panel = grilla). La forma la da el CSS.
 *
 * Contrato:
 *   [data-sk="resizable"]   [data-direction]   raíz
 *   [data-part="panel"]     cada panel (flex-grow = --sk-panel-size)
 *   [data-part="handle"]    divisor (role=separator, arrastrable/foco) entre paneles
 */
export function Resizable({ direction = 'horizontal', className, children, ...rest }: ResizableProps) {
  const panels = Children.toArray(children).filter(
    (c): c is ReactElement<ResizablePanelProps> => isValidElement(c) && c.type === ResizablePanel,
  )
  const [sizes, setSizes] = useState<number[]>(() => {
    const defs = panels.map((p) => p.props.defaultSize)
    const knownSum = defs.reduce<number>((a, d) => a + (d ?? 0), 0)
    const remaining = defs.filter((d) => d == null).length
    const each = remaining > 0 ? Math.max(0, (100 - knownSum) / remaining) : 0
    return defs.map((d) => d ?? each)
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState | null>(null)

  const applyDelta = (l: number, r: number, startL: number, startR: number, deltaPct: number) => {
    const minL = panels[l]?.props.min ?? 5
    const minR = panels[r]?.props.min ?? 5
    const pair = startL + startR
    const newL = Math.max(minL, Math.min(startL + deltaPct, pair - minR))
    setSizes((s) => {
      const c = [...s]
      c[l] = newL
      c[r] = pair - newL
      return c
    })
  }

  const begin = (l: number, r: number, e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return
    drag.current = {
      l,
      r,
      startClient: direction === 'horizontal' ? e.clientX : e.clientY,
      startL: sizes[l],
      startR: sizes[r],
      rootSize: direction === 'horizontal' ? rect.width : rect.height,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const client = direction === 'horizontal' ? e.clientX : e.clientY
    const deltaPct = ((client - d.startClient) / d.rootSize) * 100
    applyDelta(d.l, d.r, d.startL, d.startR, deltaPct)
  }
  const end = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const key = (l: number, r: number, e: KeyboardEvent<HTMLDivElement>) => {
    const dec = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const inc = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    if (e.key === dec) {
      e.preventDefault()
      applyDelta(l, r, sizes[l], sizes[r], -4)
    } else if (e.key === inc) {
      e.preventDefault()
      applyDelta(l, r, sizes[l], sizes[r], 4)
    }
  }

  return (
    <div
      ref={rootRef}
      data-sk="resizable"
      data-direction={direction}
      className={cx('sk-resizable', className)}
      {...rest}
    >
      <ResizableContext.Provider value={{ direction, begin, move, end, key }}>
        {panels.map((panel, i) => (
          <Fragment key={i}>
            {cloneElement(panel, { _size: sizes[i] })}
            {i < panels.length - 1 ? <ResizableHandle l={i} r={i + 1} /> : null}
          </Fragment>
        ))}
      </ResizableContext.Provider>
    </div>
  )
}

Resizable.Panel = ResizablePanel
