const express = require('express');
const router = express.Router();
const nominatim = require('../lib/nominatim');

// Map page.
router.get('/', function(req, res, next) {
  nominatim.geocode(req.query.address)
    .then(function(response){ 
      let nomData = response.data[0];
      // TODO: Handle errors.
      res.render('map', { 
          address: req.query.address, 
          keywords: req.query.keywords, 
          latitude: nomData.lat, 
          longitude: nomData.lon 
      });
    })
    .catch(function(e) { console.log(e); });
});

module.exports = router;
