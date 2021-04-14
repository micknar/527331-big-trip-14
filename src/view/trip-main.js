import AbstractView from './abstract';
import {getRoute, getRouteDates, getTotalPrice} from '../utils/common';

const createTripMainTemplate = (points) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRoute(points)}</h1>

      <p class="trip-info__dates">${getRouteDates(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(points, 'basePrice')}</span>
    </p>
  </section>`;
};

export default class TripMain extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripMainTemplate(this._points);
  }
}
