import React from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import { getBatchSymptoms } from "../../api/assessment";
import "./index.css";
import { tl, t } from "../../components/translate";
import { Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
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
  divider: {
    height: theme.spacing(2)
  }
}));

let suggestions = [];
let overallCount = 0;
function renderInput(inputProps) {
  const { InputProps, clearValue, classes, ref, ...other } = inputProps;
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
                  <i className="material-icons">clear</i>
                ) : (
                    <i
                      onClick={() => {
                        other.selectedItem.push({
                          symptom: other.inputProps.value
                        });
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
          input: classes.inputInput,
          inputResetButton: classes.inputResetButton
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
  const isSelected = (selectedItem || "").indexOf(suggestion.symptom) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.symptom}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.symptom}
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
    label: PropTypes.string.isRequired
  }).isRequired
};

function getSuggestions(value, { showEmpty = false } = {}) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  overallCount = 0;
  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 &&
        suggestion.symptom.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
        overallCount += 1;
      }

      return keep;
    });
}

function DownshiftMultiple(props) {
  const { classes } = props;

  const [inputValue, setInputValue] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState([]);

  React.useEffect(() => {
    setSelectedItem(props.symptoms);
  }, [props.symptoms]);

  function handleKeyDown(event) {
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleChange(item) {
    let newSelectedItem = [...selectedItem];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    setSelectedItem(newSelectedItem);
    props.makeSetPropsValueFn(newSelectedItem, "symptoms");

  }

  const handleDelete = item => () => {
    const newSelectedItem = [...selectedItem];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    setSelectedItem(newSelectedItem);
    props.makeSetPropsValueFn(newSelectedItem, "symptoms");
  };
  return (
    <Downshift
      className="pointerNone"
      id="downshift-multiple"
      inputValue={inputValue}
      onChange={handleChange}
      selectedItem={selectedItem}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        inputValue: inputValue2,
        selectedItem: selectedItem2,
        highlightedIndex
      }) => {
        const {
          onBlur,
          onChange,
          onFocus,
          ...inputProps
        } = getInputProps({
          onKeyDown: handleKeyDown,
          placeholder: t("Search for symptoms")
        });



        return (
          <div className={classes.container}>
            <div>
              {selectedItem && Array.isArray(selectedItem) &&
                selectedItem.map(item => (
                  <Chip
                    tabIndex={-1}
                    key={item.symptom}
                    label={item.symptom}
                    className={classes.chip}
                    {...(props.edit ? {} : { onDelete: handleDelete(item) })}
                  />
                ))}
            </div>
            <>
              {renderInput({
                fullWidth: true,
                save: props.save,
                edit: props.edit,
                classes,
                selectedItem: selectedItem,
                InputLabelProps: getLabelProps(),
                InputProps: {
                  onBlur,
                  onChange: event => {
                    handleInputChange(event);
                    onChange(event);
                  },
                  onFocus,
                  clearValue: () => {

                    setInputValue("");
                  }
                },
                inputProps
              })}
            </>

            {isOpen ? (
              <Paper className={classes.paper} square>
                {getSuggestions(inputValue2).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem: selectedItem2
                  })
                )}
              </Paper>
            ) : null}
          </div>
        );
      }}
    </Downshift>
  );
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired
};

export default function IntegrationDownshift(props) {
  const classes = useStyles();



  React.useEffect(() => {
    getSymptomsData();
  }, []);

  const getSymptomsData = () => {
    getBatchSymptoms().then(res => {
      suggestions = res;
    });
  };

  const pointeNone = {
    "pointer-events": "none"
  };

  return (
    <>
      <Grid container justify="space-between">
        <FormLabel component="legend">
          <Box fontSize={'14px'} fontWeight={600}>{tl("Chief complaints")}</Box>
        </FormLabel>
      </Grid>
      <div className={classes.root} style={props.edit ? pointeNone : {}}>
        <div className={classes.divider} />
        <DownshiftMultiple
          edit={props.edit}
          save={props.save}
          makeSetPropsValueFn={props.makeSetPropsValueFn}
          classes={classes}
          symptoms={props.symptoms}
        />
      </div>
    </>
  );
}
