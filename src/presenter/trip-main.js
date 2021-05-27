import TripMainView from '../view/trip-main';
import {render, replace, remove} from '../utils/render';
import {RenderPosition} from '../const';

export default class TripMain {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._tripMainComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevComponent = this._tripMainComponent;
    this._points = this._pointsModel.get();

    if (this._points.length > 0) {
      this._tripMainComponent = new TripMainView(this._points);

      if (prevComponent) {
        replace(this._tripMainComponent, prevComponent);
        remove(prevComponent);
      } else {
        render(this._container, this._tripMainComponent, RenderPosition.AFTERBEGIN);
      }
    }

    if (this._points.length <= 0) {
      remove(prevComponent);
      this._tripMainComponent = null;
    }
  }

  _handleModelEvent() {
    this.init();
  }
}
