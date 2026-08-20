import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  type VideoHTMLAttributes,
} from 'react'
import { useMediaPlayer, type MediaPlayerControls, type MediaPlayerState } from '../../lib/useMediaPlayer'
import { cx } from '../../lib/cx'
import { Toolbar, type ToolbarProps } from '../Toolbar'

// Fullscreen/PiP no son parte de useMediaPlayer (que es genérico para <video>/<audio>): son
// exclusivos de video, así que el estado vive acá, en VideoPlayer. Fullscreen se dispara sobre
// containerRef (el wrapper, no el <video> solo) para que los controles custom sigan visibles;
// PiP se dispara sobre el <video> directo, que es lo único que soporta la API.
function useFullscreenAndPip(
  containerRef: RefObject<HTMLDivElement | null>,
  mediaRef: RefObject<HTMLVideoElement | null>,
) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPip, setIsPip] = useState(false)

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const onEnter = () => setIsPip(true)
    const onLeave = () => setIsPip(false)
    el.addEventListener('enterpictureinpicture', onEnter)
    el.addEventListener('leavepictureinpicture', onLeave)
    return () => {
      el.removeEventListener('enterpictureinpicture', onEnter)
      el.removeEventListener('leavepictureinpicture', onLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRef.current])

  const toggleFullscreen = () => {
    if (document.fullscreenElement === containerRef.current) document.exitFullscreen()
    else containerRef.current?.requestFullscreen()
  }
  const togglePip = () => {
    if (document.pictureInPictureElement === mediaRef.current) document.exitPictureInPicture()
    else mediaRef.current?.requestPictureInPicture()
  }

  return { isFullscreen, isPip, toggleFullscreen, togglePip }
}

// Familia compuesta con ~11 sub-partes, repartidas en varios archivos hermanos
// (VideoPlayer/VideoPlayerPlayback/VideoPlayerVolume/VideoPlayerExtra.tsx) — mismo motivo que
// RichTextEditor: TS no infiere una propiedad estática asignada en OTRO archivo del que se
// declaró la función, así que el ensamblado final (`VideoPlayer.PlayButton`, etc.) vive en el
// barrel, `index.ts`, vía Object.assign.

export interface VideoPlayerCtx {
  mediaRef: RefObject<HTMLVideoElement | null>
  containerRef: RefObject<HTMLDivElement | null>
  state: MediaPlayerState
  controls: MediaPlayerControls
  skipSeconds: number
  playbackRates: number[]
  isFullscreen: boolean
  isPip: boolean
  toggleFullscreen: () => void
  togglePip: () => void
}
const VideoPlayerContext = createContext<VideoPlayerCtx | null>(null)

export function useVideoPlayerCtx(part: string): VideoPlayerCtx {
  const ctx = useContext(VideoPlayerContext)
  if (!ctx) throw new Error(`skinkit: <VideoPlayer.${part}> debe usarse dentro de <VideoPlayer>`)
  return ctx
}

export interface VideoPlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  src: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  defaultVolume?: number
  defaultMuted?: boolean
  defaultPlaybackRate?: number
  /** Segundos que avanzan/retroceden VideoPlayer.SkipBack/SkipForward. */
  skipSeconds?: number
  /** Opciones que ofrece VideoPlayer.PlaybackRate. */
  playbackRates?: number[]
  children: ReactNode
}

/**
 * VideoPlayer headless, compuesto — envuelve un <video> nativo: play/pause/seek/volumen/velocidad
 * los resuelve el propio HTMLMediaElement (useMediaPlayer, en src/lib), acá solo se aporta
 * estructura, el contrato data-sk/data-part, y controles armados con primitivos de skinkit
 * (Button/Toolbar/Select).
 *
 * Contrato:
 *   [data-sk="video-player"] [data-fullscreen] [data-pip]   raíz (también target de fullscreen)
 *   [data-part="surface"]                                    <VideoPlayer.Surface> (el <video>)
 *   [data-part="controls"]                                   <VideoPlayer.Controls> (Toolbar)
 */
export function VideoPlayer({
  src,
  poster,
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
}: VideoPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, controls] = useMediaPlayer(mediaRef)
  const { isFullscreen, isPip, toggleFullscreen, togglePip } = useFullscreenAndPip(containerRef, mediaRef)

  return (
    <div
      ref={containerRef}
      data-sk="video-player"
      data-fullscreen={isFullscreen ? '' : undefined}
      data-pip={isPip ? '' : undefined}
      className={cx('sk-video-player', className)}
      {...rest}
    >
      <VideoPlayerContext.Provider
        value={{
          mediaRef,
          containerRef,
          state,
          controls,
          skipSeconds,
          playbackRates,
          isFullscreen,
          isPip,
          toggleFullscreen,
          togglePip,
        }}
      >
        <VideoPlayerSurface
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          defaultVolume={defaultVolume}
          defaultMuted={defaultMuted}
          defaultPlaybackRate={defaultPlaybackRate}
          mediaRef={mediaRef}
        />
        {children}
      </VideoPlayerContext.Provider>
    </div>
  )
}

interface VideoPlayerSurfaceInternalProps extends VideoHTMLAttributes<HTMLVideoElement> {
  defaultVolume: number
  defaultMuted: boolean
  defaultPlaybackRate: number
  mediaRef: RefObject<HTMLVideoElement | null>
}

function VideoPlayerSurface({
  defaultVolume,
  defaultMuted,
  defaultPlaybackRate,
  mediaRef,
  ...rest
}: VideoPlayerSurfaceInternalProps) {
  return (
    <video
      ref={mediaRef}
      data-part="surface"
      muted={defaultMuted}
      onLoadedMetadata={(e) => {
        e.currentTarget.volume = defaultVolume
        e.currentTarget.playbackRate = defaultPlaybackRate
      }}
      {...rest}
    />
  )
}

export interface VideoPlayerControlsProps extends ToolbarProps {}

// Seek/VolumeSlider (input[type=range]) cuentan como UN ítem enfocable para el roving-focus de
// Toolbar: Tab entra/sale normal, pero con foco adentro las flechas ajustan el value nativo del
// range en vez de mover el foco del toolbar — es el comportamiento correcto, no hace falta nada
// especial acá.
function VideoPlayerControls({ className, ...rest }: VideoPlayerControlsProps) {
  return <Toolbar data-part="controls" className={cx('sk-video-player__controls', className)} {...rest} />
}

VideoPlayer.Controls = VideoPlayerControls
VideoPlayer.Separator = Toolbar.Separator
