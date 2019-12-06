import * as moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

export const createEvents = (
  {
    fromDate,
    toDate,
    fromTime,
    toTime,
    duration,
    weekDays
  }) => {
  const startDate = moment(fromDate).startOf('day');
  const endDate = moment(toDate).endOf('day');
  let days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = day.clone().add(1, 'd');
  }
  const events = [];
  const startHourMinute = fromTime.split(':').map((v) => Number(v));
  const endHourMinute = toTime.split(':').map((v) => Number(v));

  days.forEach((d) => {
    if (!weekDays.includes(d.day())) return;
    const startTime = d.clone().set({ hour: startHourMinute[0], minute: startHourMinute[1] });
    const endTIme = d.clone().set({ hour: endHourMinute[0], minute: endHourMinute[1] });

    while (startTime.isBefore(endTIme)) {
      events.push({
        id: events.length + 1,
        from: startTime.toISOString(),
        duration: duration
      });
      startTime.add('minutes', duration);
    }
  });
  return events;
}

export const transformEventsToUIFormat = (events, { owner, eventData }) => {
  events = cloneDeep(events);
  return events.map((e) => {
    return Object.assign(e, {
      to: moment(e.from).add(e.duration, 'minutes').toDate(),
      owner,
      eventData
    });
  });
}
