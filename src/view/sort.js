import AbstractView from './abstract';
import {SortType} from '../const';

const setChecked = (currentSortType, sortType) => currentSortType === sortType ? 'checked' : '';
const setDisabled = (sortType) => sortType === SortType.EVENT || sortType === SortType.OFFER ? 'disabled' : '';
const getSortTitle = (sortType) => sortType === SortType.OFFER ? 'offers' : sortType;

const createSortTemplate = (currentSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${Object.values(SortType).map((type) => {
    return `<div class="trip-sort__item trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input visually-hidden" type="radio"
      name="trip-sort" value="sort-${type}" data-sort-type="${type}"
      ${setDisabled(type)} ${setChecked(currentSortType, type)} >
      <label class="trip-sort__btn" for="sort-${type}">${getSortTitle(type)}</label>
    </div>`;
  }).join('')}
  </form>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
