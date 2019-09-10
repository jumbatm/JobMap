
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');

router.get('/', function (req, res, next) {
  geo.geocode(req.query.address)
    .then(function(response) { 
      let nomData = response.data[0];
      // TODO: Handle errors.
      res.json({
        lat: nomData.lat,
        lon: nomData.lon,
        listings: [],
      });
    })
    .catch(function(e) { console.log(e); });
});

module.exports = router;
