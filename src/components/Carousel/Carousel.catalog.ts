import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Carousel>. Actualizar SIEMPRE que cambie Carousel.tsx. */
export const carouselSpec: ComponentSpec = {
  name: 'Carousel',
  dataSk: 'carousel',
  category: 'Display',
  description:
    'Muestra un slide a la vez de varios, con anterior/siguiente y puntos. Compuesto: <Carousel> con <Carousel.Slide>. Cuenta los slides y arma los controles solo. La forma la da el skin.',
  extends: "Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>",
  props: [
    { name: 'index', type: 'number', required: false, description: 'Slide actual (controlado).' },
    { name: 'defaultIndex', type: 'number', required: false, default: '0', description: 'Slide inicial (uncontrolled).' },
    { name: 'onIndexChange', type: '(index: number) => void', required: false, description: 'Se invoca al cambiar de slide.' },
    { name: 'loop', type: 'boolean', required: false, description: 'Vuelve al principio/fin en los extremos.' },
    { name: 'label', type: 'string', required: false, default: "'Carrusel'", description: 'aria-label de la región.' },
  ],
  parts: [
    { name: 'root', description: 'role=region. Expone --sk-carousel-index (índice actual).' },
    { name: 'viewport', description: 'Ventana (overflow hidden).' },
    { name: 'track', description: 'Pista; el skin la desplaza con translateX(calc(var(--sk-carousel-index) * -100%)).' },
    { name: 'slide', description: 'Cada slide (envuelve a <Carousel.Slide>).' },
    { name: 'prev', description: 'Botón anterior (disabled en el extremo si no hay loop).' },
    { name: 'next', description: 'Botón siguiente.' },
    { name: 'dots', description: 'Contenedor de puntos.' },
    { name: 'dot', description: 'Cada punto. Lleva [data-active].' },
  ],
  examples: [
    {
      title: 'Imágenes',
      code: '<Carousel loop>\n  <Carousel.Slide><img src="/1.jpg" alt="" /></Carousel.Slide>\n  <Carousel.Slide><img src="/2.jpg" alt="" /></Carousel.Slide>\n</Carousel>',
    },
  ],
  usage: [
    'Cada slide va en un <Carousel.Slide>. El track se desplaza vía --sk-carousel-index (lo pone el skin).',
    'loop hace circular los extremos; sin loop, prev/next se deshabilitan en los bordes.',
    'Para imágenes con proporción fija, combiná con AspectRatio adentro de cada slide.',
  ],
  a11y: ['role=region + slides role=group con aria-label "n de total"; los puntos son role=tab.'],
}
