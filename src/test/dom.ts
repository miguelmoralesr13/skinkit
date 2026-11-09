import { GlobalRegistrator } from '@happy-dom/global-registrator'

/**
 * Entorno de navegador (happy-dom) para las pruebas que montan componentes con `react-dom/client`.
 * Se importa PRIMERO en esa prueba (`import '../../test/dom'`); las pruebas con `react-dom/server`
 * no lo necesitan.
 */
if (typeof document === 'undefined') {
  GlobalRegistrator.register({ url: 'http://localhost/', width: 1024, height: 768 })
}
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
