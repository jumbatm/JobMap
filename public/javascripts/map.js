function renderMap(lat, lon) {
  var map = L.map('map').setView([lat, lon], 13);
  L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
}
