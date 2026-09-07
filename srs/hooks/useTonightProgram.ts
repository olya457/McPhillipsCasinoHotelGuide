import {useMemo} from 'react';
import {tonightProgram} from '../data/tonight';
import type {MiniEventStatus, ReminderSetting, TimelineEntry} from '../types';
import {addDays, composeDate} from '../utils/date';
import {useNow} from './useNow';

const buildEntries = (base: Date) =>
  tonightProgram.map(item => {
    const start = composeDate(base, item.time);
    return {
      item,
      startAt: start.getTime(),
      endAt: start.getTime() + item.durationMin * 60000,
    };
  });

export const useTonightProgram = (
  reminders: Record<string, ReminderSetting>,
) => {
  const now = useNow(15000);

  return useMemo(() => {
    const today = new Date(now);
    let raw = buildEntries(today);
    const lastEnd = raw[raw.length - 1]?.endAt ?? 0;
    let programDate = today;
    if (now > lastEnd) {
      programDate = addDays(today, 1);
      raw = buildEntries(programDate);
    }

    const sorted = [...raw].sort((a, b) => a.startAt - b.startAt);
    const nextIndex = sorted.findIndex(entry => entry.startAt > now);

    const entries: TimelineEntry[] = sorted.map((entry, index) => {
      let status: MiniEventStatus = 'later';
      if (now >= entry.startAt && now < entry.endAt) {
        status = 'now';
      } else if (now >= entry.endAt) {
        status = 'done';
      } else if (index === nextIndex) {
        status = 'next';
      }
      return {
        ...entry.item,
        startAt: entry.startAt,
        endAt: entry.endAt,
        status,
      };
    });

    const activeEntry = entries.find(entry => entry.status === 'now') ?? null;
    const nextEntry = entries.find(entry => entry.status === 'next') ?? null;
    const programStartAt = entries[0]?.startAt ?? now;
    const countdownTarget = nextEntry?.startAt ?? programStartAt;

    const dueReminders = entries.filter(entry => {
      const setting = reminders[entry.id];
      if (!setting?.enabled) {
        return false;
      }
      const triggerAt = entry.startAt - setting.minutesBefore * 60000;
      return now >= triggerAt && now < entry.startAt;
    });

    const completed = entries.filter(entry => entry.status === 'done').length;

    return {
      now,
      programDate,
      entries,
      activeEntry,
      nextEntry,
      programStartAt,
      countdownTarget,
      dueReminders,
      completed,
      total: entries.length,
    };
  }, [now, reminders]);
};
