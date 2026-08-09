import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <DynamicForm>. Actualizar SIEMPRE que cambie DynamicForm.tsx / types.ts. */
export const dynamicFormSpec: ComponentSpec = {
  name: 'DynamicForm',
  dataSk: 'dynamic-form',
  category: 'Formulario',
  description:
    'Formulario generado desde un JSON, sobre react-hook-form + Zod. Autónomo (crea el useForm y el schema Zod por dentro) o con un form externo. Validación DINÁMICA con Zod (reglas condicionales con `when`, campos ocultos no se validan), mostrar/ocultar y habilitar/deshabilitar por condición (valores internos o externos), subformularios (object), listas (array) y grilla configurable. Se importa desde el subpath `skinkit/form` (arrastra react-hook-form/zod, que son peerDependencies opcionales); el core `skinkit` sigue cero-deps.',
  extends: "Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'>",
  props: [
    { name: 'schema', type: 'FormConfig', required: true, description: 'Config del form: { fields, cols?, gap? }. Cada field: name, type, label, options, colSpan, validation, visibleWhen, disabled, fields (object), itemFields (array).' },
    { name: 'onSubmit', type: '(values) => void | Promise', required: false, description: 'Se llama con los valores validados al enviar.' },
    { name: 'defaultValues', type: 'Record<string, unknown>', required: false, description: 'Valores iniciales (además de los defaultValue de cada campo).' },
    { name: 'externalValues', type: 'Record<string, unknown>', required: false, description: 'Contexto externo para condiciones (`{ external: "plan" }`): plan, rol, feature flags, etc.' },
    { name: 'form', type: 'UseFormReturn', required: false, description: 'Instancia externa de react-hook-form. Si se omite, el DynamicForm crea la suya.' },
    { name: 'submitLabel', type: 'ReactNode', required: false, default: "'Enviar'", description: 'Texto del botón de envío. null oculta la barra de acciones.' },
    { name: 'actions', type: 'ReactNode', required: false, description: 'Contenido extra en la barra de acciones (ej. un botón Cancelar).' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=dynamic-form] (un <form>).' },
    { name: 'fields', description: '[data-part=fields]: la grilla (Grid) que contiene los campos.' },
    { name: 'field', description: '[data-part=field]: wrapper de campos sin error/helper propio (checkbox/switch/radio); [data-part=field-label] y [data-part=field-error] adentro.' },
    { name: 'array', description: '[data-part=array] (Fieldset) con [data-part=array-item] por item y [data-part=array-item-actions].' },
    { name: 'actions', description: '[data-part=actions]: barra con el botón de envío (usa <Button>).' },
  ],
  examples: [
    {
      title: 'Form con validación, condicional y grilla',
      code: "import { DynamicForm } from 'skinkit/form'\n\nconst schema = {\n  cols: { base: 1, md: 2 },\n  gap: 4,\n  fields: [\n    { name: 'name', type: 'text', label: 'Nombre', validation: [{ type: 'required' }] },\n    { name: 'email', type: 'email', label: 'Email', validation: [{ type: 'required' }, { type: 'email' }] },\n    { name: 'wantsNewsletter', type: 'switch', label: '¿Newsletter?' },\n    // aparece sólo si el switch está prendido, y ahí es obligatorio\n    { name: 'frequency', type: 'select', label: 'Frecuencia', options: [{ value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensual' }],\n      visibleWhen: { field: 'wantsNewsletter', truthy: true },\n      validation: [{ type: 'required', when: { field: 'wantsNewsletter', truthy: true } }] },\n  ],\n}\n\n<DynamicForm schema={schema} onSubmit={(v) => console.log(v)} />",
    },
    {
      title: 'Subformulario (object) y lista (array)',
      code: "const schema = {\n  fields: [\n    { name: 'address', type: 'object', label: 'Dirección', fields: [\n      { name: 'street', type: 'text', label: 'Calle' },\n      { name: 'city', type: 'text', label: 'Ciudad' },\n    ]},\n    { name: 'phones', type: 'array', label: 'Teléfonos', addLabel: 'Agregar teléfono', itemFields: [\n      { name: 'number', type: 'text', label: 'Número' },\n    ]},\n  ],\n}",
    },
  ],
  usage: [
    "Importalo SIEMPRE desde 'skinkit/form' (no desde 'skinkit'); requiere react-hook-form, zod y @hookform/resolvers instalados.",
    'La validación va en `validation` (se compila a Zod). Poné `when` en una regla para que sea condicional (ej. required sólo si otro campo tiene cierto valor).',
    'Mostrar/ocultar con `visibleWhen`; los campos ocultos no se validan. Deshabilitar con `disabled` (boolean o condición).',
    'Referí valores internos con `{ field: "path" }` (con punto para anidados) y externos con `{ external: "key" }` (prop externalValues).',
    'La grilla es la del componente Grid: `cols` responsive en el schema y `colSpan` por campo. object/array ocupan la fila completa por defecto.',
  ],
  a11y: [
    'Reusa los componentes de campo de skinkit (labels, aria-invalid, etc.). Los subformularios usan <Fieldset>/<legend> nativo, con disabled en cascada.',
  ],
}
