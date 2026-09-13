import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <AudioPlayer>. Actualizar SIEMPRE que cambie AudioPlayer.tsx o
 * cualquiera de sus archivos hermanos (Playback/Volume). */
export const audioPlayerSpec: ComponentSpec = {
  name: 'AudioPlayer',
  dataSk: 'audio-player',
  category: 'Display',
  description:
    'Reproductor de audio compuesto — envuelve un <audio> nativo (play/pause/seek/volumen/velocidad los resuelve el propio HTMLMediaElement, vía el mismo hook que usa VideoPlayer). Sin fullscreen/picture-in-picture (exclusivos de video). Sin dependencias nuevas.',
  props: [
    { name: 'src', type: 'string', required: true, description: 'URL del audio.' },
    { name: 'autoPlay', type: 'boolean', required: false, default: 'false', description: 'Reproduce automáticamente al montar (sujeto a la política de autoplay del navegador).' },
    { name: 'loop', type: 'boolean', required: false, default: 'false', description: 'Repite al llegar al final.' },
    { name: 'defaultVolume', type: 'number', required: false, default: '1', description: 'Volumen inicial (0 a 1).' },
    { name: 'defaultMuted', type: 'boolean', required: false, default: 'false', description: 'Silenciado inicial.' },
    { name: 'defaultPlaybackRate', type: 'number', required: false, default: '1', description: 'Velocidad inicial.' },
    { name: 'skipSeconds', type: 'number', required: false, default: '10', description: 'Segundos que avanzan/retroceden SkipBack/SkipForward.' },
    { name: 'playbackRates', type: 'number[]', required: false, default: '[0.5, 1, 1.5, 2]', description: 'Opciones que ofrece PlaybackRate.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=audio-player].' },
    { name: 'controls', description: '<AudioPlayer.Controls> — [data-part=controls], es <Toolbar> por dentro. Agrupá los botones que quieras adentro.' },
    { name: 'PlayButton', description: '<Button variant="ghost"> — togglea play/pause, ícono cambia según el estado.' },
    { name: 'SkipBack / SkipForward', description: '<Button> — retrocede/adelanta `skipSeconds`.' },
    { name: 'Time', description: 'Texto "actual / duración" formateado mm:ss (h:mm:ss ≥ 1h).' },
    { name: 'Seek', description: 'input[type=range] con progreso reproducido + buffer visual (gradiente vía --sk-seek-played/--sk-seek-buffered).' },
    { name: 'VolumeButton', description: '<Button variant="ghost"> — togglea mute, ícono Volume2/VolumeX (lucide-react) según el estado.' },
    { name: 'VolumeSlider', description: 'input[type=range] 0 a 1 — volumen.' },
    { name: 'PlaybackRate', description: '<Select> con las opciones de `playbackRates`.' },
    { name: 'Separator', description: '= Toolbar.Separator, divisor entre grupos de controles.' },
  ],
  examples: [
    {
      title: 'Completo',
      code: "import { AudioPlayer } from 'skinkit'\n\n<AudioPlayer src=\"/track.mp3\">\n  <AudioPlayer.Controls>\n    <AudioPlayer.PlayButton />\n    <AudioPlayer.SkipBack />\n    <AudioPlayer.SkipForward />\n    <AudioPlayer.Seek />\n    <AudioPlayer.Time />\n    <AudioPlayer.Separator />\n    <AudioPlayer.VolumeButton />\n    <AudioPlayer.VolumeSlider />\n    <AudioPlayer.Separator />\n    <AudioPlayer.PlaybackRate />\n  </AudioPlayer.Controls>\n</AudioPlayer>",
    },
  ],
  usage: [
    'Los botones de la barra son sub-componentes de esta misma familia — ver la lista de `parts` arriba, no tienen ficha propia (igual que Accordion.Item).',
    '<AudioPlayer.Controls> es un <Toolbar>: las flechas mueven el foco entre botones; dentro de Seek/VolumeSlider, las flechas ajustan el valor del range nativo en vez de mover el foco (comportamiento nativo esperado).',
    'Comparte la lógica de reproducción con VideoPlayer (useMediaPlayer, en src/lib) — mismo comportamiento de estado, sin optimismo: los controles solo reflejan lo que el navegador confirmó.',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `mediaPlayer` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ mediaPlayer: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'Seek/VolumeSlider son input[type=range] nativos: foco/teclado/ARIA de slider vienen gratis del navegador. Seek expone aria-valuetext con el tiempo en formato legible.',
    'PlayButton/VolumeButton actualizan su aria-label según el estado real del elemento, no un estado optimista.',
  ],
}
