import * as React from "react";
import range from "lodash/range";
import times from 'lodash/times';
import * as moment from "moment";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import * as calendarData from '../functions/calendarData';
import * as calendarFns from '../functions/calendarFunctions';
import styles from "./WeekCalendar.module.css";


const totalColumnHeight = 2400;

export interface WeekCalendarProps {
  events: Array<any>
  onWeekChange: () => void
  onEventClicked: () => void
  onAddSlotsClicked: () => void
  selectedDate: moment.Moment | Date
}

export const WeekCalendarHeader =
  ({ days, hideTimeColumn, selectedDay }: { days: Array<moment.Moment>, hideTimeColumn?: boolean, selectedDay: Date | moment.Moment }) => {
    const styleClasses = (day) => {
      let classes = `${styles.weekcalendarHeader}`;
      if (moment(day).isSame(selectedDay, 'day')) classes += ' selectedDay ';
      if (moment().isSame(day, 'day')) classes = `${classes} ${styles.today}`;
      if (day.day() == 6) classes = `${classes} ${styles.weekend}`;
      return classes
    }
    return (
      <div className={styles.weekcalendarHeaders}>
        {!hideTimeColumn && <div className={styles.headerEmptyslot} />}
        {days.map(day => {
          return (
            <div key={day.toString()}
              className={styleClasses(day)}>
              <Typography variant="subtitle1" gutterBottom align="center" className={`${day.day() == 6 ? styles.colorRed : ''}`}>
                <Box fontWeight="500">
                  {calendarData.bsDaysFull[day.day()]}
                </Box>
              </Typography>
              <Typography variant="h4" gutterBottom align="center" className={`${day.day() == 6 ? styles.colorRed : ''}`}>
                {calendarFns.convertADtoBS(day).bsDate}
              </Typography>
            </div>
          );
        })}
      </div>
    );
  }

export default class WeekCalendar extends React.Component<WeekCalendarProps> {

  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date()
    };
  }

  componentDidMount() {
    this.clock = setInterval(() => {
      this.setState({ currentTime: new Date() })
    }, 60000);
    this.scrollToMyClock();
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  scrollToMyClock() { // run this method to execute scrolling. 
    this.refs.columns.scrollTo({
      top: this.refs.clock.offsetTop - 300,
    })
  }

  getDays(date = (this.props.selectedDate || new Date())) {
    const startDay = moment(date).startOf('week');
    const days = [];
    times(7, (i) => {
      days.push(startDay.clone().add(i, 'day'));
    });
    return days;
  }

  getEventStyle(e, i = 0) {
    const styles = {
      height: 10,
      top: 0
    };
    const heightPerMinute = totalColumnHeight / (24 * 60);
    const height = e.duration * heightPerMinute;
    styles.height = height < 16 ? 16 : height;
    const todayAtTweleve = moment(e.until).startOf('day');
    styles.zIndex = i + 100;
    styles.width = '85%';
    styles.top = moment.duration(moment(e.from).diff(moment(todayAtTweleve))) * (totalColumnHeight / 86400000);
    return styles;
  }

  getClockStyle() {
    const styles = {
      top: 0
    };
    const heightPerMs = totalColumnHeight / 86400000;
    const todayAtTweleve = moment().startOf('day');
    styles.top = moment.duration(moment(this.state.currentTime).diff(moment(todayAtTweleve))) * heightPerMs;
    return styles;
  }

  getEventsForTheDay(day) {
    if (!this.props.events) return [];
    return this.props.events.filter((e) => {
      return moment(day).isSame(e.from, 'day');
    })
  }

  renderEvents(day: Date) {
    const events = (
      this.getEventsForTheDay(day).map((e) => {
        return (
          <div
            className={styles.weekcalendarEvent}
            height={this.getEventStyle(e).height}
            style={this.getEventStyle(e)}>
            {
              this.props.renderEventContent(e)
            }
          </div>)
      })
    );
    return events;
  }

  renderDayColumn(day: Date) {
    return (
      <div className={`${styles.weekcalendarDayColumn} ${moment(day).isSame(this.props.selectedDate, 'day') && 'selectedDay'}`}>
        {
          moment().isSame(day, 'day') && (
            <div className={styles.weekcalendarClock} style={this.getClockStyle()} ref={'clock'}>
              <div className={styles.weekcalendarClockBar}></div>
            </div>
          )
        }

        <div className={styles.weekcalendarGrid}>
          <div className={styles.weekcalendarEvents}>{this.renderEvents(day)}</div>
          {range(48).map(i => {
            return (
              <div
                className={`${styles.weekcalendarGridcell} ${i % 2 == 0 ? styles.Hour : ""}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.weekcalendarContainer}>
        {<WeekCalendarHeader days={this.getDays()} />}
        <div className={styles.weekcalendarDayColumns} ref="columns">
          <div className={styles.weekcalendarTimecolumn}>
            {range(48).map(i => {
              return (
                <div
                  className={`${styles.weekcalendarGridcell} ${
                    i % 2 == 0 ? styles.Hour : ""
                    }`}
                >
                  <Typography variant="body1" gutterBottom align="center">
                    {i % 2 == 0 && moment(`${i / 2}`, "H").format("hh:mm A")}
                  </Typography>
                </div>
              );
            })}
          </div>
          {this.getDays().map(day => this.renderDayColumn(day))}
        </div>
      </div>
    );
  }
}
