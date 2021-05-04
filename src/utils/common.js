import dayjs from 'dayjs';
import {TimeGap, Millisecond, FilterType, DateFormat, Count} from '../const';

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

export const getRandomDate = (dateFrom) => {
  return dayjs(dateFrom)
    .add(getRandomInteger(TimeGap.DAYS, 0), 'day')
    .add(getRandomInteger(TimeGap.HOURS, 0), 'hour')
    .add(getRandomInteger(TimeGap.MINUTES, 0), 'minute');
};

export const dateToFormat = (date, format) => {
  return dayjs(date).format(format).toUpperCase();
};

const getTimeDiff = (diff) => {
  let result;

  if (diff >= Millisecond.IN_DAY) {
    result = `${Math.trunc(diff / Millisecond.IN_DAY)}D ${Math.trunc(diff % Millisecond.IN_DAY / Millisecond.IN_HOUR)}H ${Math.round(diff % Millisecond.IN_HOUR / Millisecond.IN_MINUTE)}M`;
  } else if (diff >= Millisecond.IN_HOUR) {
    result = `${Math.trunc(diff % Millisecond.IN_DAY / Millisecond.IN_HOUR)}H ${Math.round(diff % Millisecond.IN_HOUR / Millisecond.IN_MINUTE)}M`;
  } else if (diff >= Millisecond.IN_MINUTE) {
    result = `${Math.round(diff % Millisecond.IN_HOUR / Millisecond.IN_MINUTE)}M`;
  } else {
    result = '';
  }

  return result;
};

export const getPointDuration = (dateFrom, dateTo) => {
  const dateToDefault = dayjs(dateTo);
  const dateFromDefault = dayjs(dateFrom);

  return getTimeDiff(dateToDefault.diff(dateFromDefault));
};

export const getPointDates = () => {
  const dateFrom = getRandomDate();
  const dateTo = getRandomDate(dateFrom);

  const date = {
    dateFrom,
    dateTo,
  };

  return date;
};

export const areEqualDates = (dateA, dateB) => dayjs(dateA) === dayjs(dateB);

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
      return points.filter((point) => isFutureDate(currentDate, point.date.dateFrom));
    case FilterType.PAST:
      return points.filter((point) => isPastDate(currentDate, point.date.dateFrom));
  }
};

export const getRoute = (points) => {
  points = points.slice().sort((a, b) => Date.parse(a.date.dateFrom) - Date.parse(b.date.dateFrom));

  const cities = new Set(points
    .slice()
    .map((point) => point.destination.name),
  );

  let route = Array.from(cities);

  if (route.length <= Count.CITIES_IN_ROUTE) {
    route = route
      .map((city) => `${city}`)
      .join(' &mdash; ');
  } else {
    route = [route[0], route[route.length - 1]]
      .map((city) => `${city}`)
      .join(' &mdash; ... &mdash; ');
  }

  return route;
};

export const getRouteDates = (points) => {
  let dates = points.slice().sort((a, b) => Date.parse(a.date.dateFrom) - Date.parse(b.date.dateFrom));
  dates = [new Date(dates[0].date.dateFrom), new Date(dates[dates.length - 1].date.dateTo)];

  const finishDate = dateToFormat(dates[1], DateFormat.dayMonth);

  const getStartDate = () => {
    let startDate;

    dayjs(dates[0]).format(DateFormat.month) === dayjs(dates[1]).format(DateFormat.month)
      ? startDate = dayjs(dates[0]).format(DateFormat.day)
      : startDate = dateToFormat(dates[0], DateFormat.dayMonth);
    return startDate;
  };

  return `${getStartDate()} &mdash; ${finishDate}`;
};

export const getTotalPrice = (item, price) => {
  const result = item
    ? item
      .slice()
      .map((point) => point[price] + getTotalPrice(point.offers, 'price'))
      .reduce((sum, price) => sum + price, 0)
    : 0;

  return result;
};

export const sortByStartDate = (points) => {
  return points.sort((a, b) => Date.parse(a.date.dateFrom) - Date.parse(b.date.dateFrom));
};

export const sortByTime = (points) => {
  return points.sort((a, b) => b.date.dateTo.diff(b.date.dateFrom) - a.date.dateTo.diff(a.date.dateFrom));
};

export const sortByPrice = (points) => {
  return points.sort((a, b) => b.basePrice - a.basePrice);
};

export const setInputChecked = (active, type) => active === type ? 'checked' : '';
