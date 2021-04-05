import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripListTemplate} from './view/trip-list.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEventEditorTemplate} from './view/event-editor.js';
import {RenderPosition, render} from './utils/render.js';
import {EVENT_COUNT} from './const';
import {generatePoints} from './mocks/points.js';

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

console.log(generatePoints(EVENT_COUNT));
