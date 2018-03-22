mapboxgl.accessToken = 'pk.eyJ1IjoiZW5kcmVocCIsImEiOiJjamRsNmlvZjYwM3RqMnhwOGRneDhhc2ZkIn0.wVZHznNCtC5_gJAnLC2EJQ';


var select;
//var select2;
window.onload = function () {
    select = document.getElementById('dropdown');
    for(var i = 0; i< availableEarthquakes.length ; i++) {
        var option = document.createElement('option');
        option.text = option.value = availableEarthquakes[i];
        select.add(option, 0);
    }
    
    select2 = document.getElementById('dropdown2');
    for(var i = 0; i < modes.length ; i++) {
        var option = document.createElement('option');
        option.text = option.value = modes[i];
        select2.add(option, 0);
    }
}


function changeHiddenInput(objDropDown) {
    //console.log(objDropDown);
    var objHidden = document.getElementById("hiddenInput");
    objHidden.value = objDropDown.value;
    var a = objHidden.value;
    //result.innerHTML = a || "";
    earthquakeDate = a;
    //url = mode + '_' + earthquakeDate;
    //add_data()
}


function changeHiddenInput2(objDropDown) {
    //console.log(objDropDown);
    var objHidden = document.getElementById("hiddenInput2");
    objHidden.value = objDropDown.value;
    var a = objHidden.value;
    mode= a;
}

var availableEarthquakes = ['02-17-2018', '02-16-2018', '02-19-2018', '09-07-2017', '09-19-2017'];
var modes = ['public', 'private']

var earthquakeDate = '02-16-2018';
var mode = 'public';
var l = 0;
var v =[];
var i;
var Time;
var url = mode + '_' + earthquakeDate;
var play = false;


var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-98.2022, 16.6855], // initial map center in [lon, lat]
  zoom: 5.5
});



map.on('load', function() {
    
    
    document.querySelector('.new-data').addEventListener('click', function () {
    
    if (l > 0) {
    map.removeLayer('earthquake' + l);
    map.removeLayer('act' + l)
    
    }
        
    l += 1
    url = mode + '_' + earthquakeDate;
    document.getElementById('date').textContent = earthquakeDate; 
    add_data()
    
    });
    
    
document.getElementById('slider').addEventListener('input', function(e) {
  Time = parseInt(e.target.value);
    i = Time;
  // update the map
  updateLayer(Time)  
});


document.querySelector('.btn-pause').addEventListener('click', function() { 
    if (l > 0) {
        pause();}});

document.querySelector('.btn-reset').addEventListener('click', function() {
    if (l > 0) {
    reset();}});

document.querySelector('.btn-new').addEventListener('click', function() {
    if (l > 0){
    play_b();}});

});

function add_data() {
    

 v = [];
 i = 0;
 Time = 0;
    map.addLayer({
      id: 'earthquake' + l,
      type: 'circle',
      source: {
        type: 'geojson',
        data: './' + url + '.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-radius':
             
          [
            'interpolate',
          ['linear'],
          ['number', ['get', 'S_Gal']],
        0, 6,
        5, 16,
        10, 20,
        50, 25,
        100, 30
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
        
        'circle-opacity': 0.8
      }
    }, 'admin-2-boundaries-dispute');
    

if (mode == 'private') {
    private_version();
}
reset();
};


function updateLayer(Time) {
    map.setFilter('earthquake'+ l, ['==', ['number', ['get', 'Time']], Time]);
    if (mode == 'private'){
    map.setFilter('act' + l, ['==', ['number', ['get', 'Time']], Time]);
    }
        
    document.getElementById('active-hour').innerText = Time;
    
};

function play_b() {

if (play == false) {
v = [];
//document.querySelector('.btn-new').classList.remove();
    //document.querySelector('.player-1-panel').classList.remove('active');

for (var j=0; j < 700; j++) {
    
    v.push(setTimeout( function () {
        
        document.getElementById('slider').value=i;
        Time = i;
        
        i++;
        updateLayer(Time) }, j*100));
    }
    play = true;
}
    
};

function reset() { 
    if (v.length > 0){
        pause();
    }
    
    i = 0;
    document.getElementById('slider').value=i;
    Time = i;
    updateLayer(Time);
};

function pause() { 
    for (var j = 0; j < v.length; j++){
          clearTimeout(v[j])}
    play = false;
    };


function private_version() {
    map.addLayer({
      id: 'act' + l,
      type: 'circle',
      source: {
        type: 'geojson',
        data: './' + url + '.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-radius': 6,
          
        'circle-color': ["step",
            ['number', ['get', 'MdAct']] ,
            '#000000',
            0,'#000000',
            1, '#2fff05'
            
        ]
            
          
        ,
        'circle-opacity': 0.8
      }
    }, 'admin-2-boundaries-dispute');



    
    map.on('click', 'earthquake' + l, function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.Description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });
    
};

