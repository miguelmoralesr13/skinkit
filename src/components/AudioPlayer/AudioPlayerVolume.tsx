import { IconVolumeHigh, IconVolumeMuted } from '../../lib/mediaIcons'
import { Button, type ButtonProps } from '../Button'
import { Select, type SelectProps } from '../Select'
import { cx } from '../../lib/cx'
import { useAudioPlayerCtx } from './AudioPlayer'
import { useSkinkitMessages } from '../../i18n/context'

export type AudioPlayerVolumeButtonProps = Omit<ButtonProps, 'variant' | 'onClick'>

export function VolumeButton({ children, ...rest }: AudioPlayerVolumeButtonProps) {
  const m = useSkinkitMessages()
  const { state, controls } = useAudioPlayerCtx('VolumeButton')
  const silenced = state.muted || state.volume === 0
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={silenced ? m.mediaPlayer.unmute : m.mediaPlayer.mute}
      onClick={controls.toggleMute}
      {...rest}
    >
      {children ?? (silenced ? <IconVolumeMuted /> : <IconVolumeHigh />)}
    </Button>
  )
}

export interface AudioPlayerVolumeSliderProps {
  className?: string
  'aria-label'?: string
}

export function VolumeSlider({ className, 'aria-label': ariaLabelProp }: AudioPlayerVolumeSliderProps) {
  const m = useSkinkitMessages()
  const ariaLabel = ariaLabelProp ?? m.mediaPlayer.volume
  const { state, controls } = useAudioPlayerCtx('VolumeSlider')
  return (
    <input
      type="range"
      data-part="volume"
      className={cx('sk-audio-player__volume', className)}
      min={0}
      max={1}
      step={0.05}
      value={state.muted ? 0 : state.volume}
      onChange={(e) => controls.setVolume(Number(e.target.value))}
      aria-label={ariaLabel}
    />
  )
}

export interface AudioPlayerPlaybackRateProps extends Omit<SelectProps, 'value' | 'onChange' | 'children'> {}

export function PlaybackRate({ 'aria-label': ariaLabelProp, ...rest }: AudioPlayerPlaybackRateProps) {
  const m = useSkinkitMessages()
  const ariaLabel = ariaLabelProp ?? m.mediaPlayer.playbackRate
  const { state, controls, playbackRates } = useAudioPlayerCtx('PlaybackRate')
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
