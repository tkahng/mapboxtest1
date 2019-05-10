mapboxgl.accessToken = 'pk.eyJ1IjoiYnBhY2h1Y2EiLCJhIjoiY2lxbGNwaXdmMDAweGZxbmg5OGx2YWo5aSJ9.zda7KLJF3TH84UU6OhW16w';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-90, 35],
    zoom: 5
});

const bbox = [-96,31,-84,40];
const cellSide = 50;
const options = {};
const hexGrid = turf.hexGrid(bbox, cellSide, options);
hexGrid.features.forEach(f => {
  f.properties = { density: Math.random() };
});

map.on('load', function () {

    map.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': hexGrid
        },
        'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': [
              "interpolate", ["linear"], ["get", "density"],
              0, 0.3,
              1, 1
            ]
        }
    });
});
