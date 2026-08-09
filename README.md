# skinkit

Componentes headless de React con **dos ejes de estilo independientes**, ambos manejados por **CSS externo** (sin CSS Modules, sin clases hasheadas — todo overrideable desde afuera):

- **Re-look (piel)** → `theme`: un bundle de tokens de color. Cambia la paleta sin tocar nada más.
- **Re-anatomía (esqueleto)** → `skin`: una capa de CSS que cambia forma y estructura. Mismos componentes, otro planeta.

Los dos son ortogonales: `theme` × `skin` se combinan libremente.

## Idea central

Los componentes **no llevan estilo propio**. Solo emiten estructura + un contrato de atributos estables. Todo lo visual vive en CSS externo que apunta a ese contrato. Por eso podés usar un skin nuestro **o escribir el tuyo** sin forkear un solo componente.

## Uso

```tsx
import { SkinkitProvider, Button, Accordion } from 'skinkit'
import 'skinkit/styles/base'   // tokens + themes (paper, dusk)
import 'skinkit/skins/soft'    // elegí un skin… (o el tuyo)

function App() {
  return (
    <SkinkitProvider theme="paper" skin="soft">
      <Button>Hola</Button>
    </SkinkitProvider>
  )
}
```

`SkinkitProvider` solo fija `data-theme` y `data-skin` en un contenedor. Podés setear esos atributos a mano si preferís no usar el provider.

## Contrato de parts

Cada componente expone selectores estables. Un skin (o tu CSS) apunta a ellos:

| Atributo | Qué es |
|----------|--------|
| `[data-sk="button"]` etc. | raíz del componente |
| `[data-part="..."]` | sub-parte (label, icon, header, trigger, panel, indicator…) |
| `[data-variant]`, `[data-size]` | variantes declaradas por props |
| `[data-state="open\|closed"]` | estado (Accordion) |
| `[data-error]` | Input en error |
| `:disabled`, `:focus`, `:hover` | estados nativos |

Parts por componente:

- **Button** — `[data-sk=button]` · parts: `icon`, `label` · `[data-variant]` filled/outlined/ghost · `[data-size]` sm/md/lg
- **Card** — `[data-sk=card]` · parts: `header`, `body`, `footer`
- **Input** — `[data-sk=input]` · `[data-error]` · parts: `label`, `field`, `helper`
- **Accordion** — `[data-sk=accordion]` · parts: `item`, `trigger`, `label`, `indicator`, `panel` · `[data-state]` en item/trigger/panel

El comportamiento (estado, `aria-*`, teclado ↑ ↓ Home End en el Accordion) lo da el componente; el CSS nunca lo toca.

## Cómo agregar un skin

Un skin es **un archivo CSS**, scopeado bajo `[data-skin="<nombre>"]`, que estila los parts. No toca JS.

```css
/* mi-skin.css */
[data-skin='mi-skin'] [data-sk='button'] {
  border-radius: 4px;
  background: var(--sk-primary);   /* color desde el theme activo */
  color: var(--sk-on-primary);
  /* …la forma la ponés vos… */
}
```

Regla de oro: **el color sale de los tokens del theme (`var(--sk-*)`), la forma la pone el skin.** Así un skin nuevo funciona con cualquier theme al instante.

Themes disponibles: `paper`, `dusk`. Skins de referencia: `soft` (redondeado, sombras suaves), `brutal` (recto, borde grueso, mono).

## Playground

```bash
bun install     # o npm install
bun run dev     # vite, http://localhost:3200
```

Muestra los dos skins lado a lado; el selector de theme repinta ambos → ves los dos ejes a la vez.

## Estado

Spike: 4 componentes (Button, Card, Input, Accordion) × 2 skins × 2 themes. Valida que el contrato de parts aguanta dos anatomías distintas antes de escalar al catálogo completo.
