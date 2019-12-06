import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import InputAdornment from "@material-ui/core/InputAdornment";

import FormLabel from "@material-ui/core/FormLabel";

import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Downshift from "downshift";

import Paper from "@material-ui/core/Paper";

import { getLabTest } from "../../api/assessment";
import _ from "underscore";

import { tl, t } from "../../components/translate";
import { Box } from '@material-ui/core';
import styles from './Assessment.module.css';

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    position: "relative"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  rating1: {
    display: "flex",
    alignItems: "center"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: "32px",
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1,
    fontSize: '14px'
  },
  root: {
    flexGrow: 1
  }
}));
const LabTest: React.FC<> = props => {
  const classes = useStyles();
  const [prename, setPrename] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [prescription, setPrescription] = React.useState([]);
  const [overallCount, setoverallCount] = React.useState(0);
  React.useEffect(() => {
    getLabTest().then(response => {
      setSuggestions(response);
    });
  }, []);

  React.useEffect(() => {
    setPrescription(props.tests);
  });
  function renderInput(inputProps) {
    const {
      InputProps,
      clearValue,
      onChange,
      classes,
      ref,
      ...other
    } = inputProps;

    return (
      <TextField
        disabled={other.edit}
        InputProps={{
          endAdornment: (
            <InputAdornment
              onClick={InputProps.clearValue}
              position="start"
              className="inputResetButton"
            >
              {other.inputProps.value.length ? (
                <>
                  {overallCount > 0 ? (
                    ""
                  ) : (
                      <i
                        onClick={() => {
                          handleChange({ test: other.inputProps.value }, "add");
                        }}
                        className="material-icons"
                      >
                        add
                    </i>
                    )}
                </>
              ) : (
                  ""
                )}
            </InputAdornment>
          ),
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput
          },
          ...InputProps
        }}
        {...other}
      />
    );
  }
  renderInput.propTypes = {
    classes: PropTypes.object.isRequired,
    InputProps: PropTypes.object
  };

  function renderSuggestion(suggestionProps) {
    const {
      suggestion,
      index,
      itemProps,
      highlightedIndex,
      selectedItem
    } = suggestionProps;
    const isHighlighted = highlightedIndex === index;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.test}
        selected={isHighlighted}
        component="div"
      >
        <Typography variant="body2">{suggestion.test}</Typography>
      </MenuItem>
    );
  }

  renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.number
    ]).isRequired,
    index: PropTypes.number.isRequired,
    itemProps: PropTypes.object.isRequired,
    selectedItem: PropTypes.string.isRequired,
    suggestion: PropTypes.shape({
      test: PropTypes.string.isRequired
    }).isRequired
  };

  function getSuggestions(value, { showEmpty = false } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0 && !showEmpty
      ? []
      : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.test.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        setoverallCount(count);

        return keep;
      });
  }

  const handleChange = (data, addNew) => {
    let labTestListingData = [...prescription];
    labTestListingData.push(
      addNew == "add"
        ? { test: data.test }
        : { code: data.code, test: data.test }
    );
    setPrescription(labTestListingData);
    props.makeSetPropsValueFn(labTestListingData, "tests");
    setPrename("");
  };
  const removeFn = index => {
    prescription.splice(index, 1);
    setPrescription([...prescription]);
  };

  const paddingTop = {
    "padding-top": "34px"
  };
  const pointerEvent = {
    "pointer-events": "none"
  };
  return (
    <>
      <Grid container justify="space-between">
        <FormLabel className="mt20" component="legend">
          <Box fontSize={'14px'} fontWeight={600}>{tl("Lab Test")}</Box>
        </FormLabel>
      </Grid>

      <Grid container justify="space-between" className={styles.margin16Top}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Downshift
            inputValue={prename}
            onChange={event => {
              handleChange(event);
              setPrename("");
            }}
            id="downshift-simple"
          >
            {({
              clearSelection,
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              highlightedIndex,
              inputValue,
              isOpen,
              selectedItem
            }) => {
              const {
                onBlur,
                onChange,
                onFocus,
                onClick,
                ...inputProps
              } = getInputProps({
                placeholder: t("Search Lab Test"),
                onChange: event => {
                  setPrename(event.target.value);
                  if (event.target.value === "") {
                    clearSelection();
                  }
                }
              });

              return (
                <div className={classes.container}>
                  {renderInput({
                    fullWidth: true,
                    classes,
                    save: props.save,
                    edit: props.edit,
                    InputLabelProps: getLabelProps({ shrink: true }),
                    InputProps: { onBlur, onChange, onFocus },
                    inputProps
                  })}

                  <div {...getMenuProps()}>
                    {isOpen ? (
                      <Paper className={classes.paper} square>
                        {getSuggestions(inputValue).map((suggestion, index) =>
                          renderSuggestion({
                            suggestion,
                            index,
                            itemProps: getItemProps({
                              item: suggestion
                            }),
                            highlightedIndex,
                            selectedItem
                          })
                        )}
                      </Paper>
                    ) : null}
                  </div>
                </div>
              );
            }}
          </Downshift>
        </Grid>
      </Grid>

      {prescription && Array.isArray(prescription)
        ? prescription.map((data, index) => (
          <Grid
            style={index == 0 ? paddingTop : {}}
            container
            justify="space-between"
          >
            <Grid item xs={1}>
              {index + 1}
            </Grid>
            <Grid item xs={9}>
              <Typography variant="button" display="block" gutterBottom>
                {data.test}
              </Typography>
            </Grid>

            <Grid item xs={2} className="txtEnd">
              <i
                style={props.edit ? pointerEvent : {}}
                onClick={() => {
                  removeFn(index);
                }}
                className="material-icons"
              >
                clear
                </i>
            </Grid>
          </Grid>
        ))
        : ""}
    </>
  );
};

export default LabTest;
