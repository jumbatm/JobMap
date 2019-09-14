const axios = require('axios');
const Point = require('../lib/Point');

function geocode(query) {
  return new Promise((resolve, reject) =>{
    axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: query,
        format: "json",
        limit: 1,
      }
    })
    .then((response) => {
      if (response.data.length === 0) {
        console.trace(query);
        reject(query);
      }
      resolve(new Point(response.data[0].lat, response.data[0].lon));
    })
    .catch(e => reject(e));
  });
}

/**
 * Get a user's vague location from their IP address. We could also request
 * permissions from the browser itself on client side and forward this
 * information to the server, but this way doesn't require the user to give
 * any sort of permissions to our webpage.
 *
 * @return A promise which resolves to a Point..
 */
function geoLocate(ipAddress) {
  if (ipAddress.includes("127.0.0.1") || ipAddress.includes("::1")) {
    return new Promise((resolve, _) => {
      resolve(null);
    });
  }
  return new Promise(
    (resolve, reject) => {
      axios.get("http://ip-api.com/json/" + ipAddress)
        .then(
          response => response.status === 200 
          ? resolve(new Point(response.lat, response.lng))
          : reject(response)
        )
        .catch(e => reject(e));
    });
}

module.exports = { 
  geocode: geocode,
  geoLocate: geoLocate,
};
