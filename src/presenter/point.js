import PointView from '../view/point';
import PointEditorView from '../view/point-editor';
import {render, replace, remove} from '../utils/render';
import {Mode} from '../const';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditorComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditorComponent = this._pointEditorComponent;

    this._pointComponent = new PointView(point);
    this._pointEditorComponent = new PointEditorView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditorComponent.setCloseClickHandler(this._handleCloseClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevPointEditorComponent === null) {
      render(this._pointContainer, this._pointComponent);
      return;
    }

    if (this._pointContainer.contains(prevPointComponent.getElement())) {
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
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _closeFormWithoutSave() {
    this._pointEditorComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditorComponent);
    this._pointEditorComponent.resetDatepickers();
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToForm() {
    replace(this._pointEditorComponent, this._pointComponent);
    this._pointEditorComponent.setDatepickers();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFormWithoutSave();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleCloseClick() {
    this._closeFormWithoutSave();
  }

  _handleFavoriteClick() {
    this._changeData(
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
