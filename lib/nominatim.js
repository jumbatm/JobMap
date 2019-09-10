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

module.exports = { 
  geocode: geocode,
};
