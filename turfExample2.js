mapboxgl.accessToken = 'pk.eyJ1IjoibXdpZGVuZXIiLCJhIjoibXBKQU85dyJ9.Q6yf1zk7wpnYqpsQfRwVmw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mwidener/cilkw1mzf001q9jkmn4212sdw',
  center: [126.994, 37.518],
  zoom: 11
});


//CREATE A BOUNDING BOX AROUND POINTS (ALSO USE FOR HEX GRID)
var enveloped = turf.envelope(seoulhousingprice); //send point geojson to turf, creates an 'envelope' (bounding box) around points
var result = {                                   //put the resulting envelope in a geojson format FeatureCollection
    "type": "FeatureCollection",
    "features": [enveloped]                      //don't forget brackets
};

//CREATE A HEX GRID
//must be in order: minX, minY, maxX, maxY ... you have to pick these out from your envelope that you created previously
var bbox = [enveloped.geometry.coordinates[0][0][0],enveloped.geometry.coordinates[0][0][1],enveloped.geometry.coordinates[0][2][0],enveloped.geometry.coordinates[0][2][1]];
var hexgridUnits = 'kilometers' //units that will determine the width of the hex grid
var cellWidth = 200 //in the units you defined above
var hexgrid = turf.hexGrid(bbox,cellWidth,hexgridUnits); //makes the new geojson hexgrid features

//COUNT THE NUMBER OF AIRPORTS IN EACH HEX BIN
var hexAirports = turf.count(hexgrid,seoulhousingprice,'airportCount');

//create jenks natural breaks - generates min, breaks, max ... remember for 5 categories, we only need 4 numbers
var numberBreaks = 6
var jenksbreaks = turf.jenks(hexAirports,'airportCount',numberBreaks);
var colors = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']
var transparency = [.3,0.5,0.5,0.5,0.5,0.5]

jenksbreaks.forEach(function(element,i){
    if (i > 0){
      jenksbreaks[i] = [element, colors[i-1],transparency[i-1]];
    }
    else{
      jenksbreaks[i] = [element, null];
    }
});


map.on('style.load', function(){
  map.addSource('airports',{
    "type": "geojson",
    "data": seoulhousingprice
  })
  map.addLayer({
      "id": "airportsLayer",
      "type": "circle",
      "source": "airports",
      "layout": {},
      "paint":{
        'circle-color': "black",
        'circle-radius': 1,
        'circle-opacity': 1
      }
  });

// //HEXGRID EXAMPLE
  map.addSource('airportHexGrid',{
    "type": "geojson",
    "data": hexAirports                    //this is the hexgrid we just created!
  });
  for(i = 0; i < jenksbreaks.length; i++){
    if (i > 0){
      map.addLayer({
        "id": "airportHexGrid-" + (i-1),
        "type": "fill",
        "source": "airportHexGrid",
        "layout": {},
        "paint":{
          'fill-color': jenksbreaks[i][1],
          'fill-opacity': jenksbreaks[i][2],
          }
      },"airports");
    };
  };

  jenksbreaks.forEach(function(jenksbreak, i){
    if (i > 0){
      var filters = ['all',['<=', 'airportCount', jenksbreak[0]]];
      if(i>1){
        filters.push(['>', 'airportCount', jenksbreaks[i - 1][0]]);
        map.setFilter('airportHexGrid-' + (i-1), filters);
      };
      console.log(filters);
    };
  });

});
