import TripMainView from './view/trip-main';
import MainNavView from './view/main-nav';
import FilterView from './view/filter';
import {render} from './utils/render';
import {Container, Count, RenderPosition} from './const';
import {generatePoints} from './mocks/points';
import TripPresenter from './presenter/trip';
import PointsModel from './model/points';

const points = generatePoints(Count.EVENT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripPresenter = new TripPresenter(Container.EVENTS, pointsModel);

render(Container.MENU, new MainNavView());
render(Container.FILTERS, new FilterView());

if (points.length > 0) {
  render(Container.MAIN, new TripMainView(points), RenderPosition.AFTERBEGIN);
}

tripPresenter.init();
