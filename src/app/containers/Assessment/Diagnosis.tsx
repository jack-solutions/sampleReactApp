import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import decorators from 'react-treebeard/dist/components/Decorators';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import deburr from 'lodash/deburr';

import { searchDisease } from '../../api/assessment';
import Search from './SearchInputs';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { isEmpty } from 'lodash';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { ThemeProvider } from '@material-ui/styles';

import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import ArrowDropDownIcon from '@material-ui/icons/KeyboardArrowRight';

import './index.css';
import { Treebeard } from 'react-treebeard';
import { getBatchDiagnosis, getChildren, getSibblings } from '../../api/assessment';
import { tl } from '../../components/translate';
import Box from '@material-ui/core/Box';
import ChekcIcon from '@material-ui/icons/CheckCircleOutline';
import { setTimeout } from 'timers';
import styles from './Assessment.module.css';
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: '#ff79b0',
      main: pink.A200,
      dark: '#c60055',
      contrastText: '#fff',
    },
  },
});

let compareCode = [];
let timeoutRef;
const CustomHeader = ({ node, style, prefix }) => (
  <div style={style.base}>
    <div style={{ ...style.title, display: 'flex' }}>{`${node.title}`}</div>
  </div>
);
const CutomToggle = ({ node, style, prefix }) => <ArrowDropDownIcon />;

class CutomContainer extends decorators.Container {
  render() {
    const { style, decorators, terminal, onClick, node } = this.props;
    style.header.base = {
      color: '#464646',
      display: 'inline-block',
      verticalAlign: 'top',
    };

    return (
      <Grid container onClick={onClick} ref={(ref) => (this.clickableRef = ref)}>
        <Grid items className={'nodeRef'}>
          {!terminal ? this.renderToggle() : null}
        </Grid>
        <Grid items xs={11} sm={11} lg={11} md={11}>
          <div className={'mrtp6'}>
            <a>{node.title}</a>
          </div>
        </Grid>
      </Grid>
    );
  }
}

let nodesData = [];

const buildItemsHash = (items = [], parentMapHash = {}) => {
  const parentMap = { ...parentMapHash };
  items.forEach((item) => {
    parentMap[item.parentId] = parentMap[item.parentId] || {};
    parentMap[item.parentId][item.id] = item;
  });
  return parentMap;
};

const Leaf = ({ node, checkedLeaf, onCheck, onSelect, selectedTree }) => {
  return (
    <Box
      component="div"
      onClick={() => {
        onCheck(node.id);
        onSelect();
      }}
      display={'flex'}
    >
      {checkedLeaf === node.id && <ChekcIcon />}
      <Typography component="span">
        <Box component="span">
          <>
            {selectedTree == node.id ? (
              <b>
                {node.code}:{node.title}
              </b>
            ) : (
                <>
                  {node.code}:{node.title}
                </>
              )}
          </>
        </Box>
      </Typography>
    </Box>
  );
};

const ChildLeaf = ({ node, selectedTree }) => {
  return (
    <Box component="div" display={'flex'}>
      <Typography component="span">
        <Box component="span">
          <>
            {selectedTree == node.id ? (
              <b>
                {node.code}:{node.title}
              </b>
            ) : (
                <>
                  {node.code}:{node.title}
                </>
              )}
          </>
        </Box>
      </Typography>
    </Box>
  );
};

class Diagnosis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      diseaseList: [],
      diagnosisName: '',
      number: [],
      alphabet: [],
      searchString: undefined,
      buttonData: [],
      modalSearch: '',
      firstSearch: false,
      disabled: false,
      icdDisease: [],
      itemsHash: {},
      checkedLeaf: null,
      suggestions: [],
      query: '',
      timeoutRef: { current: null },
      search: '',
      defaultExpand: [],
      showTree: true,
      clientPhoneNo: '',
      selectedTree: undefined,
    };
  }

  componentDidMount() {
    getBatchDiagnosis().then((res) => {
      this.setState({ icdDisease: res });

      this.setState({ itemsHash: buildItemsHash(res, this.state.itemsHash) });
    });
  }

  renderNodes(parentId = null) {
    return (
      <>
        {this.state.itemsHash[parentId] &&
          Object.values(this.state.itemsHash[parentId]).map((node) =>
            !node.isLeaf ? (
              <TreeItem
                key={node.id}
                nodeId={node.id}
                label={
                  <ChildLeaf
                    name="okhati-icd-leaves"
                    selectedTree={this.state.selectedTree}
                    node={node}
                  />
                }
              >
                {this.state.itemsHash[node.id] ? (
                  this.renderNodes(node.id)
                ) : (
                    <CircularProgress size={16} />
                  )}
              </TreeItem>
            ) : (
                <TreeItem
                  nodeId={node.id}
                  label={
                    <Leaf
                      selectedTree={this.state.selectedTree}
                      name="okhati-icd-leaves"
                      node={node}
                      checkedLeaf={this.state.checkedLeaf}
                      onSelect={() => {
                        setTimeout(() => {
                          this.setState({ open: false });
                        }, 1000);
                      }}
                      onCheck={(id) =>
                        this.setState({
                          checkedLeaf: id,
                          searchString: node.title,
                          diagnosisName: `${node.code} ${node.title}`,
                        }, () => {
                          this.props.makeSetPropsValueFn(
                            {
                              diagnosis: `${node.code} ${node.title}`,
                              icdCode: node.code
                            },
                            'diagnosis',
                          );
                        })
                      }
                    />
                  }
                />
              ),
          )}
      </>
    );
  }

  treeView() {
    return (
      <>
        {this.state.showTree ? (
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={this.state.defaultExpand}
            onNodeToggle={(nodeId) => {
              if (!this.state.itemsHash[nodeId]) {
                getChildren(nodeId).then((res) => {
                  this.setState({ itemsHash: buildItemsHash(res, this.state.itemsHash) });
                });
              }
            }}
          >
            {this.renderNodes()}
          </TreeView>
        ) : (
            ''
          )}
      </>
    );
  }

  async search(q) {
    return new Promise(function (resolve, reject) {
      searchDisease(q).then((result) => {
        resolve(
          result.filter(
            ({ title, code }) =>
              ~title
                .toLowerCase()
                .indexOf(q.toLowerCase() || ~code.toLowerCase().indexOf(q.toLowerCase())),
          ),
        );
      });
    });
  }

  getAncestorsIds = (node, nodes) => {
    const map = nodes.reduce((m, n) => {
      m[n.id] = n;
      return m;
    }, {});
    const parents = [];
    const addParent = (parentId) => {
      parents.push(parentId);
      const parent = map[parentId];
      if (parent) {
        addParent(parent.parentId);
      }
    };
    addParent(node.parentId);
    return parents;
  };

  openTreeFn(node) {
    this.setState({ selectedTree: node.id });
    if (!this.state.itemsHash[node.id]) {
      getSibblings(node.id).then((response) => {
        var allParentIds = this.getAncestorsIds(node, response);
        this.setState(
          {
            defaultExpand: allParentIds,
            itemsHash: buildItemsHash(response, this.state.itemsHash),
            showTree: false,
          },
          () => this.setState({ showTree: true }),
        );
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props.diagnosis && !isEmpty(props.diagnosis) && props.diagnosis.diagnosis) {
      let DiagnosisName =
        (props.diagnosis.code ? props.diagnosis.code : '') + props.diagnosis.diagnosis;
      this.setState({ diagnosisName: DiagnosisName });
    }
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderInput(inputProps) {
    const {
      InputProps,
      clearValue,
      onChange,

      ref,
      ...other
    } = inputProps;

    return (
      <TextField
        disabled={other.edit}
        InputProps={{
          inputRef: ref,

          ...InputProps,
        }}
        {...other}
      />
    );
  }

  renderSuggestion(suggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;

    return (
      <MenuItem {...itemProps} key={suggestion.title} selected={isHighlighted} component="div">
        <Typography variant="body2">{suggestion.title}</Typography>
      </MenuItem>
    );
  }

  getSuggestions(value, { showEmpty = false } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0 && !showEmpty
      ? []
      : this.state.suggestions.filter((suggestion) => {
        const keep = suggestion.title.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }
        return keep;
      });
  }

  getDiseasesSuggestion(event) {
    if (event.length > 2) {
      this.state.timeoutRef.current = setTimeout(
        () => {
          searchDisease(event).then((results) => {
            this.setState({ suggestions: results });
            console.log('resultsresults', results);
          });
        },
        event.length === 3 ? 0 : 500,
      );
    } else if (event.length === 0) {
      this.setState({ suggestions: [] });
    }

    return () => {
      clearTimeout(this.state.timeoutRef.current);
      this.state.timeoutRef.current = null;
    };
  }

  getChildrenFromParentNode(id) {
    getChildren(id).then((res) => {
      console.log(res);
    });
  }

  render(props) {
    const { data } = this.state;
    decorators.Header = CustomHeader;
    decorators.Container = CutomContainer;
    decorators.Toggle = CutomToggle;

    return (
      <React.Fragment>
        <Grid container justify="space-between">
          <FormLabel className="mt20" component="legend">
            <Box fontSize={'14px'} fontWeight={600}>{tl('Diagnosis/ICD')}</Box>
          </FormLabel>

          <Grid item>
            <Button
              disabled={this.props.edit}
              variant="contained"
              onClick={() => {
                this.setState({
                  open: !this.state.open,
                });
              }}
              className="icdBtn ButtonField pull-right"
            >
              {tl('ICD')}
            </Button>
          </Grid>
        </Grid>

        <Grid container justify="space-between">
          <Grid item xs={12}>
            <TextField
              disabled={this.props.edit}
              fullWidth
              id="filled-search"
              onChange={(e) => {
                this.setState({
                  diagnosisName: e.target.value,
                });
                this.props.makeSetPropsValueFn(
                  {
                    diagnosis: e.target.value,
                  },
                  'diagnosis',
                );
              }}
              value={this.state.diagnosisName}
              margin="normal"
              multiline
              rows={1}
              InputProps={
                this.state.diagnosisName.length
                  ? {
                    classes: { root: styles.TextField },
                    endAdornment: (
                      <InputAdornment
                        onClick={() => {
                          this.setState({
                            diagnosisName: '',
                            searchString: '',
                            selectedTree: undefined,
                            checkedLeaf: '',
                            clientPhoneNo: '',
                            defaultExpand: [],
                          });
                          this.treeView();
                        }}
                        position="end"
                      >
                        <i className="material-icons">clear</i>
                      </InputAdornment>
                    ),
                  }
                  : { classes: { root: styles.TextField } }
              }
            />
          </Grid>
        </Grid>
        <Dialog
          fullWidth={true}
          maxWidth={true}
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <MuiDialogTitle disableTypography>
            <Typography variant="h6">
              <b> {tl('Disease Search')}</b>
            </Typography>

            <IconButton aria-label="Close" className="closeBtn" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>

          <DialogContent>
            <Card>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Search
                      searchFn={this.search}
                      onChange={(e) => {
                        this.setState({ clientPhoneNo: e });
                      }}
                      Namevalue={this.state.clientPhoneNo}
                      placeholder="Search ICD"
                      onItemSelect={(e) => {
                        this.setState({
                          showBox: true,
                          clientPhoneNo: e.code + ' ' + e.title,
                        });
                        this.openTreeFn(e);
                      }}
                      itemRenderer={({ title, code }) => (
                        <>
                          <ListItem button>
                            <ListItemText>
                              <div>
                                {code}:{title}
                              </div>
                            </ListItemText>
                          </ListItem>

                          <Divider />
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Grid container>
              <Typography variant="subtitle2" gutterBottom>
                <b>{tl('Disease Classification Tree')}</b>
              </Typography>

              <ThemeProvider theme={theme}>
                <Grid container>{this.treeView()}</Grid>
              </ThemeProvider>
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default Diagnosis;
