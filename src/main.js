import MainNavView from './view/main-nav';
import {render} from './utils/render';
import {Container, UpdateType} from './const';
import TripPresenter from './presenter/trip';
import TripMainPresenter from './presenter/trip-main';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import DestinationsData from './data/destinations';
import OffersData from './data/offers';
import Api from './api';

const AUTHORIZATION = 'Basic adgdcghgf6';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const addPointBtn = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsData = new DestinationsData();
const offersData = new OffersData();

const api = new Api(END_POINT, AUTHORIZATION, destinationsData, offersData);

const tripPresenter = new TripPresenter(Container.EVENTS, pointsModel, destinationsData, offersData, filterModel, api);
const filterPresenter = new FilterPresenter(Container.FILTERS, filterModel, pointsModel);
const tripMainPresenter = new TripMainPresenter(Container.MAIN, pointsModel);

addPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
});

render(Container.MENU, new MainNavView());

filterPresenter.init();
tripPresenter.init();

api
  .getData()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    tripMainPresenter.init();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });
