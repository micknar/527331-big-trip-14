import TripMainView from './view/trip-main';
import MainNavView from './view/main-nav';
import FilterView from './view/filter';
import SortView from './view/sort';
import PointsListView from './view/points-list';
import PointView from './view/point';
import PointEditorView from './view/point-editor';
import {render} from './utils/render';
import {Container, Count, RenderPosition} from './const';
import {generatePoints} from './mocks/points';

const points = generatePoints(Count.EVENT);

const pointsListView = new PointsListView();

const tripMainNode = Container.MAIN;
const tripMenuNode = Container.MENU;
const tripFilterNode = Container.FILTERS;
const tripEventsNode = Container.EVENTS;
const tripEventsListNode = pointsListView.getElement();

if (points.length > 0) {
  render(tripMainNode, new TripMainView(points), RenderPosition.AFTERBEGIN);
}

render(tripMenuNode, new MainNavView());
render(tripFilterNode, new FilterView());
render(tripEventsNode, new SortView());
render(tripEventsNode, pointsListView);
render(tripEventsListNode, new PointEditorView(points[0]));

for (let i = 0; i < Count.EVENT; i++) {
  render(tripEventsListNode, new PointView(points[i]));
}

//console.log(points);
