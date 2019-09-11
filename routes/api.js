
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');

class Listing {
  constructor(name, description, suburb, time) {
    this._name = name;
    this._description = description;
    this._suburb = suburb;
    this._time = time;
  }
  getName() { return this._name; }
  getDesc() { return this._description; }
  getSuburb() { return this._location; }
}

router.get('/', function (req, res, _) {
  geo.geocode(req.query.address)
    .then(function(point) { 
      res.json({
        lat: point.getLatitude(),
        lon: point.getLongitude(),
        listings: [
          new Listing("Dummy", "You will be dummy.", "Runcorn"),
        ],
      });
    })
    .catch(function(e) { console.log(e); });
});

module.exports = router;
