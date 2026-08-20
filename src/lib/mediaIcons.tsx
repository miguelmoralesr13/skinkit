import type { SVGProps } from 'react'

// Set chico de íconos SVG para VideoPlayer/AudioPlayer — NO emoji: un emoji es un glifo de color
// fijo que ignora `color`/`opacity` de CSS, así que no puede heredar el estilo sutil (blanco
// atenuado, hover, tono) de los botones del reproductor. Trazo simple (stroke=currentColor),
// heredan color y opacity como cualquier texto. No es un sistema de íconos general de skinkit —
// vive en src/lib porque, como useMediaPlayer, lo comparten VideoPlayer y AudioPlayer.

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4.5v15l13-7.5-13-7.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconPause(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconSkipBack(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 5v14l-11-7 11-7Z" fill="currentColor" stroke="none" />
      <path d="M7 5v14" />
    </svg>
  )
}

export function IconSkipForward(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 5v14l11-7L6 5Z" fill="currentColor" stroke="none" />
      <path d="M17 5v14" />
    </svg>
  )
}

export function IconVolumeHigh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5v5h4l5 4V5.5l-5 4H4Z" fill="currentColor" stroke="none" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19.2 6a9 9 0 0 1 0 12" />
    </svg>
  )
}

export function IconVolumeMuted(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5v5h4l5 4V5.5l-5 4H4Z" fill="currentColor" stroke="none" />
      <path d="M16 9.5l5 5" />
      <path d="M21 9.5l-5 5" />
    </svg>
  )
}

export function IconFullscreen(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H4v5" />
      <path d="M15 4h5v5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </svg>
  )
}

export function IconFullscreenExit(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9h5V4" />
      <path d="M20 9h-5V4" />
      <path d="M9 20v-5H4" />
      <path d="M15 20v-5h5" />
    </svg>
  )
}

export function IconPip(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <rect x="12" y="12" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
