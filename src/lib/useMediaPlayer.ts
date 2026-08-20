import { useEffect, useRef, useState, type RefObject } from 'react'

// Hook compartido por VideoPlayer y AudioPlayer (ambos envuelven un HTMLMediaElement nativo).
// No hace estado optimista: los controles solo llaman al método nativo del elemento; el estado
// React se actualiza SIEMPRE a través de los eventos reales del elemento — así nunca queda
// desincronizado si el navegador rechaza un play() (política de autoplay) o similar.

export interface MediaPlayerState {
  playing: boolean
  currentTime: number
  /** 0 mientras no cargó metadata (el navegador reporta NaN en ese momento). */
  duration: number
  /** Fin (segundos) del último rango bufferizado. */
  buffered: number
  volume: number
  muted: boolean
  playbackRate: number
  ended: boolean
  /** true entre 'waiting' y el próximo 'playing'/'canplay'. */
  loading: boolean
}

export interface MediaPlayerControls {
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  skip: (deltaSeconds: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  setMuted: (m: boolean) => void
  setPlaybackRate: (rate: number) => void
}

function readState(el: HTMLMediaElement): MediaPlayerState {
  return {
    playing: !el.paused && !el.ended,
    currentTime: el.currentTime,
    duration: Number.isNaN(el.duration) ? 0 : el.duration,
    buffered: el.buffered.length ? el.buffered.end(el.buffered.length - 1) : 0,
    volume: el.volume,
    muted: el.muted,
    playbackRate: el.playbackRate,
    ended: el.ended,
    loading: false,
  }
}

export function useMediaPlayer<T extends HTMLMediaElement>(
  mediaRef: RefObject<T | null>,
): [MediaPlayerState, MediaPlayerControls] {
  const [state, setState] = useState<MediaPlayerState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    muted: false,
    playbackRate: 1,
    ended: false,
    loading: false,
  })
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const el = mediaRef.current
    if (!el) return

    setState(readState(el))

    const onPlayPause = () => setState((s) => ({ ...s, ...readState(el), loading: s.loading }))
    const onTimeUpdate = () => setState((s) => ({ ...s, currentTime: el.currentTime }))
    const onDurationChange = () =>
      setState((s) => ({ ...s, duration: Number.isNaN(el.duration) ? 0 : el.duration }))
    const onVolumeChange = () => setState((s) => ({ ...s, volume: el.volume, muted: el.muted }))
    const onRateChange = () => setState((s) => ({ ...s, playbackRate: el.playbackRate }))
    const onEnded = () => setState((s) => ({ ...s, ended: true, playing: false }))
    const onProgress = () =>
      setState((s) => ({
        ...s,
        buffered: el.buffered.length ? el.buffered.end(el.buffered.length - 1) : 0,
      }))
    const onWaiting = () => setState((s) => ({ ...s, loading: true }))
    const onReady = () => setState((s) => ({ ...s, loading: false }))

    el.addEventListener('play', onPlayPause)
    el.addEventListener('pause', onPlayPause)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('durationchange', onDurationChange)
    el.addEventListener('volumechange', onVolumeChange)
    el.addEventListener('ratechange', onRateChange)
    el.addEventListener('ended', onEnded)
    el.addEventListener('progress', onProgress)
    el.addEventListener('waiting', onWaiting)
    el.addEventListener('playing', onReady)
    el.addEventListener('canplay', onReady)

    return () => {
      el.removeEventListener('play', onPlayPause)
      el.removeEventListener('pause', onPlayPause)
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('durationchange', onDurationChange)
      el.removeEventListener('volumechange', onVolumeChange)
      el.removeEventListener('ratechange', onRateChange)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('progress', onProgress)
      el.removeEventListener('waiting', onWaiting)
      el.removeEventListener('playing', onReady)
      el.removeEventListener('canplay', onReady)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRef.current])

  const controls: MediaPlayerControls = {
    play: () => mediaRef.current?.play().catch(() => {}),
    pause: () => mediaRef.current?.pause(),
    toggle: () => {
      const el = mediaRef.current
      if (!el) return
      if (el.paused || el.ended) el.play().catch(() => {})
      else el.pause()
    },
    seek: (time) => {
      const el = mediaRef.current
      if (!el) return
      el.currentTime = Math.min(Math.max(time, 0), stateRef.current.duration || time)
    },
    skip: (deltaSeconds) => {
      const el = mediaRef.current
      if (!el) return
      const target = el.currentTime + deltaSeconds
      el.currentTime = Math.min(Math.max(target, 0), stateRef.current.duration || target)
    },
    setVolume: (v) => {
      const el = mediaRef.current
      if (!el) return
      el.volume = Math.min(Math.max(v, 0), 1)
    },
    toggleMute: () => {
      const el = mediaRef.current
      if (!el) return
      el.muted = !el.muted
    },
    setMuted: (m) => {
      const el = mediaRef.current
      if (el) el.muted = m
    },
    setPlaybackRate: (rate) => {
      const el = mediaRef.current
      if (el) el.playbackRate = rate
    },
  }

  return [state, controls]
}

/** mm:ss, o h:mm:ss a partir de 1 hora. NaN/negativo → '0:00'. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`
  return `${m}:${ss}`
}
