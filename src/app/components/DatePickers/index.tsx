import * as React from 'react';
import Calendar, { CalendarFunctions as calFns, CalendarData as calData } from '../Calendar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import * as moment from 'moment';
import Popover from '@material-ui/core/Popover';
import styles from './style.module.css';
import { tl } from '../translate';

interface PropsType {
  date: moment.Moment | Date;
  onChange: (date: moment.Moment) => void;
}

interface StateType {
  selectedDate: moment.Moment;
  openCalendar: boolean;
  anchorEl: HTMLElement;
}
export class DatePickers extends React.Component<PropsType, StateType> {
  today: moment.Moment;
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      selectedDate: moment(this.props.date) || moment(),
      openCalendar: false,
      anchorEl: null,
    };
    this.today = moment();
  }

  next() {
    this.setState({ selectedDate: this.state.selectedDate.clone().add(1, 'd') }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.selectedDate.clone());
      }
    });
  }

  previous() {
    this.setState({ selectedDate: this.state.selectedDate.clone().subtract(1, 'd') }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.selectedDate.clone());
      }
    });
  }

  onChange(date) {
    this.setState({
      selectedDate: moment(date),
      openCalendar: false,
    });
    this.props.onChange(date);
  }

  onClose = () => {
    this.setState({ openCalendar: false, anchorEl: null });
  };

  render() {
    const { selectedDate } = this.state;
    return (
      <div>
        <>
          <Button onClick={this.previous}>
            <Icon>keyboard_arrow_left</Icon>
          </Button>
          <div
            className={styles.dateDisplay}
            onClick={(e) => {
              this.setState({ openCalendar: true, anchorEl: e.currentTarget });
            }}
          >
            <Typography style={{ position: 'absolute' }} component="span">
              <Box component="span" position={'relative'} top={'24px'} fontSize={'14px'}>
                {selectedDate.toDate().toDateString()}
              </Box>
            </Typography>
            <Box fontSize="20px" fontWeight={500}>
              {calData.bsDaysFull[selectedDate.day()] +
                ', ' +
                calFns.convertADtoBS(selectedDate).formatted2}
            </Box>
          </div>
          <Popover
            id="render-props-popover"
            open={this.state.openCalendar}
            anchorEl={this.state.anchorEl}
            onClose={this.onClose}
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
              defaultDate={this.state.selectedDate.toDate()}
              onChange={this.onChange.bind(this)}
            />
          </Popover>
          <Button onClick={this.next}>
            <Icon>keyboard_arrow_right</Icon>
          </Button>

          {!selectedDate.isSame(this.today, 'day') && (
            <Box
              className={styles.gotoToday}
              component="span"
              onClick={() => this.onChange(this.today)}
            >
              {tl('jump_to_today')}
            </Box>
          )}
        </>
      </div>
    );
  }
}

export default DatePickers;
