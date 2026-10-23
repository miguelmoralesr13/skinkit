import type { ComponentSpec } from '../../catalog/types'

/** Fuente de la verdad de <TourProvider> + useTour(). Actualizar SIEMPRE que cambie Tour.tsx,
 * useTourEngine.ts, positioning.ts o types.ts. */
export const tourSpec: ComponentSpec = {
  name: 'Tour',
  dataSk: 'tour',
  category: 'Overlay',
  description:
    'Walkthrough tipo spotlight, genérico y configurable por JSON: resalta un elemento por vez con un agujero en el fondo oscurecido + un tooltip. El JSON describe flujos hechos de pasos; un paso puede ser otro flujo reusable (subFlow, anidable), un flujo puede auto-arrancar al detectar que algo apareció en pantalla, y dos flujos nunca se solapan — el segundo se encola. Headless: la forma la da tour.css.',
  extends: '—',
  props: [
    { name: 'TourProvider.config', type: 'TourConfig', required: true, description: 'La definición completa: { flows: TourFlowDef[] }. Se valida al montar (ids duplicados, subFlow colgante, ciclos) — lanza con un mensaje "skinkit: <TourProvider> — ..." si el JSON está mal formado.' },
    { name: 'TourProvider.classNames', type: 'TourClassNames', required: false, description: 'Clases adicionales por data-part del overlay/tooltip: backdrop, spotlight, header, title, close, body, footer, prev, next. No reemplaza la clase base (sk-tour__<parte>).' },
    { name: 'TourFlowDef.id', type: 'string', required: true, description: 'Id único del flujo — con esto se llama a start(id) o se referencia desde un subFlow.' },
    { name: 'TourFlowDef.entries', type: 'TourFlowEntry[]', required: true, description: 'Lista ordenada de pasos. Cada entrada es un TourStepDef o { subFlow: "otroFlowId" } — al llegar a un subFlow, el motor entra en ese flujo y vuelve al terminar, como una llamada a función.' },
    { name: 'TourFlowDef.trigger', type: "{ type: 'elementVisible'; target: string } | { type: 'manual' }", required: false, default: "{ type: 'manual' }", description: 'elementVisible arranca el flujo solo, la primera vez que `target` aparece y es visible en pantalla (útil para onboarding de una sección que se monta después, ej. tras cargar datos). manual = solo por start(id).' },
    { name: 'TourStepDef.id', type: 'string', required: true, description: 'Id del paso dentro de su flujo (no necesita ser único entre flujos distintos).' },
    { name: 'TourStepDef.target', type: 'string', required: false, description: 'Selector CSS del elemento a resaltar. Si no existe todavía, el paso espera hasta waitTimeout antes de saltarse solo (no congela el tour) o, con ifMissing "show", se muestra suelto. Sin target el paso es «suelto»: sin agujero, la tarjeta centrada y sin atenuar la pantalla (salvo dim: true).' },
    { name: 'TourStepDef.title', type: 'string', required: false, description: 'Título del tooltip.' },
    { name: 'TourStepDef.body', type: 'string', required: false, description: 'Texto del tooltip.' },
    { name: 'TourStepDef.placement', type: "'top' | 'bottom' | 'left' | 'right' | 'auto' | 'center' | 'none'", required: false, default: "'auto' (con target) · 'center' (sin target)", description: 'Lado preferido del tooltip respecto al target. Si no entra en el viewport, se prueba el resto en un orden fijo. "center" lo centra en la pantalla; "none" no lo posiciona (queda position: fixed sin coordenadas: lo ubica quien consume con TourStepDef.className).' },
    { name: 'TourStepDef.ifMissing', type: "'skip' | 'show'", required: false, default: "'skip'", description: 'Qué hacer si target no aparece en waitTimeout: "skip" salta el paso; "show" lo muestra como paso suelto (sin agujero) y renderStep recibe targetFound: false, para explicar por qué falta el elemento.' },
    { name: 'TourStepDef.dim', type: 'boolean', required: false, default: 'true con target · false sin target', description: 'Atenuar el resto de la pantalla. false con target deja la pantalla sin velo (el tooltip se ancla igual); true sin target atenúa todo.' },
    { name: 'TourStepDef.advanceOn', type: "'targetClick'", required: false, description: '"targetClick": tocar el elemento señalado avanza al paso siguiente; el toque llega igual al elemento real.' },
    { name: 'TourStepDef.className', type: 'string', required: false, description: 'Clase extra de la tarjeta de este paso.' },
    { name: 'TourStepDef.data', type: 'Record<string, unknown>', required: false, description: 'Datos propios del paso (serializables), para leerlos en renderStep.' },
    { name: 'TourProvider.renderStep', type: '(ctx: TourStepRenderContext) => ReactNode', required: false, description: 'Dibuja por dentro la tarjeta de cada paso (mascota, barra de progreso, botones propios). ctx: { step, flowId, targetFound, canGoPrev, next, prev, skip }. Sin él, se dibuja el contenido de siempre (título, cuerpo, Atrás/Siguiente).' },
    { name: 'TourProvider.onStepChange', type: '(active: TourActiveStep | null) => void', required: false, description: 'Se llama cada vez que cambia el paso mostrado, y con null al terminar o saltar: para guardar dónde va la persona y retomar con start(id, { from }).' },
    { name: 'TourProvider.dismissOnBackdrop', type: 'boolean', required: false, default: 'true', description: 'false: tocar el fondo atenuado no cierra el tour.' },
    { name: 'TourProvider.dismissOnEscape', type: 'boolean', required: false, default: 'true', description: 'false: Esc no cierra el tour.' },
    { name: 'TourStepDef.spotlightPadding', type: 'number', required: false, default: '8', description: 'Px de aire entre el borde del target y el agujero del spotlight.' },
    { name: 'TourStepDef.waitTimeout', type: 'number', required: false, default: '3500', description: 'ms que espera a que `target` aparezca en el DOM y sea visible antes de saltarse el paso (console.warn en dev).' },
    { name: 'useTour().start', type: '(flowId: string, opts?: { from?: string }) => void', required: false, description: 'Arranca un flujo por id; con { from: stepId } empieza en ese paso (retomar). Si ya hay uno activo en la raíz con ese mismo id, no hace nada (evita duplicar por un trigger que dispara varias veces). Si hay OTRO flujo activo, éste se encola y arranca cuando el activo termine o se salte.' },
    { name: 'useTour().next', type: '() => void', required: false, description: 'Avanza un paso. Si el paso actual era el último del flujo (o sub-flujo) activo, vuelve al padre; si no queda ningún padre, el tour termina y se drena la cola.' },
    { name: 'useTour().prev', type: '() => void', required: false, description: 'Retrocede un paso DENTRO del flujo/sub-flujo actual. No cruza hacia atrás un sub-flujo ya terminado (ninguna librería de tours mainstream lo hace; es confuso). No-op en el primer paso.' },
    { name: 'useTour().skip', type: '() => void', required: false, description: 'Cierra el flujo activo (el "×" del usuario). La cola sigue su curso normal — un tour encolado igual arranca después.' },
    { name: 'useTour().stop', type: '() => void', required: false, description: 'Reset total: activo + cola. Para logout/cambio de ruta, no para el botón de cierre del usuario (para eso, skip()).' },
    { name: 'useTour().canGoPrev', type: 'boolean', required: false, description: 'false en el primer paso del flujo/sub-flujo actual — para deshabilitar el botón "Atrás".' },
    { name: 'useTour().activeStep', type: '{ flowId: string; step: TourStepDef } | null', required: false, description: 'El paso mostrándose ahora mismo (o null si no hay tour activo). flowId es el del flujo/sub-flujo real que lo contiene, no necesariamente el que se llamó con start().' },
    { name: 'useTour().isActive', type: 'boolean', required: false, description: 'true mientras hay algún flujo (o sub-flujo anidado) activo.' },
  ],
  parts: [
    { name: 'root', description: '[data-sk=tour-overlay] — wrapper fixed inset-0 del portal (a document.body), contiene el backdrop + el spotlight + el tooltip del paso activo. No se renderiza nada si no hay tour activo o el target del paso aún no apareció.' },
    { name: 'backdrop', description: '[data-part=backdrop] — 4 divs que cubren TODO el viewport salvo el agujero (arriba/abajo/izquierda/derecha del target). Clickeables: cierran el tour (skip()) como el overlay de un Dialog.' },
    { name: 'spotlight', description: '[data-part=spotlight] — anillo decorativo alrededor del agujero (target + spotlightPadding). pointer-events:none — el elemento resaltado real sigue siendo clickeable, no está tapado por nada.' },
    { name: 'tour', description: '[data-sk=tour] — la tarjeta con el contenido del paso (coincide con el dataSk del catálogo, igual que [data-sk=toast] en Toast, a diferencia del wrapper del portal [data-sk=tour-overlay]). Lleva [data-placement] con el lado REAL usado (puede diferir de TourStepDef.placement si tuvo que voltearse por falta de espacio).' },
    { name: 'header', description: 'Fila título + botón de cerrar.' },
    { name: 'title', description: 'TourStepDef.title.' },
    { name: 'close', description: 'Botón "×" — equivale a skip().' },
    { name: 'body', description: 'TourStepDef.body.' },
    { name: 'footer', description: 'Fila con los botones Atrás/Siguiente.' },
    { name: 'prev', description: 'Botón "Atrás" — disabled cuando !canGoPrev.' },
    { name: 'next', description: 'Botón "Siguiente" — equivale a next().' },
  ],
  examples: [
    {
      title: 'Flujo simple, arranque manual',
      code: `const config: TourConfig = {
  flows: [{
    id: 'onboarding',
    entries: [
      { id: 'paso-1', target: '#crear-proyecto', title: 'Crear proyecto', body: 'Empezá acá.' },
      { id: 'paso-2', target: '#invitar', title: 'Invitá a tu equipo', placement: 'left' },
    ],
  }],
}

<TourProvider config={config}>
  <App />
</TourProvider>

// en cualquier componente dentro del provider:
const { start } = useTour()
<Button onClick={() => start('onboarding')}>Ver tour</Button>`,
    },
    {
      title: 'Sub-flujo reusado desde dos flujos padre',
      code: `const config: TourConfig = {
  flows: [
    // 'explicar-filtros' NO se arranca directo con start() — vive como paso reusable
    { id: 'explicar-filtros', entries: [
      { id: 'f1', target: '.filtros', title: 'Filtros', body: 'Filtrá por estado o fecha.' },
    ] },
    { id: 'onboarding-tabla', entries: [
      { id: 't1', target: '.tabla', title: 'Tu tabla' },
      { subFlow: 'explicar-filtros' },   // ← se anida acá y vuelve solo al terminar
      { id: 't2', target: '.exportar', title: 'Exportar' },
    ] },
    { id: 'onboarding-dashboard', entries: [
      { id: 'd1', target: '.grafico', title: 'Tu gráfico' },
      { subFlow: 'explicar-filtros' },   // ← el MISMO sub-flujo, reusado acá también
    ] },
  ],
}`,
    },
    {
      title: 'Auto-arranque al aparecer un elemento',
      code: `const config: TourConfig = {
  flows: [{
    id: 'nueva-seccion',
    trigger: { type: 'elementVisible', target: '.panel-nuevo' },
    entries: [{ id: 'p1', target: '.panel-nuevo', title: '¡Nuevo!', body: 'Ahora podés hacer esto.' }],
  }],
}
// Se dispara solo la primera vez que .panel-nuevo se monta Y entra en viewport — no hace falta
// llamar a start(). Si otro flujo ya está activo en ese momento, éste se encola (no se solapan).`,
    },
  ],
  usage: [
    'Envolvé la app (o la sección relevante) en <TourProvider config={...}> UNA vez; useTour() lee de él, igual que useToast()/ToastProvider.',
    'Un subFlow es una lista de entries reusable: cualquier flujo puede referenciarlo por id desde cualquier punto de sus propios entries, y varios flujos pueden reusar el mismo subFlow — se valida que no haya ciclos (directos ni indirectos) al montar el provider.',
    'Dos tours nunca se muestran a la vez: start() de un flujo mientras otro está activo lo ENCOLA, no lo cancela ni lo interrumpe.',
    'trigger: elementVisible es ideal para señalar algo que aparece después de una acción del usuario (nuevo panel, dato recién cargado) sin tener que orquestar manualmente cuándo llamar a start().',
    'target roto o que nunca aparece no rompe el tour: ese paso se salta solo tras waitTimeout con un console.warn en dev.',
    'Un paso sin target (o con ifMissing: "show") sirve para explicar, esperar algo que hace la persona (tu código llama next() cuando ocurre) o decir por qué falta un botón; combínalo con renderStep y placement "none" + className para una tira propia.',
    'No uses Tour para contenido crítico que el usuario DEBE confirmar — para eso está Dialog/AlertDialog. Tour es guía opcional, siempre descartable con skip().',
    'i18n: los textos por defecto (aria-labels, placeholders, botones) salen del diccionario `tour` del `locale` del SkinkitProvider (es/en incluidos); se pisan con `<SkinkitProvider messages={{ tour: { … } }}>` o con la prop explícita del componente, que siempre gana.',
  ],
  a11y: [
    'El tooltip es role="dialog" aria-modal="true", con aria-labelledby apuntando al título cuando hay uno.',
    'Escape cierra el tour activo (equivale a skip()), igual que en Dialog.',
    'Si un paso no atenúa la pantalla (dim: false) el tooltip no lleva aria-modal: la persona sigue usando la página mientras lo lee.',
    'El elemento resaltado NO pierde interactividad — el anillo del spotlight es pointer-events:none, así un paso puede pedirle al usuario que interactúe con el target real.',
  ],
}
