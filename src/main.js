import TripMainView from './view/trip-main';
import MainNavView from './view/main-nav';
import {render} from './utils/render';
import {Container, Count, RenderPosition} from './const';
import {generatePoints} from './mocks/points';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';

const points = generatePoints(Count.EVENT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(Container.EVENTS, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(Container.FILTERS, filterModel, pointsModel);

render(Container.MENU, new MainNavView());

if (points.length > 0) {
  render(Container.MAIN, new TripMainView(points), RenderPosition.AFTERBEGIN);
}

filterPresenter.init();
tripPresenter.init();
