
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');

router.get('/', function (req, res, _) {
  geo.geocode(req.query.address)
    .then(function(point) { 
      res.json({
        lat: point.getLatitude(),
        lon: point.getLongitude(),
        listings: [],
      });
    })
    .catch(function(e) { console.log(e); });
});

module.exports = router;
