import {
  POINT_TYPES,
  POINTS,
  DESCRIPTIONS,
  OFFERS,
  PRICE_MAX,
  Count
} from '../const';

import {
  getRandomInteger,
  getRandomBoolean,
  getRandomArrayItem,
  getRandomArrayItems,
  generateId,
  getPointDates
} from '../utils/common';

const generatePicture = () => {
  return {
    src: 'http://picsum.photos/300/200?r=0.0762563005163317',
    alt: getRandomArrayItem(DESCRIPTIONS),
  };
};

const generatePictures = (count) => new Array(count).fill(' ').map(generatePicture);

const generateOffer = () => {
  return {
    title: getRandomArrayItem(OFFERS),
    price: getRandomInteger(PRICE_MAX),
  };
};

const generateOffers = (count) => new Array(count).fill(' ').map(generateOffer);

const generateDestination = () => {
  return {
    description: getRandomArrayItems(DESCRIPTIONS),
    name: getRandomArrayItem(POINTS),
    pictures: generatePictures(getRandomInteger(Count.PICTURES)),
  };
};

const generatePoint = () => {
  return {
    id: generateId(),
    basePrice: getRandomInteger(PRICE_MAX),
    date: getPointDates(),
    destination: generateDestination(),
    isFavorite: getRandomBoolean(),
    offers: generateOffers(getRandomInteger(Count.OFFER)),
    type: getRandomArrayItem(POINT_TYPES),
  };
};

export const generatePoints = (count) => new Array(count).fill(' ').map(generatePoint);
