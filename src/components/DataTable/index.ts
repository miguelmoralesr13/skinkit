export { DataTable } from './DataTable'
export { useDataTable } from './useDataTable'
export type { DataTableModel } from './useDataTable'
export type {
  DataTableProps,
  ColumnDef,
  ColumnAlign,
  CardRole,
  SortState,
  SortDir,
  ViewMode,
  PaginationMode,
  SelectionMode,
  RowKey,
  Row,
} from './types'
// El spec NO se re-exporta acá; se registra en src/catalog/index.ts.
