import PointView from '../view/point';
import PointEditorView from '../view/point-editor';
import {render, replace, remove} from '../utils/render';
import {isEscKey, isOnline} from '../utils/common';
import {renderToast} from '../utils/toast';
import {Mode, State, UserAction, UpdateType, OfflineMessage} from '../const';

export default class Point {
  constructor(container, destinations, offers, changeData, changeMode) {
    this._container = container;
    this._destinations = destinations;
    this._offers = offers;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditorComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditorComponent = this._pointEditorComponent;

    this._pointComponent = new PointView(point);
    this._pointEditorComponent = new PointEditorView(this._destinations, this._offers, point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditorComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditorComponent.setCloseClickHandler(this._handleCloseClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevPointEditorComponent === null) {
      render(this._container, this._pointComponent);
      return;
    }

    if (this._container.contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditorComponent, prevPointEditorComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditorComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditorComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditorComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditorComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditorComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditorComponent.shake(resetFormState);
        break;
    }
  }

  _closeFormWithoutSave() {
    this._pointEditorComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditorComponent);
    this._pointEditorComponent.resetDatePickers();
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToForm() {
    replace(this._pointEditorComponent, this._pointComponent);
    this._pointEditorComponent.setDatePickers();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this._closeFormWithoutSave();
    }
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      renderToast(OfflineMessage.SAVE);
      return;
    }

    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      renderToast(OfflineMessage.DELETE);
      return;
    }

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleEditClick() {
    if (!isOnline()) {
      renderToast(OfflineMessage.EDIT);
      return;
    }

    this._replacePointToForm();
  }

  _handleCloseClick() {
    this._closeFormWithoutSave();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }
}
