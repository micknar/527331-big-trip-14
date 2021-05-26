import dayjs from 'dayjs';
import {Millisecond, FilterType, DateFormat, CITIES_IN_ROUTE_COUNT} from '../const';

export const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

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
      return points.filter((point) => isFutureDate(currentDate, point.dateFrom));
    case FilterType.PAST:
      return points.filter((point) => isPastDate(currentDate, point.dateFrom));
  }
};

export const getRoute = (points) => {
  points = points.slice().sort((a, b) => Date.parse(a.dateFrom) - Date.parse(b.dateFrom));

  const cities = new Set(points
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

export const getPointPrice = (basePrice, offers) => {
  let offersPrice = 0;

  offers.forEach((offer) => offersPrice += offer.price);

  return basePrice + offersPrice;
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
  return points.sort((a, b) => getPointPrice(b.basePrice, b.offers) - getPointPrice(a.basePrice, a.offers));
};

export const setInputChecked = (active, type) => active === type ? 'checked' : '';
