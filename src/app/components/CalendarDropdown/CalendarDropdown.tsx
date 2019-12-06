import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Calendar, { CalendarFunctions as calFns } from '../Calendar';
import styles from './CalendarDropdown.module.css';
import { tl } from '../translate';
import moment, { Moment } from 'moment';
import { style } from '@material-ui/system';
import { Box } from '@material-ui/core';

export interface CalendarDropdownPropsInterface {
  date?: Date;
  onChange?: (date) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  format?: string;
  withTimeSelector?: boolean;
  TextFieldProps?: any;
  fullwidth?: boolean;
  allowNull?: boolean;
}

interface CalendarDropdownState {
  date: Date;
  open: boolean;
  anchorEl: HTMLElement;
}

export default class CalendarDropdown extends React.Component<
  CalendarDropdownPropsInterface,
  CalendarDropdownState
  > {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date ? this.props.date : (this.props.allowNull ? '' : new Date()),
      open: false,
      anchorEl: null,
    };
  }

  onChange(date) {
    this.setState({
      date,
      open: false,
    });
    this.props.onChange(date);
  }

  getDisplayDate() {
    const { date } = this.state;
    if (!date) return '';
    let formattedDate = calFns.convertADtoBS(date)[this.props.format || 'formatted'];
    if (this.props.withTimeSelector) {
      formattedDate = `${formattedDate} ${moment(this.state.date).format('HH:mm')}`;
    }
    return formattedDate;
  }

  render() {
    return (
      <div>
        <TextField
          fullWidth={this.props.fullwidth ? true : false}
          id="calender"
          label={this.props.label}
          placeholder={this.props.placeholder}
          {...(this.props.TextFieldProps || {})}
          value={this.getDisplayDate()}
          onClick={(e) => this.setState({ open: true, anchorEl: e.currentTarget })}
        />
        <Popover
          className={`${styles.calendarPopover} ${styles.className}`}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={() => {
            this.setState({
              open: false,
              anchorEl: null,
            });
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Calendar
            defaultDate={this.props.date}
            onChange={(d) => {
              const { date } = this.state;
              let dateNew = moment(d)
              if (date) {
                dateNew
                  .set('hour', date.getHours())
                  .set('minute', date.getMinutes());
              }
              this.onChange(dateNew.toDate());
            }}
          />
          {this.props.withTimeSelector && (
            <div className={styles.timeSelect}>
              <Box component={'span'} paddingRight={'16px'}>
                Time{' '}
              </Box>
              <TextField
                id="time"
                type="time"
                variant="outlined"
                value={moment(this.state.date).format('HH:mm')}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 600, // 5 min
                  className: styles.timeSelectorInput,
                }}
                onChange={({ target }) => {
                  const [hour, minute] = target.value.split(':').map(Number);
                  let date: Moment | Date = moment(this.state.date)
                    .set('hour', hour)
                    .set('minute', minute);
                  date = date.toDate();
                  this.setState({ date });
                  this.props.onChange(date);
                }}
              />
            </div>
          )}
        </Popover>
      </div>
    );
  }
}
