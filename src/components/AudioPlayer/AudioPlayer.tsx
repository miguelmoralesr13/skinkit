import {
  createContext,
  useContext,
  useRef,
  type AudioHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'
import { useMediaPlayer, type MediaPlayerControls, type MediaPlayerState } from '../../lib/useMediaPlayer'
import { cx } from '../../lib/cx'
import { Toolbar, type ToolbarProps } from '../Toolbar'

// Misma familia que VideoPlayer (comparten useMediaPlayer, en src/lib), sin fullscreen/PiP —
// exclusivos de video — y sin surface visual: un <audio> sin el atributo `controls` no renderiza
// nada (tamaño intrínseco 0x0), así que no hace falta ocultarlo por CSS.

export interface AudioPlayerCtx {
  mediaRef: RefObject<HTMLAudioElement | null>
  state: MediaPlayerState
  controls: MediaPlayerControls
  skipSeconds: number
  playbackRates: number[]
}
const AudioPlayerContext = createContext<AudioPlayerCtx | null>(null)

export function useAudioPlayerCtx(part: string): AudioPlayerCtx {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error(`skinkit: <AudioPlayer.${part}> debe usarse dentro de <AudioPlayer>`)
  return ctx
}

export interface AudioPlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  src: string
  autoPlay?: boolean
  loop?: boolean
  defaultVolume?: number
  defaultMuted?: boolean
  defaultPlaybackRate?: number
  /** Segundos que avanzan/retroceden AudioPlayer.SkipBack/SkipForward. */
  skipSeconds?: number
  /** Opciones que ofrece AudioPlayer.PlaybackRate. */
  playbackRates?: number[]
  children: ReactNode
}

/**
 * AudioPlayer headless, compuesto — envuelve un <audio> nativo. Misma lógica de reproducción que
 * VideoPlayer (comparten useMediaPlayer), sin fullscreen/picture-in-picture.
 *
 * Contrato:
 *   [data-sk="audio-player"]     raíz
 *   [data-part="controls"]       <AudioPlayer.Controls> (Toolbar)
 */
export function AudioPlayer({
  src,
  autoPlay = false,
  loop = false,
  defaultVolume = 1,
  defaultMuted = false,
  defaultPlaybackRate = 1,
  skipSeconds = 10,
  playbackRates = [0.5, 1, 1.5, 2],
  className,
  children,
  ...rest
}: AudioPlayerProps) {
  const mediaRef = useRef<HTMLAudioElement>(null)
  const [state, controls] = useMediaPlayer(mediaRef)

  return (
    <div data-sk="audio-player" className={cx('sk-audio-player', className)} {...rest}>
      <AudioPlayerContext.Provider value={{ mediaRef, state, controls, skipSeconds, playbackRates }}>
        <AudioPlayerSurface
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          defaultVolume={defaultVolume}
          defaultMuted={defaultMuted}
          defaultPlaybackRate={defaultPlaybackRate}
          mediaRef={mediaRef}
        />
        {children}
      </AudioPlayerContext.Provider>
    </div>
  )
}

interface AudioPlayerSurfaceInternalProps extends AudioHTMLAttributes<HTMLAudioElement> {
  defaultVolume: number
  defaultMuted: boolean
  defaultPlaybackRate: number
  mediaRef: RefObject<HTMLAudioElement | null>
}

function AudioPlayerSurface({
  defaultVolume,
  defaultMuted,
  defaultPlaybackRate,
  mediaRef,
  ...rest
}: AudioPlayerSurfaceInternalProps) {
  return (
    <audio
      ref={mediaRef}
      muted={defaultMuted}
      onLoadedMetadata={(e) => {
        e.currentTarget.volume = defaultVolume
        e.currentTarget.playbackRate = defaultPlaybackRate
      }}
      {...rest}
    />
  )
}

export interface AudioPlayerControlsProps extends ToolbarProps {}

// Mismo comentario que en VideoPlayer: Seek/VolumeSlider cuentan como un ítem enfocable para el
// roving-focus de Toolbar; con foco adentro, las flechas ajustan el value nativo del range en vez
// de mover el foco — comportamiento correcto, no hace falta nada especial.
function AudioPlayerControls({ className, ...rest }: AudioPlayerControlsProps) {
  return <Toolbar data-part="controls" className={cx('sk-audio-player__controls', className)} {...rest} />
}

AudioPlayer.Controls = AudioPlayerControls
AudioPlayer.Separator = Toolbar.Separator
