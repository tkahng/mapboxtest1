mapboxgl.accessToken = 'pk.eyJ1IjoidGthaG5nIiwiYSI6ImNqOTU3aWtnejRldGgycnF6d3JueG5wb2IifQ.vOYkEc5_mcoA2gtILL5ZmA';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/tkahng/cjvi9mbok047b1codknhyc2xu', // stylesheet location
  center: [126.994, 37.518], // starting position [lng, lat]
  zoom: 11 // starting zoom
});

var bbox = [126.8,37.4,127,37.6];
var cellSide = 20;
var options = {};
var hexgrid = turf.hexGrid(bbox, cellSide, options);

map.on('load', function() {

  map.addSource('seoulhexgrid',{
    "type": "geojson",
    "data": hexgrid
  })

  map.addLayer({
    id: 'maine',
    type: 'fill',
    source: {
      type: 'geojson',
      data: seoulhexgrid
    },
    layout: {},
    paint: {'fill-color': '#088', 'fill-opacity': [1]}
  });
});
