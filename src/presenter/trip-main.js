import TripMainView from '../view/trip-main';
import {render, replace, remove} from '../utils/render';
import {RenderPosition} from '../const';

export default class TripMain {
  constructor(tripMainContainer, pointsModel) {
    this._tripMainContainer = tripMainContainer;
    this._pointsModel = pointsModel;

    this._tripMainComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevComponent = this._tripMainComponent;
    this._points = this._pointsModel.getPoints();

    if (this._points.length > 0) {
      this._tripMainComponent = new TripMainView(this._points);

      if (prevComponent) {
        replace(this._tripMainComponent, prevComponent);
        remove(prevComponent);
      } else {
        render(this._tripMainContainer, this._tripMainComponent, RenderPosition.AFTERBEGIN);
      }
    }
  }

  _handleModelEvent() {
    this.init();
  }
}
