import AbstractView from './abstract';
import {dateToFormat, getPointDuration, getPointPrice} from '../utils/common';
import {DateFormat} from '../const';

const createOffersTemplate = (offers) => {
  const checkedOffers = [];

  offers.forEach((offer) => {
    if (offer.isChecked) {
      checkedOffers.push(offer);
    }
  });

  if (checkedOffers.length > 0) {
    return `<ul class="event__selected-offers">
      ${checkedOffers.map((offer) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;
  }).join('')}
    </ul>`;
  } else {
    return '';
  }
};

const createPointTemplate = (point) => {
  const {dateFrom, dateTo, destination, basePrice, id, isFavorite, type, offers} = point;
  const {name} = destination;

  return `<li class="trip-events__item">
    <div class="event" id=${id}>
      <time class="event__date"
      datetime="${dateToFormat(dateFrom, DateFormat.date)}">
      ${dateToFormat(dateFrom, DateFormat.monthDay)}
      </time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time"
          datetime="${dateToFormat(dateFrom, DateFormat.date)}T${dateToFormat(dateFrom, DateFormat.time)}">
          ${dateToFormat(dateFrom, DateFormat.time)}
          </time>
          &mdash;
          <time class="event__end-time"
          datetime="${dateToFormat(dateTo, DateFormat.date)}T${dateToFormat(dateTo, DateFormat.time)}">
          ${dateToFormat(dateTo, DateFormat.time)}
          </time>
        </p>
        <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${getPointPrice(basePrice, offers)}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      ${createOffersTemplate(offers)}
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
