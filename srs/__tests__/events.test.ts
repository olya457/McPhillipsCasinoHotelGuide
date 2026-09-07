import {events} from '../data/events';
import {venues} from '../data/venues';
import {menuSections} from '../data/menu';
import {tonightProgram} from '../data/tonight';
import {
  activeFilterCount,
  emptyFilters,
  eventForDate,
  filterEvents,
} from '../utils/events';
import {addDays, startOfDay} from '../utils/date';

describe('catalogue content', () => {
  it('holds twelve events, twelve venues and six acts tonight', () => {
    expect(events).toHaveLength(12);
    expect(venues).toHaveLength(12);
    expect(tonightProgram).toHaveLength(6);
  });

  it('has four menu sections with four items each', () => {
    expect(menuSections).toHaveLength(4);
    menuSections.forEach(section => {
      expect(section.items).toHaveLength(4);
    });
  });

  it('points every event and act at an existing venue', () => {
    const ids = venues.map(venue => venue.id);
    events.forEach(event => expect(ids).toContain(event.venueId));
    tonightProgram.forEach(act => expect(ids).toContain(act.venueId));
  });

  it('gives every event its own day', () => {
    const offsets = events.map(event => event.dayOffset);
    expect(new Set(offsets).size).toBe(events.length);
  });
});

describe('event filters', () => {
  const from = new Date(2026, 8, 7, 12, 0);

  it('returns everything without filters', () => {
    expect(filterEvents(emptyFilters, from)).toHaveLength(12);
    expect(activeFilterCount(emptyFilters)).toBe(0);
  });

  it('filters by category', () => {
    const result = filterEvents({...emptyFilters, category: 'Casino'}, from);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(event => expect(event.category).toBe('Casino'));
  });

  it('combines three filters', () => {
    const filters = {
      category: 'Casino' as const,
      date: 'This week' as const,
      format: 'Tournament' as const,
    };
    const result = filterEvents(filters, from);
    expect(activeFilterCount(filters)).toBe(3);
    result.forEach(event => {
      expect(event.category).toBe('Casino');
      expect(event.format).toBe('Tournament');
      expect(event.dayOffset).toBeLessThanOrEqual(6);
    });
  });

  it('resolves today and tomorrow', () => {
    expect(filterEvents({...emptyFilters, date: 'Today'}, from)).toHaveLength(1);
    expect(filterEvents({...emptyFilters, date: 'Tomorrow'}, from)).toHaveLength(
      1,
    );
  });

  it('matches a single event per calendar date', () => {
    const today = startOfDay(from);
    expect(eventForDate(today, from)?.dayOffset).toBe(0);
    expect(eventForDate(addDays(today, 5), from)?.dayOffset).toBe(5);
    expect(eventForDate(addDays(today, 40), from)).toBeNull();
  });
});
