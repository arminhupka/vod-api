import * as moment from 'moment';

export const addDays = (date: Date, days: number): Date => {
  const newDate = moment(date).add(days, 'd');
  return new Date(moment.utc(newDate).valueOf());
};
