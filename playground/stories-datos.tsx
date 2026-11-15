import { useState } from 'react'
import { Disclosure, Heatmap, LocationPicker, ScheduleGrid, SortableList, StackedBar, Textarea } from '../src'
import type { ScheduleGridEntry } from '../src'
import type { StoryGroup } from './stories'

// Historias de los componentes de datos y listas (zona 2). Datos neutros, sin dominio de negocio.

const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

function ScheduleGridDemo() {
  const [extra, setExtra] = useState<Record<string, ScheduleGridEntry[]>>({})
  const base: Record<string, ScheduleGridEntry[]> = {
    'p1:lun': [{ key: 'a', label: '09:00–13:00', state: 'success', stateLabel: 'Confirmado' }],
    'p1:mie': [
      { key: 'b', label: '08:00–12:00', state: 'warning', stateLabel: 'Pendiente' },
      { key: 'c', label: '14:00–18:00', state: 'danger', stateLabel: 'Se encima' },
    ],
    'p2:mar': [{ key: 'd', label: '10:00–16:00', state: 'info', stateLabel: 'Nuevo' }],
    'p3:vie': [{ key: 'e', label: 'Libre', state: 'muted' }],
  }
  const rows = [
    { key: 'p1', label: 'Ana', description: 'Equipo A' },
    { key: 'p2', label: 'Luis', description: 'Equipo B' },
    { key: 'p3', label: 'Marta', description: 'Equipo A' },
  ]
  const columns = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => ({ key: d.toLowerCase().slice(0, 3).replace('é', 'e').replace('á', 'a'), label: d }))
  return (
    <div style={{ width: '100%' }}>
      <ScheduleGrid
        label="Agenda semanal"
        cornerLabel="Persona"
        rows={rows}
        columns={columns}
        entries={(r, c) => [...(base[`${r}:${c}`] ?? []), ...(extra[`${r}:${c}`] ?? [])]}
        onCellClick={(r, c) =>
          setExtra((p) => ({ ...p, [`${r}:${c}`]: [{ key: `n${Date.now()}`, label: 'Nuevo', state: 'info' }] }))
        }
      />
    </div>
  )
}

interface Paso {
  id: string
  texto: string
}

function SortableListDemo() {
  const [pasos, setPasos] = useState<Paso[]>([
    { id: 'a', texto: 'Reunir los materiales' },
    { id: 'b', texto: 'Preparar el área de trabajo' },
    { id: 'c', texto: 'Ejecutar el procedimiento y registrar el resultado' },
  ])
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <SortableList
        label="Pasos"
        value={pasos}
        onChange={setPasos}
        onAdd={() => setPasos((p) => [...p, { id: `n${Date.now()}`, texto: '' }])}
        itemLabel={(_, i) => `paso ${i + 1}`}
        renderItem={(p, { index }) => (
          <Textarea
            aria-label={`Paso ${index + 1}`}
            rows={2}
            value={p.texto}
            onChange={(e) => setPasos((all) => all.map((x) => (x.id === p.id ? { ...x, texto: e.target.value } : x)))}
          />
        )}
      />
    </div>
  )
}

function LocationPickerDemo({ tiles }: { tiles: boolean }) {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>({ lat: 19.4326, lng: -99.1332 })
  const [radio, setRadio] = useState(250)
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <LocationPicker
        value={pos}
        onChange={setPos}
        radius={radio}
        onRadiusChange={setRadio}
        locate
        tileUrl={tiles ? OSM : undefined}
        attribution={tiles ? '© OpenStreetMap contributors' : undefined}
      />
    </div>
  )
}

function CollapsibleDemo() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Disclosure open={open} onOpenChange={setOpen}>
        <Disclosure.Trigger badge={3}>Confirmados hoy</Disclosure.Trigger>
        <Disclosure.Content>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Ana · 09:12</li>
            <li>Luis · 09:40</li>
            <li>Marta · 10:05</li>
          </ul>
        </Disclosure.Content>
      </Disclosure>
    </div>
  )
}

export const STORY_GROUPS_DATOS: StoryGroup[] = [
  {
    component: 'StackedBar',
    stories: [
      {
        name: 'Reparto con leyenda',
        render: () => (
          <div style={{ width: '100%', maxWidth: 480 }}>
            <StackedBar
              label="Tráfico por origen"
              segments={[
                { key: 'a', label: 'Directo', value: 60, tone: 'primary' },
                { key: 'b', label: 'Búsqueda', value: 28, tone: 'success' },
                { key: 'c', label: 'Social', value: 9, tone: 'warning' },
                { key: 'd', label: 'Otros', value: 3, tone: 'danger' },
              ]}
            />
          </div>
        ),
      },
      {
        name: 'Valor pequeño y cero',
        render: () => (
          <div style={{ width: '100%', maxWidth: 480 }}>
            <StackedBar
              label="Tareas"
              formatValue={(s) => String(s.value)}
              segments={[
                { key: 'a', label: 'Hechas', value: 500 },
                { key: 'b', label: 'En curso', value: 2 },
                { key: 'c', label: 'Bloqueadas', value: 0 },
              ]}
            />
          </div>
        ),
      },
    ],
  },
  {
    component: 'Heatmap',
    stories: [
      {
        name: 'Cohortes (con «aún no aplica»)',
        render: () => (
          <div style={{ width: '100%', maxWidth: 520, overflowX: 'auto' }}>
            <Heatmap
              label="Retención por cohorte"
              cornerLabel="Cohorte"
              rows={['Ene', 'Feb', 'Mar', 'Abr'].map((k) => ({ key: k, label: k }))}
              columns={['M0', 'M1', 'M2', 'M3'].map((k) => ({ key: k, label: k }))}
              values={[
                [100, 46, 31, 22],
                [100, 40, 0, null],
                [100, 52, null, null],
                [100, null, null, null],
              ]}
              formatValue={(v) => `${v}%`}
            />
          </div>
        ),
      },
    ],
  },
  { component: 'ScheduleGrid', stories: [{ name: 'Agenda semanal', render: () => <ScheduleGridDemo /> }] },
  { component: 'SortableList', stories: [{ name: 'Pasos editables', render: () => <SortableListDemo /> }] },
  {
    component: 'LocationPicker',
    stories: [
      { name: 'Con teselas OSM', render: () => <LocationPickerDemo tiles /> },
      { name: 'Sin proveedor (cuadrícula + campos)', render: () => <LocationPickerDemo tiles={false} /> },
    ],
  },
]

/** Historia extra del grupo existente «Disclosure»: encabezado con contador (cubre «Collapsible»). */
export const DISCLOSURE_BADGE_STORY = { name: 'Con contador (controlado)', render: () => <CollapsibleDemo /> }
