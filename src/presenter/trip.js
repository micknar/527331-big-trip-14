import PointPresenter from './point';
import PointNewPresenter from './point-new';
import MainNavView from '../view/main-nav';
import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import LoadingView from '../view/loading';
import {render, replace, remove} from '../utils/render';
import {sortByPrice, sortByTime, sortByStartDate, getFilteredPoints} from '../utils/common';
import {SortType, UserAction, UpdateType, FilterType, RenderPosition} from '../const';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, api) {
    this._tripContainer = tripContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._api = api;
    this._pointPresenter = {};

    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._addPointBtn = document.querySelector('.trip-main__event-add-btn');

    this._sortComponent = null;
    this._noPointsComponent = null;

    this._mainNavComponent = new MainNavView();
    this._pointsListComponent = new PointsListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderSort();
    this._renderPointsListContainer();
    this._renderTrip();

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._handleViewAction);
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints().slice();
    const filteredPoints = getFilteredPoints(points, filterType);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return sortByPrice(filteredPoints);
      case SortType.TIME:
        return sortByTime(filteredPoints);
      default:
        return sortByStartDate(filteredPoints);
    }
  }

  _renderSort() {
    if (!this._isLoading) {
      const prevSortComponent = this._sortComponent;

      this._sortComponent = new SortView(this._currentSortType);
      this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

      if (prevSortComponent) {
        replace(this._sortComponent, prevSortComponent);
        remove(prevSortComponent);
      } else {
        render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
      }
    }
  }

  _renderPointsListContainer() {
    render(this._tripContainer, this._pointsListComponent);
  }

  _renderNoPoints() {
    if (this._sortComponent) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._noPointsComponent = new NoPointsView();
    render(this._tripContainer, this._noPointsComponent);
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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

  _clearTrip({resetSortType = false} = {}) {
    remove(this._noPointsComponent);
    remove(this._loadingComponent);
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
      this._renderSort();
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearTrip();
    this._renderSort();
    this._renderTrip();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
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
        this._clearTrip();
        this._renderSort();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderSort();
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._addPointBtn.disabled = false;
        this._renderSort();
        this._renderTrip();
        break;
    }
  }
}
