const axios = require('axios');
const Point = require('./Point');

const Transport = {
  DRIVING = "driving-car",
  CYCLING = "cycling-regular",
  WALKING = "foot-walking",
  WHEELCHAIR = "wheelchair",
};

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
  if (!Object.keys(Transport).includes(mode)) {
    throw "Invalid mode specified."
  }
  return axios.post(`https://api.openrouteservice.org/v2/directions/${mode}`, {
    auth: apiKey,
    data: {
      coordinates: [
        [start.getLongitude(), start.getLatitude()], 
        [end.getLongitude(), end.getLatitude()]
      ],
      geometry: false,
      instructions: false,
    }
  });

}

module.exports = {
  Transport: Transport,
  routeBetween: routeBetween
};
