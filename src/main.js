import {createTripMainTemplate} from './view/trip-main';
import {createMenuTemplate} from './view/menu';
import {createFilterTemplate} from './view/filter';
import {createSortTemplate} from './view/sort';
import {createPointsListTemplate} from './view/points-list';
import {createPointTemplate} from './view/point';
import {createPointEditorTemplate} from './view/point-editor';
import {RenderPosition, render} from './utils/render';
import {Count} from './const';
import {generatePoints} from './mocks/points';

const points = generatePoints(Count.EVENT);

const tripMainNode = document.querySelector('.trip-main');
const tripMenuNode = document.querySelector('.trip-controls__navigation');
const tripFilterNode = document.querySelector('.trip-controls__filters');
const tripEventsNode = document.querySelector('.trip-events');

render(tripMainNode, createTripMainTemplate(points), RenderPosition.AFTERBEGIN);
render(tripMenuNode, createMenuTemplate());
render(tripFilterNode, createFilterTemplate());
render(tripEventsNode, createSortTemplate());
render(tripEventsNode, createPointsListTemplate());

const tripEventsListNode = document.querySelector('.trip-events__list');

render(tripEventsListNode, createPointEditorTemplate(points[0]));

for (let i = 0; i < Count.EVENT; i++) {
  render(tripEventsListNode, createPointTemplate(points[i]));
}

//console.log(points);
