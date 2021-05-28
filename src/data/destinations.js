export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  set(destinations) {
    this._destinations = destinations;
  }

  get() {
    return this._destinations;
  }
}
