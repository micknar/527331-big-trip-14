import AbstractView from './abstract';
import {NavItem} from '../const';

const createMainNavTemplate = () => {
  return `<div class="trip-controls__navigation">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" data-nav-item="${NavItem.TABLE}" href="#">Table</a>
      <a class="trip-tabs__btn" data-nav-item="${NavItem.STATS}" href="#">Stats</a>
    </nav>
  </div>`;
};

export default class MainNav extends AbstractView {
  constructor() {
    super();

    this._navClickHandler = this._navClickHandler.bind(this);
  }

  getTemplate() {
    return createMainNavTemplate();
  }

  setNavItem(navItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    const item = this.getElement().querySelector(`[data-nav-item=${navItem}]`);

    items.forEach((item) => item.classList.remove('trip-tabs__btn--active'));
    item.classList.add('trip-tabs__btn--active');
  }

  setMainNavClickHandler(callback) {
    this._callback.navClick = callback;
    this.getElement().addEventListener('click', this._navClickHandler);
  }

  _navClickHandler(evt) {
    evt.preventDefault();
    this._callback.navClick(evt.target.dataset.navItem);
  }
}
