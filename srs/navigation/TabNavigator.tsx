import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {TabBar} from './TabBar';
import type {TabParamList} from './types';
import {TonightScreen} from '../screens/tonight/TonightScreen';
import {EventsScreen} from '../screens/events/EventsScreen';
import {SeatBookingScreen} from '../screens/booking/SeatBookingScreen';
import {GalleryScreen} from '../screens/gallery/GalleryScreen';
import {VenuesScreen} from '../screens/venues/VenuesScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

export const TabNavigator = () => (
  <Tab.Navigator
    tabBar={renderTabBar}
    screenOptions={{
      headerShown: false,
      lazy: true,
      sceneStyle: {backgroundColor: 'transparent'},
    }}>
    <Tab.Screen name="Tonight" component={TonightScreen} />
    <Tab.Screen name="Events" component={EventsScreen} />
    <Tab.Screen name="SeatBooking" component={SeatBookingScreen} />
    <Tab.Screen name="Gallery" component={GalleryScreen} />
    <Tab.Screen name="Venues" component={VenuesScreen} />
  </Tab.Navigator>
);
