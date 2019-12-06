import * as React from "react";
import * as moment from "moment";
import Typography from '@material-ui/core/Typography';
import styles from "./ScrollCalendar.module.css";
import Chip from '@material-ui/core/Chip';
import * as calendarFns from '../functions/calendarFunctions';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import isEqual from 'lodash/isEqual';

interface eventType {
  id: number;
  from: Date;
  to: Date;
  eventData: any;
  owner: {
    id: number | string;
    name: string;
  };
}

interface summaryType {
  id: string;
  date: Date;
  segment: string;
  __type: string;
  rows: eventType[];
}

interface propType {
  onEventRemove: (id: number) => void;
  events: eventType[];
}

interface stateType {
  events: (eventType | summaryType)[];
}

const EditableSlot = ({event, onEventRemove}) => {
  return (
    <Chip
    label={
      <div className={event.removed ? styles.lineThrough : ''}>
        {moment(event.from).format("hh:mm a")} - {moment(event.to).format("hh:mm a")}
      </div>
    }
    onDelete={() => onEventRemove(event.id)}
    clickable={true}
    onClick={() => onEventRemove(event.id)}
    className={styles.chip}
    color={event.removed ? 'default' : 'primary'}
    variant="outlined"
    deleteIcon={event.removed ? <DoneIcon /> : <CloseIcon />}
  />
  );
}
export default class ScrollCalendar extends React.Component<
  propType,
  stateType
> {
  public state = {
    events: []
  };

  private static segmentize = (
    rowData: eventType[],
    segmentBy: (any) => string
  ) => {
    const segmentedData: (eventType | summaryType)[] = [];
    let currentSegment: summaryType;
    rowData.forEach(datum => {
      const segment = segmentBy(datum);
      if (!currentSegment || currentSegment.segment !== segment) {
        currentSegment = {
          id: btoa(segment),
          date: datum.from,
          segment: segment,
          rows: [],
          __type: "summary"
        };
        segmentedData.push(currentSegment);
      }
      currentSegment.rows.push(datum);
      segmentedData.push(datum);
    });
    return segmentedData;
  };

  constructor(props: propType) {
    super(props);
    this.state = {
      events: this.processEvents(props.events)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.events, nextProps.events)) {
      this.setState({
        events: this.processEvents(nextProps.events)
      });
    }
  }

  processEvents(events = this.props.events) {
    return ScrollCalendar.segmentize(events, (e: eventType) =>
      moment(e.from).format("MM-DD-YYYY")
    );
  }

  onEventToggle(id) {
    this.setState({
      events: this.state.events.map((e) => {
        if (e.id === id) e.removed = !e.removed ;
        return e;
      })
    })
  }

  renderSummary(e: any) {
    return (
      <div className={styles.eventSummary}>
          <Typography variant="title" gutterBottom>
            {calendarFns.convertADtoBS(moment(e.date)).formatted2}
          </Typography>
        <div />
      </div>
    );
  }

  renderEvent(e: any) {
    return ;
  }
  render() {
    return (
      <div className={styles.scrollCalendar}>
        {this.state.events.map(e => {
          return e["__type"] == "summary"
            ? this.renderSummary(e)
            : <EditableSlot key={e.id} event={e} onEventRemove={(id) => this.onEventToggle(id)}></EditableSlot>;
        })}
      </div>
    );
  }
}
