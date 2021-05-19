import MainNavView from './view/main-nav';
import {render} from './utils/render';
import {Container, UpdateType} from './const';
import TripPresenter from './presenter/trip';
import TripMainPresenter from './presenter/trip-main';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import DestinationData from './data/destination';
import OffersData from './data/offers';
import Api from './api';

const AUTHORIZATION = 'Basic adgdf12d6casd';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const addPointBtn = document.querySelector('.trip-main__event-add-btn');
const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationData = new DestinationData();
const offersData = new OffersData();

const tripPresenter = new TripPresenter(Container.EVENTS, pointsModel, filterModel, api);
const filterPresenter = new FilterPresenter(Container.FILTERS, filterModel, pointsModel);
const tripMainPresenter = new TripMainPresenter(Container.MAIN, pointsModel);

addPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
});

render(Container.MENU, new MainNavView());

filterPresenter.init();
tripPresenter.init();

api
  .getDestination()
    .then((destination) => {
      destinationData.setDestination(destination);
    })
    .then(() => {
      api.getOffers()
          .then((offers) => {
            offersData.setOffers(offers);
          })
      })
    .then(() => {
      api.getPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
        tripMainPresenter.init();

        console.log(points)
      })
    })
    .catch(() => {
      pointsModel.setPoints(UpdateType.INIT, []);
    });
