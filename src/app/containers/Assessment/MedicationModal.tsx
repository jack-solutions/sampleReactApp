import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import ButtonGroup from '@material-ui/core/ButtonGroup';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Rating from '@material-ui/lab/Rating';

import Add from '@material-ui/icons/Add';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Input from '@material-ui/core/Input';

import Remove from '@material-ui/icons/Remove';
import FormLabel from '@material-ui/core/FormLabel';

import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import Downshift from 'downshift';

import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';

import { getMedicineSearch } from '../../api/prescrption';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import random from 'lodash/random';
import { tl, t } from '../../components/translate';
import styles from './Assessment.module.css';

import './index.css';

import { Capsules } from '../../Svgicons/Capsules';
import { Cream } from '../../Svgicons/Cream';
import { EyeDrops } from '../../Svgicons/EyeDrop';
import { BodyLotion } from '../../Svgicons/BodyLotion';
import { Pills } from '../../Svgicons/2pills';
import { Flask } from '../../Svgicons/Flask';
import { Gel } from '../../Svgicons/Gel';
import { Inhalator } from '../../Svgicons/Inhalator';
import { Injection } from '../../Svgicons/Injection';
import { MouthWash } from '../../Svgicons/MouthWash';
import { NasalDrops } from '../../Svgicons/NasalDrop';
import { NasalSpray } from '../../Svgicons/NasalSpray';
import { Ointment } from '../../Svgicons/Ointment';
import { Patch } from '../../Svgicons/Patch';
import { Powder } from '../../Svgicons/Powder';
import { Spray } from '../../Svgicons/Spray';
import { DrySyrup } from '../../Svgicons/DrySyrup';
import { Syrup } from '../../Svgicons/Syrup';
import { Vial } from '../../Svgicons/Vial';
import { Ampoul } from '../../Svgicons/Ampoul';
import { Bottle } from '../../Svgicons/Bottle';
import { Cartridge } from '../../Svgicons/Cartridge';
import { SyrupDepo } from '../../Svgicons/Syrupdepo';

interface MedicationProps {
  genericName: string;
  brand: string;
  form: string;
  frequency: number;
  frequencyType: 'daily' | 'monthly';
  meal: 'before' | 'after';
}

interface MedicationModalProps {
  medication: MedicationProps;
  medicationTypes: Array<string>;
  onSave: (medication: MedicationProps) => void;
}

const DisabledButtons = [
  'AMP',
  'Cream',
  'Drop',
  'Ear Drop',
  'Ear/Eye',
  'EYE',
  'Eye drop',
  'Eye Ointment',
  'Gel',
  'Inhaler',
  'Injection',
  'Lotion',
  'Nasal Drop',
  'Nasal Spray',
  'Ointment',
  'PATCH',
  'Spray',
  'VIAL',
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    position: 'relative',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  rating1: {
    display: 'flex',
    alignItems: 'center',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: '32px',
    left: 0,
    right: 0,
    maxHeight: '200px',
    overflow: 'scroll'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
    fontSize: '14px'
  },
  root: {
    flexGrow: 1,
  },
}));

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

const MedicationModal: React.FC<MedicationModalProps> = (props) => {
  const classes = useStyles();

  const medicineType = [
    { type: 'AMP', imageType: Ampoul },
    { type: 'Capsule', imageType: Capsules },
    { type: 'Cartridge', imageType: Cartridge },
    { type: 'Cream', imageType: Cream },
    { type: 'Drop', imageType: EyeDrops },
    { type: 'Dry Syrup', imageType: DrySyrup },
    { type: 'D-SY', imageType: SyrupDepo },
    { type: 'Ear Drop', imageType: EyeDrops },
    { type: 'Ear/Eye', imageType: EyeDrops },
    { type: 'EYE', imageType: EyeDrops },
    { type: 'Eye drop', imageType: EyeDrops },
    { type: 'Eye Ointment', imageType: Ointment },
    { type: 'F-SUS', imageType: Bottle },
    { type: 'Gel', imageType: Gel },
    { type: 'Inhaler', imageType: Inhalator },
    { type: 'Injection', imageType: Injection },
    { type: 'Lotion', imageType: BodyLotion },
    { type: 'Mouthwash', imageType: MouthWash },
    { type: 'Nasal Drop', imageType: NasalDrops },
    { type: 'Nasal Spray', imageType: NasalSpray },
    { type: 'Ointment', imageType: Ointment },
    { type: 'PATCH', imageType: Patch },
    { type: 'Powder', imageType: Powder },
    { type: 'Solution', imageType: Flask },
    { type: 'Spray', imageType: Spray },
    { type: 'Suspension', imageType: Bottle },
    { type: 'Syrup', imageType: Syrup },
    { type: 'Tablet', imageType: Pills },
    { type: 'VIAL', imageType: Vial },
  ];
  const defaultData = {
    genericName: "",
    brand: "",
    form: "Tablet",
    frequency: 3,
    frequencyType: "daily",
    meal: "after",
    days: 7,
    type: Pills
  };
  const [state, setState] = React.useState(defaultData);

  const [modal, setModal] = React.useState(false);
  const [prename, setPrename] = React.useState('');
  const [addMedication, setAddMedication] = React.useState(false);
  const [showError, setError] = React.useState(false);

  const [medication, setPrescription] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    if (props.medication) {
      setPrescription(props.medication)
    }
  }, [props.medication])

  const removeFn = (index) => {
    medication.splice(index, 1);
    setPrescription([...medication]);
    props.removePrescription(medication, 'medication');
  };

  const handleChange = (e) => {
    var existData = suggestions.find((s) => s.id === e.id)

    if (existData && !isEmpty(existData)) {
      var existIconType = medicineType.find((mT) => mT.type === existData.form)
      existData.type = existIconType && existIconType.imageType ? existIconType.imageType : undefined;
      existData.frequency = 3;
      existData.meal = 'after';
      existData.days = 7;
      existData.frequencyType = 'daily';
    }

    if (existData && !isEmpty(existData)) {
      setModal(true);
      setState(existData);
    }
  };

  const saveFn = () => {
    if (!state.brand) {
      setError(true);
    } else {
      setError(false);
      if (state.id) {
        var existIndex = findIndex(suggestions, { id: state.id });

        if (existIndex >= 0) {
          suggestions[existIndex] = state;
        }
      } else {
        state.id = random(0, 100000);
        suggestions.push(state);
      }
      debugger;
      setPrescription([...medication, state]);
      setPrename('');
      setAddMedication(false);
      setModal(false);
      props.makeSetPropsValueFn(state, 'medication');
    }
  };

  function renderInput(inputProps) {
    const { InputProps, clearValue, onChange, classes, ref, ...other } = inputProps;

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
              {other.inputProps.value.length >= 3 ? (
                <>
                  {suggestions && suggestions.length ? (
                    ''
                  ) : (
                      <i
                        onClick={(e) => {
                          setAddMedication(true);
                          setModal(true);
                          setState({ ...defaultData, brand: prename });
                        }}
                        className="material-icons"
                      >
                        add
                    </i>
                    )}
                </>
              ) : (
                  ''
                )}
            </InputAdornment>
          ),
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          },
          ...InputProps,
        }}
        {...other}
      />
    );
  }
  renderInput.propTypes = {
    classes: PropTypes.object.isRequired,
    InputProps: PropTypes.object,
  };

  function renderSuggestion(suggestionProps) {
    var existData = medicineType.find((mT) => mT.type === suggestionProps.suggestion.form);

    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;

    return (
      <MenuItem {...itemProps} key={index} component="div">
        {existData && existData.imageType ? <existData.imageType /> : ''}
        &nbsp;
        <Typography variant="body2">
          <b>
            {suggestion.brand}&nbsp;&nbsp;{suggestion.strength}
          </b>
          <br />
          {suggestion.genericName}
        </Typography>
      </MenuItem>
    );
  }

  renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.number]).isRequired,
    index: PropTypes.number.isRequired,
    itemProps: PropTypes.object.isRequired,
    selectedItem: PropTypes.string.isRequired,
    suggestion: PropTypes.shape({
      genericName: PropTypes.string.isRequired,
    }).isRequired,
  };

  const pointerEvent = {
    'pointer-events': 'none',
  };
  const timeoutRef = React.useRef(null);

  const getSuggestionsDataFn = (data) => {
    if (data.length > 2) {
      timeoutRef.current = setTimeout(
        () => {
          getMedicineSearch(data).then((result) => {
            setSuggestions(result);
          });
        },
        data.length === 3 ? 0 : 500,
      );
    } else if (data.length === 0) {
      setSuggestions([]);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  };
  const paddingTop = {
    'padding-top': '34px',
  };
  return (
    <>
      <Grid container justify="space-between">
        <FormLabel className={'mt20'} component="legend">
          <Box fontSize={'14px'} fontWeight={600}>{tl('Medication')}</Box>
        </FormLabel>
      </Grid>

      <Grid container justify="space-between" className={styles.margin16Top}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Downshift
            inputValue={prename}
            onChange={(event) => {
              setState({ ...state, genericName: event.genericName });
              handleChange(event);
              setPrename(event.genericName);
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
              selectedItem,
            }) => {
              const { onBlur, onChange, onFocus, onClick, ...inputProps } = getInputProps({
                placeholder: t('search_medication'),
                onChange: (event) => {
                  getSuggestionsDataFn(event.target.value);
                  setPrename(event.target.value);
                  if (event.target.value === '') {
                    clearSelection();
                  }
                },
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
                    inputProps,
                  })}

                  <div {...getMenuProps()}>
                    {isOpen ? (
                      <Paper className={classes.paper} square>
                        {suggestions && suggestions.length
                          ? suggestions.map((suggestion, index) =>
                            renderSuggestion({
                              suggestion,
                              index: suggestion.id,
                              itemProps: getItemProps({
                                item: suggestion,
                              }),
                              highlightedIndex,
                              selectedItem,
                            }),
                          )
                          : ''}
                      </Paper>
                    ) : null}
                  </div>
                </div>
              );
            }}
          </Downshift>
        </Grid>
      </Grid>

      {medication && medication.length
        ? medication.map((data, index) => (
          <Grid style={index == 0 ? paddingTop : {}} container justify="space-between">
            <Grid item xs={1}>
              <data.type />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="button" display="block" gutterBottom>
                &nbsp; {data.brand}&nbsp;&nbsp;{data.strength} <br />
                <Typography
                  className="drgGryColor"
                  variant="caption"
                  display="block"
                  gutterBottom
                >
                  &nbsp;&nbsp;{data.genericName}
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={3} className="mrtp3">
              <Typography variant="caption" display="block" gutterBottom>
                &nbsp;{data.frequency} times/day
                  <>{DisabledButtons.includes(data.form) ? '' : <>{data.meal} meal</>}</>
              </Typography>
            </Grid>

            <Grid item xs={3} className={'mrtp3'}>
              <Typography variant="caption" display="block" gutterBottom>
                &nbsp;{data.frequency * data.days} {data.form} ({data.days}{' '}
                {data.frequencyType == 'daily' ? 'days' : 'week'})
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
        : ''}

      <Dialog open={modal} fullWidth="500px">
        <DialogTitle className="slate">
          <Typography>{tl('Create new Medication')}</Typography>
        </DialogTitle>
        <DialogContent>

          <Grid container>
            <Grid className="mt15" item xs={8} md={9} lg={9} sm={9}>
              <FormControl fullWidth error={showError ? true : false}>
                <Input
                  value={state.brand}
                  onChange={(e) => {
                    setState({
                      ...state,
                      brand: e.target.value,
                    })
                    setError(false);
                  }}
                  className={classes.textField}
                  id="component-error"
                  aria-describedby="component-error-text"
                />
                {showError ? (
                  <FormHelperText id="component-error-text">
                    {tl('Medicine name is missing')}
                  </FormHelperText>
                ) : (
                    ''
                  )}
              </FormControl>
            </Grid>

            <Grid className="dropDown" item xs={4} md={3} lg={3} sm={3}>
              <Select
                name="medicationType"
                onChange={(e) => {
                  setState({
                    ...state,
                    form: e.target.value,
                    type: medicineType.find((mT) => mT.type === e.target.value).imageType,
                  });
                }}
                value={state.form}
              >
                {medicineType && medicineType.length
                  ? medicineType.map((data) => (
                    <MenuItem id={data} value={data.type}>
                      {data.type}
                    </MenuItem>
                  ))
                  : ''}
              </Select>
            </Grid>
          </Grid>

          <Grid container className={'mt15'}>
            <Grid item xs={6} md={6} lg={6} sm={6}>
              <Typography component="legend">
                <b>{tl('Frequency')}</b>
              </Typography>
              <div className={classes.rating1}>
                {state.type ? (
                  <StyledRating
                    name="frequency"
                    value={state.frequency}
                    onChange={(e) => {
                      setState({ ...state, frequency: e.target.value });
                    }}
                    icon={<state.type />}
                  />
                ) : (
                    ''
                  )}

                <Box ml={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    <b>{tl('times/day')}</b>
                  </Typography>
                </Box>
              </div>
            </Grid>

            <Grid className="mt10 txtEnd" item xs={6} md={6} lg={6} sm={6}>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  onClick={(e) => {
                    setState({ ...state, meal: 'before' });
                  }}
                  className={
                    state.meal == 'before' ? 'btnPadding mealBackgroundColor' : 'btnPadding'
                  }
                  disabled={DisabledButtons.includes(state.form)}
                >
                  <b>{tl('Before meal')}</b>
                </Button>
                <Button
                  onClick={(e) => {
                    setState({ ...state, meal: 'after' });
                  }}
                  className={
                    state.meal == 'after' ? 'btnPadding mealBackgroundColor' : 'btnPadding'
                  }
                  disabled={DisabledButtons.includes(state.form)}
                >
                  <b>{tl('After meal')}</b>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>

          <Grid container>
            <Grid className="mt10" item xs={5} md={4} lg={4} sm={4}>
              <Typography className={'mrgnBt10'} component="legend">
                <b>{tl('Duration')}</b>
              </Typography>

              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  disabled={state.days <= 1}
                  onClick={(e) => {
                    setState({ ...state, days: state.days - 1 });
                  }}
                >
                  <Remove />
                </Button>

                <TextField
                  id="days"
                  type="number"
                  onChange={(e) => {
                    setState({ ...state, days: e.target.value });
                  }}
                  value={state.days}
                />

                <Button
                  onClick={(e) => {
                    setState({ ...state, days: state.days + 1 });
                  }}
                >
                  <Add />
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid className="daysWeek pdngLft20" item xs={6} md={6} lg={6} sm={6}>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  onClick={(e) => {
                    setState({ ...state, frequencyType: 'daily' });
                  }}
                  className={
                    state.frequencyType == 'daily' ? 'mealBackgroundColor btnPadding' : 'btnPadding'
                  }
                >
                  <b>{tl('Days')}</b>
                </Button>
                <Button
                  onClick={(e) => {
                    setState({ ...state, frequencyType: 'weekly' });
                  }}
                  className={
                    state.frequencyType == 'weekly'
                      ? 'mealBackgroundColor btnPadding'
                      : 'btnPadding'
                  }
                >
                  <b>{tl('Week')}</b>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="actionBackGroundColor">
          <Button
            onClick={(e) => {
              setModal(false);
              setAddMedication(false);
              setPrename('');
            }}
            className="cancelButtonColor"
          >
            {tl('Cancel')}
          </Button>

          <Button className="saveButtonColor" onClick={saveFn} variant={'contained'}>
            {tl('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MedicationModal;
