
export interface DataType {
  id: number | string;
  [key: string]: any;
  __meta__classname?: string;
  __meta__row_type?: 'data_row';
}

export interface SegmentRowType<T> {
  id: string;
  segment: string;
  rows: T[];
  __meta__row_type?: 'segment_summary';
}

export interface ColumnType<T> {
  key: string;
  label?: string | JSX.Element;
  sortable?: boolean;
  sortFunction?: (a: T, b: T) => -1 | 0 | 1;
  formatter?: (row: T) => string | JSX.Element;
  segmentable?: boolean;
  segmentBy?: (row: T) => string;
  cellRenderer?: (row: T) => JSX.Element;
  excludeRowClick?: boolean; // If true, onRowClick() will not be triggered on clicking cells under this column
}

export interface PropsType<T extends DataType> {
  automation: string;
  columns?: Array<ColumnType<T>>;
  data: T[];
  listHeight?: number;
  listWidth?: number;
  multiSelectable?: boolean;
  onMultiSelect?: (selectedIds: number[]) => void;
  rowRenderer?: (row: T, key: string, style: {}) => JSX.Element;
  multiSelectContextHeader?: JSX.Element;
  defaultSortColumn?: string;
  defaultSortOrder?: 1 | -1;
  defaultActiveRow?: string | number;
  segementSummaryRenderer?: (accumulation: SegmentRowType<T>, columnKey: string) => JSX.Element;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  rowHeight?: number;
  activeRow?: string | number | null;
  hideHeader?: boolean;
}
