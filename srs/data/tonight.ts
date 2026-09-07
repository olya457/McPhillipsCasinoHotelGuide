import {scenes} from '../assets/images';
import type {MiniEvent} from '../types';

export const tonightHeadline = {
  id: 'emerald-night-gala',
  title: 'Emerald Night',
  subtitle: 'Six acts across the complex, one evening programme',
  venueId: 'crystal-ballroom',
  dressCode: 'Ballroom Grace · formal',
  image: scenes.reception,
};

export const tonightProgram: MiniEvent[] = [
  {
    id: 'welcome-reception',
    title: 'Welcome Reception',
    time: '19:00',
    durationMin: 55,
    venueId: 'garden-terrace',
    description:
      'Sparkling welcome drinks and canapés served among the landscaped gardens.',
    tag: 'Reception',
  },
  {
    id: 'gala-dinner-service',
    title: 'Gala Dinner Service',
    time: '20:00',
    durationMin: 70,
    venueId: 'crystal-ballroom',
    description:
      'Seated four-course dinner in the ballroom with wine pairings at the table.',
    tag: 'Dinner',
  },
  {
    id: 'live-jazz-quartet',
    title: 'Live Jazz Quartet',
    time: '21:15',
    durationMin: 40,
    venueId: 'noir-lounge',
    description:
      'The resident quartet opens the lounge programme with a first live set.',
    tag: 'Live music',
  },
  {
    id: 'casino-tournament',
    title: 'Casino Tournament',
    time: '22:00',
    durationMin: 55,
    venueId: 'grand-casino',
    description:
      'Guest roulette tournament at the main floor tables with dealer briefing.',
    tag: 'Gaming',
  },
  {
    id: 'rooftop-dj-set',
    title: 'Rooftop DJ Set',
    time: '23:00',
    durationMin: 85,
    venueId: 'skyline-rooftop',
    description:
      'Open-air late set on the rooftop with an extended cocktail list.',
    tag: 'Rooftop',
  },
  {
    id: 'midnight-dessert-bar',
    title: 'Midnight Dessert Bar',
    time: '00:30',
    durationMin: 60,
    venueId: 'green-cafe',
    description:
      'Pastry finals, specialty coffee and a late dessert selection to close.',
    tag: 'Dessert',
  },
];

export const reminderOptions = [5, 10, 15, 30, 60];
