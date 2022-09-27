async function init() {
  //get data
  let hotel = await fetch(
    "https://holiday-beta.vercel.app/map/api/gethotel"
  ).then((res) => res.json());
  let destination = await fetch(
    "https://holiday-beta.vercel.app/map/api/getdestination"
  ).then((res) => res.json());
  let eating_spot = await fetch(
    "https://holiday-beta.vercel.app/map/api/geteatingspot"
  ).then((res) => res.json());
  //create maker
  hotel = getMaker(hotel, "/img/hotel.png", [25, 25]);
  destination = getMaker(destination, "/img/destination.png", [30, 30]);
  eating_spot = getMaker(eating_spot, "/img/eating-disorder.png", [30, 30]);
  //creat layergroup
  let hotels = L.layerGroup(hotel);
  let destinations = L.layerGroup(destination);
  let eatings = L.layerGroup(eating_spot);
  //create map
  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  });
  let map = L.map("map", {
    center: [11.930104232440444, 108.46101975775716],
    zoom: 13,
    layers: [osm, hotels, destinations, eatings],
  });
  //
  let sidebar = L.control.sidebar("sidebar", {
    position: "left",
  });

  map.addControl(sidebar);
  //
  L.Routing.control({
    routeWhileDragging: false,
    geocoder: L.Control.Geocoder.nominatim(),
    collapsible: true,
  }).addTo(map);
  document
    .getElementsByClassName("leaflet-routing-container")[0]
    .classList.add("leaflet-routing-container-hide"); //hide routing
  //
  function getMaker(makerDatas, iconUrl, iconSize) {
    let icon = L.icon({
      iconUrl: iconUrl,
      iconSize: iconSize,
    });
    for (let i = 0; i < makerDatas.length; i++) {
      let marker = L.marker([makerDatas[i].lat, makerDatas[i].long], {
        icon: icon,
        name: makerDatas[i].name,
        data: makerDatas[i],
      });
      marker.bindPopup(`<b>${makerDatas[i].name}</b>`);
      //hightlight maker when hover
      marker.on("mouseover", function (e) {
        //console.log(e)
        marker.openPopup();
        //set newicon
        let icon = L.icon({
          iconUrl: e.target.options.icon.options.iconUrl,
          iconSize: [50, 50],
        });
        //add maker with newicon
        let markerTemp = L.marker(e.latlng, {
          icon: icon,
        }).addTo(map);
        //remove makerTemp
        markerTemp.on("mouseout", function (e) {
          markerTemp.remove();
          marker.closePopup();
        });
        //open sidebar when click on tempmarker
        markerTemp.on("click", function (e) {
          sidebar.hide();
          sidebar.setContent(`<div style="width:100%;margin-top:10%;">
                        <iFrame style="border:none;" src="https://holiday-beta.vercel.app/map/api/infomation?id=${marker.options.data._id}" width="100%" height="700px" allowfullscreen></iFrame>
                        </div>`);
          sidebar.show();

          map.flyTo([marker.options.data.lat, marker.options.data.long], 19);

          sidebar.on("hide", function () {
            map.flyTo([marker.options.data.lat, marker.options.data.long], 13);
          });
        });
      });
      //

      makerDatas[i] = marker;
    }
    return makerDatas;
  }
  //
  let baseMaps = {
    OpenStreetMap: osm,
  };

  let overlayMaps = {
    "Khách sạn": hotels,
    "Điểm tham quan": destinations,
    "Ăn uống": eatings,
  };
  let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
  //create legend
  let legend = L.control({
    position: "bottomleft",
  });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += `
        <div style="text-align:center; background-color:white; padding:15px; box-shadow: 0 0 12px rgba(0, 0, 0, 0.7)">
        <h1>Chú thích</h1>
        <div style="margin:5px 0px; display:flex"><img style="width:20px; height:20px" src="/img/eating-disorder.png"/><p style="margin:0px 10px; font-weight:bold">Ăn uống</p></div>
        <div style="margin:5px 0px; display:flex"><img style="width:20px; height:20px" src="/img/destination.png"/><p style="margin:0px 10px; font-weight:bold">Điểm tham quan</p></div>
        <div style="margin:5px 0px; display:flex"><img style="width:20px; height:20px" src="/img/hotel.png"/><p style="margin:0px 10px; font-weight:bold">Khách sạn</p></div>
        </div>
        `;
    return div;
  };
  legend.addTo(map);
  //search
  let searchLayers = L.layerGroup([hotels, destinations, eatings]);
  L.control
    .search({
      layer: searchLayers,
      initial: false,
      propertyName: "name",
      moveToLocation: function (latlng, title, map) {
        sidebar.hide();
        map.flyTo(latlng, 18);
      },
    })
    .addTo(map);
  let searchInput = document.getElementsByClassName("search-input")[1];
  searchInput.placeholder = "Nhập điểm cần tìm...";
  searchInput.style.padding = "0px 20px 0px 2px";
  searchInput.style.width = "150px";
  searchInput.style.border = "none";
  document.getElementsByClassName("search-button")[0].style.float = "right";
  //find mylocation
  L.control
    .locate({
      strings: {
        title: "Vị trí của tôi",
      },
      flyTo: true,
      initialZoomLevel: 18,
    })
    .addTo(map);
  //find adress
  L.Control.geocoder().addTo(map);
  //map event
  map.on("click", function (e) {
    sidebar.hide();
  });
}
init();
