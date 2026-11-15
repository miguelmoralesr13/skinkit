import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'

export type RangeSliderTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

export type RangeSliderValue = [number, number]

export interface RangeSliderClassNames {
  header?: string
  label?: string
  value?: string
  track?: string
  range?: string
  thumbStart?: string
  thumbEnd?: string
  helper?: string
}

export interface RangeSliderProps {
  /** Extremos `[inicio, fin]` (controlado). */
  value?: RangeSliderValue
  defaultValue?: RangeSliderValue
  /** En cada cambio (también al arrastrar). */
  onChange?: (value: RangeSliderValue) => void
  /** Al soltar el pulgar o terminar un gesto de teclado. */
  onChangeEnd?: (value: RangeSliderValue) => void
  min?: number
  max?: number
  step?: number
  /** Separación mínima entre los dos extremos (default 0: pueden juntarse, nunca cruzarse). */
  minDistance?: number
  disabled?: boolean
  label?: ReactNode
  helper?: ReactNode
  /** Muestra «inicio – fin» junto a la etiqueta. */
  showValue?: boolean
  /**
   * Opt-in. Eje circular (horas del día, grados): el rango puede cruzar el final del eje. Con
   * `wrap`, `value = [inicio, fin]` y `fin < inicio` significa «cruza» (p. ej. `[22, 2]` en un eje
   * 0–24 es de las 22:00 a las 02:00). Los valores viven en `[min, max)`: `max` equivale a `min`.
   * `fin === inicio` es un rango vacío. `minDistance` se mide sobre el arco (de inicio a fin).
   */
  wrap?: boolean
  /** Formato de cada número (etiqueta visible y `aria-valuetext`). */
  formatValue?: (n: number) => string
  /** Color del tramo y los pulgares. 'primary' (default) no emite data-tone. */
  tone?: RangeSliderTone
  /** Nombres accesibles de los pulgares. Default según `locale`. */
  startLabel?: string
  endLabel?: string
  className?: string
  id?: string
  classNames?: RangeSliderClassNames
}

const decimals = (n: number) => (String(n).split('.')[1] ?? '').length

/**
 * RangeSlider headless — control de dos extremos para elegir un intervalo numérico (rango de
 * horas, de precios…). Cada pulgar es un `role="slider"` con teclado (flechas, RePág/AvPág,
 * Inicio/Fin) y arrastre por puntero; tocar el riel mueve el pulgar más cercano. Los extremos
 * nunca se cruzan. La forma la da el CSS (variables `--sk-range-start` / `--sk-range-end` en %).
 *
 * Contrato:
 *   [data-sk="range-slider"]       raíz · [data-tone] · [data-disabled] · [data-dragging]
 *   [data-part="header"]           fila de etiqueta + valores (si hay label o showValue)
 *   [data-part="label"] / "value"  etiqueta y «inicio – fin»
 *   [data-part="track"]            el riel
 *   [data-part="range"]            el tramo entre los dos pulgares (con `wrap` y arco que cruza: de inicio al final del riel)
 *   [data-part="range-wrap"]       solo con `wrap` y arco que cruza: del principio del riel hasta el fin
 *   [data-part="thumb-start"]      pulgar de inicio (role=slider)
 *   [data-part="thumb-end"]        pulgar de fin (role=slider)
 *   [data-part="helper"]           ayuda
 *   raíz con `wrap`: [data-wrap] · [data-crossing] cuando el arco cruza el final del eje
 */
export function RangeSlider({
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  minDistance = 0,
  disabled,
  label,
  helper,
  showValue,
  formatValue,
  tone = 'primary',
  wrap = false,
  startLabel,
  endLabel,
  className,
  id,
  classNames,
}: RangeSliderProps) {
  const m = useSkinkitMessages()
  const autoId = useId()
  const rootId = id ?? autoId
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<RangeSliderValue>(defaultValue ?? [min, max])
  const [rawA, rawB] = isControlled ? value : internal
  const wrapNorm = (v: number) => {
    const sp = max - min
    const d = Math.max(decimals(step), decimals(min))
    return Number((((((v - min) % sp) + sp) % sp) + min).toFixed(d))
  }
  const [a, b] = wrap && max !== min ? [wrapNorm(rawA), wrapNorm(rawB)] : [rawA, rawB]
  const crossing = wrap && b < a
  const trackRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<RangeSliderValue>([a, b])
  liveRef.current = [a, b]
  const dragRef = useRef<0 | 1 | null>(null)
  const [dragging, setDragging] = useState(false)

  const snap = (v: number) => {
    const n = Math.round((v - min) / step) * step + min
    const d = Math.max(decimals(step), decimals(min))
    return Number(Math.min(max, Math.max(min, n)).toFixed(d))
  }
  const pct = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100)
  const fmt = (n: number) => (formatValue ? formatValue(n) : String(n))

  // ── modo circular (`wrap`) ──
  const span = max - min
  const arcLen = (s: number, e: number) => (((e - s) % span) + span) % span
  /** Mueve un pulgar por el camino circular más corto hacia `raw`, acotado por `minDistance` en el arco. */
  const setThumbWrap = (which: 0 | 1, raw: number, relative = false) => {
    const [cs, ce] = liveRef.current
    const cur = which === 0 ? cs : ce
    const len = arcLen(cs, ce)
    const lo = Math.max(0, minDistance)
    const hi = Math.max(lo, span - Math.max(lo, step))
    // Desplazamiento firmado: por el camino más corto (arrastre) o directo (teclado).
    let d = relative ? raw : ((((raw - cur) % span) + span + span / 2) % span) - span / 2
    // Inicio: mover +d acorta el arco; fin: mover +d lo alarga.
    const lenAfter = which === 0 ? len - d : len + d
    const clamped = Math.min(hi, Math.max(lo, lenAfter))
    d = which === 0 ? len - clamped : clamped - len
    const nextPos = wrapNorm(Math.round((cur + d - min) / step) * step + min)
    const next: RangeSliderValue = which === 0 ? [nextPos, ce] : [cs, nextPos]
    if (next[0] === cs && next[1] === ce) return
    liveRef.current = next
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const setThumb = (which: 0 | 1, raw: number, relative = false) => {
    if (wrap) return setThumbWrap(which, raw, relative)
    const [cs, ce] = liveRef.current
    const v = snap(raw)
    const next: RangeSliderValue = which === 0 ? [Math.min(v, ce - minDistance), ce] : [cs, Math.max(v, cs + minDistance)]
    if (next[0] === cs && next[1] === ce) return
    liveRef.current = next
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const valueAt = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return min
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return min + ratio * (max - min)
  }

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return
    const target = e.target as HTMLElement
    const fromThumb = target.closest<HTMLElement>('[data-part="thumb-start"],[data-part="thumb-end"]')
    const v = valueAt(e.clientX)
    const [cs, ce] = liveRef.current
    let which: 0 | 1
    if (fromThumb) which = fromThumb.getAttribute('data-part') === 'thumb-start' ? 0 : 1
    else if (wrap) {
      const dist = (x: number, y: number) => {
        const t = Math.abs(x - y)
        return Math.min(t, span - t)
      }
      which = dist(v, cs) <= dist(v, ce) ? 0 : 1
    } else if (cs === ce) which = v < cs ? 0 : 1
    else which = Math.abs(v - cs) <= Math.abs(v - ce) ? 0 : 1
    dragRef.current = which
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    if (!fromThumb) setThumb(which, v)
    ;(which === 0
      ? trackRef.current?.querySelector<HTMLElement>('[data-part="thumb-start"]')
      : trackRef.current?.querySelector<HTMLElement>('[data-part="thumb-end"]')
    )?.focus()
    e.preventDefault()
  }
  const onTrackPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current === null) return
    setThumb(dragRef.current, valueAt(e.clientX))
  }
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current === null) return
    dragRef.current = null
    setDragging(false)
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    onChangeEnd?.(liveRef.current)
  }

  const onThumbKeyDown = (which: 0 | 1, e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const cur = liveRef.current[which]
    const [cs, ce] = liveRef.current
    let next: number
    if (wrap) {
      const big = span
      const delta =
        e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step
        : e.key === 'PageUp' ? step * 10
        : e.key === 'PageDown' ? -step * 10
        // Inicio/Fin: lleva el pulgar al límite del arco (el más corto o el más largo permitido).
        : e.key === 'Home' ? -big
        : e.key === 'End' ? big
        : null
      if (delta === null) return
      e.preventDefault()
      setThumbWrap(which, delta, true)
      onChangeEnd?.(liveRef.current)
      return
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = cur + step
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = cur - step
        break
      case 'PageUp':
        next = cur + step * 10
        break
      case 'PageDown':
        next = cur - step * 10
        break
      case 'Home':
        next = which === 0 ? min : cs + minDistance
        break
      case 'End':
        next = which === 0 ? ce - minDistance : max
        break
      default:
        return
    }
    e.preventDefault()
    setThumb(which, next)
    onChangeEnd?.(liveRef.current)
  }

  const rootStyle = { '--sk-range-start': `${pct(a)}%`, '--sk-range-end': `${pct(b)}%` } as CSSProperties
  const thumb = (which: 0 | 1, v: number, name: string, cls?: string) => (
    <div
      data-part={which === 0 ? 'thumb-start' : 'thumb-end'}
      role="slider"
      tabIndex={disabled ? undefined : 0}
      aria-label={name}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={v}
      aria-valuetext={fmt(v)}
      aria-orientation="horizontal"
      aria-disabled={disabled || undefined}
      className={cx(which === 0 ? 'sk-range-slider__thumb-start' : 'sk-range-slider__thumb-end', cls)}
      onKeyDown={(e) => onThumbKeyDown(which, e)}
    />
  )

  return (
    <div
      data-sk="range-slider"
      id={rootId}
      data-tone={tone === 'primary' ? undefined : tone}
      data-disabled={disabled ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      data-wrap={wrap ? '' : undefined}
      data-crossing={crossing ? '' : undefined}
      role="group"
      aria-labelledby={label ? `${rootId}-label` : undefined}
      style={rootStyle}
      className={cx('sk-range-slider', className)}
    >
      {label || showValue ? (
        <div data-part="header" className={cx('sk-range-slider__header', classNames?.header)}>
          {label ? (
            <span data-part="label" id={`${rootId}-label`} className={cx('sk-range-slider__label', classNames?.label)}>
              {label}
            </span>
          ) : null}
          {showValue ? (
            <span data-part="value" className={cx('sk-range-slider__value', classNames?.value)}>
              {fmt(a)} – {fmt(b)}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        ref={trackRef}
        data-part="track"
        className={cx('sk-range-slider__track', classNames?.track)}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div data-part="range" className={cx('sk-range-slider__range', classNames?.range)} />
        {crossing ? <div data-part="range-wrap" className={cx('sk-range-slider__range-wrap', classNames?.range)} /> : null}
        {thumb(0, a, startLabel ?? m.rangeSlider.start, classNames?.thumbStart)}
        {thumb(1, b, endLabel ?? m.rangeSlider.end, classNames?.thumbEnd)}
      </div>
      {helper ? (
        <span data-part="helper" className={cx('sk-range-slider__helper', classNames?.helper)}>
          {helper}
        </span>
      ) : null}
    </div>
  )
}
