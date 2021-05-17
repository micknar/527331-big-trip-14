import TripMainView from './view/trip-main';
import MainNavView from './view/main-nav';
import {render} from './utils/render';
import {Container, RenderPosition, UpdateType} from './const';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import Api from './api';

const AUTHORIZATION = 'Basic dgdf12dafgasd';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const addPointBtn = document.querySelector('.trip-main__event-add-btn');
const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(Container.EVENTS, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(Container.FILTERS, filterModel, pointsModel);

addPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
});

render(Container.MENU, new MainNavView());

filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);

    if (points.length > 0) {
      render(Container.MAIN, new TripMainView(points), RenderPosition.AFTERBEGIN);
    }
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });
