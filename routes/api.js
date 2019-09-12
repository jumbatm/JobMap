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
      let point = values[0];

      console.log(values[1]);

      let listings_promises = values[1].map(l => {
        return new Promise(
          (resolve, reject) => { 
            geo.geocode(l.getSuburb()).then(suburbPoint => { 
                ors.routeBetween(
                  process.env.ORS_API_KEY, 
                  point,
                  suburbPoint)
                  .then(value => {
                    let time = value.data.routes[0].summary.duration;
                    resolve(new ProcessedListing(
                      l.getName(),
                      l.getPosition(), 
                      l.getDesc(), 
                      l.getSuburb(),
                      suburbPoint.getLatitude(),
                      suburbPoint.getLongitude(),
                      time
                    ));
                  }).catch(e => reject(e));
              }).catch(e => reject(e))
          }
        )});

      Promise.all(listings_promises).then(listings => {
        listings = listings.sort((x, y) => {
          // Sort by GPS coordinate.
          let xp = x.getLatitude() + "#" + x.getLongitude();
          let yp = y.getLatitude() + "#" + y.getLongitude();
          if (xp === yp) {
            return 0;
          }
          if (xp < yp) {
            return 1;
          }
          if (xp > yp) {
            return -1;
          }
        });


        // We now merge listings with the same lat/longitude.
        let markers = listings.reduce((acc, current) => {
          let toJSON = function(jobListing) {
            return {
                name: jobListing.getName(),
                position: jobListing.getPosition(),
                description: jobListing.getDesc(),
            };
          };
          let prev = acc.length !== 0 ? acc[acc.length-1] : undefined;
          // acc: The new list.
          if (acc.length !== 0 
            && prev.lat === current.getLatitude() 
            && prev.lng === current.getLongitude()) {
            // The values are the same. Therefore, we merge with the previous node.
            prev.jobs.push(toJSON(current));
          } else {
            // Values are unique. We append current to acc.
            acc.push({
              lat: current.getLatitude(),
              lng: current.getLongitude(),
              suburb: current.getSuburb(),
              time: current.getTime(),
              jobs: [toJSON(current)],
            });
          }
          return acc;
        }, []);

        // Provide the full HTML for each of the markers..  
        let rendered = markers.map((value) => {
          return {
            lat: value.lat,
            lng: value.lng,
            html: jobRenderer({
              jobs: value.jobs,
              suburb: value.suburb,
              time: value.time,
            }),
          }
        });

        res.json({
          from: {
            lat: point.getLatitude(),
            lon: point.getLongitude(),
          },
          markers: rendered,
        });
      }).catch(e => console.log(e));

    }).catch(function(e) { console.log(e); });
});

module.exports = router;
