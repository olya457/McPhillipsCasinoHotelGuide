import type {ImageSourcePropType} from 'react-native';
import {scenes} from '../../assets/images';

export interface OnboardingSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'welcome',
    eyebrow: 'Welcome',
    title: 'Stay Mate',
    description:
      'Your guide to the casino, hotel and every venue of the complex, collected in one place.',
    image: scenes.facadeNight,
  },
  {
    id: 'tonight',
    eyebrow: 'Tonight',
    title: 'Follow the evening live',
    description:
      'Six acts, one timeline. Track what plays now, what comes next and set reminders before each act.',
    image: scenes.reception,
  },
  {
    id: 'dining',
    eyebrow: 'Dining',
    title: 'Reserve your seat',
    description:
      'Pick a date, open the hall plan and choose the exact seat, sector and price you want.',
    image: scenes.restaurantHall,
  },
  {
    id: 'events',
    eyebrow: 'Events',
    title: 'Twelve nights ahead',
    description:
      'Filter the programme by category, date and format, then move straight to booking.',
    image: scenes.aerialComplex,
  },
  {
    id: 'stay',
    eyebrow: 'Your stay',
    title: 'Vote, capture, remember',
    description:
      'Decide the plan together, keep official photos and build your own gallery of the evening.',
    image: scenes.suite,
  },
];
