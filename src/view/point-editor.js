import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';
import SmartView from './smart';
import {DateFormat, DatePickerSettings} from '../const';
import {dateToFormat, isCheckedOffer} from '../utils/common';

import 'flatpickr/dist/flatpickr.min.css';

const setDisabled = (isDisabled) => isDisabled ? 'disabled' : '';
const getDeleteBtnText = (isDeleting) => isDeleting ? 'Deleting...' : 'Delete';

const createDestinationsListTemplate = (destinations) => {
  return `<datalist id="destination-list">
    ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
  </datalist>`;
};

const createPointTypesListTemplate = (checkedType, offers, isDisabled) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
  ${offers.map((offer) => {
    const {type} = offer;
    return `<div class="event__type-item">
      <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type}" ${type === checkedType ? 'checked' : ''} ${setDisabled(isDisabled)}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type}</label>
    </div>`;
  }).join('')}
    </fieldset>
  </div>`;
};

const createOffersTemplate = (type, allOffers, offers, isDisabled) => {
  const availableOffers = allOffers.find((item) => item.type === type).offers;

  if (availableOffers.length > 0) {
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
  ${availableOffers.map((offer) => {
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}" type="checkbox" name="event-offer-${offer.title}"
      data-offer-title="${offer.title}" ${isCheckedOffer(offer, offers) ? 'checked' : ''} ${setDisabled(isDisabled)} >
      <label class="event__offer-label" for="event-offer-${offer.title}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('')}
      </div>
    </section>`;
  }

  return '';
};

const createDescriptionTemplate = (description) => {
  if (description.length !== 0) {
    return `<p class="event__destination-description">${description}</p>`;
  }

  return '';
};

const createPicturesTemplate = (pictures) => {
  if (pictures.length !== 0) {
    return `<div class="event__photos-container">
    <div class="event__photos-tape">
  ${pictures.map((picture) => {
    return `<img class="event__photo" src="${picture.src}" alt="${picture.alt}">`;
  }).join('')}
    </div>
  </div>`;
  }

  return '';
};

const createDestinationTemplate = (destination) => {
  const {description, pictures} = destination;

  if (description || pictures) {
    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDescriptionTemplate(description)}
      ${createPicturesTemplate(pictures)}
    </section>`;
  }

  return '';
};

const createPointEditorTemplate = (destinations, allOffers, point) => {
  const {id, type, dateTo, dateFrom, basePrice, offers, destination, isDisabled, isSaving, isDeleting} = point;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox" ${setDisabled(isDisabled)}>

          ${createPointTypesListTemplate(type, allOffers, isDisabled)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination"
          value="${destination !== '' ? he.encode(destination.name) : ''}" list="destination-list" ${setDisabled(isDisabled)}>
          ${createDestinationsListTemplate(destinations)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time">From</label>
          <input class="event__input event__input--time event__input--start" id="event-start-time" type="text" name="event-start-time"
          value="${dateToFormat(dateFrom, DateFormat.FULL)}" ${setDisabled(isDisabled)}>
          &mdash;
          <label class="visually-hidden" for="event-end-time">To</label>
          <input class="event__input event__input--time event__input--end" id="event-end-time" type="text" name="event-end-time"
          value="${dateToFormat(dateTo, DateFormat.FULL)}" ${setDisabled(isDisabled)}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price" type="number" min="0" name="event-price" 
          value="${basePrice}" ${setDisabled(isDisabled)}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${setDisabled(isDisabled)}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${setDisabled(isDisabled)}>${id === -1 ? 'Cancel' : getDeleteBtnText(isDeleting)}</button>
${id === -1
    ? ''
    : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'
}
      </header>
      <section class="event__details">
        ${createOffersTemplate(type, allOffers, offers, isDisabled)}
        ${createDestinationTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class PointEditor extends SmartView {
  constructor(destinations, offers, point) {
    super();
    this._destinations = destinations;
    this._offers = offers;
    this._data = PointEditor.parsePointToData(point);
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._minStartDate = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offerToggleHandler = this._offerToggleHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointEditorTemplate(this._destinations.get(), this._offers.get(), this._data);
  }

  reset(point) {
    this.updateData(
      PointEditor.parsePointToData(point),
    );

    this.resetDatePickers();
  }

  resetDatePickers() {
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
    this.setDatePickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.closeClick);
  }

  removeElement() {
    super.removeElement();
    this.resetDatePickers();
  }

  setDatePickers() {
    this.resetDatePickers();
    this._minStartDate = this._data.dateTo;

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('.event__input--start'),
      Object.assign(
        {},
        DatePickerSettings,
        {
          defaultDate: dayjs(this._data.dateFrom).toDate(),
          onChange: this._dateFromChangeHandler,
        },
      ),
    );

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('.event__input--end'),
      Object.assign(
        {},
        DatePickerSettings,
        {
          minDate: dayjs(this._data.dateFrom).toDate(),
          defaultDate: dayjs(this._data.dateTo).toDate(),
          onChange: this._dateToChangeHandler,
        },
      ),
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
    const closeBtn = this.getElement().querySelector('.event__rollup-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', this._closeClickHandler);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEditor.parseDataToPoint(this._data));
    this.resetDatePickers();
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
      offers: [],
      type: evt.target.value,
    });
  }

  _destinationChangeHandler(evt) {
    const allDestinations = this._destinations.get();
    const isExist = allDestinations.find((item) => item.name === evt.target.value);

    if (!isExist) {
      return evt.target.setCustomValidity('This destination was not found.');
    }

    const destination = allDestinations.filter((item) => item.name === evt.target.value)[0];

    this.updateData({
      destination: {
        description: destination.description,
        name: destination.name,
        pictures: destination.pictures,
      },
    });
  }

  _offerToggleHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const checkedOfferTitle = evt.target.dataset.offerTitle;
    const offers = this._data.offers;

    const availableOffers = this._offers.get().find((item) => item.type === this._data.type).offers;
    const checkedOffer = availableOffers.find((item) => item.title === checkedOfferTitle);

    const newOffers = offers.find((item) => item.title === checkedOfferTitle)
      ? offers.filter((item) => item.title !== checkedOfferTitle)
      : [...offers.slice(), checkedOffer];

    this.updateData({
      offers: newOffers,
    }, true);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
      dateTo: this._minStartDate <= userDate ? userDate : this._data.dateTo,
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
      dateFrom: this._data.dateFrom,
      dateTo: userDate,
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

    if (this.getElement().querySelector('.event__available-offers') !== null) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._offerToggleHandler);
    }
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign(
      {},
      data,
    );

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
