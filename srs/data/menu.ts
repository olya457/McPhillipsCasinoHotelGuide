import {dishes} from '../assets/images';
import type {MenuSection, MenuSectionId} from '../types';

export const menuSections: MenuSection[] = [
  {
    id: 'starters',
    title: 'Starters',
    subtitle: 'Light openings built around seasonal produce',
    items: [
      {
        id: 'burrata-garden',
        name: 'Burrata Garden',
        price: 12,
        ingredients:
          'Burrata, heirloom tomatoes, basil pesto, arugula, extra virgin olive oil.',
        image: dishes.burrataGarden,
      },
      {
        id: 'truffle-mushroom-crostini',
        name: 'Truffle Mushroom Crostini',
        price: 10,
        ingredients:
          'Wild mushrooms, truffle cream, toasted sourdough, Parmesan, fresh thyme.',
        image: dishes.truffleMushroomCrostini,
      },
      {
        id: 'crispy-calamari',
        name: 'Crispy Calamari',
        price: 13,
        ingredients: 'Calamari, lemon zest, parsley, garlic aioli, sea salt.',
        image: dishes.crispyCalamari,
      },
      {
        id: 'beef-carpaccio',
        name: 'Beef Carpaccio',
        price: 15,
        ingredients:
          'Beef tenderloin, arugula, capers, Parmesan, truffle dressing.',
        image: dishes.beefCarpaccio,
      },
    ],
  },
  {
    id: 'mains',
    title: 'Main Courses',
    subtitle: 'Signature plates from the Emerald kitchen',
    items: [
      {
        id: 'herb-crusted-salmon',
        name: 'Herb-Crusted Salmon',
        price: 24,
        ingredients:
          'Salmon fillet, roasted potatoes, asparagus, lemon butter sauce.',
        image: dishes.herbCrustedSalmon,
      },
      {
        id: 'grilled-beef-tenderloin',
        name: 'Grilled Beef Tenderloin',
        price: 31,
        ingredients:
          'Beef tenderloin, potato purée, seasonal vegetables, red wine sauce.',
        image: dishes.grilledBeefTenderloin,
      },
      {
        id: 'truffle-chicken-supreme',
        name: 'Truffle Chicken Supreme',
        price: 23,
        ingredients:
          'Chicken breast, truffle sauce, creamy polenta, roasted mushrooms.',
        image: dishes.truffleChickenSupreme,
      },
      {
        id: 'mediterranean-sea-bass',
        name: 'Mediterranean Sea Bass',
        price: 27,
        ingredients:
          'Sea bass fillet, cherry tomatoes, olives, herbs, citrus sauce.',
        image: dishes.mediterraneanSeaBass,
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    subtitle: 'Signature cocktails and garden lemonades',
    items: [
      {
        id: 'emerald-garden',
        name: 'Emerald Garden',
        price: 12,
        ingredients: 'Gin, cucumber, basil, lime juice, elderflower tonic.',
        image: dishes.emeraldGarden,
      },
      {
        id: 'golden-sunset',
        name: 'Golden Sunset',
        price: 11,
        ingredients: 'Aperol, prosecco, passion fruit, soda water, orange.',
        image: dishes.goldenSunset,
      },
      {
        id: 'forest-berry-lemonade',
        name: 'Forest Berry Lemonade',
        price: 7,
        ingredients: 'Mixed berries, lemon juice, mint, sparkling water, honey.',
        image: dishes.forestBerryLemonade,
      },
      {
        id: 'citrus-rosemary-cooler',
        name: 'Citrus Rosemary Cooler',
        price: 7,
        ingredients:
          'Orange, grapefruit, rosemary syrup, lime, sparkling water.',
        image: dishes.citrusRosemaryCooler,
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Desserts',
    subtitle: 'Pastry finals served until closing',
    items: [
      {
        id: 'pistachio-tiramisu',
        name: 'Pistachio Tiramisu',
        price: 9,
        ingredients:
          'Mascarpone, espresso, pistachio cream, cocoa, ladyfingers.',
        image: dishes.pistachioTiramisu,
      },
      {
        id: 'dark-chocolate-fondant',
        name: 'Dark Chocolate Fondant',
        price: 10,
        ingredients:
          'Dark chocolate, salted caramel, vanilla ice cream, hazelnut crumble.',
        image: dishes.darkChocolateFondant,
      },
      {
        id: 'lemon-panna-cotta',
        name: 'Lemon Panna Cotta',
        price: 8,
        ingredients: 'Lemon cream, vanilla, berry compote, almond tuile.',
        image: dishes.lemonPannaCotta,
      },
      {
        id: 'seasonal-fruit-pavlova',
        name: 'Seasonal Fruit Pavlova',
        price: 9,
        ingredients:
          'Crispy meringue, vanilla cream, seasonal fruit, passion fruit sauce.',
        image: dishes.seasonalFruitPavlova,
      },
    ],
  },
];

export const menuSectionById = (id: MenuSectionId) =>
  menuSections.find(section => section.id === id);
