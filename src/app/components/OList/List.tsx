import './List.scss';
import * as React from 'react';
import * as ListInterface from './ListInterface';
import ListActions from './ListActions';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import VirtualizedList from 'react-virtualized/dist/commonjs/List'
import CheckBox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp';

export enum SORT_ORDER {
  ASC = 1,
  DESC = -1,
}
interface State<T> {
  activeColumn: string;
  activeRow: string | number;
  sortOrder: number; // -1 | 1
  processedData: Array<T | ListInterface.SegmentRowType<T>>;
  originalData: ListInterface.DataType[];
  selectedRows: { [key: string]: boolean };
}

export const EmptyView = (props) => {
  return <div style={{ height: '100%', width: '100%' }}>{props.children}</div>;
};

export const LoadingView = (props) => {
  return <div style={{ height: '100%', width: '100%' }}>{props.children}</div>;
};

export default class List<T extends ListInterface.DataType> extends React.Component<
  ListInterface.PropsType<T>,
  State<T>
> {
  public static sortFunction = (key) => (a, b) =>
    a[key] > b[key] ? 1 : a[key] === b[key] ? 0 : -1;

  public static sortData = (data, sortOrder, sortFunction) => {
    return data.sort((a, b) => sortOrder * sortFunction(a, b));
  };

  /**
   * Inserts Segment row data to the data array.
   *
   * @static
   * @memberof List
   */
  public static segmentize<U>(rowData, segmentBy) {
    const segmentedData = [];
    let currentSegment: ListInterface.SegmentRowType<U>;
    rowData.forEach((datum) => {
      const segment = segmentBy(datum);
      if (!currentSegment || currentSegment.segment !== segment) {
        currentSegment = {
          id: btoa(unescape(encodeURIComponent(segment))),
          segment,
          rows: [],
          __meta__row_type: 'segment_summary',
        };
        segmentedData.push(currentSegment);
      }
      currentSegment.rows.push(datum);
      segmentedData.push(datum);
    });
    return segmentedData;
  }

  constructor(props) {
    super(props);
    this.state = {
      activeColumn: props.defaultSortColumn,
      activeRow: props.defaultActiveRow,
      sortOrder: props.defaultSortOrder || 1,
      originalData: props.data,
      processedData: props.data,
      selectedRows: {},
    };
  }

  public componentDidMount() {
    const activeColumnConfig = this.columnConfig();
    if (activeColumnConfig && activeColumnConfig.sortable) {
      this.setState({ processedData: this.processData() });
    }
  }

  public componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      const state = {
        originalData: nextProps.data,
        processedData: this.processData(nextProps.data),
      };
      if (this.props.multiSelectable) {
        state['selectedRows'] = this.trimSelectedRows(nextProps.data);
      }
      this.setState(state);
    }
    if (
      nextProps.defaultSortColumn &&
      nextProps.defaultSortColumn !== this.props.defaultSortColumn
    ) {
      this.setState({
        activeColumn: nextProps.defaultSortColumn,
      });
    }
  }

  private trimSelectedRows(newData) {
    if (!Object.keys(this.state.selectedRows).length) {
      return {};
    }
    const selectedRows = {};
    newData.forEach((el) => {
      if (this.state.selectedRows[el.id]) {
        selectedRows[el.id] = true;
      }
    });
    return selectedRows;
  }

  private onColumnHeaderClick(column) {
    const sortOrder = this.state.activeColumn === column ? this.state.sortOrder * -1 : 1;
    this.setState({
      activeColumn: column,
      sortOrder: sortOrder,
      processedData: this.processData(this.props.data, sortOrder, column),
    });
  }

  private onRowClick(row, excludeRowClick: boolean = false) {
    if (excludeRowClick) {
      return;
    }
    if (this.props.activeRow === undefined) {
      this.setState({ activeRow: row.id });
    }
    if (this.isAtleastOneSelected() && !this.state.selectedRows[row.id]) {
      this.clearAllSelected();
    }

    if (this.props.onRowClick) {
      this.props.onRowClick(row);
    }
  }

  private columnConfig(activeColumn = this.state.activeColumn) {
    return this.props.columns.find((c) => c.key === activeColumn);
  }

  private processData(
    data = this.props.data,
    order = this.state.sortOrder,
    column = this.state.activeColumn,
  ) {
    const columnConfig = this.columnConfig(column);
    if (data.length === 0 || !columnConfig) {
      return data;
    }
    const { sortable, segmentable, sortFunction } = columnConfig;
    let processedData = cloneDeep(data);
    if (sortable) {
      processedData = List.sortData(
        processedData,
        order,
        sortFunction ? sortFunction : List.sortFunction(column),
      );
    }
    if (segmentable) {
      processedData = this.segmentizeData(processedData, column);
    }
    return processedData;
  }

  private segmentizeData(data, column = this.state.activeColumn) {
    const { segmentable, segmentBy } = this.columnConfig(column);
    let segmentedData = data;
    if (segmentable && segmentBy) {
      segmentedData = List.segmentize(data, segmentBy);
    }
    return segmentedData;
  }

  private getChildComponent(componentType) {
    return (
      React.Children.toArray(this.props.children).find((child) => {
        return child.type === componentType;
      }) || null
    );
  }

  private getActiveRow() {
    return this.props.hasOwnProperty('activeRow') ? this.props.activeRow : this.state.activeRow;
  }
  private selectRowToggle(id) {
    const selectedRows = Object.assign({}, this.state.selectedRows);
    selectedRows[id] = !selectedRows[id];
    if (!selectedRows[id]) {
      delete selectedRows[id];
    }
    this.setState({ selectedRows });
    if (this.props.onMultiSelect) {
      this.props.onMultiSelect(
        Object.keys(selectedRows)
          .filter((id) => selectedRows[id])
          .map((id) => Number(id)),
      );
    }
  }

  private selectAllRowsToggle() {
    let selectedRows = {};
    if (Object.keys(this.state.selectedRows).length < this.props.data.length) {
      selectedRows = this.props.data.reduce((acc, d) => {
        acc[d.id] = true;
        return acc;
      }, {});
    } else {
      selectedRows = {};
    }
    this.setState({ selectedRows: selectedRows }, () => {
      if (this.props.onMultiSelect) {
        this.props.onMultiSelect(Object.keys(selectedRows));
      }
    });
  }

  private clearAllSelected() {
    this.setState({ selectedRows: {} });
    if (this.props.onMultiSelect) {
      this.props.onMultiSelect([]);
    }
  }

  private areAllRowsSelected() {
    const selectedRows = Object.keys(this.state.selectedRows);
    return selectedRows.length && selectedRows.length === this.props.data.length;
  }

  private isMultiSelected() {
    return Object.values(this.state.selectedRows).filter((v) => v).length > 1;
  }

  private isAtleastOneSelected() {
    return Object.values(this.state.selectedRows).find((v) => v);
  }

  private renderColumnHeaders() {
    const headers = [];
    if (this.props.multiSelectable) {
      headers.push(
        <div key={'selectHeader'} className="okhati-list-headercell">
          <CheckBox
            value={this.areAllRowsSelected()}
            onChange={(e) => {
              this.selectAllRowsToggle();
            }}
          />
        </div>,
      );
    }
    if (
      this.props.multiSelectable &&
      this.isMultiSelected() &&
      this.props.multiSelectContextHeader
    ) {
      headers.push(this.props.multiSelectContextHeader);
    } else {
      this.props.columns.forEach((c) => {
        let caret;
        const classes = `okhati-list-headercell headercell-${c.key}`;
        if (this.state.activeColumn === c.key && this.columnConfig(c.key).sortable) {
          caret = this.state.sortOrder === 1 ? <ArrowUpIcon /> : <ArrowDownIcon />;
        }
        headers.push(
          <div
            key={c.key}
            className={classes}
            data-automation={`${this.props.automation}-column-header-${c.key}`}
            onClick={() => this.onColumnHeaderClick(c.key)}
          >
            <Typography variant={'caption'}>
              <Box component="span" fontSize={'0.8rem'} fontWeight={500}>
                {c.label || c.key}
              </Box>
            </Typography>
            {caret}
          </div>,
        );
      });
    }
    if (this.getChildComponent(ListActions)) {
      headers.push(
        <div key="okhati-list-actions" className="okhati-list-headercell actions">
          {this.renderListActions()}
        </div>,
      );
    }
    return headers;
  }

  private renderSegment(datum, datumKey, style) {
    const { key } = this.columnConfig();
    return (
      <div key={datumKey} className="okhati-list-row okhati-list-segment-sumary" style={style}>
        {this.props.segementSummaryRenderer
          ? this.props.segementSummaryRenderer(datum, key)
          : datum.segment}
      </div>
    );
  }

  private getRowCells(datum) {
    let rowCells = this.props.columns.map((c) => {
      const { formatter, cellRenderer } = this.columnConfig(c.key);
      const classes = `okhati-list-rowcell rowcell-${c.key}`;
      return (
        <div
          key={c.key}
          className={classes}
          data-automation={`${this.props.automation}-column-cell-${c.key}`}
          onClick={() => this.onRowClick(datum, c.excludeRowClick)}
        >
          {cellRenderer
            ? cellRenderer(datum)
            : formatter
            ? formatter(datum)
            : <Typography variant="body2">{datum[c.key]}</Typography> || ''}
        </div>
      );
    });
    if (this.props.multiSelectable) {
      const rowSelectCell = (
        <div key={'selectorCell'} className="okhati-list-rowcell">
          <CheckBox
            value={!!this.state.selectedRows[datum.id]}
            onChange={(d, e) => {
              this.selectRowToggle(datum.id);
              e.stopPropagation();
            }}
          />
        </div>
      );
      rowCells = [rowSelectCell].concat(rowCells);
    }
    return rowCells;
  }

  private renderRow({ index, isScrolling, key, style }) {
    const datum = this.state.processedData[index];
    const isMultiSelected = this.state.selectedRows[datum.id];
    if (datum.__meta__row_type === 'segment_summary') {
      return this.renderSegment(datum, key, style);
    }
    if (this.props.rowRenderer) {
      return this.props.rowRenderer(datum, key, style);
    }
    const className = `okhati-list-row ${
      this.getActiveRow() === datum.id || isMultiSelected ? 'active' : ''
    }`;
    return (
      <div
        key={key}
        className={`${className} ${datum.__meta__classname || ''}`}
        style={style}
        data-automation={`${this.props.automation}-row-${datum.id}`}
        onClick={() => this.onRowClick(datum)}
      >
        {this.getRowCells(datum)}
      </div>
    );
  }

  public renderListActions() {
    const listActions = this.getChildComponent(ListActions);
    if (listActions) {
      return (
        <ListActions {...listActions.props} getProcessedData={() => this.state.processedData} />
      );
    }
  }

  public render() {
    return (
      <div className="okhati-list-container" data-automation={this.props.automation}>
        {!this.props.hideHeader && (
          <div className="okhati-list-header">{this.renderColumnHeaders()}</div>
        )}
        {this.props.isLoading && this.getChildComponent(LoadingView)}
        {!this.props.isLoading &&
          this.state.processedData.length === 0 &&
          this.getChildComponent(EmptyView)}
        <div className="okhati-list-rows">
          <AutoSizer sortState={this.state.sortOrder} activeColumn={this.state.activeColumn}>
            {({ height, width }) => (
              <VirtualizedList
                height={this.props.listHeight || height}
                width={this.props.listWidth || width}
                rowCount={this.state.processedData.length}
                rowHeight={this.props.rowHeight}
                rowRenderer={this.renderRow.bind(this)}
                sortState={this.state.sortOrder + this.state.activeColumn}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
