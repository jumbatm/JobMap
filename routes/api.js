"use strict";
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');
const job = require('../lib/job');
const ors = require('../lib/ors');

class ProcessedListing extends job.Job {
  constructor(name, position, description, suburb, lat, lng, time) {
    super(name, position, description, suburb);
    this._lat = lat;
    this._lng = lng;
    this._time = time;
  }
  getTime() { return this._time; }
}

router.get('/', function (req, res, _) {
  Promise.all([ geo.geocode(req.query.address), job.getJobs(req.query.keywords)])
    .then(values => {
      let point = values[0];

      let listings_promises = values[1].map(l => {
        return new Promise(
          (resolve, reject) => { 
            geo.geocode(l.getSuburb()).then(value => { 
              ors.routeBetween(
                process.env.ORS_API_KEY, 
                point,
                value)
                .then(value => {
                  let time = value.data.routes[0].summary.duration;
                  console.log(time);
                  resolve(new ProcessedListing(
                    l.getName(),
                    l.getPosition(), 
                    l.getDesc(), 
                    l.getSuburb(),
                    time
                  ));
                }).catch(e => reject(e));
            }).catch(e => reject(e))/* goecode*/
          }
        )});

      console.log(listings_promises);
      Promise.all(listings_promises).then(listings => {
        console.log("Listings:");
        console.log(listings);
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
