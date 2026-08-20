import { AudioPlayer as AudioPlayerBase } from './AudioPlayer'
import { PlayButton, SkipBack, SkipForward, Time, Seek } from './AudioPlayerPlayback'
import { VolumeButton, VolumeSlider, PlaybackRate } from './AudioPlayerVolume'

// AudioPlayer.Controls/.Separator ya vienen colgados como propiedades estáticas DESDE
// AudioPlayer.tsx (mismo archivo → TS infiere el tipo solo). El resto vive en archivos hermanos
// (Playback/Volume.tsx) — TS NO infiere una propiedad estática asignada en OTRO archivo del que
// se declaró la función, así que acá se ensamblan con Object.assign.
export const AudioPlayer = Object.assign(AudioPlayerBase, {
  PlayButton,
  SkipBack,
  SkipForward,
  Time,
  Seek,
  VolumeButton,
  VolumeSlider,
  PlaybackRate,
})

export type { AudioPlayerProps, AudioPlayerControlsProps } from './AudioPlayer'
export type {
  AudioPlayerPlayButtonProps,
  AudioPlayerSkipButtonProps,
  AudioPlayerTimeProps,
  AudioPlayerSeekProps,
} from './AudioPlayerPlayback'
export type {
  AudioPlayerVolumeButtonProps,
  AudioPlayerVolumeSliderProps,
  AudioPlayerPlaybackRateProps,
} from './AudioPlayerVolume'
// El spec NO se re-exporta acá; se registra en src/catalog/index.ts.
