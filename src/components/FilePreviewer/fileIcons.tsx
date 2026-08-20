import type { ReactNode, SVGProps } from 'react'

// Set chico de íconos SVG para el panel de fallback de FilePreviewer — mismo criterio que
// src/lib/mediaIcons.tsx: NO emoji (ignoran color/opacity de CSS, no pueden atenuarse/tintarse
// junto con el resto de la UI). Local a este directorio: un solo consumidor (FilePreviewer),
// a diferencia de mediaIcons.tsx que comparten VideoPlayer y AudioPlayer.

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 40,
  height: 40,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function FileOutline({ children, ...rest }: IconProps & { children?: ReactNode }) {
  return (
    <svg {...base} {...rest}>
      <path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M14 2.5V7a1 1 0 0 0 1 1h4.5" />
      {children}
    </svg>
  )
}

export function IconFileGeneric(props: IconProps) {
  return <FileOutline {...props} />
}

export function IconFilePdf(props: IconProps) {
  return (
    <FileOutline {...props}>
      <text x="7" y="18" fontSize="6" fontWeight="700" stroke="none" fill="currentColor">
        PDF
      </text>
    </FileOutline>
  )
}

export function IconFileWord(props: IconProps) {
  return (
    <FileOutline {...props}>
      <text x="7.5" y="18" fontSize="6" fontWeight="700" stroke="none" fill="currentColor">
        W
      </text>
    </FileOutline>
  )
}

export function IconFileExcel(props: IconProps) {
  return (
    <FileOutline {...props}>
      <text x="7.5" y="18" fontSize="6" fontWeight="700" stroke="none" fill="currentColor">
        X
      </text>
    </FileOutline>
  )
}

export function IconFileCode(props: IconProps) {
  return (
    <FileOutline {...props}>
      <path d="M9 13l-2 2 2 2" />
      <path d="M13 13l2 2-2 2" />
    </FileOutline>
  )
}

export function IconDownload(props: IconProps) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M12 3.5v11" />
      <path d="M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  )
}
