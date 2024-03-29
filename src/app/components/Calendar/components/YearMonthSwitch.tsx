import styles from './styles.module.css';
import * as React from 'react';
import * as calendarData from '../functions/calendarData';
import * as calFns from '../functions/calendarFunctions';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

enum Switch {
  month,
  year,
}

export interface YearMonthSwitchProps {
  onSwitch: (year: number, month: number) => void;
  defaultYear: number;
  defaultMonth: number;
}

export interface YearMonthSwitchState {
  currentYear: number;
  currentMonth: number;
  activeSwitch: Switch;
}

export default class YearMonthSwitch extends React.Component<
  YearMonthSwitchProps,
  YearMonthSwitchState
> {
  constructor(props) {
    super(props);
    this.state = {
      currentYear: props.defaultYear,
      currentMonth: props.defaultMonth,
      activeSwitch: Switch.month,
    };
  }

  private setCurrent(currentYear = this.state.currentYear, currentMonth = this.state.currentMonth) {
    this.setState({ currentMonth, currentYear });
    this.props.onSwitch(currentYear, currentMonth);
  }

  private goBack() {
    if (
      this.state.activeSwitch === Switch.year &&
      calendarData.minBsYear < this.state.currentYear
    ) {
      this.setCurrent(this.state.currentYear - 1);
    }
    if (this.state.activeSwitch === Switch.month) {
      let currentMonth = this.state.currentMonth - 1;
      let currentYear = this.state.currentYear;
      if (currentMonth == 0) {
        currentMonth = 12;
        currentYear = this.state.currentYear - 1;
      }
      if (calendarData.minBsYear <= currentYear) {
        this.setCurrent(currentYear, currentMonth);
      }
    }
  }

  private goForward() {
    if (
      this.state.activeSwitch === Switch.year &&
      calendarData.maxBsYear > this.state.currentYear
    ) {
      this.setCurrent(this.state.currentYear + 1);
    }
    if (this.state.activeSwitch === Switch.month) {
      let currentMonth = this.state.currentMonth + 1;
      let currentYear = this.state.currentYear;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear = this.state.currentYear + 1;
      }
      if (calendarData.maxBsYear >= currentYear) {
        this.setCurrent(currentYear, currentMonth);
      }
    }
  }

  render(): JSX.Element {
    return (
      <div className={`r-n-cal-switch ${styles.switch}`}>
        <div
          className={`r-n-cal-backBtn ${styles.btns} ${styles.backBtn}`}
          onClick={() => this.goBack()}
        >
          <ArrowLeftIcon />
        </div>
        <div
          className={`r-n-cal-yearBtn ${styles.btns} ${styles.btns} ${
            this.state.activeSwitch == Switch.year ? styles.activeSwitch : ''
          }`}
          onClick={() => this.setState({ activeSwitch: Switch.year })}
        >
          {calFns.toDevanagariDigits(this.state.currentYear)}
        </div>
        <div
          className={`r-n-cal-monthBtn ${styles.btns} ${styles.btns}  ${
            this.state.activeSwitch == Switch.month ? styles.activeSwitch : ''
          }`}
          onClick={() => this.setState({ activeSwitch: Switch.month })}
        >
          {calendarData.bsMonths[this.state.currentMonth - 1]}
        </div>
        <div
          className={`r-n-cal-forwardBtn ${styles.btns} ${styles.forwardBtn}`}
          onClick={() => this.goForward()}
        >
          <ArrowRightIcon />
        </div>
      </div>
    );
  }
}
