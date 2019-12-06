import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import OList, { EmptyView, LoadingView } from '../OList';
import { PropsType, DataType } from '../OList/ListInterface';
import Grid from '@material-ui/core/Grid';
import Fuse from 'fuse.js';
import Search from '../Search';
import styles from './styles.module.css';
import './styles.scss';

export interface ListType<T extends DataType> extends PropsType<T> {
  title: string | JSX.Element;
  data: any[];
  createLabel?: string | JSX.Element;
  hideCreateButton?: boolean;
  onEdit?: (id) => void;
  onDelete?: (id) => void;
  onCreateNew?: () => void;
}

const getSearchableColumnKeys = (data) => {
  return Object.keys(data[0] || {});
};

const search = (data, searchText) => {
  let listItems = data;
  if (searchText) {
    const options = {
      id: 'id',
      shouldSort: true,
      tokenize: true,
      threshold: 0.3,
      keys: getSearchableColumnKeys(data),
    };
    const fuse = new Fuse(data, options);
    const ids = fuse.search(searchText);
    listItems = data.filter(({ id }) => ids.includes(String(id)));
  }
  return listItems;
};

export const ListRowActions = ({ onEditRow, onDeleteRow }) => {
  return (
    <>
      <IconButton
        onClick={(e) => {
          onEditRow();
          e.stopPropagation();
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={(e) => {
          onDeleteRow();
          e.stopPropagation();
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  );
};

export const InfoView = ({ children, closeInfo }) => {
  return (
    <div className={styles.rightSide}>
      <IconButton aria-label="delete" className={styles.closeInfo} size="small" onClick={closeInfo}>
        <ClearIcon fontSize="large" />
      </IconButton>
      {children}
    </div>
  );
};

export const ListHeader = ({ createLabel, onCreateClick, onSearch, hideCreateButton, title }) => {
  return (
    <>
      <div className={styles.root}>
        <Grid container>
          <Grid item xs={3} sm={3}>
            <Typography>
              <Box fontSize={'20px'} fontWeight={600} lineHeight={'40px'}>
                {title || ''}
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={9} sm={9}>
            {!hideCreateButton && (
              <Button
                variant="contained"
                color="primary"
                className={styles.button}
                onClick={onCreateClick}
              >
                <Typography variant="button">{createLabel}</Typography>
              </Button>
            )}
            <Search onSearch={onSearch} />
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default class List<T extends DataType> extends React.Component<
  ListType<T>,
  { listItems: Array<T>; searchText: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      listItems: props.data,
      searchText: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      listItems: search(props.data, state.searchText),
    };
  }

  private getChildComponent(componentType) {
    return (
      React.Children.toArray(this.props.children).find((child) => {
        return child.type === componentType;
      }) || null
    );
  }

  private onSearch(searchText = this.state.searchText) {
    this.setState({
      searchText,
      listItems: search(this.props.data, searchText) || this.props.data,
    });
  }

  public render() {
    const { createLabel, title, onCreateNew, data, ...rest } = this.props;
    const infoView = this.getChildComponent(InfoView);
    return (
      <div className={styles.listMainArea}>
        <div className={styles.leftSide}>
          <ListHeader
            title={title}
            onSearch={(searchText) => this.onSearch(searchText)}
            hideCreateButton={rest.hideCreateButton}
            createLabel={createLabel}
            onCreateClick={onCreateNew}
          />
          <div className={styles.listContainer}>
            <OList {...rest} data={this.state.listItems} rowHeight={this.props.rowHeight || 50}>
              <EmptyView>
                <Typography variant="body2">
                  <Box textAlign={'center'} padding={'20px'}>
                    There are no items to display...
                  </Box>
                </Typography>
              </EmptyView>
            </OList>
          </div>
        </div>
        {infoView}
      </div>
    );
  }
}
