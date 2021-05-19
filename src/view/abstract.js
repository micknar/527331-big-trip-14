import {createElement} from '../utils/render';
import {ERROR_ANIMATION_TIMEOUT, ERROR_ANIMATION_STYLE} from '../const';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style = ERROR_ANIMATION_STYLE;

    setTimeout(() => {
      this.getElement().style = '';
      callback();
    }, ERROR_ANIMATION_TIMEOUT);
  }
}
