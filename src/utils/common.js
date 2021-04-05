import dayjs from 'dayjs';
import {TimeGap, Millisecond} from '../const.js';

export const getRandomInteger = (max, min = 0) => Math.floor(Math.random() * (max + 1 - min)) + min;

export const getRandomBoolean = () => Math.random() > 0.5;

export const getRandomArrayItem = (array) => array[getRandomArrayIndex(array)];

export const getRandomArrayIndex = (array) => getRandomInteger(array.length - 1);

export const getRandomArrayItems = (array) => {
  const tempArray = array.slice();
  const count = getRandomArrayIndex(array);
  const randomItems = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomArrayIndex(tempArray);
    const itemOfSet = tempArray[randomIndex];

    randomItems.push(itemOfSet);
    tempArray.splice(randomIndex, 1);
  }

  return randomItems.length === 0 ? [array[0]] : randomItems;
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const getRandomDate = (dateFrom) => {
  return dayjs(dateFrom)
    .add(getRandomInteger(TimeGap.DAYS, 0), 'day')
    .add(getRandomInteger(TimeGap.HOURS, 0), 'hour')
    .add(getRandomInteger(TimeGap.MINUTES, 0), 'minute');
};

const dateToFormat = (date, format) => {
  return dayjs(date).format(format).toUpperCase();
};

export const getTimeDiff = (diff) => {
  let result;

  if ((diff / Millisecond.IN_DAY) >= 1) {
    result = `${Math.trunc(diff / Millisecond.IN_DAY)}D ${Math.trunc(diff % Millisecond.IN_DAY / Millisecond.IN_HOUR)}H ${Math.round(diff % Millisecond.IN_HOUR / Millisecond.IN_MINUTE)}M`;
  } else if ((diff / Millisecond.IN_HOUR) >= 1) {
    result = `${Math.trunc(diff % Millisecond.IN_DAY / Millisecond.IN_HOUR)}H ${Math.round(diff % Millisecond.IN_HOUR / Millisecond.IN_MINUTE)}M`;
  } else {
    result = `${Math.round(diff % Millisecond.IN_HOUR / Millisecond.IN_MINUTE)}M`;
  }

  return result;
};

export const getPointDates = () => {
  const dateFromFull = getRandomDate();
  const dateToFull = getRandomDate(dateFromFull);

  const dateFrom = dateToFormat(dateFromFull, 'YYYY-MM-DD');
  const dateFromShort = dateToFormat(dateFromFull, 'MMM DD');
  const timeFrom = dateToFormat(dateFromFull, 'HH:mm');

  const dateTo = dateToFormat(dateToFull, 'YYYY-MM-DD');
  const dateToShort = dateToFormat(dateToFull, 'MMM DD');
  const timeTo = dateToFormat(dateToFull, 'HH:mm');

  const duration = getTimeDiff(dateToFull.diff(dateFromFull));

  const date = {
    dateFrom: {
      full: dateFrom,
      short: dateFromShort,
      time: timeFrom,
    },
    dateTo: {
      full: dateTo,
      short: dateToShort,
      time: timeTo,
    },
    duration,
  };

  return date;
};
