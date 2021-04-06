import {
  OFFER_COUNT,
  POINT_TYPES,
  POINTS,
  DESCRIPTIONS,
  OFFERS,
  PRICE_MAX
} from '../const';

import {
  getRandomInteger,
  getRandomBoolean,
  getRandomArrayItem,
  getRandomArrayItems,
  generateId,
  getPointDates
} from '../utils/common.js';

const generateDestination = () => {
  return {
    description: getRandomArrayItems(DESCRIPTIONS),
    name: getRandomArrayItem(POINTS),
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        alt: getRandomArrayItem(DESCRIPTIONS),
      },
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        alt: getRandomArrayItem(DESCRIPTIONS),
      },
    ],
  };
};

const generateOffer = () => {
  return {
    title: getRandomArrayItem(OFFERS),
    price: getRandomInteger(PRICE_MAX),
  };
};

const generateOffers = (count) => new Array(count).fill(' ').map(generateOffer);

const generatePoint = () => {
  return {
    id: generateId(),
    basePrice: getRandomInteger(PRICE_MAX),
    date: getPointDates(),
    destination: generateDestination(),
    isFavorite: getRandomBoolean(),
    offers: generateOffers(getRandomInteger(OFFER_COUNT)),
    type: getRandomArrayItem(POINT_TYPES),
  };
};

export const generatePoints = (count) => new Array(count).fill(' ').map(generatePoint);
