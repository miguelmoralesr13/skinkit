import type { CSSProperties } from 'react'
import { formatTime } from '../../lib/useMediaPlayer'
import { IconPlay, IconPause, IconSkipBack, IconSkipForward } from '../../lib/mediaIcons'
import { Button, type ButtonProps } from '../Button'
import { cx } from '../../lib/cx'
import { useAudioPlayerCtx } from './AudioPlayer'

export type AudioPlayerPlayButtonProps = Omit<ButtonProps, 'variant' | 'onClick'>

export function PlayButton({ children, ...rest }: AudioPlayerPlayButtonProps) {
  const { state, controls } = useAudioPlayerCtx('PlayButton')
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={state.playing ? 'Pausar' : 'Reproducir'}
      onClick={controls.toggle}
      {...rest}
    >
      {children ?? (state.playing ? <IconPause /> : <IconPlay />)}
    </Button>
  )
}

export type AudioPlayerSkipButtonProps = Omit<ButtonProps, 'variant' | 'onClick'>

export function SkipBack({ children, ...rest }: AudioPlayerSkipButtonProps) {
  const { controls, skipSeconds } = useAudioPlayerCtx('SkipBack')
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={`Retroceder ${skipSeconds}s`}
      onClick={() => controls.skip(-skipSeconds)}
      {...rest}
    >
      {children ?? <IconSkipBack />}
    </Button>
  )
}

export function SkipForward({ children, ...rest }: AudioPlayerSkipButtonProps) {
  const { controls, skipSeconds } = useAudioPlayerCtx('SkipForward')
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={`Adelantar ${skipSeconds}s`}
      onClick={() => controls.skip(skipSeconds)}
      {...rest}
    >
      {children ?? <IconSkipForward />}
    </Button>
  )
}

export interface AudioPlayerTimeProps {
  className?: string
}

export function Time({ className }: AudioPlayerTimeProps) {
  const { state } = useAudioPlayerCtx('Time')
  return (
    <span data-part="time" className={cx('sk-audio-player__time', className)}>
      {formatTime(state.currentTime)} / {formatTime(state.duration)}
    </span>
  )
}

export interface AudioPlayerSeekProps {
  className?: string
  'aria-label'?: string
}

export function Seek({ className, 'aria-label': ariaLabel = 'Progreso' }: AudioPlayerSeekProps) {
  const { state, controls } = useAudioPlayerCtx('Seek')
  const pct = state.duration ? (state.currentTime / state.duration) * 100 : 0
  const bufferedPct = state.duration ? (state.buffered / state.duration) * 100 : 0

  return (
    <input
      type="range"
      data-part="seek"
      className={cx('sk-audio-player__seek', className)}
      min={0}
      max={state.duration || 0}
      step={0.1}
      value={state.currentTime}
      style={{ '--sk-seek-played': `${pct}%`, '--sk-seek-buffered': `${bufferedPct}%` } as CSSProperties}
      onChange={(e) => controls.seek(Number(e.target.value))}
      aria-label={ariaLabel}
      aria-valuetext={`${formatTime(state.currentTime)} de ${formatTime(state.duration)}`}
    />
  )
}
