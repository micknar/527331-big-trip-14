import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripListTemplate} from './view/trip-list.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEventEditorTemplate} from './view/event-editor.js';

const EVENT_COUNT = 3;

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
  BEFOREBEGIN: 'beforebegin',
};

const render = (container, template, position = RenderPosition.BEFOREEND) => {
  container.insertAdjacentHTML(position, template);
};

const tripMainNode = document.querySelector('.trip-main');
const tripMenuNode = document.querySelector('.trip-controls__navigation');
const tripFilterNode = document.querySelector('.trip-controls__filters');
const tripEventsNode = document.querySelector('.trip-events');

render(tripMainNode, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
render(tripMenuNode, createMenuTemplate());
render(tripFilterNode, createFilterTemplate());
render(tripEventsNode, createSortTemplate());
render(tripEventsNode, createTripListTemplate());

const tripEventsListNode = document.querySelector('.trip-events__list');

render(tripEventsListNode, createEventEditorTemplate());

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripEventsListNode, createTripEventTemplate());
}
