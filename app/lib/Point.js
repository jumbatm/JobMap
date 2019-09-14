class Point {
  constructor(lat, lng) {
    this._lat = lat;
    this._lng = lng;
  }

  getLatitude() {
    return this._lat;
  }

  getLongitude() {
    return this._lng;
  }
}

module.exports = Point;
