import dayjs from 'dayjs';
import {KeyCode, Millisecond, FilterType, DateFormat, CITIES_IN_ROUTE_COUNT} from '../const';

export const isEscKey = (evt) => evt.key === KeyCode.ESCAPE || evt.key === KeyCode.ESC;

export const dateToFormat = (date, format) => {
  return dayjs(date).format(format).toUpperCase();
};

export const getFormattedDuration = (diff) => {
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

export const getTimestamp = (dateFrom, dateTo) => {
  const dateToDefault = dayjs(dateTo);
  const dateFromDefault = dayjs(dateFrom);

  return dateToDefault.diff(dateFromDefault);
};

export const getPointDuration = (dateFrom, dateTo) => {
  return getFormattedDuration(getTimestamp(dateFrom, dateTo));
};

export const getRoute = (points) => {
  points = points.slice().sort((a, b) => Date.parse(a.dateFrom) - Date.parse(b.dateFrom));

  const cities = new Set(
    points
      .slice()
      .map((point) => point.destination.name),
  );

  let route = Array.from(cities);

  if (route.length <= CITIES_IN_ROUTE_COUNT) {
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
  let dates = points.slice().sort((a, b) => Date.parse(a.dateFrom) - Date.parse(b.dateFrom));
  dates = [new Date(dates[0].dateFrom), new Date(dates[dates.length - 1].dateTo)];

  const finishDate = dateToFormat(dates[1], DateFormat.DAY_MONTH);

  const getStartDate = () => {
    let startDate;

    dayjs(dates[0]).format(DateFormat.MONTH) === dayjs(dates[1]).format(DateFormat.MONTH)
      ? startDate = dayjs(dates[0]).format(DateFormat.DAY)
      : startDate = dateToFormat(dates[0], DateFormat.DAY_MONTH);
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

export const isCheckedOffer = (availableOffer, checkedOffers) => {
  if (availableOffer && checkedOffers) {
    return checkedOffers.some((item) =>  [item.title].indexOf(availableOffer.title) !== -1);
  }
};

export const sortByStartDate = (points) => {
  return points.sort((a, b) => Date.parse(a.dateFrom) - Date.parse(b.dateFrom));
};

export const sortByTime = (points) => {
  return points.sort((a, b) => dayjs(b.dateTo).diff(dayjs(b.dateFrom)) - dayjs(a.dateTo).diff(dayjs(a.dateFrom)));
};

export const sortByPrice = (points) => {
  return points.sort((a, b) => b.basePrice - a.basePrice);
};

export const setInputChecked = (active, type) => active === type ? 'checked' : '';

export const isInEveryFilter = (from, to) => {
  return dayjs(from).isBefore(dayjs(), 'd') && dayjs().isBefore(dayjs(to), 'd');
};

export const isFutureDate = (from, to) => {
  return dayjs(from).isAfter(dayjs(), 'd') || dayjs(from).isSame(dayjs(), 'd') || isInEveryFilter(from, to);
};

export const isPastDate = (from, to) => {
  return dayjs(to).isBefore(dayjs(), 'd') || isInEveryFilter(from, to);
};

export const getFilteredPoints = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.slice().filter((point) => isFutureDate(point.dateFrom, point.dateTo));
    case FilterType.PAST:
      return points.slice().filter((point) => isPastDate(point.dateFrom, point.dateTo));
  }
};

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.slice().filter((point) => isFutureDate(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.slice().filter((point) => isPastDate(point.dateFrom, point.dateTo)),
};

export const isOnline = () => {
  return window.navigator.onLine;
};
