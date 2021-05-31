import PointsModel from '../model/points';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization, destinationsData, offersData) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._destinationsData = destinationsData;
    this._offersData = offersData;
  }

  getPoints() {
    return this._load({
      url: 'points',
    })
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    return this._load({
      url: 'destinations',
    })
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({
      url: 'offers',
    })
      .then(Api.toJSON);
  }

  getData() {
    return Promise.all([
      this.getPoints(),
      this.getDestinations(),
      this.getOffers(),
    ])
      .then((data) => {
        const [points, destinations, offers] = data;

        this._destinationsData.set(destinations);
        this._offersData.set(offers);

        return points;
      })
      .catch(() => {
        this._destinationsData.set([]);
        this._offersData.set([]);
      });
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  sync(data) {
    return this._load({
      url: 'points/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
