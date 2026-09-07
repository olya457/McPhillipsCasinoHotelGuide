const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const dateKey = (date: Date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const dateFromKey = (key: string) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const parseTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return {hours, minutes};
};

export const composeDate = (base: Date, time: string) => {
  const {hours, minutes} = parseTime(time);
  const result = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hours,
    minutes,
    0,
    0,
  );
  if (hours < 6) {
    result.setDate(result.getDate() + 1);
  }
  return result;
};

export const formatFullDate = (date: Date) =>
  `${WEEKDAYS_SHORT[date.getDay()]}, ${date.getDate()} ${
    MONTHS[date.getMonth()]
  }`;

export const formatShortDate = (date: Date) =>
  `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;

export const formatDayLabel = (date: Date) => WEEKDAYS_SHORT[date.getDay()];

export const formatMonthLabel = (date: Date) => MONTHS_SHORT[date.getMonth()];

export const formatTimeOfDay = (date: Date) => {
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const shiftTime = (time: string, minutes: number) => {
  const {hours, minutes: mins} = parseTime(time);
  const total = (hours * 60 + mins - minutes + 24 * 60) % (24 * 60);
  const nextHours = `${Math.floor(total / 60)}`.padStart(2, '0');
  const nextMinutes = `${total % 60}`.padStart(2, '0');
  return `${nextHours}:${nextMinutes}`;
};

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const diffInDays = (target: Date, from: Date) =>
  Math.round(
    (startOfDay(target).getTime() - startOfDay(from).getTime()) / 86400000,
  );

export const formatCountdown = (ms: number) => {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    days,
    hours: `${hours}`.padStart(2, '0'),
    minutes: `${minutes}`.padStart(2, '0'),
    seconds: `${seconds}`.padStart(2, '0'),
  };
};

export const formatRelativeMinutes = (ms: number) => {
  const minutes = Math.round(ms / 60000);
  if (minutes <= 0) {
    return 'now';
  }
  if (minutes < 60) {
    return `in ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `in ${hours} h ${rest} min` : `in ${hours} h`;
};
