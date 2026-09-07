import React from 'react';
import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../theme';
import type {RootStackParamList} from './types';
import {TabNavigator} from './TabNavigator';
import {LoadingScreen} from '../screens/loading/LoadingScreen';
import {OnboardingScreen} from '../screens/onboarding/OnboardingScreen';
import {EventDetailScreen} from '../screens/events/EventDetailScreen';
import {VenueDetailScreen} from '../screens/venues/VenueDetailScreen';
import {MenuScreen} from '../screens/menu/MenuScreen';
import {VotingScreen} from '../screens/voting/VotingScreen';
import {MyBookingsScreen} from '../screens/booking/MyBookingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    primary: colors.emerald,
    border: colors.borderNeutral,
  },
};

export const RootNavigator = () => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {backgroundColor: colors.bg},
      }}>
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Group screenOptions={{animation: 'slide_from_right'}}>
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  </NavigationContainer>
);
