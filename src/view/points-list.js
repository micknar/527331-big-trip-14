import Abstract from '../view/abstract';

const createPointsListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

export default class PointsList extends Abstract {
  getTemplate() {
    return createPointsListTemplate();
  }
}
