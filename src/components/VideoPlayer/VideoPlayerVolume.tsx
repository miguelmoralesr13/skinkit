import { IconVolumeHigh, IconVolumeMuted } from '../../lib/mediaIcons'
import { Button, type ButtonProps } from '../Button'
import { cx } from '../../lib/cx'
import { useVideoPlayerCtx } from './VideoPlayer'

// VolumeSlider es un input[type=range] a mano, NO un <Slider> reusado: Slider trae layout de
// campo de formulario (label arriba, flex-col) que no encaja en una barra horizontal sin pisar
// [data-sk='slider'] desde el CSS de este componente — y ningún archivo CSS de skinkit targetea
// el data-sk de OTRO componente. Sin buffer que mostrar acá, así que alcanza con accent-color
// (a diferencia de Seek, que sí necesita el truco de gradiente para el buffer).

export type VideoPlayerVolumeButtonProps = Omit<ButtonProps, 'variant' | 'onClick'>

export function VolumeButton({ children, ...rest }: VideoPlayerVolumeButtonProps) {
  const { state, controls } = useVideoPlayerCtx('VolumeButton')
  const silenced = state.muted || state.volume === 0
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={silenced ? 'Activar sonido' : 'Silenciar'}
      onClick={controls.toggleMute}
      {...rest}
    >
      {children ?? (silenced ? <IconVolumeMuted /> : <IconVolumeHigh />)}
    </Button>
  )
}

export interface VideoPlayerVolumeSliderProps {
  className?: string
  'aria-label'?: string
}

export function VolumeSlider({ className, 'aria-label': ariaLabel = 'Volumen' }: VideoPlayerVolumeSliderProps) {
  const { state, controls } = useVideoPlayerCtx('VolumeSlider')
  return (
    <input
      type="range"
      data-part="volume"
      className={cx('sk-video-player__volume', className)}
      min={0}
      max={1}
      step={0.05}
      value={state.muted ? 0 : state.volume}
      onChange={(e) => controls.setVolume(Number(e.target.value))}
      aria-label={ariaLabel}
    />
  )
}
