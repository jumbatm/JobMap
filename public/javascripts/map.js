let map;
let homeMarker;
let markers;

function getMap() {
  if (!map) {
    initMap();
    console.assert(map);
  }
  return map;
}

function initMap() {
  if (map) {
    map.remove();
    map = homeMarker = markers = undefined;
  }
  map = L.map('map');
  L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
  markers = []

}

function moveMapTo(lat, lon) {
  map.setView([lat, lon], 13);
}

function plotHome(homeLat, homeLon) {
  homeMarker = L.marker([homeLat, homeLon]).addTo(getMap());
}

function addJobPopup(renderValue) {
  markers.push(L.marker([renderValue.lat, renderValue.lng])
    .bindPopup(renderValue.html)
    .addTo(getMap()));
}

function onFormSubmit() {
  const keywords = document.querySelector("#form_keywords").value;
  const address = document.querySelector("#form_address").value;
  document.querySelector("#form_submit").classList.add("spinning");
  $.ajax({
    url: "/api",
    type: "GET",
    data: {
      keywords: keywords,
      address: address,
    },
    success: function(response) {
      document.querySelector("#form_submit").classList.remove("spinning");
      console.log(response);
      moveMapTo(response.from.lat, response.from.lon);
      plotHome(response.from.lat, response.from.lon);
      response.markers
      .forEach(v => {
        addJobPopup(v);
      });
    }
  });
}
