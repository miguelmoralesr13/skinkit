import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <LocationPicker>. Actualizar SIEMPRE que cambie LocationPicker.tsx. */
export const locationPickerSpec: ComponentSpec = {
  name: 'LocationPicker',
  dataSk: 'location-picker',
  category: 'Formulario',
  description:
    'Selector de ubicación: pin movible y radio opcional sobre un mapa de teselas, con campos de latitud/longitud/radio. Sin librería de mapas ni llaves: el proveedor de teselas se inyecta (`tileUrl`/`renderTiles`). Sin teselas o sin red degrada a cuadrícula neutra + campos, nunca en blanco.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>",
  props: [
    { name: 'value', type: '{ lat: number; lng: number } | null', required: true, description: 'Ubicación elegida (controlado). null = sin elegir.' },
    { name: 'onChange', type: '(next: { lat: number; lng: number }) => void', required: true, description: 'Al arrastrar el pin, hacer clic en el mapa, usar las flechas, editar los campos o geolocalizar.' },
    { name: 'radius', type: 'number', required: false, description: 'Radio en metros. Con él se dibuja el círculo (y el campo si hay onRadiusChange).' },
    { name: 'onRadiusChange', type: '(next: number) => void', required: false, description: 'Habilita el campo de radio (acotado por minRadius/maxRadius).' },
    { name: 'minRadius', type: 'number', required: false, default: '10', description: 'Radio mínimo (se aplica al salir del campo).' },
    { name: 'maxRadius', type: 'number', required: false, default: '5000', description: 'Radio máximo.' },
    { name: 'tileUrl', type: 'string', required: false, description: 'Plantilla de teselas con {z}/{x}/{y} (y {s}= a/b/c), ej. "https://tile.openstreetmap.org/{z}/{x}/{y}.png". Sin ella: solo cuadrícula neutra y NINGUNA petición a terceros.' },
    { name: 'renderTiles', type: '(tiles: TileInfo[]) => ReactNode', required: false, description: 'Dibujo propio de las teselas visibles (cada una con left/top/size/x/y/z/url); pisa a tileUrl.' },
    { name: 'attribution', type: 'ReactNode', required: false, description: 'Crédito del proveedor; obligatorio por sus términos (OSM: "© OpenStreetMap contributors").' },
    { name: 'defaultCenter', type: '{ lat: number; lng: number }', required: false, description: 'Centro mientras value sea null.' },
    { name: 'defaultZoom', type: 'number', required: false, default: '15', description: 'Zoom inicial (3–19).' },
    { name: 'locate', type: 'boolean', required: false, default: 'false', description: 'Muestra «Usar mi ubicación» (geolocalización del navegador; pide permiso al pulsar).' },
    { name: 'onLocateError', type: '(error: unknown) => void', required: false, description: 'Si la geolocalización falla.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Desactiva todas las entradas.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=location-picker] con [data-state=ready|offline|no-tiles].' },
    { name: 'map', description: 'Superficie interactiva (role=group). [data-dragging].' },
    { name: 'tiles', description: 'Capa de teselas (decorativa).' },
    { name: 'tile', description: 'Cada <img> de tesela.' },
    { name: 'overlay', description: '<svg> del radio.' },
    { name: 'radius-circle', description: 'Círculo del radio.' },
    { name: 'pin', description: 'Marcador (button; flechas lo mueven).' },
    { name: 'zoom-in', description: 'Botón acercar.' },
    { name: 'zoom-out', description: 'Botón alejar.' },
    { name: 'attribution', description: 'Crédito de las teselas.' },
    { name: 'notice', description: 'Aviso cuando las teselas no cargan.' },
    { name: 'fields', description: 'Grupo de campos y botón de ubicación.' },
    { name: 'field', description: 'Cada campo (label). [data-field=lat|lng|radius].' },
    { name: 'label', description: 'Texto del campo.' },
    { name: 'input', description: 'El <input type=number>.' },
    { name: 'locate', description: 'Botón «Usar mi ubicación».' },
    { name: 'status', description: 'Región aria-live (buscando ubicación / error).' },
  ],
  examples: [
    {
      title: 'Zona con radio y teselas OSM',
      code: `const [pos, setPos] = useState<{ lat: number; lng: number } | null>({ lat: 19.4326, lng: -99.1332 })
const [radio, setRadio] = useState(200)
<LocationPicker
  value={pos}
  onChange={setPos}
  radius={radio}
  onRadiusChange={setRadio}
  locate
  tileUrl="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution="© OpenStreetMap contributors"
/>`,
    },
    {
      title: 'Sin proveedor (solo cuadrícula y campos)',
      code: '<LocationPicker value={pos} onChange={setPos} />',
    },
  ],
  usage: [
    'Para marcar UN punto (y su radio) de forma aproximada. Para rutas, varios marcadores, búsqueda de direcciones o desplazamiento libre usa una librería de mapas completa.',
    'Respeta los términos de tu proveedor de teselas: el servidor público de OSM es para uso ligero; en producción usa el tuyo y pon `attribution`.',
    'Los campos numéricos son parte del componente (entrada por teclado y alternativa accesible): no los ocultes.',
    'Límite: el mapa se recentra al pin; no hay arrastre libre del mapa, rotación ni geocodificación.',
  ],
  a11y: [
    'Todo se puede hacer sin ratón: campos de latitud/longitud/radio y el pin enfocable que se mueve con las flechas (Mayús = salto mayor). El mapa es decorativo para lectores.',
    'Los mensajes de geolocalización y error se anuncian en una región aria-live; el color del círculo no transmite información que no esté en los campos.',
  ],
}
