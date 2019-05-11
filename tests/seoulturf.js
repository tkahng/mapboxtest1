mapboxgl.accessToken = 'pk.eyJ1IjoidGthaG5nIiwiYSI6ImNqOTU3aWtnejRldGgycnF6d3JueG5wb2IifQ.vOYkEc5_mcoA2gtILL5ZmA';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [126.994, 37.518], // starting position [lng, lat]
  zoom: 11 // starting zoom
});

const bbox = [126.8, 37.4, 127.2, 37.7];
const cellSide = 1;
const options = {};
const hexGrid = turf.hexGrid(bbox, cellSide, options);

map.on('load', function() {



  map.addSource("seoulpoints",{
    type: "geojson",
    data: "./seoulhousingprice - Copy.geojson",
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50

  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: "seoulpoints",
    layout: {},
    paint: {'fill-color': '#088', 'fill-opacity': [1]}
  });


});
