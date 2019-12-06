import * as React from 'react';
import List, { EmptyView, LoadingView } from '../List';
import ListInterface from '../ListInterface';
import { cloneDeep } from 'lodash/cloneDeep';
import { mount } from 'enzyme';

const columns: ListInterface.ColumnType[] = [
  { key: 'name', sortable: true }
]

const data: ListInterface.DataType[] = [
  { id: 1, name: 'Rapunzel' },
  { id: 2, name: 'Scheherazade' },
  { id: 3, name: 'Iris' },
  { id: 4, name: 'Zara' },
  { id: 5, name: 'Zenisha' }
]

describe('List', () => {
  it(' renders rows', () => {
    const list = mount(<div style={{ height: 400, width: 500 }}>
      <List listHeight={120} listWidth={400} rowHeight={30} columns={columns} data={data} />
    </div>);
    expect(list.find('.okhati-list-row').length).toBe(5);
  });

  it(' renders rows sorted in the order specified', () => {
    const list = mount(<div style={{ height: 400, width: 500 }}>
      <List listHeight={120} listWidth={400} rowHeight={30} columns={columns} data={data} defaultSortColumn={'name'} defaultSortOrder={1} />
    </div>);
    const rows = list.find('.okhati-list-row');
    expect(rows.length).toBe(5);
    expect(rows.at(0).text()).toContain(data[2].name);
    expect(rows.at(1).text()).toContain(data[0].name);
    expect(rows.at(2).text()).toContain(data[1].name);
    expect(rows.at(4).text()).toContain(data[4].name);
  });

  it(' renders rows segmented, segmented by the function provided', () => {
    const _columns = cloneDeep(columns);
    _columns[0] = { key: 'name', sortable: true, segmentable: true, segmentBy: (row) => row.name[0] };
    const list = mount(<div style={{ height: 400, width: 500 }}>
      <List listHeight={900} listWidth={400} rowHeight={30} columns={_columns} data={data} defaultSortColumn={'name'} />
    </div>);
    const rows = list.find('.okhati-list-row');
    expect(rows.length).toBe(9);
    expect(rows.at(0).text()).toContain(data[2].name[0]);
    expect(rows.at(1).text()).toContain(data[2].name);
    expect(rows.at(2).text()).toContain(data[0].name[0]);
    expect(rows.at(3).text()).toContain(data[0].name);
    expect(rows.at(4).text()).toContain(data[1].name[0]);
    expect(rows.at(5).text()).toContain(data[1].name);
    expect(rows.at(6).text()).toContain(data[3].name[0]);
    expect(rows.at(8).text()).toContain(data[4].name);
  });

  it(' sorts and segmentizes rows when sortable-segmentable column header is clicked', () => {
    const _columns = cloneDeep(columns);
    _columns[0] = { key: 'name', sortable: true, segmentable: true, segmentBy: (row) => row.name[0] };
    const list = mount(<div style={{ height: 400, width: 500 }}>
      <List listHeight={900} listWidth={400} rowHeight={30} columns={_columns} data={data} defaultSortColumn={'name'} />
    </div>);
    const rows = list.find('.okhati-list-row');
    list.find('.okhati-list-headercell').at(0).simulate('click');
    expect(rows.length).toBe(9);
    expect(rows.at(0).text()).toContain(data[3].name[0]);
    expect(rows.at(1).text()).toContain(data[4].name);
    expect(rows.at(2).text()).toContain(data[3].name);
    expect(rows.at(3).text()).toContain(data[1].name[0]);
    expect(rows.at(4).text()).toContain(data[1].name);
    expect(rows.at(7).text()).toContain(data[2].name[0]);
    expect(rows.at(8).text()).toContain(data[2].name);
  });

  it(' shows Empty View if the data is unavailable and data is not being loaded', () => {
    const list = mount(<div style={{ height: 400, width: 500 }}>
      <List listHeight={120} listWidth={400} rowHeight={30} columns={columns} data={[]}>
        <EmptyView><div className="empty-view"> I am empty</div></EmptyView>
        <LoadingView><div className="loading-view">Loading</div></LoadingView>
      </List>
    </div>);
    expect(list.find('.empty-view').length).toBe(1);
    expect(list.find('.loading-view').length).toBe(0);
  });

  it(' shows Loading View if the data is being loaded', () => {
    const list = mount(<div style={{ height: 400, width: 500 }}>
      <List listHeight={120} listWidth={400} rowHeight={30} columns={columns} data={[]} isLoading={true}>
        <EmptyView><div className="empty-view"> I am empty</div></EmptyView>
        <LoadingView><div className="loading-view">Loading</div></LoadingView>
      </List>
    </div>);
    expect(list.find('.empty-view').length).toBe(0);
    expect(list.find('.loading-view').length).toBe(1);
  });

});