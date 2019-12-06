import * as React from 'react';
import times from 'lodash/times';
import * as moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { WeekCalendarHeader } from './WeekCalendar';
import { tl } from '../../translate';
import styles from './WeekEventsCalendar.module.css';

const totalColumnHeight = 2400;

export interface WeekCalendarProps {
  events: Array<any>;
  onWeekChange?: () => void;
  onEventClicked?: () => void;
  onAddSlotsClicked?: () => void;
  selectedDate: moment.Moment | Date;
  renderEventContent: (event, style) => JSX.Element;
}

export default class WeekCalendar extends React.Component<WeekCalendarProps> {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
    };
  }

  getDays(date = this.props.selectedDate || new Date()) {
    const startDay = moment(date).startOf('week');
    const days = [];
    times(7, (i) => {
      days.push(startDay.clone().add(i, 'day'));
    });
    return days;
  }

  getClockStyle() {
    const styles = {
      top: 0,
    };
    const heightPerMs = totalColumnHeight / 86400000;
    const todayAtTweleve = moment().startOf('day');
    styles.top =
      moment.duration(moment(this.state.currentTime).diff(moment(todayAtTweleve))) * heightPerMs;
    return styles;
  }

  getEventsForTheDay(day) {
    if (!this.props.events) return [];
    return this.props.events.filter((e) => {
      return moment(day).isSame(e.from, 'day');
    });
  }

  renderEvents(day: Date) {
    const events = this.getEventsForTheDay(day).map((e, i) => {
      return <div key={i} className={styles.weekcalendarEvent}>{this.props.renderEventContent(e)}</div>;
    });
    return events;
  }

  renderDayColumn(day: Date) {
    return (
      <div key={day.toISOString()} className={styles.weekcalendarDayColumn}>
        <div className={styles.weekcalendarGrid}>
          <div className={styles.weekcalendarEvents}>{this.renderEvents(day)}</div>
        </div>
      </div>
    );
  }

  render() {
    const { events } = this.props;
    return (
      <div className={styles.weekcalendarContainer}>
        {<WeekCalendarHeader days={this.getDays()} hideTimeColumn={true} />}
        {events && events.length == 0 ? (
          <div className={styles.emptyCalendar}>
            <Typography component="div">
              <Box className={styles.emptyCalendarText}>{tl('noCalendarEvents')}</Box>
            </Typography>
          </div>
        ) : (
          <div className={styles.weekcalendarDayColumns} ref="columns">
            {this.getDays().map((day) => this.renderDayColumn(day))}
          </div>
        )}
      </div>
    );
  }
}
