import AbstractView from './abstract';
import {POINTS, POINT_TYPES, DateFormat} from '../const';
import {dateToFormat} from '../utils/common';

const createDestinationsListTemplate = (id) => {
  return `<datalist id="destination-list-${id}">
    ${POINTS.map((point) => `<option value="${point}"></option>`).join('')}
  </datalist>`;
};

const createPointTypesListTemplate = (id, checkedType) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
  ${POINT_TYPES.map((type) => {
    return `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type}" ${type === checkedType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
    </div>`;
  }).join('')}
    </fieldset>
  </div>`;
};

const createOffersTemplate = (id, offers) => {
  if (offers.length > 0) {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
  ${offers.map((offer) => {
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${id}" type="checkbox" name="event-offer-${offer.title}" checked>
      <label class="event__offer-label" for="event-offer-${offer.title}-${id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('')}
      </div>
    </section>`;
  } else {
    return '';
  }
};

const createDestinationTemplate = (destination) => {
  const {description, pictures} = destination;

  if (Object.keys(destination).length !== 0) {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
  ${pictures.map((picture) => {
    return `<img class="event__photo" src="${picture.src}" alt="${picture.alt}">`;
  }).join('')}
        </div>
      </div>
    </section>`;
  } else {
    return '';
  }
};

const createPointEditorTemplate = (point = {}) => {
  const {
    id = -1,
    basePrice = '',
    date = {
      dateFrom: new Date(),
      dateTo: new Date(),
    },
    destination = {
      name: POINTS[0],
      pictures: [],
      description: '',
    },
    //isFavorite = false,
    offers = [],
    type = POINT_TYPES[0],
  } = point;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          ${createPointTypesListTemplate(id, type)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
          ${createDestinationsListTemplate(id)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
          value="${dateToFormat(date.dateFrom, DateFormat.full)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time"
          value="${dateToFormat(date.dateTo, DateFormat.full)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" 
          value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${id === -1 ? 'Cancel' : 'Delete'}</button>
${id === -1
    ? ''
    : `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
}
      </header>
      <section class="event__details">
        ${createOffersTemplate(id, offers)}
        ${createDestinationTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class PointEditor extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createPointEditorTemplate();
  }
}
