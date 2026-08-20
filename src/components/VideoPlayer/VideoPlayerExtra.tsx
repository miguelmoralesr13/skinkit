import { IconFullscreen, IconFullscreenExit, IconPip } from '../../lib/mediaIcons'
import { Button, type ButtonProps } from '../Button'
import { Select, type SelectProps } from '../Select'
import { useVideoPlayerCtx } from './VideoPlayer'

export interface VideoPlayerPlaybackRateProps extends Omit<SelectProps, 'value' | 'onChange' | 'children'> {}

export function PlaybackRate({ 'aria-label': ariaLabel = 'Velocidad', ...rest }: VideoPlayerPlaybackRateProps) {
  const { state, controls, playbackRates } = useVideoPlayerCtx('PlaybackRate')
  return (
    <Select
      aria-label={ariaLabel}
      value={state.playbackRate}
      onChange={(e) => controls.setPlaybackRate(Number(e.target.value))}
      {...rest}
    >
      {playbackRates.map((rate) => (
        <option key={rate} value={rate}>
          {rate}x
        </option>
      ))}
    </Select>
  )
}

export type VideoPlayerFullscreenButtonProps = Omit<ButtonProps, 'variant' | 'onClick'>

// document.fullscreenEnabled se lee en render: es un feature flag del navegador, no cambia en
// runtime, así que no hace falta estado/efecto para esto.
export function FullscreenButton({ children, ...rest }: VideoPlayerFullscreenButtonProps) {
  const { isFullscreen, toggleFullscreen } = useVideoPlayerCtx('FullscreenButton')
  if (typeof document !== 'undefined' && !document.fullscreenEnabled) return null

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      aria-pressed={isFullscreen}
      onClick={toggleFullscreen}
      {...rest}
    >
      {children ?? (isFullscreen ? <IconFullscreenExit /> : <IconFullscreen />)}
    </Button>
  )
}

export type VideoPlayerPipButtonProps = Omit<ButtonProps, 'variant' | 'onClick'>

export function PipButton({ children, ...rest }: VideoPlayerPipButtonProps) {
  const { isPip, togglePip } = useVideoPlayerCtx('PipButton')
  if (typeof document !== 'undefined' && !document.pictureInPictureEnabled) return null

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={isPip ? 'Salir de picture-in-picture' : 'Picture-in-picture'}
      aria-pressed={isPip}
      onClick={togglePip}
      {...rest}
    >
      {children ?? <IconPip />}
    </Button>
  )
}
