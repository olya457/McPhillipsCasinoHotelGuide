import {
  addDays,
  composeDate,
  dateFromKey,
  dateKey,
  diffInDays,
  formatCountdown,
  formatRelativeMinutes,
  isSameDay,
  shiftTime,
  startOfDay,
} from '../utils/date';

describe('date utils', () => {
  it('round-trips a date key', () => {
    const date = new Date(2026, 8, 7, 13, 45);
    expect(dateKey(date)).toBe('2026-09-07');
    expect(isSameDay(dateFromKey(dateKey(date)), date)).toBe(true);
  });

  it('keeps evening times on the programme day', () => {
    const base = new Date(2026, 8, 7);
    expect(composeDate(base, '19:00').getDate()).toBe(7);
    expect(composeDate(base, '23:00').getHours()).toBe(23);
  });

  it('moves after-midnight times to the next day', () => {
    const base = new Date(2026, 8, 7);
    const late = composeDate(base, '00:30');
    expect(late.getDate()).toBe(8);
    expect(late.getHours()).toBe(0);
    expect(late.getMinutes()).toBe(30);
  });

  it('shifts reminder times backwards across midnight', () => {
    expect(shiftTime('19:00', 15)).toBe('18:45');
    expect(shiftTime('00:30', 60)).toBe('23:30');
  });

  it('formats a countdown with padded units', () => {
    const {days, hours, minutes, seconds} = formatCountdown(
      (2 * 3600 + 5 * 60 + 9) * 1000,
    );
    expect(days).toBe(0);
    expect(hours).toBe('02');
    expect(minutes).toBe('05');
    expect(seconds).toBe('09');
  });

  it('never returns a negative countdown', () => {
    expect(formatCountdown(-5000)).toEqual({
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00',
    });
  });

  it('describes the remaining time in words', () => {
    expect(formatRelativeMinutes(0)).toBe('now');
    expect(formatRelativeMinutes(25 * 60000)).toBe('in 25 min');
    expect(formatRelativeMinutes(90 * 60000)).toBe('in 1 h 30 min');
    expect(formatRelativeMinutes(120 * 60000)).toBe('in 2 h');
  });

  it('counts whole days between dates', () => {
    const from = new Date(2026, 8, 7, 23, 59);
    expect(diffInDays(addDays(startOfDay(from), 3), from)).toBe(3);
  });
});
