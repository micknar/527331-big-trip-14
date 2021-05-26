import MainNavView from './view/main-nav';
import StatsView from './view/stats';
import {render} from './utils/render';
import {Container, UpdateType, NavItem, FilterType, RenderPosition} from './const';
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
const mainNavComponent = new MainNavView();

addPointBtn.addEventListener('click', () => {
  tripPresenter.createPoint();
});

render(Container.MENU, mainNavComponent);

const handleMainNavClick = (navItem) => {
  switch (navItem) {
    case NavItem.TABLE:
      mainNavComponent.setNavItem(NavItem.TABLE);
      tripPresenter.init();
      Container.EVENTS.classList.remove('trip-events--hidden');
      filterPresenter.removeDisabled();
      filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case NavItem.STATS:
      mainNavComponent.setNavItem(NavItem.STATS);
      Container.EVENTS.classList.add('trip-events--hidden');
      tripPresenter.destroy();
      addPointBtn.disabled = true;
      filterPresenter.setDisabled();
      render(Container.PAGE_MAIN, new StatsView(), RenderPosition.BEFOREEND);
      break;
  }
};

mainNavComponent.setMainNavClickHandler(handleMainNavClick);

filterPresenter.init();
tripPresenter.init();

api
  .getData()
  .then((points) => {
    pointsModel.set(UpdateType.INIT, points);
    tripMainPresenter.init();
  })
  .catch(() => {
    pointsModel.set(UpdateType.INIT, []);
  });
