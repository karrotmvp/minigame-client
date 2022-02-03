import { getYear, getMonth, getWeekOfMonth, getWeek } from "date-fns";

const oneWeekBeforeToday = new Date(Date.now() - 7 * (24 * 60 * 60 * 1000));

export const lastWeek = {
  year: getYear(oneWeekBeforeToday),
  month: getMonth(oneWeekBeforeToday) + 1,
  week: getWeekOfMonth(oneWeekBeforeToday, {
    weekStartsOn: 1,
  }),
  weekOfYear: weekOfYear(oneWeekBeforeToday),
};

function weekOfYear(selectedWeek: Date = oneWeekBeforeToday) {
  return getWeek(selectedWeek, {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  });
}
