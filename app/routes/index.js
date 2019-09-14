const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');

// Map page.
router.get('/', function(req, res, next) {
  const DEFAULT_LATITUDE = "-27.470125";
  const DEFAULT_LONGITUDE = "153.021072";

  geo.geoLocate(req.ip.slice(req.ip.lastIndexOf(":")+1)).then(function(point) {
    res.render('index', { 
      address: req.query.address, 
      keywords: req.query.keywords, 
      latitude: point ? point.getLatitude() : DEFAULT_LATITUDE, 
      longitude: point ? point.getLongitude() : DEFAULT_LONGITUDE,
    });
  }).catch(e => next(e));
});

module.exports = router;
