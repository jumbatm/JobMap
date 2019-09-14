"use strict";
const express = require('express');
const router = express.Router();
const geo = require('../lib/geo');
const job = require('../lib/job');
const ors = require('../lib/ors');
const pug = require('pug');
const path = require('path');
const entities = require('html-entities').AllHtmlEntities;

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
  let homePoint;
  let points;
  let uniquedSuburbs;
  let values;

  Promise.all([ geo.geocode(req.query.address), job.getJobs(req.query.keywords, req.query.address)])
    .then(valuesResponse => {
      values = valuesResponse;
      homePoint = valuesResponse[0];

      uniquedSuburbs = [...new Set(valuesResponse[1].map(l => l.getSuburb()))];
      let uniqueGeocodeWithPromise = 
        uniquedSuburbs.map(suburbName => {
          return geo.geocode(suburbName);
        });

      return Promise.all(uniqueGeocodeWithPromise);
    }).then(pointsResponse => { 
      points = pointsResponse;
      // Now, fire off the bulk request for time taken for points.
      return ors.bulkRouteBetween(process.env.ORS_API_KEY, 
        [homePoint.getLongitude(), homePoint.getLatitude()],
        pointsResponse.map(v => { return [ v.getLongitude(), v.getLatitude() ]; }),
      );
    }).then(response => {
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
          title: job.getTitle(),
          link: job.getLink(),
          content: entities.decode(job.getContent()),
        });
      });

      Object.freeze(result);

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

});

module.exports = router;
