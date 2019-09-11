let map = L.map('map');
L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);

function renderMap(lat, lon) {
    map.setView([lat, lon], 13); 
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
      renderMap(response.lat, response.lon);
    }
  });
}
