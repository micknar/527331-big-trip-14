import dayjs from 'dayjs';
import {TimeGap, Millisecond, DateFormat, FilterType} from '../const';

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
  const dateFromDefault = getRandomDate();
  const dateToDefault = getRandomDate(dateFromDefault);

  const dateFrom = dateToFormat(dateFromDefault, DateFormat.date);
  const dateFromShort = dateToFormat(dateFromDefault, DateFormat.dateShort);
  const dateFromFull = dateToFormat(dateFromDefault, DateFormat.full);
  const timeFrom = dateToFormat(dateFromDefault, DateFormat.time);

  const dateTo = dateToFormat(dateToDefault, DateFormat.date);
  const dateToShort = dateToFormat(dateToDefault, DateFormat.dateShort);
  const dateToFull = dateToFormat(dateToDefault, DateFormat.full);
  const timeTo = dateToFormat(dateToDefault, DateFormat.time);

  const duration = getTimeDiff(dateToDefault.diff(dateFromDefault));

  const date = {
    dateFrom: {
      default: dateFromDefault,
      date: dateFrom,
      short: dateFromShort,
      full: dateFromFull,
      time: timeFrom,
    },
    dateTo: {
      default: dateToDefault,
      date: dateTo,
      short: dateToShort,
      full: dateToFull,
      time: timeTo,
    },
    duration,
  };

  return date;
};

export const areEqualDates = (dateA, dateB) => {
  return dayjs(dateA) === dayjs(dateB);
};

export const isFutureDate = (currentDate, dateFrom) => {
  return dayjs(currentDate) < dayjs(dateFrom) && !areEqualDates(currentDate, dateFrom);
};

export const isPastDate = (currentDate, dateFrom) => {
  return dayjs(currentDate) > dayjs(dateFrom) && !areEqualDates(currentDate, dateFrom);
};

export const getFilteredPoints = (points, filterType) => {
  const currentDate = dayjs();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((point) => isFutureDate(currentDate, point.date.dateFrom.default));
    case FilterType.PAST:
      return points.filter((point) => isPastDate(currentDate, point.date.dateFrom.default));
  }
};

