import type {NavigatorScreenParams} from '@react-navigation/native';

export type TabParamList = {
  Tonight: undefined;
  Events: undefined;
  SeatBooking: {eventId?: string; dateKey?: string} | undefined;
  Gallery: {tab?: 'official' | 'mine'} | undefined;
  Venues: undefined;
};

export type RootStackParamList = {
  Loading: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  EventDetail: {eventId: string};
  VenueDetail: {venueId: string};
  Menu: {venueId?: string; sectionId?: string} | undefined;
  Voting: undefined;
  MyBookings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
