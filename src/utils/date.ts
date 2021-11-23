import { getYear, getMonth, getWeekOfMonth } from 'date-fns';

const previousWeek = new Date(Date.now() - 7 * (24 * 60 * 60 * 1000));
const year = getYear(previousWeek);
const month = getMonth(previousWeek) + 1;
const week = getWeekOfMonth(previousWeek, {
  weekStartsOn: 1,
});

export const lastWeek = {
  year: year,
  month: month,
  week: week,
};
