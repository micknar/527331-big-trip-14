import PointPresenter from './point';
import MainNavView from '../view/main-nav';
import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import {render, remove} from '../utils/render';
import {sortByPrice, sortByTime, sortByStartDate} from '../utils/common';
import {SortType, UserAction, UpdateType} from '../const';

export default class Trip {
  constructor(tripContainer, pointsModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._pointPresenter = {};

    this._currentSortType = SortType.DAY;

    this._sortComponent = null;
    this._noPointsComponent = null;

    this._mainNavComponent = new MainNavView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderTripEvents();
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  _renderTripEvents() {
    this._renderSort();
    this._renderPointsListContainer();
    this._renderTrip();
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    render(this._tripContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPointsListContainer() {
    this._pointsListComponent = new PointsListView();
    render(this._tripContainer, this._pointsListComponent);
  }

  _renderNoPoints() {
    if (this._sortComponent) {
      remove(this._sortComponent);
    }

    this._noPointsComponent = new NoPointsView();
    render(this._tripContainer, this._noPointsComponent);
  }

  _renderTrip() {
    const points =  this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPoints();
      return;
    }

    for (let i = 0; i < pointsCount; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent.getElement(), this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearTrip({resetSortComponent = false, resetSortType = false} = {}) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    if (resetSortComponent) {
      remove(this._pointsListComponent);
      remove(this._sortComponent);
    }

    if (resetSortType) {
      remove(this._pointsListComponent);
      remove(this._sortComponent);
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.PRICE:
        return sortByPrice(this._pointsModel.getPoints());
      case SortType.TIME:
        return sortByTime(this._pointsModel.getPoints());
      default:
        return sortByStartDate(this._pointsModel.getPoints());
    }
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearTrip({resetSortComponent: true});
    this._renderTripEvents();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip({resetSortComponent: true});
        this._renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTripEvents();
        break;
    }
  }
}
