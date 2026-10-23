import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx'
import { useElementVisible } from '../../lib/useElementVisible'
import { useSkinkitColorScheme } from '../../provider/SkinkitProvider'
import { computeSpotlightFrame, computeTooltipPosition, getTargetRect, type Rect } from './positioning'
import type { UseTourEngineResult } from './useTourEngine'
import type { TourStepRenderContext } from './types'
import { useSkinkitMessages } from '../../i18n/context'

const DEFAULT_WAIT_TIMEOUT = 3500
const DEFAULT_SPOTLIGHT_PADDING = 8

function rectToStyle(r: Rect): CSSProperties {
  return {
    position: 'fixed',
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
  }
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
  /** Dibuja por dentro la tarjeta de un paso (mascota, barra de pasos, botones propios…). Sin él, el contenido de siempre. */
  renderStep?: (ctx: TourStepRenderContext) => ReactNode
  /** false: tocar el fondo atenuado no cierra el tour. Default true. */
  dismissOnBackdrop?: boolean
  /** false: Esc no cierra el tour. Default true. */
  dismissOnEscape?: boolean
}

/**
 * Presentacional — renderiza el spotlight (4 divs, ver positioning.ts) + el tooltip del paso
 * activo, portalizados. Separado de Tour.tsx (TourProvider) porque el árbol acá es bastante más
 * grande que el de Dialog (backdrop en 4 partes + tooltip con header/body/footer).
 */
export function TourOverlay({
  engine,
  classNames,
  renderStep,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
}: TourOverlayProps) {
  const m = useSkinkitMessages()
  const { activeStep, canGoPrev, next, prev, skip } = engine
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [missing, setMissing] = useState(false)
  const [tooltipSize, setTooltipSize] = useState({ width: 280, height: 140 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const colorScheme = useSkinkitColorScheme()

  const stepKey = activeStep ? `${activeStep.flowId}:${activeStep.step.id}` : null
  const targetSelector = activeStep?.step.target ?? null
  const step = activeStep?.step
  const waitTimeout = activeStep?.step.waitTimeout ?? DEFAULT_WAIT_TIMEOUT

  // Al cambiar de paso, ocultar todo hasta confirmar el nuevo target (evita ver el spotlight
  // viejo un instante encima del elemento equivocado).
  useEffect(() => {
    setTargetRect(null)
    setMissing(false)
  }, [stepKey])

  useElementVisible(
    targetSelector,
    () => {
      if (targetSelector) setTargetRect(getTargetRect(targetSelector))
    },
    {
      timeoutMs: waitTimeout,
      onTimeout: () => {
        // `ifMissing: 'show'`: el paso se muestra suelto para explicar por qué falta el elemento.
        if (step?.ifMissing === 'show') {
          setMissing(true)
          return
        }
        // El selector de este paso nunca apareció — no congelar el tour por un dato roto.
        if (typeof console !== 'undefined') {
          console.warn(
            `skinkit: <TourProvider> — el target "${targetSelector}" no apareció a tiempo, se saltea el paso.`,
          )
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
  }, [stepKey, targetRect, missing])

  // `advanceOn: 'targetClick'`: tocar el elemento señalado avanza (el toque llega igual al elemento real).
  useEffect(() => {
    if (!targetSelector || !targetRect || step?.advanceOn !== 'targetClick') return
    const el = document.querySelector(targetSelector)
    if (!el) return
    el.addEventListener('click', next, { once: true })
    return () => el.removeEventListener('click', next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey, targetRect !== null])

  useEffect(() => {
    if (!activeStep) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissOnEscape) skip()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeStep, skip, dismissOnEscape])

  const hasTarget = !!targetSelector
  // Un paso con target espera a medirlo; uno suelto (o con `ifMissing: 'show'` ya vencido) se muestra de una vez.
  if (!activeStep || !step || typeof document === 'undefined') return null
  const buscando = hasTarget && !targetRect && !missing
  if (buscando && !(renderStep && step.whileSearching === 'show')) return null
  const anchored = hasTarget && !!targetRect && !missing
  const dim = step.dim ?? anchored

  const vw = window.innerWidth
  const vh = window.innerHeight
  const frame =
    anchored && targetRect
      ? computeSpotlightFrame(targetRect, step.spotlightPadding ?? DEFAULT_SPOTLIGHT_PADDING, vw, vh)
      : null
  const placement = step.placement ?? (anchored ? 'auto' : 'center')
  const tooltipPos =
    anchored && targetRect && placement !== 'center' && placement !== 'none'
      ? computeTooltipPosition(targetRect, placement, tooltipSize.width, tooltipSize.height, vw, vh)
      : null
  const tooltipStyle: CSSProperties = tooltipPos
    ? { position: 'fixed', top: tooltipPos.top, left: tooltipPos.left }
    : placement === 'none'
      ? { position: 'fixed' }
      : {
          position: 'fixed',
          top: Math.max(16, (vh - tooltipSize.height) / 2),
          left: Math.max(16, (vw - tooltipSize.width) / 2),
        }
  const backdropProps = {
    className: cx('sk-tour__backdrop', classNames?.backdrop),
    onClick: dismissOnBackdrop ? skip : undefined,
    'aria-hidden': true as const,
  }

  return createPortal(
    <div data-skinkit-root="" data-color-scheme={colorScheme} className="skinkit-root">
      <div data-sk="tour-overlay">
        {dim && frame ? (
          <>
            <div data-part="backdrop" {...backdropProps} style={rectToStyle(frame.top)} />
            <div data-part="backdrop" {...backdropProps} style={rectToStyle(frame.bottom)} />
            <div data-part="backdrop" {...backdropProps} style={rectToStyle(frame.left)} />
            <div data-part="backdrop" {...backdropProps} style={rectToStyle(frame.right)} />
          </>
        ) : dim ? (
          <div data-part="backdrop" {...backdropProps} style={{ position: 'fixed', inset: 0 }} />
        ) : null}
        {frame ? (
          <div
            data-part="spotlight"
            className={cx('sk-tour__spotlight', classNames?.spotlight)}
            style={rectToStyle(frame.hole)}
            aria-hidden="true"
          />
        ) : null}
        <div
          ref={tooltipRef}
          data-sk="tour"
          data-placement={tooltipPos?.placement ?? placement}
          className={step.className}
          role="dialog"
          aria-modal={dim ? 'true' : undefined}
          aria-label={step.ariaLabel}
          aria-labelledby={!renderStep && step.title ? `sk-tour-title-${stepKey}` : undefined}
          style={tooltipStyle}
        >
          {renderStep ? (
            renderStep({
              step,
              flowId: activeStep.flowId,
              targetFound: anchored,
              searching: buscando,
              canGoPrev,
              next,
              prev,
              skip,
            })
          ) : (
            <>
              <div data-part="header" className={cx('sk-tour__header', classNames?.header)}>
                {activeStep.step.title ? (
                  <h2
                    data-part="title"
                    className={cx('sk-tour__title', classNames?.title)}
                    id={`sk-tour-title-${stepKey}`}
                  >
                    {activeStep.step.title}
                  </h2>
                ) : null}
                <button
                  type="button"
                  data-part="close"
                  className={cx('sk-tour__close', classNames?.close)}
                  aria-label={m.tour.close}
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
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
