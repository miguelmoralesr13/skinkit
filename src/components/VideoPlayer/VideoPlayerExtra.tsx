import { IconFullscreen, IconFullscreenExit, IconPip } from '../../lib/mediaIcons'
import { Button, type ButtonProps } from '../Button'
import { Select, type SelectProps } from '../Select'
import { useVideoPlayerCtx } from './VideoPlayer'
import { useSkinkitMessages } from '../../i18n/context'

export interface VideoPlayerPlaybackRateProps extends Omit<SelectProps, 'value' | 'onChange' | 'children'> {}

export function PlaybackRate({ 'aria-label': ariaLabelProp, ...rest }: VideoPlayerPlaybackRateProps) {
  const m = useSkinkitMessages()
  const ariaLabel = ariaLabelProp ?? m.mediaPlayer.playbackRate
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
  const m = useSkinkitMessages()
  const { isFullscreen, toggleFullscreen } = useVideoPlayerCtx('FullscreenButton')
  if (typeof document !== 'undefined' && !document.fullscreenEnabled) return null

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={isFullscreen ? m.mediaPlayer.exitFullscreen : m.mediaPlayer.fullscreen}
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
  const m = useSkinkitMessages()
  const { isPip, togglePip } = useVideoPlayerCtx('PipButton')
  if (typeof document !== 'undefined' && !document.pictureInPictureEnabled) return null

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={isPip ? m.mediaPlayer.exitPip : m.mediaPlayer.pip}
      aria-pressed={isPip}
      onClick={togglePip}
      {...rest}
    >
      {children ?? <IconPip />}
    </Button>
  )
}
