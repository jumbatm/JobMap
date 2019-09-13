"use strict";
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');
const job = require('../lib/job');
const ors = require('../lib/ors');
const pug = require('pug');
const path = require('path');

const jobRenderer = pug.compileFile(path.join(__dirname, '../views/job.pug'));

class ProcessedListing extends job.Job {
  constructor(name, position, description, suburb, lat, lng, time) {
    super(name, position, description, suburb);
    this._lat = lat;
    this._lng = lng;
    this._time = time;
  }
  getTime() { return this._time; }
  getLatitude() { return this._lat; }
  getLongitude() { return this._lng; }
}

router.get('/', function (req, res, _) {
  Promise.all([ geo.geocode(req.query.address), job.getJobs(req.query.keywords, req.query.address)])
    .then(values => {
      let homePoint = values[0];

      let uniquedSuburbs = [...new Set(values[1].map(l => l.getSuburb()))];
      let uniqueGeocodeWithPromise = 
        uniquedSuburbs.map(suburbName => {
          return geo.geocode(suburbName);
        });

      Promise.all(uniqueGeocodeWithPromise).then(points => {

        // Now, fire off the bulk request for time taken for points.
        ors.bulkRouteBetween(process.env.ORS_API_KEY, 
          [homePoint.getLongitude(), homePoint.getLatitude()],
          points.map(v => { return [ v.getLongitude(), v.getLatitude() ]; }),
        ).then(response => {
          const durations = response.durations;

          let result = {};
          points.forEach((point, i) => {
            const suburbName = uniquedSuburbs[i];
            const duration = durations[0][i];
            result[suburbName] = { lat: point.getLatitude(), lng: point.getLongitude(), duration: duration, };
          });

          // Now, we iterate through our jobs, and using the location of the job as a key, we append job information.
          values[1].forEach(job => {
            result[job.getSuburb()]["jobs"] = result[job.getSuburb()]["jobs"] || [];
            result[job.getSuburb()]["jobs"].push({
              name: job.getName(),
              position: job.getPosition(),
              description: job.getDesc(),
            });
          });

          Object.freeze(result);
          console.log(result);

          // Provide the full HTML for each of the markers.
          let rendered = Object.keys(result).map((suburbName) => {
            return {
              lat: result[suburbName].lat,
              lng: result[suburbName].lng,
              html: jobRenderer({
                jobs: result[suburbName].jobs,
                suburb: result[suburbName].suburb,
                time: result[suburbName].duration,
              }),
            };
          });

          res.json({
            from: {
              lat: homePoint.getLatitude(),
              lon: homePoint.getLongitude(),
            },
            markers: rendered,
          });
        }).catch(e => console.log(e));

      }).catch(e => console.log(e));


    }).catch(e => console.log(e));

});

module.exports = router;
