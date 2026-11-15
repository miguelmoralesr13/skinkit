import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { cx } from '../../lib/cx'
import { useSkinkitMessages } from '../../i18n/context'
import { clampLatLng, metersPerPixel, project, unproject, visibleTiles, type LatLng, type TileInfo } from './geo'

export type { LatLng, TileInfo } from './geo'

export interface LocationPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Ubicación elegida; null = sin elegir todavía. */
  value: LatLng | null
  onChange: (next: LatLng) => void
  /** Radio en metros. Si se omite no se dibuja círculo ni campo de radio. */
  radius?: number
  onRadiusChange?: (next: number) => void
  minRadius?: number
  maxRadius?: number
  /** Plantilla de teselas, ej. "https://tile.openstreetmap.org/{z}/{x}/{y}.png" ({s} = subdominio a/b/c). Sin ella: solo cuadrícula neutra. */
  tileUrl?: string
  /** Dibujo propio de las teselas (Leaflet-less: recibe posición y URL de cada una). Pisa a `tileUrl`. */
  renderTiles?: (tiles: TileInfo[]) => ReactNode
  /** Crédito del proveedor de teselas (obligatorio para OSM y la mayoría). */
  attribution?: ReactNode
  /** Centro del mapa mientras `value` sea null. */
  defaultCenter?: LatLng
  /** Zoom inicial (3–19). */
  defaultZoom?: number
  /** Muestra «Usar mi ubicación» (navigator.geolocation). */
  locate?: boolean
  /** Se invoca si la geolocalización falla (permiso denegado, sin señal). */
  onLocateError?: (error: unknown) => void
  disabled?: boolean
}

const MIN_ZOOM = 3
const MAX_ZOOM = 19
const FALLBACK_CENTER: LatLng = { lat: 0, lng: 0 }

/**
 * LocationPicker headless — elige un punto (pin) y, opcional, un radio sobre un mapa de teselas.
 * Sin dependencias de mapas ni llaves: el proveedor de teselas se INYECTA (`tileUrl` o
 * `renderTiles`). Sin teselas o sin red, el mapa degrada a una cuadrícula neutra y los campos de
 * latitud/longitud/radio siguen funcionando: nunca queda en blanco.
 *
 * Entradas: arrastrar el pin, clic en el mapa, flechas con el pin enfocado (Mayús = salto
 * mayor), +/- de zoom y campos numéricos. Límite honesto: no hay desplazamiento libre del
 * mapa (se recentra al pin), ni rotación; para mapas completos usa una librería de mapas.
 *
 * Contrato:
 *   [data-sk="location-picker"]      raíz · [data-state=ready|offline|no-tiles]
 *   [data-part="map"]                superficie interactiva
 *   [data-part="tiles"] [data-part="tile"]   capa de teselas (img)
 *   [data-part="radius-circle"]      círculo del radio (svg)
 *   [data-part="pin"]                marcador (button)
 *   [data-part="zoom-in"] [data-part="zoom-out"]
 *   [data-part="attribution"]        crédito
 *   [data-part="status"]             mensaje aria-live (buscando/errores)
 *   [data-part="fields"]             grupo de campos
 *   [data-part="field"] [data-part="label"] [data-part="input"]   (lat, lng, radio)
 *   [data-part="locate"]             botón «Usar mi ubicación»
 */
export const LocationPicker = forwardRef<HTMLDivElement, LocationPickerProps>(function LocationPicker(
  {
    value,
    onChange,
    radius,
    onRadiusChange,
    minRadius = 10,
    maxRadius = 5000,
    tileUrl,
    renderTiles,
    attribution,
    defaultCenter,
    defaultZoom = 15,
    locate = false,
    onLocateError,
    disabled,
    className,
    ...rest
  },
  ref,
) {
  const m = useSkinkitMessages()
  const mapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 320, h: 240 })
  const [zoom, setZoom] = useState(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, defaultZoom)))
  const [center, setCenter] = useState<LatLng>(value ?? defaultCenter ?? FALLBACK_CENTER)
  const [dragging, setDragging] = useState(false)
  const [failed, setFailed] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState('')
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) setSize({ w: r.width, h: r.height })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sync = () => setOnline(navigator.onLine !== false)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  // Si el valor cambia por los campos y queda fuera del encuadre, recentra (no durante el arrastre).
  useEffect(() => {
    if (!value || dragging) return
    const c = project(center, zoom)
    const p = project(value, zoom)
    const margin = 24
    const out = Math.abs(p.x - c.x) > size.w / 2 - margin || Math.abs(p.y - c.y) > size.h / 2 - margin
    if (out) setCenter(value)
  }, [value, zoom, size.w, size.h, dragging]) // eslint-disable-line react-hooks/exhaustive-deps

  const c = project(center, zoom)
  const pinPos = value ? project(value, zoom) : null
  const pinLeft = pinPos ? pinPos.x - c.x + size.w / 2 : null
  const pinTop = pinPos ? pinPos.y - c.y + size.h / 2 : null

  const tiles = tileUrl && !renderTiles ? visibleTiles(center, zoom, size.w, size.h, tileUrl) : []
  const customTiles = renderTiles ? visibleTiles(center, zoom, size.w, size.h, tileUrl ?? '') : null
  const hasTiles = !!(tileUrl || renderTiles)
  const allFailed = tiles.length > 0 && tiles.every((t) => failed.has(t.url))
  const state = !hasTiles ? 'no-tiles' : !online || allFailed ? 'offline' : 'ready'

  const radiusPx = radius != null && value ? radius / metersPerPixel(value.lat, zoom) : 0

  const setFromPointer = (e: PointerEvent<HTMLElement>) => {
    const el = mapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = c.x + (e.clientX - r.left - r.width / 2)
    const y = c.y + (e.clientY - r.top - r.height / 2)
    onChange(unproject(x, y, zoom))
  }

  const onMapPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-part="zoom-in"],[data-part="zoom-out"]')) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDragging(true)
    setFromPointer(e)
  }
  const onMapPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setFromPointer(e)
  }
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    setDragging(false)
  }

  const onPinKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || !value) return
    const step = e.shiftKey ? 40 : 8
    const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0
    const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0
    if (!dx && !dy) return
    e.preventDefault()
    const p = project(value, zoom)
    onChange(unproject(p.x + dx, p.y + dy, zoom))
  }

  const useMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus(m.locationPicker.locateError)
      onLocateError?.(new Error('geolocation-unavailable'))
      return
    }
    setStatus(m.locationPicker.locating)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = clampLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('')
        setCenter(p)
        onChange(p)
      },
      (err) => {
        setStatus(m.locationPicker.locateError)
        onLocateError?.(err)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const numField = (
    key: string,
    label: string,
    val: number | undefined,
    onNum: (n: number) => void,
    attrs: { min?: number; max?: number; step?: number | string },
    onCommit?: (n: number) => void,
  ) => (
    <label data-part="field" data-field={key}>
      <span data-part="label">{label}</span>
      <input
        data-part="input"
        type="number"
        inputMode="decimal"
        disabled={disabled}
        value={val == null || Number.isNaN(val) ? '' : val}
        onChange={(e) => {
          const n = e.target.valueAsNumber
          if (Number.isFinite(n)) onNum(n)
        }}
        onBlur={(e) => {
          const n = e.target.valueAsNumber
          if (onCommit && Number.isFinite(n)) onCommit(n)
        }}
        {...attrs}
      />
    </label>
  )

  const mapStyle = { '--sk-location-picker-radius': `${radiusPx}px` } as CSSProperties

  return (
    <div
      ref={ref}
      data-sk="location-picker"
      data-state={state}
      data-disabled={disabled ? '' : undefined}
      className={cx('sk-location-picker', className)}
      {...rest}
    >
      <div
        ref={mapRef}
        data-part="map"
        data-dragging={dragging ? '' : undefined}
        role="group"
        aria-label={m.locationPicker.map}
        style={mapStyle}
        onPointerDown={onMapPointerDown}
        onPointerMove={onMapPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div data-part="tiles" aria-hidden="true">
          {customTiles
            ? renderTiles?.(customTiles)
            : tiles.map((t) =>
                failed.has(t.url) ? null : (
                  <img
                    key={t.key}
                    data-part="tile"
                    src={t.url}
                    alt=""
                    width={t.size}
                    height={t.size}
                    draggable={false}
                    loading="lazy"
                    style={{ left: t.left, top: t.top }}
                    onError={() => setFailed((prev) => new Set(prev).add(t.url))}
                  />
                ),
              )}
        </div>
        {value && radius != null && radiusPx > 0 && pinLeft != null && pinTop != null ? (
          <svg data-part="overlay" aria-hidden="true" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            <circle data-part="radius-circle" cx={pinLeft} cy={pinTop} r={radiusPx} />
          </svg>
        ) : null}
        {value && pinLeft != null && pinTop != null ? (
          <button
            type="button"
            data-part="pin"
            disabled={disabled}
            aria-label={m.locationPicker.pin}
            style={{ left: pinLeft, top: pinTop }}
            onKeyDown={onPinKey}
          >
            <span aria-hidden="true" />
          </button>
        ) : null}
        <div data-part="zoom" role="group">
          <button type="button" data-part="zoom-in" aria-label={m.locationPicker.zoomIn} disabled={disabled || zoom >= MAX_ZOOM} onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1))}>
            +
          </button>
          <button type="button" data-part="zoom-out" aria-label={m.locationPicker.zoomOut} disabled={disabled || zoom <= MIN_ZOOM} onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 1))}>
            −
          </button>
        </div>
        {attribution && hasTiles ? <div data-part="attribution">{attribution}</div> : null}
        {state === 'offline' ? <div data-part="notice">{m.locationPicker.noTiles}</div> : null}
      </div>
      <div data-part="fields">
        {numField('lat', m.locationPicker.latitude, value?.lat, (n) => onChange(clampLatLng({ lat: n, lng: value?.lng ?? center.lng })), { min: -90, max: 90, step: 'any' })}
        {numField('lng', m.locationPicker.longitude, value?.lng, (n) => onChange(clampLatLng({ lat: value?.lat ?? center.lat, lng: n })), { min: -180, max: 180, step: 'any' })}
        {radius != null && onRadiusChange
          ? numField('radius', m.locationPicker.radius, radius, (n) => onRadiusChange(Math.min(maxRadius, n)), { min: minRadius, max: maxRadius, step: 10 }, (n) => onRadiusChange(Math.min(maxRadius, Math.max(minRadius, n))))
          : null}
        {locate ? (
          <button type="button" data-part="locate" disabled={disabled} onClick={useMyLocation}>
            {m.locationPicker.useMyLocation}
          </button>
        ) : null}
      </div>
      <span data-part="status" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
})
