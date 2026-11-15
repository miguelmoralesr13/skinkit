import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <Field>. Actualizar SIEMPRE que cambie Field.tsx. */
export const fieldSpec: ComponentSpec = {
  name: 'Field',
  dataSk: 'field',
  category: 'Formulario',
  description:
    'Envoltorio de campo con label + control + helper/error, para dar markup y accesibilidad consistentes a CUALQUIER control — incluidos los que no traen label/error propios (Slider) o widgets a medida. No estila; la forma la da el CSS.',
  extends: 'HTMLAttributes<HTMLDivElement>',
  props: [
    { name: 'label', type: 'ReactNode', required: false, description: 'Etiqueta del campo.' },
    { name: 'helper', type: 'ReactNode', required: false, description: 'Texto de ayuda bajo el control.' },
    { name: 'error', type: 'string', required: false, description: 'Mensaje de error; marca [data-error] y reemplaza al helper.' },
    { name: 'required', type: 'boolean', required: false, description: 'Muestra la marca * en la etiqueta.' },
    { name: 'htmlFor', type: 'string', required: false, description: 'id del control interno, para el <label htmlFor>.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'El control (Input, Slider, un widget propio, etc.).' },
    { name: 'associateLabel', type: 'boolean', required: false, default: 'false', description: 'Opt-in. Asocia la etiqueta con el control: genera un id y se lo pasa al único hijo (o usa el id que ya traiga, o `htmlFor`) y cablea `<label htmlFor>`; así el control tiene nombre accesible (lectores de pantalla, getByLabel). Sin efecto si el hijo no es un elemento único. Sin la prop, el marcado no cambia.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=field]. Lleva [data-error] cuando hay error.' },
    { name: 'label', description: '[data-part=label] (<label htmlFor>); [data-part=required] es la marca *.' },
    { name: 'control', description: '[data-part=control]: envuelve al children.' },
    { name: 'helper', description: '[data-part=helper]: texto de ayuda.' },
    { name: 'error', description: '[data-part=error] (role=alert): mensaje de error.' },
  ],
  examples: [
    {
      title: 'Envolver un Slider (que no trae error)',
      code: '<Field label="Volumen" htmlFor="vol" helper="0 a 100" error={touched ? "Requerido" : undefined}>\n  <Slider id="vol" min={0} max={100} />\n</Field>',
    },
  ],
  usage: [
    'Usalo para dar label/helper/error uniformes a un control que no los tiene, o a uno propio.',
    'Para Input/Select/Textarea (que ya traen label/helper/error), no hace falta Field: usá sus props.',
    'Pasá htmlFor igual al id del control para asociar la etiqueta.',
    'Para que el control quede nombrado por la etiqueta sin repetir `aria-label`, pasa `associateLabel` (el hijo debe aceptar `id`: Input, Slider, Select, Textarea…).',
  ],
}
