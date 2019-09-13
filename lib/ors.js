const axios = require('axios');
const Point = require('./Point');

const Transport = {
  DRIVING: "driving-car",
  CYCLING: "cycling-regular",
  WALKING: "foot-walking",
  WHEELCHAIR: "wheelchair",
};

function range(start, stop) {
  return [...Array(stop - 1).keys()].map(x => x + start);
}


/**
 * Get the raw route information from OpenRouteService.
 * @param apiKey The API key as a string.
 * @param start, end The start and end latitude, longitude as { lat: ..., lng: ... }
 * @param mode Optional driving mode. One of the values defined in Transport. Defaults to DRIVING.
 */
function routeBetween(apiKey, start, end, mode) {
  if (!apiKey) {
    throw "No API key provided.";
  }
  if (!(start && end)) {
    throw "Missing either the start or end destination.";
  }
  mode = mode || Transport.DRIVING;
  if (!Object.keys(Transport).map(v => Transport[v]).includes(mode)) {
    throw "Invalid mode specified."
  }
  let data = {
    coordinates: [
      [start.getLongitude(), start.getLatitude()], 
      [end.getLongitude(), end.getLatitude()]
    ],
  };

  let headers = {
    headers: {
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      'Authorization': apiKey,
    }
  }; 

return axios.post(`https://api.openrouteservice.org/v2/directions/${mode}`, data, headers); 
}

/**
 * Perform a routing between a single start and multiple end points. Only makes
 * a single request to the API. Output has the same format as the routeBetween
 * function, but as an array
 */
function bulkRouteBetween(apiKey, start, end, mode) {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      throw "No API key provided.";
    }
    if (!(start && end)) {
      throw "Missing either the start or end destination.";
    }
    mode = mode || Transport.DRIVING;
    if (!Object.keys(Transport).map(v => Transport[v]).includes(mode)) {
      throw "Invalid mode specified."
    }
    const headers = {
      headers: {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': apiKey,
      }
    }; 

    let data = {
      locations: [ start ].concat(end),
      destinations: range(1, end.length + 1),
      sources: [ 0 ],
    };

    return axios.post(`https://api.openrouteservice.org/v2/matrix/${mode}`, data, headers)
      .then(v => {
        resolve(v.data);
      })
      .catch(e => reject(e));
  });
}

module.exports = {
  Transport: Transport,
  routeBetween: routeBetween,
  bulkRouteBetween: bulkRouteBetween,
};
