import TripMainView from './view/trip-main';
import MainNavView from './view/main-nav';
import {render} from './utils/render';
import {Container, Count, RenderPosition} from './const';
import {generatePoints} from './mocks/points';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';

const addPointButton = document.querySelector('.trip-main__event-add-btn');
const points = generatePoints(Count.EVENT);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

pointsModel.setPoints(points);

const tripPresenter = new TripPresenter(Container.EVENTS, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(Container.FILTERS, filterModel, pointsModel);

addPointButton.addEventListener('click', () => {
  tripPresenter.createPoint();
});

render(Container.MENU, new MainNavView());

if (points.length > 0) {
  render(Container.MAIN, new TripMainView(points), RenderPosition.AFTERBEGIN);
}

filterPresenter.init();
tripPresenter.init();
