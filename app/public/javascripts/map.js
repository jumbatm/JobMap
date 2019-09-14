let map;
let markers;

function getMap() {
  if (!map) {
    initMap();
    console.assert(map);
  }
  return map;
}

function clearMarkers() {
  markers = markers || [];
  markers.forEach(val => {
    map.removeLayer(val);
  });
}

function initMap() {
  if (map) {
    map.remove();
    map = markers = undefined;
  }
  map = L.map('map');
  L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
  markers = [];
}

function moveMapTo(lat, lon) {
  map.setView([lat, lon], 13);
}

function clearError() {
  document.querySelector("#error").innerHTML = "";
}

function addError(msg) {
  document.querySelector("#error").innerHTML = "Error: " + msg;
}

function addJobPopup(renderValue) {
  markers.push(L.marker([renderValue.lat, renderValue.lng])
    .bindPopup(renderValue.html)
    .addTo(getMap()));
}

function onFormSubmit() {
  clearError();
  const keywords = document.querySelector("#form_keywords").value;
  const address = document.querySelector("#form_address").value;
  const timeLimit = document.querySelector("#timelimit").value;
  document.querySelector("#form_submit").classList.add("spinning");
  $.ajax({
    url: "/api",
    type: "GET",
    data: {
      keywords: keywords,
      address: address,
      timeLimit: timeLimit,
    },
  })
  .done(response => {
    moveMapTo(response.from.lat, response.from.lon);
    clearMarkers();
    response.markers
      .forEach(v => {
        addJobPopup(v);
      })
  })
  .fail(e => {
    addError(e.responseJSON.error);
  })
  .always((_xhr, _info) => {
      document.querySelector("#form_submit").classList.remove("spinning");
  });
}
