
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');
const job = require('../lib/job');
const Point = require('../lib/Point');
const ors = require('../lib/ors');

class ProcessedListing extends job.Job {
  constructor(name, position, description, suburb, time) {
    super(name, position, description, suburb);
    this._time = time;
  }
  getTime() { return this._time; }
}

router.get('/', function (req, res, _) {
  Promise.all([ geo.geocode(req.query.address), job.getJobs(req.query.keywords)])
    .then(values => {
      let point = values[0];

      let listings_promises = values[1].map(l => {
        geo.geocode(l.getSuburb()).then(value => { 
          ors.routeBetween(
            process.env.ORS_API_KEY, 
            point,
            value)
          .then(value => { console.log(value.data.routes); })
          .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
      });

      Promise.all(listings_promises).then(listings => {
        res.json({
          lat: point.getLatitude(),
          lon: point.getLongitude(),
          listings: listings,
        });
      })
      .catch(e => console.log(e));

    })
    .catch(function(e) { console.log(e); });
});

module.exports = router;
