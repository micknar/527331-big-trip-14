import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart';
import {POINTS, POINT_TYPES, DateFormat, DESCRIPTIONS, Count, BLANK_POINT} from '../const';
import {dateToFormat, getRandomArrayItems, getRandomInteger} from '../utils/common';
import {generatePictures, generateOffers} from '../mocks/points';

import 'flatpickr/dist/flatpickr.min.css';

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
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${id}" type="checkbox" name="event-offer-${offer.title}">
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

const createPointEditorTemplate = (point) => {
  const {id, type, date, basePrice, offers, destination} = point;

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
          <input class="event__input event__input--time event__input--start" id="event-start-time-${id}" type="text" name="event-start-time"
          value="${dateToFormat(date.dateFrom, DateFormat.full)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input event__input--time event__input--end" id="event-end-time-${id}" type="text" name="event-end-time"
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

export default class PointEditor extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = PointEditor.parsePointToData(point);
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._minStartDate = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign(
      {},
      data,
    );

    return data;
  }

  getTemplate() {
    return createPointEditorTemplate(this._data);
  }

  reset(point) {
    this.updateData(
      PointEditor.parsePointToData(point),
    );

    this.resetDatepickers();
  }

  resetDatepickers() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.closeClick);
  }

  removeElement() {
    super.removeElement();
    this.resetDatepickers();
  }

  setDatepickers() {
    this.resetDatepickers();
    this._minStartDate = this._data.date.dateTo;

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('.event__input--start'),
      {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._data.date.dateFrom).toDate(),
        onChange: this._dateFromChangeHandler,
      },
    );

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('.event__input--end'),
      {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        minDate: dayjs(this._data.date.dateFrom).toDate(),
        defaultDate: dayjs(this._data.date.dateTo).toDate(),
        onChange: this._dateToChangeHandler,
      },
    );
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEditor.parseDataToPoint(this._data));
    this.resetDatepickers();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEditor.parseDataToPoint(this._data));
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick(this._data);
  }

  _pointTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      offers: generateOffers(getRandomInteger(Count.OFFER)),
      type: evt.target.value,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: {
        description: getRandomArrayItems(DESCRIPTIONS),
        name: evt.target.value,
        pictures: generatePictures(getRandomInteger(Count.PICTURES)),
      },
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      date: {
        dateFrom: userDate,
        dateTo: this._minStartDate <= userDate ? userDate : this._data.date.dateTo,
      },
    }, true);

    this._dateToPicker.set('minDate', userDate);
    this._dateToPicker.set('minTime', userDate);

    if (this._minStartDate <= userDate) {
      this._dateToPicker.setDate(userDate);
      this._minStartDate = userDate;
    }
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      date: {
        dateFrom: this._data.date.dateFrom,
        dateTo: userDate,
      },
    }, true);

    this._dateToPicker.setDate(userDate);

    if (this._minStartDate > userDate) {
      this._dateToPicker.set('minDate', userDate);
      this._dateToPicker.set('minTime', userDate);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._pointTypeChangeHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);
  }
}
