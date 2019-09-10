const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');

// Map page.
router.get('/', function(req, res, next) {
  const DEFAULT_LATITUDE = "-27.470125";
  const DEFAULT_LONGITUDE = "153.021072";
  console.log(req.connection.remoteAddress);

  geo.geoLocate(req.ip).then(function(resp) {
    console.log(resp);
    res.render('index', { 
      address: req.query.address, 
      keywords: req.query.keywords, 
      latitude: (resp && resp.status) ? resp.lat : DEFAULT_LATITUDE, 
      longitude: (resp && resp.status) ? resp.lon : DEFAULT_LONGITUDE,
    });
  }).catch(e => console.log(e));
});

module.exports = router;
