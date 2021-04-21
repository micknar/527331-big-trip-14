import PointView from '../view/point';
import PointEditorView from '../view/point-editor';
import {render, replace} from '../utils/render';

export default class Point {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;

    this._pointComponent = null;
    this._pointEditorComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new PointView(point);
    this._pointEditorComponent = new PointEditorView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditorComponent.setEditClickHandler(this._handleCloseClick);

    render(this._pointContainer, this._pointComponent);
  }

  _replaceFormToPoint() {
      replace(this._pointComponent, this._pointEditorComponent);
      document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _replacePointToForm() {
    replace(this._pointEditorComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleCloseClick() {
    this._replaceFormToPoint();
  }
} 
