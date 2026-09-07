import {events} from '../data/events';
import type {
  CasinoEvent,
  EventCategory,
  EventDateFilter,
  EventFormat,
} from '../types';
import {addDays, composeDate, dateKey, diffInDays, startOfDay} from './date';

export const eventDate = (event: CasinoEvent, from: Date = new Date()) =>
  addDays(startOfDay(from), event.dayOffset);

export const eventStartAt = (event: CasinoEvent, from: Date = new Date()) =>
  composeDate(eventDate(event, from), event.time).getTime();

export const eventEndAt = (event: CasinoEvent, from: Date = new Date()) =>
  eventStartAt(event, from) + event.durationMin * 60000;

export const eventDateKey = (event: CasinoEvent, from: Date = new Date()) =>
  dateKey(eventDate(event, from));

export const eventForDate = (target: Date, from: Date = new Date()) => {
  const offset = diffInDays(target, from);
  return events.find(item => item.dayOffset === offset) ?? null;
};

export interface EventFilters {
  category: EventCategory | null;
  date: EventDateFilter | null;
  format: EventFormat | null;
}

export const emptyFilters: EventFilters = {
  category: null,
  date: null,
  format: null,
};

const matchesDate = (
  event: CasinoEvent,
  filter: EventDateFilter,
  from: Date,
) => {
  const target = eventDate(event, from);
  switch (filter) {
    case 'Today':
      return event.dayOffset === 0;
    case 'Tomorrow':
      return event.dayOffset === 1;
    case 'This week':
      return event.dayOffset <= 6;
    case 'This month':
      return (
        target.getMonth() === from.getMonth() &&
        target.getFullYear() === from.getFullYear()
      );
    default:
      return true;
  }
};

export const filterEvents = (
  filters: EventFilters,
  from: Date = new Date(),
) =>
  events.filter(event => {
    if (filters.category && event.category !== filters.category) {
      return false;
    }
    if (filters.format && event.format !== filters.format) {
      return false;
    }
    if (filters.date && !matchesDate(event, filters.date, from)) {
      return false;
    }
    return true;
  });

export const activeFilterCount = (filters: EventFilters) =>
  [filters.category, filters.date, filters.format].filter(Boolean).length;
