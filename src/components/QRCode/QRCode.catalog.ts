import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <QRCode>. Actualizar SIEMPRE que cambie QRCode.tsx o src/lib/qrEncode.ts. */
export const qrCodeSpec: ComponentSpec = {
  name: 'QRCode',
  dataSk: 'qrcode',
  category: 'Display',
  description:
    'Código QR headless, en SVG — sin canvas, sin dependencias. El encoder (Reed–Solomon + layout, ISO/IEC 18004, modo byte, versiones 1 a 10) es propio (src/lib/qrEncode.ts), verificado contra un decoder QR real. Alcanza para URLs, texto corto, vCards, config de wifi, etc. (~250 bytes máx. a nivel L).',
  extends: "Omit<HTMLAttributes<HTMLSpanElement>, 'children'>",
  props: [
    { name: 'value', type: 'string', required: true, description: 'Contenido a codificar.' },
    { name: 'size', type: 'number', required: false, default: '128', description: 'Tamaño en px (cuadrado).' },
    { name: 'errorCorrectionLevel', type: "'L' | 'M' | 'Q' | 'H'", required: false, default: "'M'", description: 'Redundancia de corrección de errores. Más alto = QR más denso mismo contenido, pero tolera más daño/oclusión (útil si vas a poner un logo encima, aunque QRCode no trae esa feature en esta versión).' },
    { name: 'margin', type: 'number', required: false, default: '4', description: 'Zona de silencio (quiet zone) alrededor del código, en módulos. 4 es el mínimo recomendado por la spec — bajarlo puede afectar el escaneo.' },
    { name: 'classNames', type: '{ module?: string }', required: false, description: 'Clases extra para la sub-parte `module` (aplica a los cientos de <rect> por igual, la misma clase para todos los módulos oscuros).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=qrcode]: <span> que envuelve el <svg>.' },
    { name: 'module', description: '[data-part=module]: cada módulo oscuro (<rect>). El color sale de `fill` — sin prop de color, ver usage.' },
  ],
  examples: [
    {
      title: 'Básico',
      code: "import { QRCode } from 'skinkit'\n\n<QRCode value=\"https://skinkit.dev\" />",
    },
    {
      title: 'Nivel de corrección alto + tamaño custom',
      code: '<QRCode value="WIFI:T:WPA;S:MiRed;P:micontraseña;;" errorCorrectionLevel="H" size={200} />',
    },
  ],
  usage: [
    'Si el texto no entra en ninguna versión soportada (1 a 10) con el `errorCorrectionLevel` pedido, lanza un error explícito — probá un nivel más bajo o acortá el contenido.',
    'No hay prop de color: los módulos toman `fill` (default var(--color-sk-text) vía CSS) y el fondo lo pone el contenedor. Personalizá con CSS, pero mantené buen contraste — un QR con poco contraste puede no escanear aunque se vea "bien" en pantalla.',
    'No incluye soporte de logo superpuesto en esta versión — si lo necesitás, subí `errorCorrectionLevel` a "H" (más tolerancia a oclusión) y superponé tu propio logo por CSS/posicionamiento absoluto sobre el centro.',
  ],
  a11y: [
    'El <svg> lleva role="img" y aria-label con el valor codificado, para que un lector de pantalla anuncie el contenido en vez de "imagen sin descripción".',
  ],
}
