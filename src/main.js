import {createTripMainTemplate} from './view/trip-main';
import MainNavView from './view/main-nav';
import FilterView from './view/filter';
import SortView from './view/sort';
import PointsListView from './view/points-list';
import {createPointTemplate} from './view/point';
import {createPointEditorTemplate} from './view/point-editor';
import {render} from './utils/render';
import {Count, RenderPosition} from './const';
import {generatePoints} from './mocks/points';

const points = generatePoints(Count.EVENT);

const tripMainNode = document.querySelector('.trip-main');
const tripMenuNode = document.querySelector('.trip-controls__navigation');
const tripFilterNode = document.querySelector('.trip-controls__filters');
const tripEventsNode = document.querySelector('.trip-events');

// if (points.length > 0) {
//   render(tripMainNode, createTripMainTemplate(points), RenderPosition.AFTERBEGIN);
// }

render(tripMenuNode, new MainNavView());
render(tripFilterNode, new FilterView());
render(tripEventsNode, new SortView());
render(tripEventsNode, new PointsListView());

// const tripEventsListNode = document.querySelector('.trip-events__list');

// render(tripEventsListNode, createPointEditorTemplate(points[0]));

// for (let i = 0; i < Count.EVENT; i++) {
//   render(tripEventsListNode, createPointTemplate(points[i]));
// }

//console.log(points);
