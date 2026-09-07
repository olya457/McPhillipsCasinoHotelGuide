import type {ImageSourcePropType} from 'react-native';

export type EventCategory = 'Music' | 'Casino' | 'Dining' | 'Wellness';
export type EventDateFilter = 'Today' | 'Tomorrow' | 'This week' | 'This month';
export type EventFormat = 'Live show' | 'Tournament' | 'Tasting' | 'Workshop';

export interface VenueSchedule {
  days: string;
  hours: string;
  closed?: string;
}

export interface Venue {
  id: string;
  name: string;
  short: string;
  schedule: VenueSchedule;
  paragraphs: string[];
  highlights: string[];
  image: ImageSourcePropType;
  lookImage?: ImageSourcePropType;
  lookTitle?: string;
  lookNote?: string;
  menuSections?: MenuSectionId[];
  ageRestricted?: boolean;
  bookingRequired?: boolean;
}

export type MenuSectionId = 'starters' | 'mains' | 'drinks' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  ingredients: string;
  image: ImageSourcePropType;
}

export interface MenuSection {
  id: MenuSectionId;
  title: string;
  subtitle: string;
  items: MenuItem[];
}

export interface CasinoEvent {
  id: string;
  title: string;
  venueId: string;
  dayOffset: number;
  time: string;
  durationMin: number;
  category: EventCategory;
  format: EventFormat;
  short: string;
  description: string;
  lineup: string[];
  price: string;
  image: ImageSourcePropType;
  seatingSectors: string[];
}

export interface MiniEvent {
  id: string;
  title: string;
  time: string;
  durationMin: number;
  venueId: string;
  description: string;
  tag: string;
}

export type MiniEventStatus = 'done' | 'now' | 'next' | 'later';

export interface TimelineEntry extends MiniEvent {
  startAt: number;
  endAt: number;
  status: MiniEventStatus;
}

export interface HallSector {
  id: string;
  name: string;
  note: string;
  rows: number;
  seatsPerRow: number;
  price: number;
}

export interface Seat {
  id: string;
  sectorId: string;
  sectorName: string;
  row: number;
  number: number;
  price: number;
  taken: boolean;
}

export interface ReminderSetting {
  enabled: boolean;
  minutesBefore: number;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  dateKey: string;
  time: string;
  seatId: string;
  sectorId: string;
  sectorName: string;
  row: number;
  number: number;
  price: number;
  createdAt: number;
}

export type VotingPhase = 'setup' | 'voting' | 'result';

export interface VotingOption {
  title: string;
  detail: string;
}

export type VoteChoice = 'A' | 'B';

export interface VotingState {
  phase: VotingPhase;
  optionA: VotingOption;
  optionB: VotingOption;
  participants: number;
  votesA: number;
  votesB: number;
  history: VoteChoice[];
  winner: VoteChoice | null;
  decidedRandomly: boolean;
}

export interface UserPhoto {
  id: string;
  uri: string;
  eventId: string | null;
  title: string;
  note: string;
  createdAt: number;
}
