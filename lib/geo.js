const axios = require('axios');

function geocode(query) {
  return axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: query,
      format: "json",
      limit: 1,
    }
  });
}

/**
 * Get a user's vague location from their IP address. We could also request
 * permissions from the browser itself on client side and forward this
 * information to the server, but this way doesn't require the user to give
 * any sort of permissions to our webpage.
 *
 * @return A promise. Returns null if the request failed.
 */
function geoLocate(ipAddress) {
  console.log(ipAddress);
  if (ipAddress.includes("127.0.0.1") || ipAddress.includes("::1")) {
    return new Promise(function(resolve, reject) {
      resolve(null);
    });
  }
  return axios.get("http://ip-api.com/json/" + ipAddress)
}

module.exports = { 
  geocode: geocode,
  geoLocate: geoLocate,
};
