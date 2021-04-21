import PointPresenter from './point';
import MainNavView from '../view/main-nav';
import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import {render} from '../utils/render';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._pointsListComponent = new PointsListView();
    this._mainNavComponent = new MainNavView();
    this._sortComponent = new SortView();
    this._noPointsComponent= new NoPointsView();
  }

  init(points) {
    if (points.length > 0) {
      render(this._tripContainer, this._sortComponent);
      render(this._tripContainer, this._pointsListComponent);
    
      this._renderTrip(points);
    } else {
      render(this._tripContainer, this._noPointsComponent);
    }
  }

  _renderTrip(points) {
    for (let i = 0; i < points.length; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent.getElement());
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearTrip() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }
} 
