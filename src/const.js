export const Count = {
  EVENT: 8,
  OFFER: 5,
  PICTURES: 5,
  CITIES_IN_ROUTE: 3,
};

export const PRICE_MAX = 10000;

export const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const POINTS = ['Amsterdam', 'Chamonix', 'Geneva', 'Munich', 'Birmingham'];

export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

export const OFFERS = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Upgrade to a business class',
  'Choose the radio station',
];

export const TimeGap = {
  DAYS: 7,
  HOURS: 24,
  MINUTES: 60,
};

export const Millisecond = {
  IN_DAY: 86400000,
  IN_HOUR: 3600000,
  IN_MINUTE: 60000,
};

export const UserAction = {
  ADD_POINT: 'add',
  EDIT_POINT: 'edit',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const DateFormat = {
  time: 'HH:mm',
  day: 'DD',
  month: 'MMM',
  dayMonth: 'DD MMM',
  monthDay: 'MMM DD',
  date: 'YYYY-MM-DD',
  full: 'YY/MM/DD HH:mm',
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
  BEFOREBEGIN: 'beforebegin',
};

export const Container = {
  MAIN: document.querySelector('.trip-main'),
  MENU: document.querySelector('.trip-controls__navigation'),
  FILTERS: document.querySelector('.trip-controls__filters'),
  EVENTS: document.querySelector('.trip-events'),
};
