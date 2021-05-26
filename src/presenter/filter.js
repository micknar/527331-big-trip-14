import FilterView from '../view/filter';
import {render, replace, remove} from '../utils/render';
import {UpdateType} from '../const';


export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;
    this._activeFilter = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(this._filterModel.get());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent) {
      replace(this._filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    } else {
      render(this._filterContainer, this._filterComponent);
    }
  }

  setDisabled() {
    this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input')
      .forEach((input) => input.setAttribute('disabled', 'true'));
  }

  removeDisabled() {
    this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input')
      .forEach((input) => input.removeAttribute('disabled'));
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.get() === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}
