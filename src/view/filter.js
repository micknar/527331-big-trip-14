import AbstractView from './abstract';
import {FilterType} from '../const';
import {setInputChecked} from '../utils/common';

const setDisabled = (filters, filterType) => {
  const count = filters.filter(({type}) => type === filterType)[0].count;

  if (count === 0) {
    return 'disabled';
  }

  return '';
};

const createFilterTemplate = (filters, activeFilter) => {
  return `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
  ${Object.values(FilterType).map((type) => {
    return `<div class="trip-filters__filter">
        <input id="filter-${type}" 
        class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" 
        value="${type}" ${setInputChecked(activeFilter, type)}
        ${setDisabled(filters, type)}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
      </div>`;
  }).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
};

export default class Filter extends AbstractView {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._activeFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.filterTypeChange(evt.target.value);
  }
}
