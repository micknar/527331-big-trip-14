import PointEditorView from '../view/point-editor';
import {render, remove} from '../utils/render';
import {isEscKey} from '../utils/common';
import {UserAction, UpdateType, RenderPosition, DEFAULT_POINT_TYPE} from '../const';

export default class PointNew {
  constructor(pointsListContainer, destinations, offers, changeData) {
    this._pointsListContainer = pointsListContainer;
    this._destinations = destinations;
    this._offers = offers;
    this._changeData = changeData;

    this._pointEditorComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

    this._addPointBtn = document.querySelector('.trip-main__event-add-btn');

    this._blankPoint = {
      id: -1,
      basePrice: '0',
      dateFrom: new Date(),
      dateTo: new Date(),
      destination: '',
      isFavorite: false,
      offers: [],
      type: DEFAULT_POINT_TYPE,
    };
  }

  init() {
    this._addPointBtn.disabled = true;

    if (this._pointEditorComponent !== null) {
      return;
    }

    this._pointEditorComponent = new PointEditorView(this._destinations, this._offers, this._blankPoint);

    this._pointEditorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditorComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditorComponent.setDatepickers();

    render(this._pointsListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditorComponent === null) {
      return;
    }

    remove(this._pointEditorComponent);
    this._pointEditorComponent = null;
    this._addPointBtn.disabled = false;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditorComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditorComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditorComponent.shake(resetFormState);
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      this.destroy();
      this._addPointBtn.disabled = false;
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this._addPointBtn.disabled = false;
  }

  _handleDeleteClick() {
    this.destroy();
    this._addPointBtn.disabled = false;
  }
}
