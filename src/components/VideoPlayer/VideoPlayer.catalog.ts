import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <VideoPlayer>. Actualizar SIEMPRE que cambie VideoPlayer.tsx o
 * cualquiera de sus archivos hermanos (Playback/Volume/Extra). */
export const videoPlayerSpec: ComponentSpec = {
  name: 'VideoPlayer',
  dataSk: 'video-player',
  category: 'Display',
  description:
    'Reproductor de video compuesto — envuelve un <video> nativo (play/pause/seek/volumen/velocidad los resuelve el propio HTMLMediaElement); controles armados con Button/Toolbar/Select de skinkit. Sin dependencias nuevas.',
  props: [
    { name: 'src', type: 'string', required: true, description: 'URL del video.' },
    { name: 'poster', type: 'string', required: false, description: 'Imagen mostrada antes de reproducir.' },
    { name: 'autoPlay', type: 'boolean', required: false, default: 'false', description: 'Reproduce automáticamente al montar (sujeto a la política de autoplay del navegador).' },
    { name: 'loop', type: 'boolean', required: false, default: 'false', description: 'Repite al llegar al final.' },
    { name: 'defaultVolume', type: 'number', required: false, default: '1', description: 'Volumen inicial (0 a 1).' },
    { name: 'defaultMuted', type: 'boolean', required: false, default: 'false', description: 'Silenciado inicial.' },
    { name: 'defaultPlaybackRate', type: 'number', required: false, default: '1', description: 'Velocidad inicial.' },
    { name: 'skipSeconds', type: 'number', required: false, default: '10', description: 'Segundos que avanzan/retroceden SkipBack/SkipForward.' },
    { name: 'playbackRates', type: 'number[]', required: false, default: '[0.5, 1, 1.5, 2]', description: 'Opciones que ofrece PlaybackRate.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=video-player]. También el target de fullscreen — lleva [data-fullscreen] y [data-pip] cuando aplican.' },
    { name: 'surface', description: '[data-part=surface]: el <video> nativo.' },
    { name: 'controls', description: '<VideoPlayer.Controls> — [data-part=controls], es <Toolbar> por dentro. Agrupá los botones que quieras adentro.' },
    { name: 'PlayButton', description: '<Button variant="ghost"> — togglea play/pause, ícono cambia según el estado.' },
    { name: 'SkipBack / SkipForward', description: '<Button> — retrocede/adelanta `skipSeconds`.' },
    { name: 'Time', description: 'Texto "actual / duración" formateado mm:ss (h:mm:ss ≥ 1h).' },
    { name: 'Seek', description: 'input[type=range] con progreso reproducido + buffer visual (gradiente vía --sk-seek-played/--sk-seek-buffered).' },
    { name: 'VolumeButton', description: '<Button variant="ghost"> — togglea mute, ícono Volume2/VolumeX (lucide-react) según el estado.' },
    { name: 'VolumeSlider', description: 'input[type=range] 0 a 1 — volumen. Bespoke (no reusa <Slider>, que trae layout de campo de formulario que no encaja en una barra horizontal).' },
    { name: 'PlaybackRate', description: '<Select> con las opciones de `playbackRates`. Cambia editor.playbackRate.' },
    { name: 'FullscreenButton', description: '<Button> — pantalla completa sobre TODO el reproductor (no solo el video), así los controles siguen visibles/clicleables. No se renderiza si el navegador no soporta la Fullscreen API.' },
    { name: 'PipButton', description: '<Button> — picture-in-picture. No se renderiza si el navegador no soporta la API (mejor omitir que mostrar un botón siempre deshabilitado sin explicación).' },
    { name: 'Separator', description: '= Toolbar.Separator, divisor entre grupos de controles.' },
  ],
  examples: [
    {
      title: 'Básico',
      code: "import { VideoPlayer } from 'skinkit'\n\n<VideoPlayer src=\"/video.mp4\" poster=\"/poster.jpg\">\n  <VideoPlayer.Controls>\n    <VideoPlayer.PlayButton />\n    <VideoPlayer.Seek />\n    <VideoPlayer.Time />\n  </VideoPlayer.Controls>\n</VideoPlayer>",
    },
    {
      title: 'Completo — todos los controles',
      code: "<VideoPlayer src=\"/video.mp4\" poster=\"/poster.jpg\" skipSeconds={10}>\n  <VideoPlayer.Controls>\n    <VideoPlayer.PlayButton />\n    <VideoPlayer.SkipBack />\n    <VideoPlayer.SkipForward />\n    <VideoPlayer.Seek />\n    <VideoPlayer.Time />\n    <VideoPlayer.Separator />\n    <VideoPlayer.VolumeButton />\n    <VideoPlayer.VolumeSlider />\n    <VideoPlayer.Separator />\n    <VideoPlayer.PlaybackRate />\n    <VideoPlayer.PipButton />\n    <VideoPlayer.FullscreenButton />\n  </VideoPlayer.Controls>\n</VideoPlayer>",
    },
  ],
  usage: [
    'Los botones de la barra son sub-componentes de esta misma familia — ver la lista de `parts` arriba, no tienen ficha propia (igual que Accordion.Item).',
    '<VideoPlayer.Controls> es un <Toolbar>: las flechas mueven el foco entre botones; dentro de Seek/VolumeSlider, las flechas ajustan el valor del range nativo en vez de mover el foco (comportamiento nativo esperado).',
    'FullscreenButton/PipButton se auto-omiten (no renderizan nada) si el navegador no soporta esa API — no hace falta chequearlo del lado del consumidor.',
    'El root [data-sk="video-player"] es también el target de fullscreen: lleva [data-fullscreen]/[data-pip] cuando aplica, para que el CSS pueda ajustar el layout en esos estados.',
  ],
  a11y: [
    'Seek/VolumeSlider son input[type=range] nativos: foco/teclado/ARIA de slider vienen gratis del navegador. Seek expone aria-valuetext con el tiempo en formato legible.',
    'PlayButton/VolumeButton/FullscreenButton/PipButton actualizan su aria-label/aria-pressed según el estado REAL del elemento (nunca un estado optimista).',
  ],
}
