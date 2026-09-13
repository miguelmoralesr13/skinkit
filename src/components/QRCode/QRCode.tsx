import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { generateQRMatrix, type ErrorCorrectionLevel } from '../../lib/qrEncode'
import { useSkinkitMessages, formatMessage } from '../../i18n/context'

export type { ErrorCorrectionLevel }

export interface QRCodeClassNames {
  module?: string
}

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Contenido a codificar. */
  value: string
  /** Tamaño en px (cuadrado). Default 128. */
  size?: number
  /** Nivel de corrección de errores. Default 'M'. Más alto = más redundante = QR más denso. */
  errorCorrectionLevel?: ErrorCorrectionLevel
  /** Zona de silencio alrededor del código, en módulos. Default 4 (mínimo recomendado por la spec). */
  margin?: number
  /** Clases extra por sub-parte. */
  classNames?: QRCodeClassNames
}

/**
 * QRCode headless — genera y renderiza un código QR en SVG. El algoritmo de codificación
 * (Reed–Solomon + layout, ISO/IEC 18004, modo byte, versiones 1 a 10) vive en src/lib/qrEncode.ts:
 * sin dependencias nuevas, mismo criterio que el highlighter propio de <Code>. Sin canvas: cada
 * módulo es un <rect>, mismo patrón que <Sparkline>/<RadialProgress> (geometría en JS, SVG crudo).
 *
 * Contrato:
 *   [data-sk="qrcode"]        raíz (<span> con el SVG adentro)
 *   [data-part="module"]      cada módulo oscuro (<rect>)
 *
 * Los módulos toman su color de `fill` (default var(--color-sk-text) vía CSS) — NO hay prop de
 * color: dejá buen contraste entre módulos y fondo o el código puede no escanear.
 */
export const QRCode = forwardRef<HTMLSpanElement, QRCodeProps>(function QRCode(
  { value, size = 128, errorCorrectionLevel = 'M', margin = 4, className, classNames, ...rest },
  ref,
) {
  const m = useSkinkitMessages()
  const matrix = useMemo(
    () => generateQRMatrix(value, { errorCorrectionLevel }),
    [value, errorCorrectionLevel],
  )
  const n = matrix.length
  const viewBoxSize = n + margin * 2

  return (
    <span
      ref={ref}
      data-sk="qrcode"
      className={cx('sk-qrcode', className)}
      style={{ display: 'inline-flex', width: size, height: size }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        shapeRendering="crispEdges"
        role="img"
        aria-label={formatMessage(m.qrCode.label, { value })}
      >
        {matrix.map((row, r) =>
          row.map((dark, c) =>
            dark ? (
              <rect
                key={`${r}-${c}`}
                data-part="module"
                className={cx('sk-qrcode__module', classNames?.module)}
                x={c + margin}
                y={r + margin}
                width={1}
                height={1}
              />
            ) : null,
          ),
        )}
      </svg>
    </span>
  )
})
