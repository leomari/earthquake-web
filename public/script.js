mapboxgl.accessToken = 'pk.eyJ1IjoiZW5kcmVocCIsImEiOiJjamRsNmlvZjYwM3RqMnhwOGRneDhhc2ZkIn0.wVZHznNCtC5_gJAnLC2EJQ';

var v = []
var i = 0;
var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-98.2022, 16.6855], // initial map center in [lon, lat]
  zoom: 5.5
});

map.on('load', function() {
    map.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: './map_all4_public.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-radius':
             
          [
            'interpolate',
          ['linear'],
          ['number', ['get', 'S_Gal']],
        0, 4,
        5, 8,
        10, 16,
        50, 20,
        100, 25
        ],
        
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'S_Gal']],
          0, '#000000',
          5, '#b8ecff',
          10,'#05bcff',
          15,'#2fff05',
          25,'#ffd505',
          50,'#ff9f05',
          75,'#ff6d05',
          100,'#ff0505',
          150,'#C70000'
            
          
        ],
        
        'circle-opacity': [
			'interpolate', 
			['linear'],
			['number', ['get', 'S_Gal']],
			0, 0.0, 
			5, 0.8
		]
      }
    }, 'admin-2-boundaries-dispute');
    

document.getElementById('slider').addEventListener('input', function(e) {
  var Time = parseInt(e.target.value);
  // update the map
  updateLayer(Time)  
});


document.querySelector('.btn-pause').addEventListener('click', function() 
    {for (var j = 0; j < v.length; j++){
          clearTimeout(v[j])}});

document.querySelector('.btn-reset').addEventListener('click', function() 
    {i = 0;
    document.getElementById('slider').value=i;
    var Time = i;
    updateLayer(Time);
    });

    
document.querySelector('.btn-new').addEventListener('click',function() {


v = []
for (var j=0; j < 700; j++) {
    
    v.push(setTimeout( function () {
        
        document.getElementById('slider').value=i;
        var Time = i;
        
        i++;
        updateLayer(Time) }, j*100));
    }

});
    
});



function updateLayer(Time) {
    map.setFilter('collisions', ['==', ['number', ['get', 'Time']], Time]);
    
    
    
    document.getElementById('active-hour').innerText = Time;
    
}

