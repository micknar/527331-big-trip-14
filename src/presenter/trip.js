import PointPresenter from './point';
import MainNavView from '../view/main-nav';
import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import {render, remove} from '../utils/render';
import {updateItem, sortByPrice, sortByTime, sortByStartDate} from '../utils/common';
import {SortType} from '../const';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._currentSortType = SortType.DAY;

    this._mainNavComponent = new MainNavView();
    this._noPointsComponent = new NoPointsView();

    this._handleChangeData = this._handleChangeData.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = sortByStartDate(points);
    this._sourcedPoints = points.slice();

    if (this._points.length > 0) {
      this._renderSort();
      this._renderPointsListContainer();
      this._renderTrip();
    } else {
      this._renderNoPoints();
    }
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
    render(this._tripContainer, this._noPointsComponent);
  }

  _renderTrip() {
    for (let i = 0; i < this._points.length; i++) {
      this._renderPoint(this._points[i]);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent.getElement(), this._handleChangeData, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearTrip() {
    remove(this._sortComponent);
    remove(this._pointsListComponent);

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._points = sortByPrice(this._points);
        break;
      case SortType.TIME:
        this._points = sortByTime(this._points);
        break;
      default:
        this._points = sortByStartDate(this._sourcedPoints.slice());
    }
  }

  _handleChangeData(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._sourcedPoints = updateItem(this._sourcedPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
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

    this._sortPoints(sortType);
    this._clearTrip();
    this._renderSort();
    this._renderPointsListContainer();
    this._renderTrip();
  }
}
