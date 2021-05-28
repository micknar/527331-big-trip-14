import MainNavView from './view/main-nav';
import StatsView from './view/stats';
import {render, remove} from './utils/render';
import {UpdateType, NavItem, FilterType, RenderPosition} from './const';
import TripPresenter from './presenter/trip';
import TripMainPresenter from './presenter/trip-main';
import FilterPresenter from './presenter/filter';
import PointsModel from './model/points';
import FilterModel from './model/filter';
import DestinationsData from './data/destinations';
import OffersData from './data/offers';
import Api from './api';

const AUTHORIZATION = 'Basic adgfd6cxv5hgf6';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const bodyNode = document.querySelector('.page-body');
const tripMainNode = bodyNode.querySelector('.trip-main');
const menuNode = tripMainNode.querySelector('.trip-controls__navigation');
const filtersNode = tripMainNode.querySelector('.trip-controls__filters');
export const addPointBtnNode = tripMainNode.querySelector('.trip-main__event-add-btn');
const pageContainerNode = bodyNode.querySelector('.page-main .page-body__container');
const tripEventsNode = bodyNode.querySelector('.trip-events');


const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsData = new DestinationsData();
const offersData = new OffersData();

const api = new Api(END_POINT, AUTHORIZATION, destinationsData, offersData);

const tripPresenter = new TripPresenter(tripEventsNode, pointsModel, destinationsData, offersData, filterModel, api);
const filterPresenter = new FilterPresenter(filtersNode, filterModel, pointsModel);
const tripMainPresenter = new TripMainPresenter(tripMainNode, pointsModel);
const mainNavComponent = new MainNavView();
let statsViewComponent = null;

addPointBtnNode.addEventListener('click', () => {
  tripPresenter.createPoint();
});

render(menuNode, mainNavComponent);

const handleMainNavClick = (navItem) => {
  switch (navItem) {
    case NavItem.TABLE:
      mainNavComponent.setNavItem(NavItem.TABLE);
      tripPresenter.init();
      tripEventsNode.classList.remove('trip-events--hidden');
      remove(statsViewComponent);
      filterPresenter.removeDisabled();
      filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case NavItem.STATS:
      mainNavComponent.setNavItem(NavItem.STATS);
      tripEventsNode.classList.add('trip-events--hidden');
      tripPresenter.destroy();
      addPointBtnNode.disabled = true;
      filterPresenter.setDisabled();

      statsViewComponent = new StatsView(pointsModel.get());
      render(pageContainerNode, statsViewComponent, RenderPosition.BEFOREEND);
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
