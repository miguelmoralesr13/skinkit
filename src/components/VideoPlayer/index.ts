import { VideoPlayer as VideoPlayerBase } from './VideoPlayer'
import { PlayButton, SkipBack, SkipForward, Time, Seek } from './VideoPlayerPlayback'
import { VolumeButton, VolumeSlider } from './VideoPlayerVolume'
import { PlaybackRate, FullscreenButton, PipButton } from './VideoPlayerExtra'

// VideoPlayer.Controls/.Separator ya vienen colgados como propiedades estáticas DESDE
// VideoPlayer.tsx (mismo archivo → TS infiere el tipo solo). El resto vive en archivos hermanos
// (Playback/Volume/Extra.tsx) — TS NO infiere una propiedad estática asignada en OTRO archivo del
// que se declaró la función, así que acá se ensamblan con Object.assign.
export const VideoPlayer = Object.assign(VideoPlayerBase, {
  PlayButton,
  SkipBack,
  SkipForward,
  Time,
  Seek,
  VolumeButton,
  VolumeSlider,
  PlaybackRate,
  FullscreenButton,
  PipButton,
})

export type { VideoPlayerProps, VideoPlayerControlsProps } from './VideoPlayer'
export type {
  VideoPlayerPlayButtonProps,
  VideoPlayerSkipButtonProps,
  VideoPlayerTimeProps,
  VideoPlayerSeekProps,
} from './VideoPlayerPlayback'
export type { VideoPlayerVolumeButtonProps, VideoPlayerVolumeSliderProps } from './VideoPlayerVolume'
export type {
  VideoPlayerPlaybackRateProps,
  VideoPlayerFullscreenButtonProps,
  VideoPlayerPipButtonProps,
} from './VideoPlayerExtra'
// El spec NO se re-exporta acá; se registra en src/catalog/index.ts.
