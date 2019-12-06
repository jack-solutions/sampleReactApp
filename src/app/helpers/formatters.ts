import * as moment from 'moment';
import { t } from '../components/translate';

export const ageFormatter = (date) => {
  if (!date) { return null }
  const age = moment().diff(moment(date), 'months');
  const year = age / 12;
  const month = age % 12;
  const yearString = `${parseInt(year)} ${t('year')}`;
  return yearString + (month ? ` ${month} ${t('month')}` : '');
};