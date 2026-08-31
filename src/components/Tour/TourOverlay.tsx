import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useElementVisible } from '../../lib/useElementVisible'
import { useSkinkitColorScheme } from '../../provider/SkinkitProvider'
import { computeSpotlightFrame, computeTooltipPosition, getTargetRect, type Rect } from './positioning'
import type { UseTourEngineResult } from './useTourEngine'

const DEFAULT_WAIT_TIMEOUT = 3500
const DEFAULT_SPOTLIGHT_PADDING = 8

function rectToStyle(r: Rect): CSSProperties {
  return { position: 'fixed', top: r.top, left: r.left, width: r.width, height: r.height }
}

/** Clases adicionales por `data-part` del overlay/tooltip del tour. No reemplaza la clase base. */
export interface TourClassNames {
  backdrop?: string
  spotlight?: string
  header?: string
  title?: string
  close?: string
  body?: string
  footer?: string
  prev?: string
  next?: string
}

interface TourOverlayProps {
  engine: UseTourEngineResult
  classNames?: TourClassNames
}

/**
 * Presentacional — renderiza el spotlight (4 divs, ver positioning.ts) + el tooltip del paso
 * activo, portalizados. Separado de Tour.tsx (TourProvider) porque el árbol acá es bastante más
 * grande que el de Dialog (backdrop en 4 partes + tooltip con header/body/footer).
 */
export function TourOverlay({ engine, classNames }: TourOverlayProps) {
  const { activeStep, canGoPrev, next, prev, skip } = engine
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [tooltipSize, setTooltipSize] = useState({ width: 280, height: 140 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const colorScheme = useSkinkitColorScheme()

  const stepKey = activeStep ? `${activeStep.flowId}:${activeStep.step.id}` : null
  const targetSelector = activeStep?.step.target ?? null
  const waitTimeout = activeStep?.step.waitTimeout ?? DEFAULT_WAIT_TIMEOUT

  // Al cambiar de paso, ocultar todo hasta confirmar el nuevo target (evita ver el spotlight
  // viejo un instante encima del elemento equivocado).
  useEffect(() => {
    setTargetRect(null)
  }, [stepKey])

  useElementVisible(
    targetSelector,
    () => {
      if (targetSelector) setTargetRect(getTargetRect(targetSelector))
    },
    {
      timeoutMs: waitTimeout,
      onTimeout: () => {
        // El selector de este paso nunca apareció — no congelar el tour por un dato roto.
        if (typeof console !== 'undefined') {
          console.warn(`skinkit: <TourProvider> — el target "${targetSelector}" no apareció a tiempo, se saltea el paso.`)
        }
        next()
      },
    },
  )

  // Reposicionar en vivo mientras el paso sigue activo (scroll/resize).
  useEffect(() => {
    if (!targetSelector) return
    const update = () => setTargetRect(getTargetRect(targetSelector))
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [targetSelector])

  // Medir el tooltip real (una vez montado) para que el cálculo de flip use su tamaño real.
  useEffect(() => {
    if (tooltipRef.current) {
      const r = tooltipRef.current.getBoundingClientRect()
      setTooltipSize({ width: r.width, height: r.height })
    }
  }, [stepKey, targetRect])

  useEffect(() => {
    if (!activeStep) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeStep, skip])

  if (!activeStep || !targetRect || typeof document === 'undefined') return null

  const vw = window.innerWidth
  const vh = window.innerHeight
  const frame = computeSpotlightFrame(targetRect, activeStep.step.spotlightPadding ?? DEFAULT_SPOTLIGHT_PADDING, vw, vh)
  const tooltipPos = computeTooltipPosition(
    targetRect,
    activeStep.step.placement ?? 'auto',
    tooltipSize.width,
    tooltipSize.height,
    vw,
    vh,
  )

  return createPortal(
    <div data-skinkit-root="" data-color-scheme={colorScheme} className="skinkit-root">
      <div data-sk="tour-overlay">
        <div
          data-part="backdrop"
          className={cx('sk-tour__backdrop', classNames?.backdrop)}
          style={rectToStyle(frame.top)}
          onClick={skip}
          aria-hidden="true"
        />
        <div
          data-part="backdrop"
          className={cx('sk-tour__backdrop', classNames?.backdrop)}
          style={rectToStyle(frame.bottom)}
          onClick={skip}
          aria-hidden="true"
        />
        <div
          data-part="backdrop"
          className={cx('sk-tour__backdrop', classNames?.backdrop)}
          style={rectToStyle(frame.left)}
          onClick={skip}
          aria-hidden="true"
        />
        <div
          data-part="backdrop"
          className={cx('sk-tour__backdrop', classNames?.backdrop)}
          style={rectToStyle(frame.right)}
          onClick={skip}
          aria-hidden="true"
        />
        <div
          data-part="spotlight"
          className={cx('sk-tour__spotlight', classNames?.spotlight)}
          style={rectToStyle(frame.hole)}
          aria-hidden="true"
        />
        <div
          ref={tooltipRef}
          data-sk="tour"
          data-placement={tooltipPos.placement}
          role="dialog"
          aria-modal="true"
          aria-labelledby={activeStep.step.title ? `sk-tour-title-${stepKey}` : undefined}
          style={{ position: 'fixed', top: tooltipPos.top, left: tooltipPos.left }}
        >
          <div data-part="header" className={cx('sk-tour__header', classNames?.header)}>
            {activeStep.step.title ? (
              <h2 data-part="title" className={cx('sk-tour__title', classNames?.title)} id={`sk-tour-title-${stepKey}`}>
                {activeStep.step.title}
              </h2>
            ) : null}
            <button
              type="button"
              data-part="close"
              className={cx('sk-tour__close', classNames?.close)}
              aria-label="Cerrar"
              onClick={skip}
            >
              ×
            </button>
          </div>
          {activeStep.step.body ? (
            <div data-part="body" className={cx('sk-tour__body', classNames?.body)}>
              {activeStep.step.body}
            </div>
          ) : null}
          <div data-part="footer" className={cx('sk-tour__footer', classNames?.footer)}>
            <button
              type="button"
              data-part="prev"
              className={cx('sk-tour__prev', classNames?.prev)}
              disabled={!canGoPrev}
              onClick={prev}
            >
              ‹ Atrás
            </button>
            <button type="button" data-part="next" className={cx('sk-tour__next', classNames?.next)} onClick={next}>
              Siguiente ›
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
