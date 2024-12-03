var map = L.map('map').setView([27.611565, 85.231399], 7);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var personIcon = myIcon = L.icon({
    iconUrl: 'data/person.png',
    iconSize: [38, 35]})

var myMarkerGroup= L.layerGroup();

fetch("data/students.geojson").then(response=>{
   return response.json();
}).then(data=>{
    data.features.forEach(feature => {
        
        let studentCooordinates= feature.geometry.coordinates;
        let lat = studentCooordinates[ 1];
        let long= studentCooordinates[0];
        let studentHouse = L.marker([lat,long],{icon: myIcon})
        myMarkerGroup.addLayer(studentHouse);
        map.on("click", function(ev){
            
        })
    });
})

var districts = L.layerGroup();

    
 fetch("data/districts.geojson")
                .then(response =>{return response.json()})
                .then(data=> { let district= L.geoJSON(data);
                    districts.addLayer(district);

                });
var muniLayer = L.layerGroup();

fetch("data/municipality.geojson")
            .then(response =>{return response.json()})
            .then(data=> { let minicipalities= L.geoJSON(data);
                muniLayer.addLayer(minicipalities);

});
var provincesLayer = L.layerGroup();

fetch("data/provinces.geojson")
            .then(response =>{return response.json()})
            .then(data=> { let province= L.geoJSON(data);
                provincesLayer.addLayer(province);

});
var nepalLayer = L.layerGroup();

fetch("data/wholeNepal.geojson")
            .then(response =>{return response.json()})
            .then(data=> { nepal= L.geoJSON(data);
                nepalLayer.addLayer(nepal);
                

});


var baseLayers= {"OSM":osm }
var overLays = {"Students":myMarkerGroup, "Country":nepalLayer,"Provinces":provincesLayer,"Municipalities":muniLayer, "Districts":districts };


L.control.layers(baseLayers, overLays).addTo(map);








