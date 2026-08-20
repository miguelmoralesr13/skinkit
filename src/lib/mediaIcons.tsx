import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  type LucideProps,
} from 'lucide-react'

// Set chico de íconos para VideoPlayer/AudioPlayer — wrappers de lucide-react con el tamaño/grosor
// de trazo por defecto que usan los controles del reproductor (heredan color/opacity via
// stroke=currentColor, como cualquier ícono de lucide). No es un sistema de íconos general de
// skinkit — vive en src/lib porque, como useMediaPlayer, lo comparten VideoPlayer y AudioPlayer.

type IconProps = LucideProps

const defaults: LucideProps = { size: 18, strokeWidth: 1.75 }

export function IconPlay(props: IconProps) {
  return <Play {...defaults} {...props} />
}

export function IconPause(props: IconProps) {
  return <Pause {...defaults} {...props} />
}

export function IconSkipBack(props: IconProps) {
  return <SkipBack {...defaults} {...props} />
}

export function IconSkipForward(props: IconProps) {
  return <SkipForward {...defaults} {...props} />
}

export function IconVolumeHigh(props: IconProps) {
  return <Volume2 {...defaults} {...props} />
}

export function IconVolumeMuted(props: IconProps) {
  return <VolumeX {...defaults} {...props} />
}

export function IconFullscreen(props: IconProps) {
  return <Maximize {...defaults} {...props} />
}

export function IconFullscreenExit(props: IconProps) {
  return <Minimize {...defaults} {...props} />
}

export function IconPip(props: IconProps) {
  return <PictureInPicture2 {...defaults} {...props} />
}
