import * as React from 'react';
import styles from './style.module.css';
import TextField from '@material-ui/core/TextField';
import cloneDeep from 'lodash/cloneDeep';
import MenuItem from '@material-ui/core/MenuItem';
import { validate } from '../../helpers/validators';
import CalendarDropdown from '../../components/CalendarDropdown/CalendarDropdown';
import { tl } from '../../components/translate';

export interface PropType {
  fields: Object[];
  data: {};
  footer?: JSX.Element;
  hideSaveButton?: boolean;
  title?: JSX.Element;
  classNames?: { [key: string]: string };
  onChange?: (data, errors, errorsCount: number) => void;
  onSave?: (data) => void;
  translator?: (label: string) => JSX.Element;
  showErrors?: boolean;
}
export interface StateType {
  data: {};
  errors: {};
  isFocused: boolean;
}

export default class Form extends React.Component<PropType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      errors: {},
      isFocused: false,
    };
  }

  public componentDidMount() {
    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && this.state.isFocused) {
        this.onSave();
      }
    });
  }

  private onChange(key, value) {
    const data = cloneDeep(this.state.data);
    data[key] = value;
    this.setState({ data: data });
    if (this.props.onChange) this.props.onChange(data);
  }

  private validateData() {
    let isValid = true;
    const errors = {};
    let errorsCount = 0;
    this.props.fields.forEach((f) => {
      if (f.validators && f.validators.length) {
        const validationInfo = validate(this.state.data[f.key] || '', f.validators);
        if (!validationInfo.isValid) {
          errors[f.key] = validationInfo.messages;
          isValid = false;
          errorsCount += 1;
        }
      }
    });
    this.setState({ errors }, () => {
      this.props.onChange(this.state.data, errors, errorsCount);
    });
    return isValid;
  }

  private onSave() {
    const isValid = this.validateData();
    if (isValid && this.props.onSave) this.props.onSave(this.state.data);
  }

  private createField(field) {
    const errors = this.state.errors[field.key];
    switch (field.inputType) {
      case 'select':
        return (
          <TextField
            select
            error={this.props.showErrors ? !!errors : false}
            margin="dense"
            label={tl(field.label)}
            className={styles.input}
            value={this.state.data[field.key] || ''}
            onChange={(e) => this.onChange(field.key, e.target.value)}
            onFocus={(e) => this.setState({ isFocused: true })}
            onBlur={(e) => this.setState({ isFocused: false })}
            SelectProps={{
              MenuProps: {
                className: styles.menu,
              },
            }}
            required={field.hasOwnProperty('required') ? field.required : true}
            helperText={field.placeholder}
          >
            {field.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'date':
        return (
          <CalendarDropdown date={this.state.data[field.key] ? new Date(this.state.data[field.key]) : null}
            key={field.key}
            allowNull={true}
            TextFieldProps={{
              className: styles.input,
              margin: "dense"
            }}
            fullwidth={true}
            label={tl(field.label)}
            onChange={(value) => {
              this.setState({ isFocused: false }, () => {
                this.validateData();
                this.onChange(field.key, value.toISOString());
              });
            }} />
        );
      default:
        return (
          <TextField
            margin="dense"
            key={field.key}
            error={this.props.showErrors ? !!errors : false}
            helperText={
              this.props.showErrors ? (
                <>
                  {(errors || []).map((er) => {
                    return (
                      <React.Fragment key={er}>
                        - {er} <br />
                      </React.Fragment>
                    );
                  })}
                </>
              ) : (
                  ''
                )
            }
            className={styles.input}
            onFocus={(e) => this.setState({ isFocused: true })}
            onBlur={(e) => {
              this.setState({ isFocused: false }, () => {
                this.validateData();
              });
            }}
            id="required"
            type={field.inputType || ''}
            {...(field.inputType === 'password' ? { autoComplete: 'new-password' } : {})}
            label={tl(field.label)}
            required={field.hasOwnProperty('required') ? field.required : true}
            defaultValue={this.state.data[field.key] || ''}
            onChange={(e) => this.onChange(field.key, e.target.value)}
          />
        );
    }
  }

  render() {
    const { fields, title, classNames = {} } = this.props;
    return (
      <div className={`${styles.root} ${classNames.root}`}>
        <div className={`${styles.paper} ${classNames.paper}`}>
          {title}
          {fields.map((f) => {
            return this.createField(f);
          })}
          {this.props.footer}
        </div>
      </div>
    );
  }
}
