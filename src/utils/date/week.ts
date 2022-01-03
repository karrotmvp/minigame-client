import { getYear, getMonth, getWeekOfMonth, getWeek } from 'date-fns';

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
  weekOfYear: weekOfYear(),
};

export function weekOfYear(selectedWeek: Date = previousWeek) {
  return getWeek(selectedWeek, {
    weekStartsOn: 1,
  });
}
