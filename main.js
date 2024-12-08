var map = L.map('map').setView([27.611565, 85.231399], 7);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale({position:"topleft"}).addTo(map);



var personIcon = myIcon = L.icon({
    iconUrl: 'data/person.png',
    iconSize: [50, 50]})

var myMarkerGroup= L.layerGroup();

fetch("data/students.geojson").then(response=>{
   return response.json();
}).then(data=>{
    data.features.forEach(feature => {
        
        let studentCooordinates= feature.geometry.coordinates;
        let lat = studentCooordinates[ 1];
        let long= studentCooordinates[0];
        var studentHouse = L.marker([lat,long],{icon: myIcon})
        myMarkerGroup.addLayer(studentHouse);
        var studentName = feature.properties.Name;
        var rollNo= feature.properties["Roll.no"];
        var municipality= feature.properties.Municipality;

        var districtStudent= feature.properties.District;
        var studentPoup= `<div>
        <h4>Name:${studentName}</h4>
        <h4> Roll No:${rollNo}</h4>
        <h4>District:${districtStudent} </h4>
        <h4> Municipality:${municipality}</h4>

        </div>`

       


        //I later found the problem like if i close some poup and opened same popup it will not open again
        //to solve this issue we have to first  bind the popup and the display it using event function
        let studentPopup = studentHouse.bindPopup(studentPoup)

        studentHouse.on("click", function(ev){
            studentPopup.openPopup();
           
            
            
        })
    });
})

var districts = L.layerGroup();

    
 fetch("data/districts.geojson")
                .then(response =>{return response.json()})
                .then(data=> { let district= L.geoJSON(data,{onEachFeature:function(feature, layer){
                    layer.bindPopup(`${feature.properties.shapeName}`);

                    
                }});
                    districts.addLayer(district);



                });
var muniLayer = L.layerGroup();

fetch("data/municipality.geojson")
            .then(response =>{return response.json()})
            .then(data=> { let minicipalities= L.geoJSON(data, {onEachFeature:function(feature, layer){
                layer.bindPopup(`${feature.properties.GaPa_NaPa}`)
            }});
                muniLayer.addLayer(minicipalities);

});
var provincesLayer = L.layerGroup();

fetch("data/provinces.geojson")
            .then(response =>{return response.json()})
            .then(data=> { let province= L.geoJSON(data,{onEachFeature:function(feature, layer){
                layer.bindPopup(`${feature.properties.PR_NAME}`)
            }});
                provincesLayer.addLayer(province);

});
var nepalLayer = L.layerGroup();

fetch("data/wholeNepal.geojson")
            .then(response =>{return response.json()})
            .then(data=> { nepal= L.geoJSON(data);
                nepalLayer.addLayer(nepal);
                

});

var schoolIcon= L.icon({iconUrl: "data/school.png",
    iconSize:[30,30]


})
var schoolLayer = L.layerGroup();
var circleLayer = L.layerGroup();

fetch("data/school.geojson")
            .then(response =>{return response.json()})
            .then(data=> { 
                school= L.geoJSON(data);
                 data.features.forEach(function(schools){
                    let lat = schools.geometry.coordinates[1];
                    let lng = schools.geometry.coordinates[0];
                    let schoolName=schools.properties.name;
                    let schoolType=schools.properties.amenity;

                    L.marker([lat, lng],{icon:schoolIcon}).bindPopup(` <strong>School:</strong>${schoolName}<br>
                       <strong>Type:</strong> ${schoolType} `). addTo(schoolLayer)

                })

                




                
});





// api for weather
var weatherLayer= L.layerGroup();
map.on('click', function(ev) {
    if(map.hasLayer(weatherLayer)){
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${ev.latlng.lat}&lon=${ev.latlng.lng}&appid=16a2508dc0d12c0ec8438cd2681d164b`)
      .then(function(response) {
        
        const weatherPopup = `
        <div style="background: linear-gradient(135deg,#00feba,#5b548a);
          width :200px;
          
          color: white;
          padding: 10px;
          border-radius: 8px;
          text-align: center;">
          


            <h1 style="font-size: 30px; padding-buttom:5px; margin-buttom: 20px;">${(response.data.main.temp - 273).toFixed(0)}°C</h1>
            <h3 style= "padding:5px"> ${response.data.weather[0].main}</h4>


            <h2>${response.data.name}</h2>


            <div style="display: flex; justify-content: space-between; margin-top: 10px;">


                <div>
                    <img src="data/humidity.png" alt="Humidity" style="width: 25px;">
                    <p>${response.data.main.humidity}% Humidity</p>
                </div>


                <div>
                    <img src="data/wind.png" alt="Wind" style="width: 25px;">
                    <p>${response.data.wind.speed} km/h <b> Wind</p>
                </div>
            </div>
        </div>
    `;
    var myWeather=L.popup()
    .setLatLng(ev.latlng)
    .setContent(weatherPopup)
    .openOn(weatherLayer);

weatherLayer.addLayer(myWeather);
        
      })
      .catch(function(error) {

        // Handle errors
        console.log("Error Fetching Weather Data: ", error);
      })
      .finally(function() {
        console.log("Weather Displayed Successfully")
        
      });
    }





      
      
      

  });

  
var speciesLayer = L.layerGroup();
  axios.get("https://api.gbif.org/v1/occurrence/search?country=NP&format=geojson")
            .then(response => {
                const data = response.data.results;
               
                    data.forEach(item => {
                        const lat = item.decimalLatitude;
                        const lon = item.decimalLongitude;
                        const species = item.scientificName;
                        const image = item.media[0].identifier;

                        
                        
                    var speciesMarker = L.marker([lat, lon])
            
                    .bindPopup(`
                        <strong>Species:</strong> ${species}<br>
                        <strong>Location:</strong> ${item.verbatimLocality}<br>
                        <strong>Recorded By:</strong> ${item.recordedBy}<br>
                        <strong> Event Date: </strong> ${item.verbatimEventDate}<br>
                        <img src = ${image} style = "width:100px;height:auto;">
                                `);
                    speciesLayer.addLayer(speciesMarker);  
                    });
                    
                
            })
            .catch(error => {
                console.error('Error fetching GBIF data:', error);
            });

  


        
            
  
  





var baseLayers= {"OSM":osm }
var overLays = {"Students":myMarkerGroup, "Country":nepalLayer,"Provinces":provincesLayer,"Municipalities":muniLayer, "Districts":districts ,"School":schoolLayer, "weather":weatherLayer , "species": speciesLayer};


L.control.layers(baseLayers, overLays,{collapsed:false}).addTo(map);




//https://api.gbif.org/v1/occurrence/search?taxon_key=1802189 (tiger occurance)
//https://api.gbif.org/v1/occurrence/search?country=NP&year=2000,2020&taxon_key=212 for bird occurance
//https://api.inaturalist.org/v1/observations?nelat=30.4815&nelng=88.2033&swlat=26.3289&swlng=80.0556&per_page=200 






