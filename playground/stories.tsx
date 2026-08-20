import { useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Bell, Check, Compass, Folder, Home, Mail, Search, SearchX, Settings, User } from 'lucide-react'
import {
  Button,
  ButtonGroup,
  Toggle,
  Toolbar,
  SplitButton,
  CopyButton,
  CommandMenu,
  List,
  Marquee,
  Highlight,
  Carousel,
  Tree,
  Calendar,
  VisuallyHidden,
  Card,
  Input,
  Textarea,
  SegmentedControl,
  NumberInput,
  AvatarGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Select,
  Slider,
  Rating,
  FileUpload,
  PasswordInput,
  PinInput,
  TimePicker,
  ColorSwatch,
  RadioCardGroup,
  RadioCard,
  Fieldset,
  RadialProgress,
  ScrollArea,
  TagInput,
  Combobox,
  MultiSelect,
  Editable,
  HoverCard,
  AnimatedNumber,
  Blockquote,
  Sparkline,
  QRCode,
  Resizable,
  Countdown,
  DatePicker,
  RangeCalendar,
  DateRangePicker,
  Banner,
  DescriptionList,
  Code,
  Meter,
  AspectRatio,
  Badge,
  Avatar,
  Separator,
  Spinner,
  Progress,
  Skeleton,
  Stat,
  EmptyState,
  Timeline,
  Tag,
  Kbd,
  Tabs,
  Breadcrumb,
  Pagination,
  Disclosure,
  Stepper,
  Menu,
  Popover,
  Tooltip,
  Alert,
  Dialog,
  ConfirmDialog,
  AlertDialog,
  PromptDialog,
  ToastProvider,
  useToast,
  Accordion,
  ComparisonSlider,
  Menubar,
  BackTop,
  Prose,
  DataTable,
  Grid,
  Stack,
  Container,
  Spacer,
  Field,
  InputGroup,
  Image,
  Popconfirm,
  Topbar,
  Sidebar,
  BottomNav,
  AppShell,
  VideoPlayer,
  AudioPlayer,
  FilePreviewer,
  TourProvider,
  useTour,
} from '../src'
import type { ColumnDef, SortState, TourConfig } from '../src'
import { useForm } from 'react-hook-form'
import { DynamicForm } from '../src/components/DynamicForm'
import type { FormConfig, FormValues } from '../src/components/DynamicForm'
import { RichTextEditor } from '../src/components/RichTextEditor'
import { officeRenderers } from '../src/components/FilePreviewer/office'

export interface Story {
  name: string
  render: () => ReactNode
}
export interface StoryGroup {
  /** Debe coincidir con ComponentSpec.name para enlazar los docs del catálogo. */
  component: string
  stories: Story[]
}

/** Ícono inline mínimo (sin dependencias) para las historias con ícono. */
const Dot = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="6" />
  </svg>
)

/** Demos interactivos (necesitan estado → son componentes, no funciones sueltas). */
function DialogDemo() {
  const [basic, setBasic] = useState(false)
  const [full, setFull] = useState(false)
  return (
    <div className="sb-row">
      <Button onClick={() => setBasic(true)}>Header + Footer</Button>
      <Button variant="outlined" onClick={() => setFull(true)}>
        Fullscreen
      </Button>

      <Dialog open={basic} onClose={() => setBasic(false)}>
        <Dialog.Header>
          <Dialog.Title>Editar perfil</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          Un modal con cabecera, cuerpo y pie. Probá Tab (el foco queda atrapado) y Esc para
          cerrar. El scroll del fondo está bloqueado.
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outlined" onClick={() => setBasic(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setBasic(false)}>Guardar</Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog open={full} onClose={() => setFull(false)} size="full">
        <Dialog.Header>
          <Dialog.Title>Pantalla completa</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>size="full" ocupa toda la pantalla — para flujos inmersivos.</Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setFull(false)}>Listo</Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  )
}

function ConfirmDemo() {
  const [danger, setDanger] = useState(false)
  const [primary, setPrimary] = useState(false)
  return (
    <div className="sb-row">
      <Button variant="ghost" onClick={() => setPrimary(true)}>
        Confirmar (primary)
      </Button>
      <Button variant="ghost" onClick={() => setDanger(true)}>
        Eliminar (danger)
      </Button>

      <ConfirmDialog
        open={primary}
        onClose={() => setPrimary(false)}
        onConfirm={() => setPrimary(false)}
        title="¿Publicar los cambios?"
        description="Se harán visibles para todo el equipo."
        confirmText="Publicar"
      />
      <ConfirmDialog
        open={danger}
        onClose={() => setDanger(false)}
        onConfirm={() => setDanger(false)}
        tone="danger"
        title="¿Eliminar proyecto?"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  )
}

function ToastButtons() {
  const { toast } = useToast()
  return (
    <div className="sb-row">
      <Button
        onClick={() => toast({ title: 'Guardado', description: 'Tus cambios se guardaron.', variant: 'primary' })}
      >
        Primary
      </Button>
      <Button variant="outlined" onClick={() => toast({ title: 'Aviso', description: 'Un mensaje neutro.' })}>
        Neutral
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast({ title: 'Error', description: 'No se pudo cargar.', variant: 'danger', duration: 0 })}
      >
        Danger (persistente)
      </Button>
    </div>
  )
}

function ToastDemo() {
  return (
    <ToastProvider position="bottom-right">
      <ToastButtons />
    </ToastProvider>
  )
}

const TOUR_DEMO_CONFIG: TourConfig = {
  flows: [
    {
      // Sub-flujo reusado: no se arranca directo con start(), solo vive referenciado desde
      // 'onboarding-tabla' y 'onboarding-panel' — ver ambos entries más abajo.
      id: 'explicar-filtros',
      entries: [
        {
          id: 'f1',
          target: '[data-tour-target="filtros"]',
          title: 'Filtros',
          body: 'Filtrá por estado o fecha — este paso vive en un sub-flujo, reusado por dos tours distintos.',
        },
      ],
    },
    {
      id: 'onboarding-tabla',
      entries: [
        { id: 't1', target: '[data-tour-target="tabla"]', title: 'Tu tabla', body: 'Acá ves tus datos.' },
        { subFlow: 'explicar-filtros' },
        { id: 't2', target: '[data-tour-target="exportar"]', title: 'Exportar', placement: 'left' },
      ],
    },
    {
      id: 'onboarding-panel',
      // Arranca solo la primera vez que el panel aparece en pantalla — sin llamar a start().
      trigger: { type: 'elementVisible', target: '[data-tour-target="panel-nuevo"]' },
      entries: [
        {
          id: 'p1',
          target: '[data-tour-target="panel-nuevo"]',
          title: '¡Nuevo panel!',
          body: 'Este tour arranca solo al aparecer el panel. Si otro tour ya está activo, éste se encola y no se solapan.',
        },
        { subFlow: 'explicar-filtros' },
      ],
    },
  ],
}

function TourPlayground() {
  const { start } = useTour()
  const [showPanel, setShowPanel] = useState(false)
  const boxStyle: CSSProperties = {
    padding: '0.75rem',
    border: '1px dashed var(--color-sk-border)',
    borderRadius: 8,
  }
  return (
    <div className="sb-col" style={{ gap: '0.75rem' }}>
      <div className="sb-row">
        <Button onClick={() => start('onboarding-tabla')}>Iniciar tour tabla</Button>
        <Button variant="outlined" onClick={() => setShowPanel(true)}>
          Mostrar panel nuevo (auto-arranca su tour, se encola si hay uno activo)
        </Button>
      </div>
      <div data-tour-target="tabla" style={boxStyle}>
        Tabla
      </div>
      <div data-tour-target="filtros" style={boxStyle}>
        Filtros
      </div>
      <div data-tour-target="exportar" style={boxStyle}>
        Exportar
      </div>
      {showPanel && (
        <div data-tour-target="panel-nuevo" style={boxStyle}>
          Panel nuevo
        </div>
      )}
    </div>
  )
}

function TourDemo() {
  return (
    <TourProvider config={TOUR_DEMO_CONFIG}>
      <TourPlayground />
    </TourProvider>
  )
}

function DrawerDemo() {
  const [side, setSide] = useState<'left' | 'right' | 'bottom' | null>(null)
  return (
    <div className="sb-row">
      <Button variant="outlined" onClick={() => setSide('left')}>
        Izquierda
      </Button>
      <Button variant="outlined" onClick={() => setSide('right')}>
        Derecha
      </Button>
      <Button variant="outlined" onClick={() => setSide('bottom')}>
        Abajo
      </Button>
      <Dialog open={side !== null} onClose={() => setSide(null)} placement={side ?? 'right'}>
        <Dialog.Header>
          <Dialog.Title>Drawer: {side}</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          El mismo <code>Dialog</code> con <code>placement="{side}"</code>. Mismo comportamiento
          (foco atrapado, Esc), otra anatomía por CSS.
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setSide(null)}>Cerrar</Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  )
}

function AlertDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="sb-row">
      <Button onClick={() => setOpen(true)}>Mostrar aviso</Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Sesión expirada"
        description="Volvé a iniciar sesión para continuar."
      />
    </div>
  )
}

function FileUploadDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <FileUpload
        label="Fotos"
        accept="image/*"
        multiple
        preview
        helper="Arrastrá imágenes o hacé click. Se muestran las miniaturas."
      />
    </div>
  )
}

function CalendarDemo() {
  const [fecha, setFecha] = useState('2026-08-07')
  return (
    <div className="sb-col">
      <Calendar value={fecha} onChange={setFecha} weekStartsOn={1} />
      <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Elegida: {fecha}</span>
    </div>
  )
}

function DatePickerDemo() {
  const [fecha, setFecha] = useState('')
  return (
    <div style={{ width: '100%', maxWidth: 260 }}>
      <DatePicker
        label="Fecha de inicio"
        value={fecha}
        onChange={setFecha}
        weekStartsOn={1}
        helper={fecha ? `ISO: ${fecha}` : 'Hacé click para abrir el calendario.'}
      />
    </div>
  )
}

function RangeCalendarDemo() {
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: '2026-08-05',
    end: '2026-08-14',
  })
  return (
    <div className="sb-col">
      <RangeCalendar value={range} onChange={setRange} weekStartsOn={1} />
      <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
        {range.start ?? '—'} → {range.end ?? '…'}
      </span>
    </div>
  )
}

function DateRangePickerDemo() {
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  })
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <DateRangePicker
        label="Período"
        value={range}
        onChange={setRange}
        weekStartsOn={1}
        helper="Elegí inicio y fin; se cierra al completar."
      />
    </div>
  )
}

function CommandMenuDemo() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState('—')
  const items = [
    { id: 'new', label: 'Nuevo proyecto', group: 'Acciones', shortcut: '⌘N', onSelect: () => setLast('Nuevo proyecto') },
    { id: 'dup', label: 'Duplicar', group: 'Acciones', onSelect: () => setLast('Duplicar') },
    { id: 'settings', label: 'Ajustes', group: 'Ir a', shortcut: '⌘,', onSelect: () => setLast('Ajustes') },
    { id: 'docs', label: 'Documentación', group: 'Ir a', keywords: 'ayuda help', onSelect: () => setLast('Documentación') },
    { id: 'theme', label: 'Cambiar theme', group: 'Ir a', onSelect: () => setLast('Cambiar theme') },
  ]
  return (
    <div className="sb-col">
      <Button onClick={() => setOpen(true)}>Abrir paleta (⌘K)</Button>
      <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Último comando: {last}</span>
      <CommandMenu open={open} onOpenChange={setOpen} items={items} />
    </div>
  )
}

function ListDemo() {
  const [active, setActive] = useState('cuenta')
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <List>
        <List.Item title="Cuenta" description="Perfil y seguridad" active={active === 'cuenta'} onSelect={() => setActive('cuenta')} />
        <List.Item title="Notificaciones" description="Emails y push" meta="3" active={active === 'notif'} onSelect={() => setActive('notif')} />
        <List.Item title="Facturación" description="Plan y pagos" active={active === 'pago'} onSelect={() => setActive('pago')} />
      </List>
    </div>
  )
}

function RadioCardDemo() {
  const [plan, setPlan] = useState('pro')
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <RadioCardGroup value={plan} onValueChange={setPlan} label="Plan">
        <RadioCard value="free" title="Free" description="Para empezar. 1 proyecto." />
        <RadioCard value="pro" title="Pro" description="$9/mes. Proyectos ilimitados." />
        <RadioCard value="team" title="Team" description="$29/mes. Colaboración en equipo." />
      </RadioCardGroup>
    </div>
  )
}

function PinInputDemo() {
  const [code, setCode] = useState('')
  return (
    <div className="sb-col">
      <PinInput
        length={6}
        value={code}
        onChange={setCode}
        label="Código de verificación"
        helper={
          code.length === 6 ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Check size={14} /> Completo
            </span>
          ) : (
            `${code.length}/6 — pegá o tipeá`
          )
        }
      />
    </div>
  )
}

function ColorSwatchDemo() {
  const colors = ['#2f6df6', '#e0245e', '#17bf63', '#f45d22', '#794bc4', '#111827']
  const [sel, setSel] = useState(colors[0])
  return (
    <div className="sb-row">
      {colors.map((c) => (
        <ColorSwatch key={c} color={c} selected={c === sel} onClick={() => setSel(c)} aria-label={c} />
      ))}
    </div>
  )
}

function CountdownDemo() {
  const [target] = useState(() => Date.now() + 2 * 86400_000 + 3 * 3600_000 + 12 * 60_000)
  return <Countdown to={target} hideDaysWhenZero />
}

function BackTopDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    // wrapper relativo que NO scrollea: el botón absolute se ancla acá y queda fijo en la esquina
    <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
      <div
        ref={ref}
        style={{
          height: 200,
          overflow: 'auto',
          border: '1px solid var(--sk-border)',
          borderRadius: 8,
          padding: '0.75rem',
        }}
      >
        <p style={{ margin: 0, color: 'var(--sk-text-muted)' }}>Scrolleá dentro de este panel ↓</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '0.75rem 0' }}>
            Línea {i + 1}
          </p>
        ))}
      </div>
      {/* hermano del panel scrolleable: target scopa el scroll, absolute lo fija a la esquina */}
      <BackTop target={ref} threshold={80} style={{ position: 'absolute' }} />
    </div>
  )
}

interface DemoUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  age: number
}

const DEMO_ROLES = ['Admin', 'Editor', 'Viewer']
const DEMO_USERS: DemoUser[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
  email: `user${i + 1}@demo.io`,
  role: DEMO_ROLES[i % 3],
  status: i % 4 === 0 ? 'Inactivo' : 'Activo',
  age: 20 + ((i * 7) % 40),
}))


const DEMO_COLUMNS: ColumnDef<DemoUser>[] = [
  { key: 'name', header: 'Nombre', sortable: true, cardRole: 'title' },
  { key: 'email', header: 'Email', cardRole: 'subtitle' },
  { key: 'role', header: 'Rol', sortable: true },
  { key: 'status', header: 'Estado', sortable: true },
  { key: 'age', header: 'Edad', sortable: true, align: 'end' },
]

// Kitchen-sink: selección + filtro + paginado + toggle + acciones + sticky
function DataTableDemo() {
  const [data, setData] = useState<DemoUser[]>(DEMO_USERS)
  return (
    <div style={{ width: '100%' }}>
      <DataTable
        data={data}
        columns={DEMO_COLUMNS}
        rowKey={(u) => u.id}
        selection="multiple"
        filterable
        pagination="client"
        pageSize={8}
        allowViewToggle
        stickyHeader
        caption="Usuarios del proyecto"
        rowActions={(u) => (
          <Button type="button" variant="ghost" size="sm" onClick={() => setData((d) => d.filter((x) => x.id !== u.id))}>
            Borrar
          </Button>
        )}
        bulkActions={(rows) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const ids = new Set(rows.map((r) => r.id))
              setData((d) => d.filter((x) => !ids.has(x.id)))
            }}
          >
            Borrar sel.
          </Button>
        )}
      />
    </div>
  )
}

// Virtualizada: 10.000 filas cargadas de una, el DOM solo renderiza las visibles (+ overscan).
const DEMO_BIG_USERS: DemoUser[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
  email: `user${i + 1}@demo.io`,
  role: DEMO_ROLES[i % 3],
  status: i % 4 === 0 ? 'Inactivo' : 'Activo',
  age: 20 + ((i * 7) % 40),
}))

function DataTableVirtualizedDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DataTable
        data={DEMO_BIG_USERS}
        columns={DEMO_COLUMNS}
        rowKey={(u) => u.id}
        pagination="none"
        view="table"
        virtualized
        rowHeight={44}
        height={420}
        caption={`${DEMO_BIG_USERS.length.toLocaleString('es')} filas — scrolleá para probar`}
      />
    </div>
  )
}

// Selección + acciones aisladas (sin filtro ni paginado)
function DataTableActionsDemo() {
  const [data, setData] = useState<DemoUser[]>(DEMO_USERS.slice(0, 6))
  return (
    <div style={{ width: '100%' }}>
      <DataTable
        data={data}
        columns={DEMO_COLUMNS}
        rowKey={(u) => u.id}
        selection="multiple"
        pagination="none"
        rowActions={(u) => (
          <Button type="button" variant="ghost" size="sm" onClick={() => setData((d) => d.filter((x) => x.id !== u.id))}>
            Borrar
          </Button>
        )}
        bulkActions={(rows) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const ids = new Set(rows.map((r) => r.id))
              setData((d) => d.filter((x) => !ids.has(x.id)))
            }}
          >
            Borrar {rows.length}
          </Button>
        )}
      />
    </div>
  )
}

// Orden + paginado del lado del SERVIDOR (mock: ordeno y corto acá)
function DataTableServerDemo() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState | null>(null)
  const pageSize = 8
  const sorted = useMemo(() => {
    if (!sort) return DEMO_USERS
    const dir = sort.dir === 'asc' ? 1 : -1
    const key = sort.key as keyof DemoUser
    return [...DEMO_USERS].sort(
      (a, b) => dir * String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }),
    )
  }, [sort])
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize)
  return (
    <div style={{ width: '100%' }}>
      <DataTable
        data={pageRows}
        columns={DEMO_COLUMNS}
        rowKey={(u) => u.id}
        pagination="server"
        page={page}
        pageSize={pageSize}
        total={DEMO_USERS.length}
        onPageChange={setPage}
        sort={sort}
        onSortChange={(s) => {
          setSort(s)
          setPage(1)
        }}
        caption="El backend ordena y pagina (mock)"
      />
    </div>
  )
}

// Scroll infinito (mock: agrego lotes con un pequeño delay)
function DataTableInfiniteDemo() {
  const [rows, setRows] = useState<DemoUser[]>(DEMO_USERS.slice(0, 6))
  const [loading, setLoading] = useState(false)
  const hasMore = rows.length < DEMO_USERS.length
  const loadMore = () => {
    if (loading || !hasMore) return
    setLoading(true)
    window.setTimeout(() => {
      setRows((r) => DEMO_USERS.slice(0, r.length + 6))
      setLoading(false)
    }, 600)
  }
  return (
    <div style={{ width: '100%' }}>
      <DataTable
        data={rows}
        columns={DEMO_COLUMNS}
        rowKey={(u) => u.id}
        pagination="infinite"
        hasMore={hasMore}
        loadingMore={loading}
        onLoadMore={loadMore}
      />
    </div>
  )
}

function EditableDemo() {
  const [name, setName] = useState('Proyecto skinkit')
  return (
    <div style={{ width: '100%', maxWidth: 300 }}>
      <Editable value={name} onChange={setName} label="Nombre del proyecto" placeholder="Sin título" />
    </div>
  )
}

function MultiSelectDemo() {
  const [stack, setStack] = useState<string[]>(['react', 'css'])
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'css', label: 'CSS' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'node', label: 'Node' },
  ]
  return (
    <div style={{ width: '100%', maxWidth: 340 }}>
      <MultiSelect
        label="Stack"
        placeholder="Agregá tecnologías…"
        options={options}
        value={stack}
        onValueChange={setStack}
        helper={`${stack.length} elegidas`}
      />
    </div>
  )
}

function AnimatedNumberDemo() {
  const [n, setN] = useState(1204)
  return (
    <div className="sb-row" style={{ alignItems: 'center' }}>
      <span style={{ fontSize: '2rem' }}>
        <AnimatedNumber value={n} />
      </span>
      <Button size="sm" variant="outlined" onClick={() => setN((v) => v + 337)}>
        +337
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setN(0)}>
        Reset
      </Button>
    </div>
  )
}

function ComboboxDemo() {
  const [pais, setPais] = useState('')
  const options = [
    { value: 'mx', label: 'México' },
    { value: 'ar', label: 'Argentina' },
    { value: 'co', label: 'Colombia' },
    { value: 'cl', label: 'Chile' },
    { value: 'pe', label: 'Perú' },
    { value: 'uy', label: 'Uruguay' },
    { value: 'es', label: 'España' },
  ]
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <Combobox
        label="País"
        placeholder="Buscá un país…"
        options={options}
        value={pais}
        onValueChange={setPais}
        helper={pais ? `Elegiste: ${pais}` : 'Escribí para filtrar.'}
      />
    </div>
  )
}

function SliderDemo() {
  const [vol, setVol] = useState(50)
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <Slider
        label="Volumen"
        min={0}
        max={100}
        value={vol}
        showValue
        onChange={(e) => setVol(Number(e.target.value))}
      />
    </div>
  )
}

function TagDemo() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'CSS', 'Headless'])
  return (
    <div className="sb-row">
      {tags.map((t) => (
        <Tag key={t} variant="primary" onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
      {tags.length === 0 ? <span style={{ opacity: 0.6 }}>Sin tags (recargá la story)</span> : null}
    </div>
  )
}

function PaginationDemo() {
  const [page, setPage] = useState(1)
  return <Pagination page={page} count={12} onPageChange={setPage} />
}

function RatingDemo() {
  const [score, setScore] = useState(3)
  return (
    <div className="sb-row" style={{ alignItems: 'center' }}>
      <Rating value={score} onChange={setScore} />
      <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{score} / 5</span>
    </div>
  )
}

function StepperDemo() {
  const [active, setActive] = useState(1)
  return (
    <div className="sb-col" style={{ width: '100%', maxWidth: 420 }}>
      <Stepper active={active}>
        <Stepper.Step label="Carrito" />
        <Stepper.Step label="Envío" />
        <Stepper.Step label="Pago" />
        <Stepper.Step label="Listo" />
      </Stepper>
      <div className="sb-row">
        <Button variant="outlined" size="sm" onClick={() => setActive((a) => Math.max(0, a - 1))}>
          Atrás
        </Button>
        <Button size="sm" onClick={() => setActive((a) => Math.min(3, a + 1))}>
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function PromptDemo() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('Proyecto sin título')
  return (
    <div className="sb-col">
      <Button onClick={() => setOpen(true)}>Renombrar…</Button>
      <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Actual: {name}</span>
      <PromptDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={(v) => {
          setName(v)
          setOpen(false)
        }}
        title="Renombrar proyecto"
        label="Nuevo nombre"
        defaultValue={name}
      />
    </div>
  )
}

const DYNAMIC_FORM_SCHEMA: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', placeholder: 'Tu nombre', validation: [{ type: 'required', message: 'Poné tu nombre' }] },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'vos@ejemplo.io', validation: [{ type: 'required' }, { type: 'email', message: 'Email inválido' }] },
    { name: 'role', type: 'select', label: 'Rol', options: [{ value: 'dev', label: 'Dev' }, { value: 'design', label: 'Diseño' }, { value: 'pm', label: 'PM' }] },
    { name: 'wantsNewsletter', type: 'switch', label: 'Suscribirme al newsletter' },
    // aparece sólo si el switch está prendido, y ahí se vuelve obligatorio (validación condicional)
    {
      name: 'frequency', type: 'radio', label: 'Frecuencia',
      options: [{ value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensual' }],
      visibleWhen: { field: 'wantsNewsletter', truthy: true },
      validation: [{ type: 'required', when: { field: 'wantsNewsletter', truthy: true }, message: 'Elegí una frecuencia' }],
    },
    // visibilidad + validación por valor EXTERNO (plan): sólo Pro ve y requiere asientos
    {
      name: 'seats', type: 'number', label: 'Asientos (solo Pro)', min: 1, max: 100,
      visibleWhen: { external: 'plan', eq: 'pro' },
      validation: [{ type: 'required', when: { external: 'plan', eq: 'pro' } }, { type: 'min', value: 1 }],
    },
    {
      name: 'address', type: 'object', label: 'Dirección', fields: [
        { name: 'street', type: 'text', label: 'Calle' },
        { name: 'city', type: 'text', label: 'Ciudad' },
      ],
    },
    {
      name: 'phones', type: 'array', label: 'Teléfonos', addLabel: 'Agregar teléfono', removeLabel: 'Quitar', itemFields: [
        { name: 'label', type: 'text', label: 'Etiqueta', placeholder: 'Casa / Trabajo' },
        { name: 'number', type: 'text', label: 'Número', validation: [{ type: 'required', message: 'Falta el número' }] },
      ],
    },
    { name: 'bio', type: 'textarea', label: 'Bio', rows: 3, colSpan: 12 },
    { name: 'accept', type: 'checkbox', label: 'Acepto los términos', validation: [{ type: 'required', message: 'Tenés que aceptar' }] },
  ],
}

function DynamicFormDemo() {
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <div style={{ marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9em' }}>
        <span style={{ color: 'var(--sk-text-muted)' }}>Plan externo:</span>
        <SegmentedControl value={plan} onValueChange={(v) => setPlan(v as 'free' | 'pro')}>
          <SegmentedControl.Item value="free">free</SegmentedControl.Item>
          <SegmentedControl.Item value="pro">pro</SegmentedControl.Item>
        </SegmentedControl>
      </div>
      <DynamicForm
        schema={DYNAMIC_FORM_SCHEMA}
        externalValues={{ plan }}
        onSubmit={(v) => setSubmitted(v)}
        submitLabel="Guardar"
      />
      {submitted && (
        <pre
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--sk-surface-2)',
            borderRadius: 8,
            fontSize: '0.8em',
            overflow: 'auto',
          }}
        >
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}

// ── Schemas separados por capacidad (para las stories del DynamicForm) ──
const ROLE_OPTS = [
  { value: 'dev', label: 'Dev' },
  { value: 'design', label: 'Diseño' },
  { value: 'pm', label: 'PM' },
]

const DF_BASIC: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', placeholder: 'Tu nombre', validation: [{ type: 'required' }] },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'vos@ejemplo.io', validation: [{ type: 'required' }, { type: 'email' }] },
    { name: 'role', type: 'select', label: 'Rol', options: ROLE_OPTS },
    { name: 'bio', type: 'textarea', label: 'Bio', rows: 3, colSpan: 12 },
  ],
}

const DF_VALIDATION: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'user', type: 'text', label: 'Usuario', helper: '3–12, sólo letras y números', validation: [{ type: 'required' }, { type: 'minLength', value: 3, message: 'Mínimo 3' }, { type: 'maxLength', value: 12, message: 'Máximo 12' }, { type: 'pattern', value: '^[a-zA-Z0-9]+$', message: 'Sólo letras y números' }] },
    { name: 'email', type: 'email', label: 'Email', validation: [{ type: 'required' }, { type: 'email', message: 'Email inválido' }] },
    { name: 'site', type: 'text', label: 'Sitio web', placeholder: 'https://…', validation: [{ type: 'url', message: 'URL inválida' }] },
    { name: 'age', type: 'number', label: 'Edad', validation: [{ type: 'required' }, { type: 'min', value: 18, message: 'Tenés que ser +18' }, { type: 'max', value: 120 }] },
  ],
}

const DF_GRID: FormConfig = {
  cols: { base: 1, sm: 2, lg: 3 },
  gap: 4,
  fields: [
    { name: 'first', type: 'text', label: 'Nombre' },
    { name: 'last', type: 'text', label: 'Apellido' },
    { name: 'alias', type: 'text', label: 'Alias' },
    { name: 'address', type: 'text', label: 'Dirección (fila completa)', colSpan: { base: 1, sm: 2, lg: 3 } },
    { name: 'city', type: 'text', label: 'Ciudad' },
    { name: 'zip', type: 'text', label: 'CP' },
  ],
}

const DF_CONDITIONAL: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'contactMethod', type: 'radio', label: '¿Cómo te contactamos?', colSpan: 12, options: [{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Teléfono' }], validation: [{ type: 'required', message: 'Elegí un método' }] },
    { name: 'email', type: 'email', label: 'Email', visibleWhen: { field: 'contactMethod', eq: 'email' }, validation: [{ type: 'required', when: { field: 'contactMethod', eq: 'email' } }, { type: 'email' }] },
    { name: 'phone', type: 'text', label: 'Teléfono', visibleWhen: { field: 'contactMethod', eq: 'phone' }, validation: [{ type: 'required', when: { field: 'contactMethod', eq: 'phone' }, message: 'Falta el teléfono' }] },
  ],
}

const DF_OBJECT: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', colSpan: 12, validation: [{ type: 'required' }] },
    { name: 'address', type: 'object', label: 'Dirección', fields: [
      { name: 'street', type: 'text', label: 'Calle' },
      { name: 'city', type: 'text', label: 'Ciudad' },
    ] },
    { name: 'billing', type: 'object', label: 'Facturación', fields: [
      { name: 'company', type: 'text', label: 'Empresa' },
      { name: 'taxId', type: 'text', label: 'CUIT / RFC' },
    ] },
  ],
}

const DF_ARRAY: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'title', type: 'text', label: 'Proyecto', colSpan: 12, validation: [{ type: 'required' }] },
    { name: 'members', type: 'array', label: 'Miembros', addLabel: 'Agregar miembro', removeLabel: 'Quitar', minItems: 1, itemFields: [
      { name: 'name', type: 'text', label: 'Nombre', validation: [{ type: 'required', message: 'Falta el nombre' }] },
      { name: 'role', type: 'select', label: 'Rol', options: ROLE_OPTS },
    ] },
  ],
}

const AB_OPTS = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
  { value: 'c', label: 'Opción C' },
]
const DF_ALLTYPES: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'text', type: 'text', label: 'text' },
    { name: 'email', type: 'email', label: 'email' },
    { name: 'password', type: 'password', label: 'password' },
    { name: 'number', type: 'number', label: 'number', min: 0, max: 10 },
    { name: 'textarea', type: 'textarea', label: 'textarea', rows: 2, colSpan: 12 },
    { name: 'select', type: 'select', label: 'select', options: AB_OPTS },
    { name: 'combobox', type: 'combobox', label: 'combobox', options: AB_OPTS },
    { name: 'multiselect', type: 'multiselect', label: 'multiselect', options: AB_OPTS },
    { name: 'tags', type: 'tags', label: 'tags' },
    { name: 'checkbox', type: 'checkbox', label: 'checkbox' },
    { name: 'switch', type: 'switch', label: 'switch' },
    { name: 'radio', type: 'radio', label: 'radio', options: AB_OPTS },
    { name: 'radioCard', type: 'radio-card', label: 'radio-card', colSpan: 12, options: AB_OPTS },
    { name: 'slider', type: 'slider', label: 'slider', min: 0, max: 100, step: 5 },
    { name: 'pin', type: 'pin', label: 'pin', max: 4 },
    { name: 'date', type: 'date', label: 'date' },
  ],
}

const DF_EXTERNAL: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'name', type: 'text', label: 'Nombre', validation: [{ type: 'required' }] },
    { name: 'seats', type: 'number', label: 'Asientos (solo Pro)', min: 1, visibleWhen: { external: 'plan', eq: 'pro' }, validation: [{ type: 'required', when: { external: 'plan', eq: 'pro' } }, { type: 'min', value: 1 }] },
    { name: 'sso', type: 'switch', label: 'SSO (solo Pro)', colSpan: 12, visibleWhen: { external: 'plan', eq: 'pro' } },
  ],
}

const DF_BYO: FormConfig = {
  cols: { base: 1, md: 2 },
  gap: 4,
  fields: [
    { name: 'name', type: 'text', label: 'Nombre' },
    { name: 'email', type: 'email', label: 'Email' },
  ],
}

// Story simple reutilizable: schema + submit que muestra el JSON.
function DFStory({ schema }: { schema: FormConfig }) {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <DynamicForm schema={schema} onSubmit={(v) => setSubmitted(v)} submitLabel="Enviar" />
      {submitted && (
        <pre style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--sk-surface-2)', borderRadius: 8, fontSize: '0.8em', overflow: 'auto' }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}

// Visibilidad/validación por valor EXTERNO (toggle free/pro fuera del form).
function DynamicFormExternalDemo() {
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <div style={{ marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9em' }}>
        <span style={{ color: 'var(--sk-text-muted)' }}>Plan externo:</span>
        <SegmentedControl value={plan} onValueChange={(v) => setPlan(v as 'free' | 'pro')}>
          <SegmentedControl.Item value="free">free</SegmentedControl.Item>
          <SegmentedControl.Item value="pro">pro</SegmentedControl.Item>
        </SegmentedControl>
      </div>
      <DynamicForm schema={DF_EXTERNAL} externalValues={{ plan }} onSubmit={() => {}} submitLabel="Guardar" />
    </div>
  )
}

// Form EXTERNO: el consumidor es dueño del useForm y el DynamicForm pinta los campos adentro.
function DynamicFormExternalFormDemo() {
  const form = useForm<FormValues>({ defaultValues: { name: '', email: '' } })
  const values = form.watch()
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <DynamicForm schema={DF_BYO} form={form} onSubmit={() => {}} submitLabel="Enviar" />
      <pre style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--sk-surface-2)', borderRadius: 8, fontSize: '0.8em', overflow: 'auto' }}>
        {'// tu useForm().watch() en vivo\n'}
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  )
}

// Imagen data-URI (siempre carga, sin depender de la red) para el demo de Image.
const DEMO_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%236aa3ff'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-family='sans-serif' font-size='22' text-anchor='middle' dominant-baseline='middle'%3Eskinkit%3C/text%3E%3C/svg%3E"

function PopconfirmDemo() {
  const [count, setCount] = useState(3)
  return (
    <Stack direction="row" align="center" gap={3}>
      <span>Items: {count}</span>
      <Popconfirm
        title="¿Borrar un item?"
        description="Esta acción no se puede deshacer."
        danger
        confirmLabel="Borrar"
        onConfirm={() => setCount((c) => Math.max(0, c - 1))}
      >
        Borrar
      </Popconfirm>
    </Stack>
  )
}

const SHELL_NAV: [string, ReactNode, string][] = [
  ['inicio', <Home size={18} />, 'Inicio'],
  ['proyectos', <Folder size={18} />, 'Proyectos'],
  ['mensajes', <Mail size={18} />, 'Mensajes'],
  ['ajustes', <Settings size={18} />, 'Ajustes'],
]

function AppShellDemo() {
  const [active, setActive] = useState('inicio')
  const [mode, setMode] = useState<'full' | 'rail' | 'hidden'>('full')
  return (
    <div style={{ width: '100%', height: 460, border: '1px solid var(--sk-border)', borderRadius: 8, overflow: 'hidden' }}>
      <AppShell style={{ height: '100%' }}>
        <AppShell.Header>
          <Topbar>
            <Topbar.Brand>Pigmento</Topbar.Brand>
            <Topbar.Actions>
              <SegmentedControl value={mode} onValueChange={(v) => setMode(v as 'full' | 'rail' | 'hidden')}>
                <SegmentedControl.Item value="full">Completo</SegmentedControl.Item>
                <SegmentedControl.Item value="rail">Rail</SegmentedControl.Item>
                <SegmentedControl.Item value="hidden">Oculto</SegmentedControl.Item>
              </SegmentedControl>
              <Avatar fallback="MM" alt="yo" />
            </Topbar.Actions>
          </Topbar>
        </AppShell.Header>
        <AppShell.Sidebar hidden={mode === 'hidden'}>
          <Sidebar collapsed={mode === 'rail'}>
            <Sidebar.Section label="Menú">
              {SHELL_NAV.map(([id, ic, label]) => (
                <Sidebar.Item
                  key={id}
                  href="#"
                  icon={ic}
                  active={active === id}
                  badge={id === 'mensajes' ? '3' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setActive(id)
                  }}
                >
                  {label}
                </Sidebar.Item>
              ))}
            </Sidebar.Section>
          </Sidebar>
        </AppShell.Sidebar>
        <AppShell.Main>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>{SHELL_NAV.find((n) => n[0] === active)?.[2]}</h3>
            <p style={{ color: 'var(--sk-text-muted)' }}>
              Contenido de “{active}”. El main scrollea solo y el header queda fijo arriba.
            </p>
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i}>Línea de contenido {i + 1}</p>
            ))}
          </div>
        </AppShell.Main>
      </AppShell>
    </div>
  )
}

// Sidebar con botón EXTERNO que dispara el colapso.
function SidebarCollapsibleDemo() {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('inicio')
  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <Button size="sm" variant="outlined" onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? '⟩ Expandir' : '⟨ Colapsar'}
        </Button>
      </div>
      <div style={{ height: 320, display: 'flex' }}>
        <Sidebar collapsed={collapsed} style={{ minHeight: 0 }}>
          <Sidebar.Section label="Principal">
            {SHELL_NAV.map(([id, ic, label]) => (
              <Sidebar.Item
                key={id}
                href="#"
                icon={ic}
                active={active === id}
                badge={id === 'mensajes' ? '3' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(id)
                }}
              >
                {label}
              </Sidebar.Item>
            ))}
          </Sidebar.Section>
        </Sidebar>
      </div>
    </div>
  )
}

// Sidebar "enterprise": Header fijo + Section estática + Group colapsable (con items anidados) +
// Footer fijo, todo dentro de un contenedor de altura fija para que se note el scroll interno.
function SidebarGroupDemo() {
  const [active, setActive] = useState('perfil')
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setActive(id)
  }
  return (
    <div style={{ height: 520, display: 'flex' }}>
      <Sidebar style={{ minHeight: 0 }}>
        <Sidebar.Header>
          <strong>Acme Inc.</strong>
        </Sidebar.Header>
        <Sidebar.Section label="Principal">
          {SHELL_NAV.map(([id, ic, label]) => (
            <Sidebar.Item key={id} href="#" icon={ic} active={active === id} onClick={go(id)}>
              {label}
            </Sidebar.Item>
          ))}
        </Sidebar.Section>
        <Sidebar.Group icon={<Settings size={18} />} label="Configuración" badge="3" defaultOpen>
          <Sidebar.Item href="#" active={active === 'perfil'} onClick={go('perfil')}>
            Perfil
          </Sidebar.Item>
          <Sidebar.Item href="#" active={active === 'facturacion'} onClick={go('facturacion')}>
            Facturación
          </Sidebar.Item>
          <Sidebar.Item href="#" active={active === 'equipo'} onClick={go('equipo')}>
            Equipo
          </Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Footer>
          <Sidebar.Item href="#" icon={<User size={18} />}>
            Jane Doe
          </Sidebar.Item>
        </Sidebar.Footer>
      </Sidebar>
    </div>
  )
}

// Topbar con navegación interactiva (el item activo cambia al click).
function TopbarNavDemo() {
  const [active, setActive] = useState('inicio')
  const items = [
    ['inicio', 'Inicio'],
    ['proyectos', 'Proyectos'],
    ['equipo', 'Equipo'],
    ['facturacion', 'Facturación'],
  ]
  return (
    <div style={{ width: '100%' }}>
      <Topbar>
        <Topbar.Brand>Pigmento</Topbar.Brand>
        <Topbar.Nav>
          {items.map(([id, label]) => (
            <Topbar.Item
              key={id}
              href="#"
              active={active === id}
              onClick={(e) => {
                e.preventDefault()
                setActive(id)
              }}
            >
              {label}
            </Topbar.Item>
          ))}
        </Topbar.Nav>
        <Topbar.Actions>
          <Avatar fallback="MM" alt="yo" />
        </Topbar.Actions>
      </Topbar>
    </div>
  )
}

// Topbar "enterprise": hamburguesa + búsqueda + notificaciones con badge + user menu (compone Menu).
function TopbarEnterpriseDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ width: '100%' }}>
      <Topbar>
        <Topbar.MenuToggle onClick={() => setCollapsed((v) => !v)} />
        <Topbar.Brand>Acme</Topbar.Brand>
        <Topbar.Search icon={<Search size={16} />} placeholder="Buscar…" shortcut="⌘K" />
        <Topbar.Actions>
          <Topbar.IconButton icon={<Bell size={18} />} badge={3} label="Notificaciones" />
          <Topbar.UserMenu
            trigger={
              <>
                <Avatar fallback="JD" size="sm" /> Jane
              </>
            }
          >
            <Topbar.UserMenu.Item>Perfil</Topbar.UserMenu.Item>
            <Topbar.UserMenu.Item>Cerrar sesión</Topbar.UserMenu.Item>
          </Topbar.UserMenu>
        </Topbar.Actions>
      </Topbar>
      <p style={{ color: 'var(--color-sk-text-muted)', marginTop: '0.75rem', fontSize: '0.85em' }}>
        Toggle de la hamburguesa: {collapsed ? 'activado' : 'sin activar'} — en tu app se lo pasarías a{' '}
        <code>{'<Sidebar collapsed>'}</code>.
      </p>
    </div>
  )
}

// BottomNav interactivo.
function BottomNavDemo() {
  const [active, setActive] = useState('inicio')
  const items: [string, ReactNode, string][] = [
    ['inicio', <Home size={18} />, 'Inicio'],
    ['buscar', <Search size={18} />, 'Buscar'],
    ['alertas', <Bell size={18} />, 'Alertas'],
    ['perfil', <User size={18} />, 'Perfil'],
  ]
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <BottomNav>
        {items.map(([id, ic, label]) => (
          <BottomNav.Item
            key={id}
            href="#"
            icon={ic}
            active={active === id}
            onClick={(e) => {
              e.preventDefault()
              setActive(id)
            }}
          >
            {label}
          </BottomNav.Item>
        ))}
      </BottomNav>
    </div>
  )
}

// AppShell mobile: sin sidebar, con BottomNav en el footer.
function AppShellMobileDemo() {
  const [active, setActive] = useState('inicio')
  const items: [string, ReactNode, string][] = [
    ['inicio', <Home size={18} />, 'Inicio'],
    ['buscar', <Search size={18} />, 'Buscar'],
    ['alertas', <Bell size={18} />, 'Alertas'],
    ['perfil', <User size={18} />, 'Perfil'],
  ]
  return (
    <div style={{ width: '100%', maxWidth: 380, height: 440, border: '1px solid var(--sk-border)', borderRadius: 8, overflow: 'hidden' }}>
      <AppShell style={{ height: '100%' }}>
        <AppShell.Header>
          <Topbar>
            <Topbar.Brand>Pigmento</Topbar.Brand>
            <Topbar.Actions>
              <Avatar fallback="MM" alt="yo" size="sm" />
            </Topbar.Actions>
          </Topbar>
        </AppShell.Header>
        <AppShell.Main>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>{items.find((i) => i[0] === active)?.[2]}</h3>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i}>Contenido {i + 1}</p>
            ))}
          </div>
        </AppShell.Main>
        <AppShell.Footer>
          <BottomNav>
            {items.map(([id, ic, label]) => (
              <BottomNav.Item
                key={id}
                href="#"
                icon={ic}
                active={active === id}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(id)
                }}
              >
                {label}
              </BottomNav.Item>
            ))}
          </BottomNav>
        </AppShell.Footer>
      </AppShell>
    </div>
  )
}

// Celda de demo para los layouts (contenido de relleno, no parte de la librería).
const layoutCell: CSSProperties = {
  padding: '0.75rem',
  background: 'var(--sk-surface-2)',
  border: '1px solid var(--sk-border)',
  borderRadius: 8,
  textAlign: 'center',
  fontSize: '0.9em',
}
function LCell({ children }: { children: ReactNode }) {
  return <div style={layoutCell}>{children}</div>
}

// ── RichTextEditor: demo mínima — sin toolbar, solo confirma que el editor monta, es editable
// y el undo/redo nativo (Ctrl+Z) de Tiptap funciona.
function RichTextEditorMinimalDemo() {
  const [html, setHtml] = useState('<p>Escribí algo acá y probá <strong>Ctrl+Z</strong>.</p>')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <RichTextEditor content={html} onChange={setHtml}>
        <RichTextEditor.Content />
      </RichTextEditor>
      <details>
        <summary>HTML actual</summary>
        <pre style={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{html}</pre>
      </details>
    </div>
  )
}

// ── RichTextEditor: formato + bloques (batch 2) — negrita/cursiva/subrayado/tachado, estilo de
// bloque (párrafo/títulos), listas, cita, código, línea horizontal, undo/redo.
function RichTextEditorFormattingDemo() {
  const [html, setHtml] = useState(
    '<h2>Probá cada botón</h2><p>Seleccioná texto y aplicá <strong>negrita</strong>, <em>cursiva</em>, etc.</p><ul><li>Un ítem</li><li>Otro ítem</li></ul>',
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <RichTextEditor content={html} onChange={setHtml}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.BlockType />
          <RichTextEditor.Separator />
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strike />
          <RichTextEditor.Separator />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Blockquote />
          <RichTextEditor.CodeBlock />
          <RichTextEditor.HorizontalRule />
          <RichTextEditor.Separator />
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
      <details>
        <summary>HTML actual</summary>
        <pre style={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{html}</pre>
      </details>
    </div>
  )
}

// ── RichTextEditor: link + imagen (batch 3) — ambos abren un PromptDialog reusado de Dialog.
function RichTextEditorLinkImageDemo() {
  const [html, setHtml] = useState('<p>Seleccioná esta frase y probá insertar un link.</p>')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <RichTextEditor content={html} onChange={setHtml}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.Link />
          <RichTextEditor.Image />
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
      <details>
        <summary>HTML actual</summary>
        <pre style={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{html}</pre>
      </details>
    </div>
  )
}

// ── RichTextEditor: alinear + color + tabla (batch 4) — .TableControls solo aparece con el
// cursor dentro de una tabla, probá insertar una y hacer click adentro.
function RichTextEditorAlignColorTableDemo() {
  const [html, setHtml] = useState('<h2>Encabezado</h2><p>Seleccioná texto y probá alinear o cambiar el color.</p>')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <RichTextEditor content={html} onChange={setHtml}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.Align />
          <RichTextEditor.Separator />
          <RichTextEditor.Color />
          <RichTextEditor.Separator />
          <RichTextEditor.Table />
        </RichTextEditor.Toolbar>
        <RichTextEditor.TableControls />
        <RichTextEditor.Content />
      </RichTextEditor>
      <details>
        <summary>HTML actual</summary>
        <pre style={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{html}</pre>
      </details>
    </div>
  )
}

// ── VideoPlayer: assets CC0 públicos de MDN (estándar en demos web, MDN los usa en su propia
// documentación de <video>/<audio>) — sin poster propio para este archivo, se omite.
const VIDEO_DEMO_SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const AUDIO_DEMO_SRC = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'

function VideoPlayerDemo() {
  return (
    <VideoPlayer src={VIDEO_DEMO_SRC} style={{ maxWidth: 480 }}>
      <VideoPlayer.Controls>
        <VideoPlayer.PlayButton />
        <VideoPlayer.SkipBack />
        <VideoPlayer.SkipForward />
        <VideoPlayer.Seek />
        <VideoPlayer.Time />
        <VideoPlayer.Separator />
        <VideoPlayer.VolumeButton />
        <VideoPlayer.VolumeSlider />
        <VideoPlayer.Separator />
        <VideoPlayer.PlaybackRate />
        <VideoPlayer.PipButton />
        <VideoPlayer.FullscreenButton />
      </VideoPlayer.Controls>
    </VideoPlayer>
  )
}

function AudioPlayerDemo() {
  return (
    <AudioPlayer src={AUDIO_DEMO_SRC} style={{ maxWidth: 480 }}>
      <AudioPlayer.Controls>
        <AudioPlayer.PlayButton />
        <AudioPlayer.SkipBack />
        <AudioPlayer.SkipForward />
        <AudioPlayer.Seek />
        <AudioPlayer.Time />
        <AudioPlayer.Separator />
        <AudioPlayer.VolumeButton />
        <AudioPlayer.VolumeSlider />
        <AudioPlayer.Separator />
        <AudioPlayer.PlaybackRate />
      </AudioPlayer.Controls>
    </AudioPlayer>
  )
}

// ── FilePreviewer: assets de demo — imagen data-URI (sin red), video/audio CC0 de MDN (mismos
// que VideoPlayer/AudioPlayer arriba), PDF público estándar de pdf.js, código como data-URI.
const CODE_DEMO_SRC =
  'data:text/plain,' + encodeURIComponent('export function hello() {\n  return "hola"\n}\n')
const PDF_DEMO_SRC = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

function FilePreviewerSingleDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Ver imagen</Button>
      <FilePreviewer
        open={open}
        onClose={() => setOpen(false)}
        files={[{ url: DEMO_IMG, name: 'skinkit.svg', size: 1280, type: 'image/svg+xml' }]}
      />
    </>
  )
}

function FilePreviewerGalleryDemo() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const files = [
    { url: DEMO_IMG, name: 'skinkit.svg', size: 1280, type: 'image/svg+xml' },
    { url: VIDEO_DEMO_SRC, name: 'flower.mp4', type: 'video/mp4' },
    { url: AUDIO_DEMO_SRC, name: 't-rex-roar.mp3', type: 'audio/mpeg' },
    { url: PDF_DEMO_SRC, name: 'paper.pdf', type: 'application/pdf' },
    { url: CODE_DEMO_SRC, name: 'hello.ts' },
    { url: '#', name: 'reporte.docx', size: 45_000 },
  ]
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir galería</Button>
      <FilePreviewer open={open} onClose={() => setOpen(false)} files={files} index={index} onIndexChange={setIndex} />
    </>
  )
}

// ── FilePreviewer: skinkit/file-preview-office — demo 100% en vivo con .docx/.xlsx de muestra
// servidos localmente desde playground/public (sin depender de ningún host externo/CORS).
const WORD_DEMO_SRC = '/sample.docx'
const EXCEL_DEMO_SRC = '/sample.xlsx'

function FilePreviewerOfficeDemo() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const files = [
    { url: WORD_DEMO_SRC, name: 'sample.docx' },
    { url: EXCEL_DEMO_SRC, name: 'sample.xlsx' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ margin: 0 }}>
        <code>officeRenderers</code> ({Object.keys(officeRenderers).join(', ')}) se importa desde{' '}
        <code>skinkit/file-preview-office</code> y se combina con la prop <code>renderers</code>:
      </p>
      <Code block lang="tsx" copyable>
        {`import { FilePreviewer } from 'skinkit'
import { officeRenderers } from 'skinkit/file-preview-office'

<FilePreviewer files={archivos} renderers={officeRenderers} open={open} onClose={onClose} />`}
      </Code>
      <div>
        <Button onClick={() => setOpen(true)}>Ver .docx / .xlsx de muestra</Button>
      </div>
      <FilePreviewer
        open={open}
        onClose={() => setOpen(false)}
        files={files}
        index={index}
        onIndexChange={setIndex}
        renderers={officeRenderers}
      />
    </div>
  )
}

/**
 * Registro de historias del playground. Agregar un componente = agregar un grupo acá.
 * El sidebar y el panel de docs se arman solos desde esto + el catálogo.
 */
export const STORY_GROUPS: StoryGroup[] = [
  {
    component: 'Button',
    stories: [
      {
        name: 'Variantes',
        render: () => (
          <div className="sb-row">
            <Button>Filled</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        ),
      },
      {
        name: 'Tamaños',
        render: () => (
          <div className="sb-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        ),
      },
      {
        name: 'Con ícono',
        render: () => (
          <div className="sb-row">
            <Button iconLeft={<Dot />}>Izquierda</Button>
            <Button iconRight={<Dot />}>Derecha</Button>
          </div>
        ),
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <Button tone="primary">Primary</Button>
            <Button tone="secondary">Secondary</Button>
            <Button tone="tertiary">Tertiary</Button>
            <Button tone="accent">Accent</Button>
            <Button tone="success">Success</Button>
            <Button tone="warning">Warning</Button>
            <Button tone="info">Info</Button>
            <Button tone="danger">Danger</Button>
          </div>
        ),
      },
      {
        name: 'Estados',
        render: () => (
          <div className="sb-row">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
          </div>
        ),
      },
    ],
  },
  {
    component: 'ButtonGroup',
    stories: [
      {
        name: 'Unido',
        render: () => (
          <ButtonGroup label="Formato">
            <Button variant="outlined">Izquierda</Button>
            <Button variant="outlined">Centro</Button>
            <Button variant="outlined">Derecha</Button>
          </ButtonGroup>
        ),
      },
    ],
  },
  {
    component: 'SplitButton',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <SplitButton tone="primary" menu={<SplitButton.Item onSelect={() => {}}>Opción</SplitButton.Item>}>
              Primary
            </SplitButton>
            <SplitButton tone="success" menu={<SplitButton.Item onSelect={() => {}}>Opción</SplitButton.Item>}>
              Success
            </SplitButton>
          </div>
        ),
      },
      {
        name: 'Acción + menú',
        render: () => (
          <SplitButton
            onClick={() => {}}
            menu={
              <>
                <SplitButton.Item onSelect={() => {}}>Guardar como…</SplitButton.Item>
                <SplitButton.Item onSelect={() => {}}>Duplicar</SplitButton.Item>
                <SplitButton.Item onSelect={() => {}}>Exportar</SplitButton.Item>
              </>
            }
          >
            Guardar
          </SplitButton>
        ),
      },
    ],
  },
  {
    component: 'CopyButton',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row" style={{ alignItems: 'center' }}>
            <CopyButton value="x" tone="primary">Primary</CopyButton>
            <CopyButton value="x" tone="success">Success</CopyButton>
            <CopyButton value="x" tone="danger">Danger</CopyButton>
          </div>
        ),
      },
      {
        name: 'Copiar',
        render: () => (
          <div className="sb-row" style={{ alignItems: 'center' }}>
            <CopyButton value="npm install skinkit" />
            <CopyButton value="https://skinkit.dev">Copiar URL</CopyButton>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Toggle',
    stories: [
      {
        name: 'Estados',
        render: () => (
          <div className="sb-row">
            <Toggle defaultPressed aria-label="Negrita">B</Toggle>
            <Toggle aria-label="Cursiva">I</Toggle>
            <Toggle aria-label="Subrayado">U</Toggle>
            <Toggle disabled aria-label="Deshabilitado">S</Toggle>
          </div>
        ),
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <Toggle defaultPressed>Primary</Toggle>
            <Toggle defaultPressed tone="secondary">Secondary</Toggle>
            <Toggle defaultPressed tone="tertiary">Tertiary</Toggle>
            <Toggle defaultPressed tone="accent">Accent</Toggle>
            <Toggle defaultPressed tone="success">Success</Toggle>
            <Toggle defaultPressed tone="warning">Warning</Toggle>
            <Toggle defaultPressed tone="info">Info</Toggle>
            <Toggle defaultPressed tone="danger">Danger</Toggle>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Toolbar',
    stories: [
      {
        name: 'Formato',
        render: () => (
          <Toolbar label="Formato">
            <Toggle defaultPressed aria-label="Negrita">B</Toggle>
            <Toggle aria-label="Cursiva">I</Toggle>
            <Toggle aria-label="Subrayado">U</Toggle>
            <Toolbar.Separator />
            <Button size="sm" variant="outlined">Guardar</Button>
          </Toolbar>
        ),
      },
    ],
  },
  {
    component: 'Card',
    stories: [
      {
        name: 'Con cabecera y pie',
        render: () => (
          <Card header="Título de card" footer={<Button size="sm">Acción</Button>}>
            El mismo componente Card. La forma la impone el skin activo.
          </Card>
        ),
      },
      {
        name: 'Solo cuerpo',
        render: () => <Card>Contenido simple, sin header ni footer.</Card>,
      },
    ],
  },
  {
    component: 'Input',
    stories: [
      {
        name: 'Con label y helper',
        render: () => (
          <Input label="Correo" placeholder="tu@correo.com" helper="Nunca lo compartimos." />
        ),
      },
      {
        name: 'En error',
        render: () => (
          <Input label="Correo" defaultValue="mal" error helper="Ese valor no es válido." />
        ),
      },
    ],
  },
  {
    component: 'Textarea',
    stories: [
      {
        name: 'Con label y helper',
        render: () => (
          <Textarea label="Comentario" rows={4} placeholder="Escribí acá…" helper="Máx. 500 caracteres." />
        ),
      },
      {
        name: 'En error',
        render: () => (
          <Textarea label="Descripción" rows={4} defaultValue="corto" error helper="Contá un poco más." />
        ),
      },
    ],
  },
  {
    component: 'Checkbox',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col">
            <Checkbox defaultChecked label="Primary" tone="primary" />
            <Checkbox defaultChecked label="Secondary" tone="secondary" />
            <Checkbox defaultChecked label="Success" tone="success" />
            <Checkbox defaultChecked label="Warning" tone="warning" />
            <Checkbox defaultChecked label="Danger" tone="danger" />
          </div>
        ),
      },
      {
        name: 'Estados',
        render: () => (
          <div className="sb-col">
            <Checkbox label="Sin marcar" />
            <Checkbox label="Marcado" defaultChecked />
            <Checkbox label="Indeterminado" indeterminate />
            <Checkbox label="Deshabilitado" disabled />
          </div>
        ),
      },
    ],
  },
  {
    component: 'RadioGroup',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row" style={{ gap: '1.5rem' }}>
            <RadioGroup defaultValue="a" tone="primary">
              <Radio value="a" label="Primary" />
            </RadioGroup>
            <RadioGroup defaultValue="a" tone="success">
              <Radio value="a" label="Success" />
            </RadioGroup>
            <RadioGroup defaultValue="a" tone="danger">
              <Radio value="a" label="Danger" />
            </RadioGroup>
          </div>
        ),
      },
      {
        name: 'Uncontrolled',
        render: () => (
          <RadioGroup defaultValue="anual">
            <Radio value="mensual" label="Mensual" />
            <Radio value="anual" label="Anual (2 meses gratis)" />
            <Radio value="equipo" label="Equipo" />
          </RadioGroup>
        ),
      },
      {
        name: 'Deshabilitado',
        render: () => (
          <RadioGroup defaultValue="a" disabled>
            <Radio value="a" label="Opción A" />
            <Radio value="b" label="Opción B" />
          </RadioGroup>
        ),
      },
    ],
  },
  {
    component: 'Switch',
    stories: [
      {
        name: 'Estados',
        render: () => (
          <div className="sb-col">
            <Switch label="Apagado" />
            <Switch label="Encendido" defaultChecked />
            <Switch label="Deshabilitado" disabled />
          </div>
        ),
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col">
            <Switch label="Primary" defaultChecked />
            <Switch label="Secondary" defaultChecked tone="secondary" />
            <Switch label="Tertiary" defaultChecked tone="tertiary" />
            <Switch label="Accent" defaultChecked tone="accent" />
            <Switch label="Success" defaultChecked tone="success" />
            <Switch label="Warning" defaultChecked tone="warning" />
            <Switch label="Info" defaultChecked tone="info" />
            <Switch label="Danger" defaultChecked tone="danger" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Select',
    stories: [
      {
        name: 'Con label',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Select label="País" defaultValue="mx" helper="Elegí tu país.">
              <option value="mx">México</option>
              <option value="ar">Argentina</option>
              <option value="co">Colombia</option>
              <option value="cl">Chile</option>
            </Select>
          </div>
        ),
      },
      {
        name: 'En error',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Select label="Plan" error helper="Elegí un plan válido.">
              <option value="">—</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </Select>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Slider',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 280 }}>
            <Slider defaultValue={60} tone="primary" />
            <Slider defaultValue={60} tone="success" />
            <Slider defaultValue={60} tone="warning" />
            <Slider defaultValue={60} tone="danger" />
          </div>
        ),
      },
      {
        name: 'Con valor',
        render: () => <SliderDemo />,
      },
      {
        name: 'Simple',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Slider label="Brillo" min={0} max={100} defaultValue={70} />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Rating',
    stories: [
      {
        name: 'Interactivo',
        render: () => <RatingDemo />,
      },
      {
        name: 'Solo lectura',
        render: () => <Rating value={4} readOnly />,
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col">
            <Rating value={4} readOnly tone="primary" />
            <Rating value={4} readOnly tone="secondary" />
            <Rating value={4} readOnly tone="accent" />
            <Rating value={4} readOnly tone="success" />
            <Rating value={4} readOnly tone="warning" />
            <Rating value={4} readOnly tone="danger" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'SegmentedControl',
    stories: [
      {
        name: 'Vista',
        render: () => (
          <SegmentedControl defaultValue="lista" label="Vista">
            <SegmentedControl.Item value="lista">Lista</SegmentedControl.Item>
            <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
            <SegmentedControl.Item value="tabla">Tabla</SegmentedControl.Item>
          </SegmentedControl>
        ),
      },
    ],
  },
  {
    component: 'NumberInput',
    stories: [
      {
        name: 'Cantidad',
        render: () => (
          <div style={{ width: '100%', maxWidth: 260 }}>
            <NumberInput label="Cantidad" min={1} max={10} defaultValue={2} helper="Entre 1 y 10." />
          </div>
        ),
      },
    ],
  },
  {
    component: 'TagInput',
    stories: [
      {
        name: 'Chips',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <TagInput
              label="Etiquetas"
              defaultValue={['react', 'css']}
              placeholder="Escribí y Enter…"
              helper="Enter o coma agrega; Backspace borra el último."
            />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Combobox',
    stories: [
      {
        name: 'Autocomplete',
        render: () => <ComboboxDemo />,
      },
    ],
  },
  {
    component: 'MultiSelect',
    stories: [
      {
        name: 'Varios valores',
        render: () => <MultiSelectDemo />,
      },
    ],
  },
  {
    component: 'Editable',
    stories: [
      {
        name: 'Editar in-line',
        render: () => <EditableDemo />,
      },
    ],
  },
  {
    component: 'Calendar',
    stories: [
      {
        name: 'Inline',
        render: () => <CalendarDemo />,
      },
    ],
  },
  {
    component: 'DatePicker',
    stories: [
      {
        name: 'Campo + popover',
        render: () => <DatePickerDemo />,
      },
    ],
  },
  {
    component: 'RangeCalendar',
    stories: [
      {
        name: 'Rango inline',
        render: () => <RangeCalendarDemo />,
      },
    ],
  },
  {
    component: 'DateRangePicker',
    stories: [
      {
        name: 'Campo + popover',
        render: () => <DateRangePickerDemo />,
      },
    ],
  },
  {
    component: 'FileUpload',
    stories: [
      {
        name: 'Dropzone + previews',
        render: () => <FileUploadDemo />,
      },
      {
        name: 'Compacto (button)',
        render: () => (
          <FileUpload variant="button" accept="image/*" multiple preview label="Subir" />
        ),
      },
    ],
  },
  {
    component: 'Banner',
    stories: [
      {
        name: 'Variantes',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 520 }}>
            <Banner variant="primary" action={<Button size="sm">Ver</Button>} onClose={() => {}}>
              Nueva versión de skinkit disponible.
            </Banner>
            <Banner variant="success">Pago confirmado.</Banner>
            <Banner variant="warning">Tu plan vence pronto.</Banner>
            <Banner variant="info">Estamos en modo lectura por unos minutos.</Banner>
            <Banner variant="danger">Mantenimiento programado a las 22:00.</Banner>
            <Banner>Consejo: podés escribir tu propio skin.</Banner>
          </div>
        ),
      },
    ],
  },
  {
    component: 'DescriptionList',
    stories: [
      {
        name: 'Ficha',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <DescriptionList>
              <DescriptionList.Item term="Estado">Activo</DescriptionList.Item>
              <DescriptionList.Item term="Plan">Pro</DescriptionList.Item>
              <DescriptionList.Item term="Miembros">12</DescriptionList.Item>
              <DescriptionList.Item term="Creado">2024-08-01</DescriptionList.Item>
            </DescriptionList>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Code',
    stories: [
      {
        name: 'Inline y bloque',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 460 }}>
            <p style={{ margin: 0 }}>
              Corré <Code>bun dev</Code> para empezar.
            </p>
            <Code block copyable lang="ts">{`import { Button } from 'skinkit'
import 'skinkit/styles/base'
import 'skinkit/skins/soft'

// El color de sintaxis lo pone el theme activo
function App() {
  const total = 42
  return <Button onClick={() => save(total)}>Guardar</Button>
}`}</Code>
          </div>
        ),
      },
    ],
  },
  {
    component: 'RadioCardGroup',
    stories: [
      {
        name: 'Planes',
        render: () => <RadioCardDemo />,
      },
    ],
  },
  {
    component: 'Fieldset',
    stories: [
      {
        name: 'Grupo de campos',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Fieldset legend="Dirección" helper="Todos los campos son obligatorios.">
              <Input label="Calle" placeholder="Av. Siempre Viva 742" />
              <Input label="Ciudad" placeholder="Springfield" />
            </Fieldset>
          </div>
        ),
      },
    ],
  },
  {
    component: 'RadialProgress',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <RadialProgress value={66} tone="primary" />
            <RadialProgress value={66} tone="secondary" />
            <RadialProgress value={66} tone="success" />
            <RadialProgress value={66} tone="warning" />
            <RadialProgress value={66} tone="danger" />
          </div>
        ),
      },
      {
        name: 'Anillos',
        render: () => (
          <div className="sb-row" style={{ alignItems: 'center', gap: '1.5rem' }}>
            <RadialProgress value={72} showValue />
            <RadialProgress value={30} tone="danger" showValue />
            <RadialProgress value={90} size={96} thickness={10}>
              9/10
            </RadialProgress>
          </div>
        ),
      },
    ],
  },
  {
    component: 'ScrollArea',
    stories: [
      {
        name: 'Lista larga',
        render: () => (
          <ScrollArea maxHeight={200} style={{ width: 260 }}>
            <div className="sb-col" style={{ gap: '0.5rem', padding: '0.25rem' }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--sk-surface-2)', borderRadius: 8 }}>
                  Ítem {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        ),
      },
    ],
  },
  {
    component: 'PasswordInput',
    stories: [
      {
        name: 'Mostrar/ocultar',
        render: () => (
          <div style={{ width: '100%', maxWidth: 300 }}>
            <PasswordInput label="Contraseña" placeholder="••••••••" defaultValue="secreto123" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'PinInput',
    stories: [
      {
        name: 'OTP',
        render: () => <PinInputDemo />,
      },
    ],
  },
  {
    component: 'TimePicker',
    stories: [
      {
        name: 'Hora',
        render: () => (
          <div style={{ width: '100%', maxWidth: 200 }}>
            <TimePicker label="Hora del turno" defaultValue="09:30" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'ColorSwatch',
    stories: [
      {
        name: 'Paleta',
        render: () => <ColorSwatchDemo />,
      },
    ],
  },
  {
    component: 'Badge',
    stories: [
      {
        name: 'Variantes',
        render: () => (
          <div className="sb-row">
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="tertiary">Tertiary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Avatar',
    stories: [
      {
        name: 'Con imagen y fallback',
        render: () => (
          <div className="sb-row">
            <Avatar
              src="https://i.pravatar.cc/80?img=5"
              alt="Ana Pérez"
              fallback="AP"
            />
            <Avatar alt="Miguel Ángel" fallback="MA" />
            <Avatar src="/imagen-rota.jpg" alt="Rota" fallback="RT" />
          </div>
        ),
      },
      {
        name: 'Tamaños',
        render: () => (
          <div className="sb-row">
            <Avatar size="sm" alt="Small" fallback="SM" />
            <Avatar size="md" alt="Medium" fallback="MD" />
            <Avatar size="lg" alt="Large" fallback="LG" />
          </div>
        ),
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <Avatar alt="Neutral" fallback="NE" />
            <Avatar alt="Primary" fallback="PR" tone="primary" />
            <Avatar alt="Secondary" fallback="SE" tone="secondary" />
            <Avatar alt="Tertiary" fallback="TE" tone="tertiary" />
            <Avatar alt="Accent" fallback="AC" tone="accent" />
            <Avatar alt="Success" fallback="SU" tone="success" />
            <Avatar alt="Warning" fallback="WA" tone="warning" />
            <Avatar alt="Info" fallback="IN" tone="info" />
            <Avatar alt="Danger" fallback="DA" tone="danger" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'AvatarGroup',
    stories: [
      {
        name: 'Con overflow',
        render: () => (
          <AvatarGroup max={3}>
            <Avatar alt="Ana" fallback="AN" />
            <Avatar alt="Beto" fallback="BE" />
            <Avatar alt="Caro" fallback="CA" />
            <Avatar alt="Dani" fallback="DA" />
            <Avatar alt="Eze" fallback="EZ" />
          </AvatarGroup>
        ),
      },
    ],
  },
  {
    component: 'Separator',
    stories: [
      {
        name: 'Horizontal',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <p style={{ margin: 0 }}>Sección de arriba</p>
            <Separator />
            <p style={{ margin: 0 }}>Sección de abajo</p>
          </div>
        ),
      },
      {
        name: 'Vertical',
        render: () => (
          <div style={{ display: 'flex', alignItems: 'center', height: 28 }}>
            <span>Inicio</span>
            <Separator orientation="vertical" />
            <span>Perfil</span>
            <Separator orientation="vertical" />
            <span>Ajustes</span>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Spinner',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <Spinner tone="primary" />
            <Spinner tone="secondary" />
            <Spinner tone="tertiary" />
            <Spinner tone="accent" />
            <Spinner tone="success" />
            <Spinner tone="warning" />
            <Spinner tone="danger" />
          </div>
        ),
      },
      {
        name: 'Tamaños',
        render: () => (
          <div className="sb-row">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        ),
      },
      {
        name: 'En un botón',
        render: () => (
          <Button disabled iconLeft={<Spinner size="sm" />}>
            Enviando…
          </Button>
        ),
      },
    ],
  },
  {
    component: 'Progress',
    stories: [
      {
        name: 'Determinado',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 320 }}>
            <Progress value={25} />
            <Progress value={60} />
            <Progress value={100} />
          </div>
        ),
      },
      {
        name: 'Indeterminado',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Progress indeterminate />
          </div>
        ),
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 320 }}>
            <Progress value={70} tone="primary" />
            <Progress value={70} tone="secondary" />
            <Progress value={70} tone="tertiary" />
            <Progress value={70} tone="accent" />
            <Progress value={70} tone="success" />
            <Progress value={70} tone="warning" />
            <Progress value={70} tone="info" />
            <Progress value={70} tone="danger" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Skeleton',
    stories: [
      {
        name: 'Formas',
        render: () => (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: 320 }}>
            <Skeleton variant="circle" width={48} height={48} />
            <div className="sb-col" style={{ flex: 1, gap: '0.5rem' }}>
              <Skeleton width="80%" />
              <Skeleton width="60%" />
              <Skeleton variant="rect" width="100%" height={60} />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Carousel',
    stories: [
      {
        name: 'Imágenes',
        render: () => (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <Carousel loop>
              <Carousel.Slide>
                <AspectRatio ratio={16 / 9}>
                  <img src="https://picsum.photos/seed/skc1/600/400" alt="Slide 1" />
                </AspectRatio>
              </Carousel.Slide>
              <Carousel.Slide>
                <AspectRatio ratio={16 / 9}>
                  <img src="https://picsum.photos/seed/skc2/600/400" alt="Slide 2" />
                </AspectRatio>
              </Carousel.Slide>
              <Carousel.Slide>
                <AspectRatio ratio={16 / 9}>
                  <img src="https://picsum.photos/seed/skc3/600/400" alt="Slide 3" />
                </AspectRatio>
              </Carousel.Slide>
            </Carousel>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Meter',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 280 }}>
            <Meter value={70} tone="primary" />
            <Meter value={70} tone="secondary" />
            <Meter value={70} tone="success" />
            <Meter value={70} tone="warning" />
            <Meter value={70} tone="danger" />
          </div>
        ),
      },
      {
        name: 'Mediciones',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 320 }}>
            <Meter label="Disco" value={82} showValue />
            <Meter label="Batería" value={12} low={20} showValue />
            <Meter label="Score" value={64} tone="neutral" showValue />
          </div>
        ),
      },
    ],
  },
  {
    component: 'AspectRatio',
    stories: [
      {
        name: 'Proporciones',
        render: () => (
          <div className="sb-row" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 200 }}>
              <AspectRatio ratio={16 / 9}>
                <img src="https://picsum.photos/seed/sk16/400/300" alt="16:9" />
              </AspectRatio>
            </div>
            <div style={{ width: 120 }}>
              <AspectRatio ratio={1}>
                <img src="https://picsum.photos/seed/sk1/300/300" alt="1:1" />
              </AspectRatio>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    component: 'VisuallyHidden',
    stories: [
      {
        name: 'Solo para lectores',
        render: () => (
          <div className="sb-col">
            <Button variant="ghost">
              <Settings size={18} />
              <VisuallyHidden> Ajustes</VisuallyHidden>
            </Button>
            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              El texto “Ajustes” no se ve, pero lo anuncian los lectores de pantalla (inspeccioná el
              DOM del botón).
            </span>
          </div>
        ),
      },
    ],
  },
  {
    component: 'AnimatedNumber',
    stories: [
      {
        name: 'Contador',
        render: () => <AnimatedNumberDemo />,
      },
    ],
  },
  {
    component: 'Sparkline',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row">
            <Sparkline data={[3, 7, 4, 9, 6, 11, 8]} tone="primary" />
            <Sparkline data={[3, 7, 4, 9, 6, 11, 8]} tone="success" />
            <Sparkline data={[8, 6, 9, 4, 7, 3, 5]} tone="danger" />
          </div>
        ),
      },
      {
        name: 'Tendencias',
        render: () => (
          <div className="sb-col">
            <Sparkline data={[4, 6, 5, 8, 7, 10, 9, 13]} dot width={140} />
            <Sparkline data={[12, 10, 11, 8, 9, 6, 5, 3]} area tone="danger" width={140} />
          </div>
        ),
      },
    ],
  },
  {
    component: 'QRCode',
    stories: [
      {
        name: 'Básico',
        render: () => (
          <div className="sb-row">
            <QRCode value="https://skinkit.dev" />
            <QRCode value="skinkit" size={80} errorCorrectionLevel="H" />
          </div>
        ),
      },
      {
        name: 'Contenido largo (versión más alta)',
        render: () => (
          <QRCode
            value="WIFI:T:WPA;S:MiRedWifi;P:unaContraseñaLarga123;;"
            size={180}
            errorCorrectionLevel="Q"
          />
        ),
      },
    ],
  },
  {
    component: 'Tour',
    stories: [
      {
        name: 'Anidado + reusado + auto-trigger',
        render: () => <TourDemo />,
      },
    ],
  },
  {
    component: 'Resizable',
    stories: [
      {
        name: '3 columnas',
        render: () => (
          <div style={{ width: '100%', maxWidth: 480, height: 160 }}>
            <Resizable style={{ height: '100%' }}>
              <Resizable.Panel defaultSize={22} min={12}>
                <div style={{ padding: '0.75rem' }}>Nav</div>
              </Resizable.Panel>
              <Resizable.Panel>
                <div style={{ padding: '0.75rem', background: 'var(--sk-surface-2)' }}>Editor</div>
              </Resizable.Panel>
              <Resizable.Panel defaultSize={28}>
                <div style={{ padding: '0.75rem' }}>Inspector</div>
              </Resizable.Panel>
            </Resizable>
          </div>
        ),
      },
      {
        name: 'Grilla (anidado)',
        render: () => (
          <div style={{ width: '100%', maxWidth: 480, height: 200 }}>
            <Resizable direction="vertical" style={{ height: '100%' }}>
              <Resizable.Panel>
                <Resizable style={{ height: '100%' }}>
                  <Resizable.Panel>
                    <div style={{ padding: '0.75rem' }}>A</div>
                  </Resizable.Panel>
                  <Resizable.Panel>
                    <div style={{ padding: '0.75rem', background: 'var(--sk-surface-2)' }}>B</div>
                  </Resizable.Panel>
                </Resizable>
              </Resizable.Panel>
              <Resizable.Panel defaultSize={35}>
                <div style={{ padding: '0.75rem' }}>C (a lo ancho)</div>
              </Resizable.Panel>
            </Resizable>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Countdown',
    stories: [
      {
        name: 'Cuenta regresiva',
        render: () => <CountdownDemo />,
      },
    ],
  },
  {
    component: 'Blockquote',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ maxWidth: 420, gap: '1rem' }}>
            <Blockquote tone="primary" author="Primary">La barra toma el tono.</Blockquote>
            <Blockquote tone="success" author="Success">La barra toma el tono.</Blockquote>
            <Blockquote tone="danger" author="Danger">La barra toma el tono.</Blockquote>
          </div>
        ),
      },
      {
        name: 'Cita',
        render: () => (
          <div style={{ maxWidth: 420 }}>
            <Blockquote author="Dieter Rams">
              Buen diseño es el menor diseño posible. Menos, pero mejor.
            </Blockquote>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Stat',
    stories: [
      {
        name: 'KPIs',
        render: () => (
          <div className="sb-row" style={{ gap: '2rem' }}>
            <Stat label="Ingresos" value="$12.4k" delta="+12%" trend="up" />
            <Stat label="Churn" value="3.1%" delta="-0.4pp" trend="down" />
            <Stat label="Usuarios" value="1,204" delta="0%" trend="neutral" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'EmptyState',
    stories: [
      {
        name: 'Sin resultados',
        render: () => (
          <EmptyState
            icon={<SearchX />}
            title="Sin resultados"
            description="No encontramos nada con esos filtros. Probá con otros términos."
          >
            <Button variant="outlined">Limpiar filtros</Button>
            <Button>Crear nuevo</Button>
          </EmptyState>
        ),
      },
    ],
  },
  {
    component: 'Timeline',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <Timeline>
            <Timeline.Item title="Primary" time="paso 1" tone="primary" />
            <Timeline.Item title="Success" time="paso 2" tone="success" />
            <Timeline.Item title="Warning" time="paso 3" tone="warning" />
            <Timeline.Item title="Danger" time="paso 4" tone="danger" />
          </Timeline>
        ),
      },
      {
        name: 'Actividad (left)',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Timeline>
              <Timeline.Item title="Proyecto creado" time="hace 3 d" tone="primary" />
              <Timeline.Item title="Primer screen" time="hace 2 d">
                Se generó la pantalla de login.
              </Timeline.Item>
              <Timeline.Item title="Revisión" time="ayer" tone="danger" />
              <Timeline.Item title="Deploy a prod" time="hoy" tone="primary" />
            </Timeline>
          </div>
        ),
      },
      {
        name: 'Espejo (right)',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Timeline align="right">
              <Timeline.Item title="Creado" time="hace 3 d" tone="primary" />
              <Timeline.Item title="Editado" time="ayer" />
              <Timeline.Item title="Publicado" time="hoy" tone="primary" />
            </Timeline>
          </div>
        ),
      },
      {
        name: 'Zigzag (alternate)',
        render: () => (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <Timeline align="alternate">
              <Timeline.Item title="Carrito" time="10:00" tone="primary" />
              <Timeline.Item title="Envío" time="10:05" />
              <Timeline.Item title="Pago" time="10:07" tone="primary" />
              <Timeline.Item title="Confirmado" time="10:08" tone="primary" />
            </Timeline>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Tag',
    stories: [
      {
        name: 'Removibles',
        render: () => <TagDemo />,
      },
      {
        name: 'Variantes',
        render: () => (
          <div className="sb-row">
            <Tag>Neutral</Tag>
            <Tag variant="primary">Primary</Tag>
            <Tag variant="secondary">Secondary</Tag>
            <Tag variant="tertiary">Tertiary</Tag>
            <Tag variant="accent">Accent</Tag>
            <Tag variant="success">Success</Tag>
            <Tag variant="warning">Warning</Tag>
            <Tag variant="info">Info</Tag>
            <Tag variant="danger">Danger</Tag>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Kbd',
    stories: [
      {
        name: 'Teclas y atajos',
        render: () => (
          <div className="sb-row" style={{ alignItems: 'center' }}>
            <Kbd>Enter</Kbd>
            <Kbd>Esc</Kbd>
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              <Kbd>⌘</Kbd> <Kbd>K</Kbd>
            </span>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Tabs',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ gap: '1.5rem' }}>
            <Tabs defaultValue="a" tone="primary">
              <Tabs.List>
                <Tabs.Tab value="a">Primary</Tabs.Tab>
                <Tabs.Tab value="b">Otro</Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Tabs defaultValue="a" tone="success">
              <Tabs.List>
                <Tabs.Tab value="a">Success</Tabs.Tab>
                <Tabs.Tab value="b">Otro</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        ),
      },
      {
        name: 'Básico',
        render: () => (
          <Tabs defaultValue="perfil">
            <Tabs.List>
              <Tabs.Tab value="perfil">Perfil</Tabs.Tab>
              <Tabs.Tab value="cuenta">Cuenta</Tabs.Tab>
              <Tabs.Tab value="notif">Notificaciones</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="perfil">Datos públicos de tu perfil.</Tabs.Panel>
            <Tabs.Panel value="cuenta">Email, contraseña y seguridad.</Tabs.Panel>
            <Tabs.Panel value="notif">Qué avisos querés recibir.</Tabs.Panel>
          </Tabs>
        ),
      },
    ],
  },
  {
    component: 'Breadcrumb',
    stories: [
      {
        name: 'Rastro',
        render: () => (
          <Breadcrumb>
            <Breadcrumb.Item href="#">Inicio</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Proyectos</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Pigmento</Breadcrumb.Item>
            <Breadcrumb.Item current>skinkit</Breadcrumb.Item>
          </Breadcrumb>
        ),
      },
    ],
  },
  {
    component: 'Pagination',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ gap: '1rem' }}>
            <Pagination page={2} count={5} onPageChange={() => {}} tone="primary" />
            <Pagination page={2} count={5} onPageChange={() => {}} tone="success" />
            <Pagination page={2} count={5} onPageChange={() => {}} tone="danger" />
          </div>
        ),
      },
      {
        name: 'Interactiva',
        render: () => <PaginationDemo />,
      },
    ],
  },
  {
    component: 'Tree',
    stories: [
      {
        name: 'Archivos',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Tree defaultExpanded={['src', 'styles']} label="Archivos">
              <Tree.Item value="src" label="src">
                <Tree.Item value="app" label="App.tsx" />
                <Tree.Item value="styles" label="styles">
                  <Tree.Item value="soft" label="soft.css" />
                  <Tree.Item value="brutal" label="brutal.css" />
                  <Tree.Item value="minimal" label="minimal.css" />
                </Tree.Item>
              </Tree.Item>
              <Tree.Item value="pkg" label="package.json" />
              <Tree.Item value="readme" label="README.md" />
            </Tree>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Disclosure',
    stories: [
      {
        name: 'FAQ',
        render: () => (
          <div style={{ width: '100%', maxWidth: 460 }}>
            <Disclosure defaultOpen>
              <Disclosure.Trigger>¿Qué es un skin?</Disclosure.Trigger>
              <Disclosure.Content>
                Una capa de CSS externo que apunta a los parts. Cambia forma y anatomía sin tocar
                el componente.
              </Disclosure.Content>
            </Disclosure>
            <Disclosure>
              <Disclosure.Trigger>¿Y un theme?</Disclosure.Trigger>
              <Disclosure.Content>Un bundle de tokens de color; cambia solo la paleta.</Disclosure.Content>
            </Disclosure>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Stepper',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ gap: '1.5rem' }}>
            <Stepper active={1} tone="primary">
              <Stepper.Step label="Uno" />
              <Stepper.Step label="Dos" />
              <Stepper.Step label="Tres" />
            </Stepper>
            <Stepper active={1} tone="success">
              <Stepper.Step label="Uno" />
              <Stepper.Step label="Dos" />
              <Stepper.Step label="Tres" />
            </Stepper>
          </div>
        ),
      },
      {
        name: 'Interactivo',
        render: () => <StepperDemo />,
      },
    ],
  },
  {
    component: 'CommandMenu',
    stories: [
      {
        name: 'Paleta ⌘K',
        render: () => <CommandMenuDemo />,
      },
    ],
  },
  {
    component: 'List',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row" style={{ gap: '1rem', alignItems: 'flex-start' }}>
            <List tone="primary">
              <List.Item active title="Primary" />
              <List.Item title="Otro" />
            </List>
            <List tone="success">
              <List.Item active title="Success" />
              <List.Item title="Otro" />
            </List>
          </div>
        ),
      },
      {
        name: 'Filas seleccionables',
        render: () => <ListDemo />,
      },
    ],
  },
  {
    component: 'Highlight',
    stories: [
      {
        name: 'Coincidencias',
        render: () => (
          <div className="sb-col">
            <Highlight text="Componentes headless de React con dos ejes de estilo." query="head" />
            <Highlight text="theme × skin se combinan libremente" query={['theme', 'skin']} />
          </div>
        ),
      },
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col">
            <Highlight text="Resaltado primary" query="primary" tone="primary" />
            <Highlight text="Resaltado accent" query="accent" tone="accent" />
            <Highlight text="Resaltado success" query="success" tone="success" />
            <Highlight text="Resaltado warning" query="warning" tone="warning" />
            <Highlight text="Resaltado danger" query="danger" tone="danger" />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Marquee',
    stories: [
      {
        name: 'Tira',
        render: () => (
          <Marquee speed={18} pauseOnHover>
            <span>skinkit</span>
            <span>·</span>
            <span>headless</span>
            <span>·</span>
            <span>theme × skin</span>
            <span>·</span>
            <span>60+ componentes</span>
            <span>·</span>
          </Marquee>
        ),
      },
    ],
  },
  {
    component: 'HoverCard',
    stories: [
      {
        name: 'Preview',
        render: () => (
          <p>
            Seguí a{' '}
            <HoverCard>
              <HoverCard.Trigger>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  @ana
                </a>
              </HoverCard.Trigger>
              <HoverCard.Content>
                <div className="sb-row" style={{ alignItems: 'center' }}>
                  <Avatar fallback="AN" alt="Ana" />
                  <div>
                    <strong>Ana Pérez</strong>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Diseñadora · 320 seguidores</div>
                  </div>
                </div>
              </HoverCard.Content>
            </HoverCard>{' '}
            para novedades.
          </p>
        ),
      },
    ],
  },
  {
    component: 'Menu',
    stories: [
      {
        name: 'Acciones',
        render: () => (
          <Menu>
            <Menu.Trigger>Opciones ▾</Menu.Trigger>
            <Menu.Content>
              <Menu.Item onSelect={() => {}}>Duplicar</Menu.Item>
              <Menu.Item onSelect={() => {}}>Archivar</Menu.Item>
              <Menu.Item onSelect={() => {}}>Eliminar</Menu.Item>
            </Menu.Content>
          </Menu>
        ),
      },
    ],
  },
  {
    component: 'Popover',
    stories: [
      {
        name: 'Contenido rico',
        render: () => (
          <Popover>
            <Popover.Trigger>¿Ayuda?</Popover.Trigger>
            <Popover.Content>
              <div style={{ maxWidth: 220 }}>
                <strong>¿Qué es un skin?</strong>
                <p style={{ margin: '4px 0 0' }}>
                  Una capa de CSS que cambia la forma sin tocar el componente.
                </p>
              </div>
            </Popover.Content>
          </Popover>
        ),
      },
    ],
  },
  {
    component: 'Tooltip',
    stories: [
      {
        name: 'Lados',
        render: () => (
          <div className="sb-row">
            <Tooltip label="Arriba (default)">
              <Button variant="outlined">Top</Button>
            </Tooltip>
            <Tooltip label="A la derecha" side="right">
              <Button variant="outlined">Right</Button>
            </Tooltip>
            <Tooltip label="Abajo" side="bottom">
              <Button variant="outlined">Bottom</Button>
            </Tooltip>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Alert',
    stories: [
      {
        name: 'Variantes',
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 420 }}>
            <Alert title="Información">Un mensaje neutro para dar contexto.</Alert>
            <Alert variant="primary" title="Novedad">Ya podés elegir tu propio skin.</Alert>
            <Alert variant="success" title="Guardado">Los cambios se guardaron correctamente.</Alert>
            <Alert variant="warning" title="Atención">Tu sesión expira en 5 minutos.</Alert>
            <Alert variant="info" title="Info">Hay una nueva versión disponible.</Alert>
            <Alert variant="danger" title="No se pudo guardar">Revisá tu conexión e intentá de nuevo.</Alert>
          </div>
        ),
      },
      {
        name: 'Con cierre',
        render: () => (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <Alert variant="primary" onClose={() => {}}>
              Alerta con botón de cierre (el onClose lo controla el consumidor).
            </Alert>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Dialog',
    stories: [
      {
        name: 'Tamaños y partes',
        render: () => <DialogDemo />,
      },
      {
        name: 'Drawers (placement)',
        render: () => <DrawerDemo />,
      },
    ],
  },
  {
    component: 'ConfirmDialog',
    stories: [
      {
        name: 'Confirmación',
        render: () => <ConfirmDemo />,
      },
    ],
  },
  {
    component: 'AlertDialog',
    stories: [
      {
        name: 'Aviso',
        render: () => <AlertDemo />,
      },
    ],
  },
  {
    component: 'PromptDialog',
    stories: [
      {
        name: 'Pedir un valor',
        render: () => <PromptDemo />,
      },
    ],
  },
  {
    component: 'Toast',
    stories: [
      {
        name: 'Variantes',
        render: () => <ToastDemo />,
      },
      {
        name: 'Estados',
        // El toast real se dispara con el hook y va a un portal global (no se ve por-skin en el
        // comparador). Acá replicamos el markup/contrato del toast para mostrar cómo lo pinta
        // cada skin en cada variante.
        render: () => (
          <div className="sb-col" style={{ width: '100%', maxWidth: 360 }}>
            {(['neutral', 'primary', 'success', 'warning', 'info', 'danger'] as const).map((v) => (
              <div key={v} data-sk="toast" data-variant={v} role="status">
                <div data-part="content">
                  <div data-part="title">{v[0].toUpperCase() + v.slice(1)}</div>
                  <div data-part="description">Notificación de ejemplo.</div>
                </div>
                <button type="button" data-part="close" aria-label="Cerrar">
                  ×
                </button>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    component: 'Accordion',
    stories: [
      {
        name: 'Single',
        render: () => (
          <Accordion type="single" defaultValue="a">
            <Accordion.Item value="a">
              <Accordion.Trigger>¿Qué es un skin?</Accordion.Trigger>
              <Accordion.Panel>
                Una capa de CSS externo que apunta a los parts. Cambia forma sin tocar el
                componente.
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="b">
              <Accordion.Trigger>¿Y un theme?</Accordion.Trigger>
              <Accordion.Panel>Un bundle de tokens de color. Cambia solo la paleta.</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ),
      },
      {
        name: 'Multiple',
        render: () => (
          <Accordion type="multiple" defaultValue={['a']}>
            <Accordion.Item value="a">
              <Accordion.Trigger>Sección A</Accordion.Trigger>
              <Accordion.Panel>Puede convivir abierta con otras.</Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="b">
              <Accordion.Trigger>Sección B</Accordion.Trigger>
              <Accordion.Panel>Y esta también.</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ),
      },
    ],
  },
  {
    component: 'ComparisonSlider',
    stories: [
      {
        name: 'Antes / después',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <ComparisonSlider
              after={
                <div
                  style={{
                    height: 200,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--sk-surface-2)',
                    color: 'var(--sk-text-muted)',
                    fontSize: '1.5rem',
                  }}
                >
                  Después
                </div>
              }
              before={
                <div
                  style={{
                    height: 200,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--sk-primary)',
                    color: 'var(--sk-on-primary)',
                    fontSize: '1.5rem',
                  }}
                >
                  Antes
                </div>
              }
            />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Menubar',
    stories: [
      {
        name: 'Barra de menús',
        render: () => (
          <Menubar>
            <Menubar.Menu label="Archivo">
              <Menubar.Item onSelect={() => {}}>Nuevo</Menubar.Item>
              <Menubar.Item onSelect={() => {}}>Abrir…</Menubar.Item>
              <Menubar.Item onSelect={() => {}}>Guardar</Menubar.Item>
              <Menubar.Item disabled>Guardar como… (deshabilitado)</Menubar.Item>
            </Menubar.Menu>
            <Menubar.Menu label="Editar">
              <Menubar.Item onSelect={() => {}}>Deshacer</Menubar.Item>
              <Menubar.Item onSelect={() => {}}>Rehacer</Menubar.Item>
            </Menubar.Menu>
            <Menubar.Menu label="Ver">
              <Menubar.Item onSelect={() => {}}>Zoom in</Menubar.Item>
              <Menubar.Item onSelect={() => {}}>Zoom out</Menubar.Item>
            </Menubar.Menu>
          </Menubar>
        ),
      },
    ],
  },
  {
    component: 'BackTop',
    stories: [
      {
        name: 'Volver arriba (en un panel)',
        render: () => <BackTopDemo />,
      },
    ],
  },
  {
    component: 'DataTable',
    stories: [
      {
        name: 'Completa (cliente)',
        render: () => <DataTableDemo />,
      },
      {
        name: 'Básica',
        render: () => (
          <div style={{ width: '100%' }}>
            <DataTable
              data={DEMO_USERS.slice(0, 5)}
              columns={DEMO_COLUMNS}
              rowKey={(u) => u.id}
              pagination="none"
            />
          </div>
        ),
      },
      {
        name: 'Orden + filtro (cliente)',
        render: () => (
          <div style={{ width: '100%' }}>
            <DataTable
              data={DEMO_USERS}
              columns={DEMO_COLUMNS}
              rowKey={(u) => u.id}
              filterable
              pagination="client"
              pageSize={6}
            />
          </div>
        ),
      },
      {
        name: 'Selección + acciones',
        render: () => <DataTableActionsDemo />,
      },
      {
        name: 'Paginado servidor (mock)',
        render: () => <DataTableServerDemo />,
      },
      {
        name: 'Scroll infinito (mock)',
        render: () => <DataTableInfiniteDemo />,
      },
      {
        name: 'Cards',
        render: () => (
          <div style={{ width: '100%' }}>
            <DataTable
              data={DEMO_USERS.slice(0, 6)}
              columns={DEMO_COLUMNS}
              rowKey={(u) => u.id}
              view="cards"
              selection="multiple"
              pagination="none"
            />
          </div>
        ),
      },
      {
        name: 'Densidad compacta',
        render: () => (
          <div style={{ width: '100%' }}>
            <DataTable
              data={DEMO_USERS.slice(0, 8)}
              columns={DEMO_COLUMNS}
              rowKey={(u) => u.id}
              density="compact"
              pagination="none"
            />
          </div>
        ),
      },
      {
        name: 'Vacía',
        render: () => (
          <div style={{ width: '100%' }}>
            <DataTable
              data={[] as DemoUser[]}
              columns={DEMO_COLUMNS}
              rowKey={(u) => u.id}
              pagination="none"
              emptyContent="No hay usuarios todavía"
            />
          </div>
        ),
      },
      {
        name: 'Cargando',
        render: () => (
          <div style={{ width: '100%' }}>
            <DataTable
              data={[] as DemoUser[]}
              columns={DEMO_COLUMNS}
              rowKey={(u) => u.id}
              pagination="none"
              loading
            />
          </div>
        ),
      },
      {
        name: 'Virtualizada (10k filas)',
        render: () => <DataTableVirtualizedDemo />,
      },
    ],
  },
  {
    component: 'Prose',
    stories: [
      {
        name: 'Texto largo',
        render: () => (
          <div style={{ width: '100%', maxWidth: 420 }}>
            <Prose>
              <h2>Título de sección</h2>
              <p>
                Un párrafo con <a href="#comparison">un enlace</a>, algo de{' '}
                <code>código inline</code> y énfasis normal. Prose sólo marca el contenedor; la
                tipografía la pone el skin.
              </p>
              <ul>
                <li>Primer punto</li>
                <li>Segundo punto</li>
              </ul>
              <blockquote>Una cita para probar el borde lateral.</blockquote>
              <pre>
                <code>{'const x = 1\nconsole.log(x)'}</code>
              </pre>
            </Prose>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Grid',
    stories: [
      {
        name: 'Columnas responsive',
        render: () => (
          <div style={{ width: '100%' }}>
            <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={3}>
              {Array.from({ length: 8 }, (_, i) => (
                <LCell key={i}>{i + 1}</LCell>
              ))}
            </Grid>
          </div>
        ),
      },
      {
        name: 'Auto-fit (sin breakpoints)',
        render: () => (
          <div style={{ width: '100%' }}>
            <Grid minChildWidth={120} gap={3}>
              {Array.from({ length: 7 }, (_, i) => (
                <LCell key={i}>#{i + 1}</LCell>
              ))}
            </Grid>
          </div>
        ),
      },
      {
        name: 'Grid.Item (span)',
        render: () => (
          <div style={{ width: '100%' }}>
            <Grid cols={4} gap={3}>
              <Grid.Item colSpan={{ base: 4, md: 2 }}>
                <LCell>Destacado (span 2 en desktop)</LCell>
              </Grid.Item>
              <Grid.Item>
                <LCell>a</LCell>
              </Grid.Item>
              <Grid.Item>
                <LCell>b</LCell>
              </Grid.Item>
            </Grid>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Stack',
    stories: [
      {
        name: 'Columna → fila (responsive)',
        render: () => (
          <div style={{ width: '100%' }}>
            <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
              <LCell>Uno</LCell>
              <LCell>Dos</LCell>
              <LCell>Tres</LCell>
            </Stack>
          </div>
        ),
      },
      {
        name: 'Fila con Spacer',
        render: () => (
          <div style={{ width: '100%' }}>
            <Stack direction="row" align="center" gap={2}>
              <strong>Título</strong>
              <Spacer />
              <Button size="sm">Acción</Button>
            </Stack>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Container',
    stories: [
      {
        name: 'Centrado con ancho máximo',
        render: () => (
          <div style={{ width: '100%', background: 'var(--sk-surface-2)' }}>
            <Container size="sm">
              <LCell>Container size="sm" — centrado, ancho acotado</LCell>
            </Container>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Spacer',
    stories: [
      {
        name: 'Empuja a los extremos',
        render: () => (
          <div style={{ width: '100%' }}>
            <Stack direction="row" align="center" gap={2}>
              <LCell>Izquierda</LCell>
              <Spacer />
              <LCell>Derecha</LCell>
            </Stack>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Field',
    stories: [
      {
        name: 'Envolviendo un control',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Field label="Volumen" htmlFor="vol" helper="Arrastrá para ajustar" required>
              <Slider id="vol" min={0} max={100} defaultValue={40} showValue />
            </Field>
          </div>
        ),
      },
      {
        name: 'Con error',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Field label="Nombre" htmlFor="fn" error="Este campo es obligatorio">
              <Input id="fn" placeholder="Tu nombre" error />
            </Field>
          </div>
        ),
      },
    ],
  },
  {
    component: 'InputGroup',
    stories: [
      {
        name: 'Prefijo y sufijo',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <InputGroup>
              <InputGroup.Addon>$</InputGroup.Addon>
              <Input placeholder="0" />
              <InputGroup.Addon>.00</InputGroup.Addon>
            </InputGroup>
          </div>
        ),
      },
      {
        name: 'Con botón',
        render: () => (
          <div style={{ width: '100%', maxWidth: 360 }}>
            <InputGroup>
              <Input placeholder="Buscar…" />
              <Button>Ir</Button>
            </InputGroup>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Image',
    stories: [
      {
        name: 'Carga',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Image src={DEMO_IMG} alt="Demo" ratio="16/9" rounded />
          </div>
        ),
      },
      {
        name: 'Fallback (src roto)',
        render: () => (
          <div style={{ width: '100%', maxWidth: 320 }}>
            <Image
              src="https://no.existe.local/x.jpg"
              alt="No disponible"
              ratio="16/9"
              rounded
              fallback="Imagen no disponible"
            />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Popconfirm',
    stories: [{ name: 'Confirmar inline', render: () => <PopconfirmDemo /> }],
  },
  {
    component: 'Topbar',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ gap: '1rem', width: '100%' }}>
            <Topbar tone="primary">
              <Topbar.Nav>
                <Topbar.Item active>Primary</Topbar.Item>
                <Topbar.Item>Otro</Topbar.Item>
              </Topbar.Nav>
            </Topbar>
            <Topbar tone="success">
              <Topbar.Nav>
                <Topbar.Item active>Success</Topbar.Item>
                <Topbar.Item>Otro</Topbar.Item>
              </Topbar.Nav>
            </Topbar>
          </div>
        ),
      },
      {
        name: 'Barra superior',
        render: () => (
          <div style={{ width: '100%' }}>
            <Topbar>
              <Topbar.Brand>Pigmento</Topbar.Brand>
              <Topbar.Nav>
                <Topbar.Item href="#" active onClick={(e) => e.preventDefault()}>
                  Inicio
                </Topbar.Item>
                <Topbar.Item href="#" onClick={(e) => e.preventDefault()}>
                  Proyectos
                </Topbar.Item>
                <Topbar.Item href="#" onClick={(e) => e.preventDefault()}>
                  Equipo
                </Topbar.Item>
              </Topbar.Nav>
              <Topbar.Actions>
                <Button size="sm">Nuevo</Button>
                <Avatar fallback="MM" alt="yo" />
              </Topbar.Actions>
            </Topbar>
          </div>
        ),
      },
      { name: 'Navegación activa', render: () => <TopbarNavDemo /> },
      { name: 'Búsqueda + notificaciones + user menu', render: () => <TopbarEnterpriseDemo /> },
      {
        name: 'Con búsqueda',
        render: () => (
          <div style={{ width: '100%' }}>
            <Topbar>
              <Topbar.Brand>Pigmento</Topbar.Brand>
              <div style={{ flex: 1, maxWidth: 360 }}>
                <Input placeholder="Buscar…" />
              </div>
              <Topbar.Actions>
                <Avatar fallback="MM" alt="yo" />
              </Topbar.Actions>
            </Topbar>
          </div>
        ),
      },
      {
        name: 'Sólo marca y acciones',
        render: () => (
          <div style={{ width: '100%' }}>
            <Topbar>
              <Topbar.Brand>Pigmento</Topbar.Brand>
              <Topbar.Actions>
                <Button size="sm" variant="ghost">
                  Ayuda
                </Button>
                <Button size="sm">Entrar</Button>
              </Topbar.Actions>
            </Topbar>
          </div>
        ),
      },
    ],
  },
  {
    component: 'Sidebar',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-row" style={{ gap: '1rem', alignItems: 'flex-start' }}>
            <Sidebar tone="primary">
              <Sidebar.Section label="Primary">
                <Sidebar.Item active>Inicio</Sidebar.Item>
                <Sidebar.Item>Proyectos</Sidebar.Item>
              </Sidebar.Section>
            </Sidebar>
            <Sidebar tone="success">
              <Sidebar.Section label="Success">
                <Sidebar.Item active>Inicio</Sidebar.Item>
                <Sidebar.Item>Proyectos</Sidebar.Item>
              </Sidebar.Section>
            </Sidebar>
          </div>
        ),
      },
      {
        name: 'Con secciones',
        render: () => (
          <div style={{ height: 320, display: 'flex' }}>
            <Sidebar style={{ minHeight: 0 }}>
              <Sidebar.Section label="Principal">
                <Sidebar.Item href="#" icon={<Home size={18} />} active onClick={(e) => e.preventDefault()}>
                  Inicio
                </Sidebar.Item>
                <Sidebar.Item href="#" icon={<Mail size={18} />} badge="3" onClick={(e) => e.preventDefault()}>
                  Mensajes
                </Sidebar.Item>
                <Sidebar.Item href="#" icon={<Folder size={18} />} onClick={(e) => e.preventDefault()}>
                  Proyectos
                </Sidebar.Item>
              </Sidebar.Section>
              <Sidebar.Section label="Cuenta">
                <Sidebar.Item href="#" icon={<Settings size={18} />} onClick={(e) => e.preventDefault()}>
                  Ajustes
                </Sidebar.Item>
              </Sidebar.Section>
            </Sidebar>
          </div>
        ),
      },
      { name: 'Colapsable (botón externo)', render: () => <SidebarCollapsibleDemo /> },
      { name: 'Header + Group colapsable + Footer', render: () => <SidebarGroupDemo /> },
      {
        name: 'Colapsado (rail)',
        render: () => (
          <div style={{ height: 260, display: 'flex' }}>
            <Sidebar collapsed style={{ minHeight: 0 }}>
              <Sidebar.Section label="Principal">
                <Sidebar.Item href="#" icon={<Home size={18} />} active onClick={(e) => e.preventDefault()}>
                  Inicio
                </Sidebar.Item>
                <Sidebar.Item href="#" icon={<Mail size={18} />} onClick={(e) => e.preventDefault()}>
                  Mensajes
                </Sidebar.Item>
                <Sidebar.Item href="#" icon={<Settings size={18} />} onClick={(e) => e.preventDefault()}>
                  Ajustes
                </Sidebar.Item>
              </Sidebar.Section>
            </Sidebar>
          </div>
        ),
      },
    ],
  },
  {
    component: 'BottomNav',
    stories: [
      {
        name: 'Tonos',
        render: () => (
          <div className="sb-col" style={{ gap: '1rem', width: '100%' }}>
            <BottomNav tone="primary">
              <BottomNav.Item icon={<Home size={18} />} active>Inicio</BottomNav.Item>
              <BottomNav.Item icon={<Compass size={18} />}>Explorar</BottomNav.Item>
            </BottomNav>
            <BottomNav tone="success">
              <BottomNav.Item icon={<Home size={18} />} active>Inicio</BottomNav.Item>
              <BottomNav.Item icon={<Compass size={18} />}>Explorar</BottomNav.Item>
            </BottomNav>
          </div>
        ),
      },
      { name: 'Interactivo', render: () => <BottomNavDemo /> },
      {
        name: 'Tres items',
        render: () => (
          <div style={{ width: '100%', maxWidth: 300 }}>
            <BottomNav>
              <BottomNav.Item href="#" icon={<Home size={18} />} active onClick={(e) => e.preventDefault()}>
                Inicio
              </BottomNav.Item>
              <BottomNav.Item href="#" icon={<Compass size={18} />} onClick={(e) => e.preventDefault()}>
                Explorar
              </BottomNav.Item>
              <BottomNav.Item href="#" icon={<User size={18} />} onClick={(e) => e.preventDefault()}>
                Perfil
              </BottomNav.Item>
            </BottomNav>
          </div>
        ),
      },
    ],
  },
  {
    component: 'AppShell',
    stories: [
      { name: 'Shell de app', render: () => <AppShellDemo /> },
      { name: 'Mobile (con BottomNav)', render: () => <AppShellMobileDemo /> },
    ],
  },
  {
    component: 'DynamicForm',
    stories: [
      { name: 'Completo (todo junto)', render: () => <DynamicFormDemo /> },
      { name: 'Básico', render: () => <DFStory schema={DF_BASIC} /> },
      { name: 'Validación Zod', render: () => <DFStory schema={DF_VALIDATION} /> },
      { name: 'Grilla responsive', render: () => <DFStory schema={DF_GRID} /> },
      { name: 'Mostrar/ocultar + condicional', render: () => <DFStory schema={DF_CONDITIONAL} /> },
      { name: 'Valor externo (free/pro)', render: () => <DynamicFormExternalDemo /> },
      { name: 'Subformulario (object)', render: () => <DFStory schema={DF_OBJECT} /> },
      { name: 'Lista (array)', render: () => <DFStory schema={DF_ARRAY} /> },
      { name: 'Todos los tipos de campo', render: () => <DFStory schema={DF_ALLTYPES} /> },
      { name: 'Form externo (tu useForm)', render: () => <DynamicFormExternalFormDemo /> },
    ],
  },
  {
    component: 'RichTextEditor',
    stories: [
      { name: 'Mínimo (sin toolbar)', render: () => <RichTextEditorMinimalDemo /> },
      { name: 'Formato + bloques', render: () => <RichTextEditorFormattingDemo /> },
      { name: 'Link + imagen', render: () => <RichTextEditorLinkImageDemo /> },
      { name: 'Alinear + color + tabla', render: () => <RichTextEditorAlignColorTableDemo /> },
    ],
  },
  {
    component: 'VideoPlayer',
    stories: [{ name: 'Completo', render: () => <VideoPlayerDemo /> }],
  },
  {
    component: 'AudioPlayer',
    stories: [{ name: 'Completo', render: () => <AudioPlayerDemo /> }],
  },
  {
    component: 'FilePreviewer',
    stories: [
      { name: 'Un archivo', render: () => <FilePreviewerSingleDemo /> },
      { name: 'Galería (todos los tipos)', render: () => <FilePreviewerGalleryDemo /> },
      { name: 'Word/Excel (skinkit/file-preview-office)', render: () => <FilePreviewerOfficeDemo /> },
    ],
  },
]
