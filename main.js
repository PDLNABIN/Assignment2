var map = L.map('map').setView([27.611565, 85.231399], 7);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch("data/students.geojson").then(response=>{
   return response.json();
}).then(data=>{
    data.features.forEach(feature => {
        
        let studentCooordinates= feature.geometry.coordinates;
        let lat = studentCooordinates[1];
        let long= studentCooordinates[0];
        let studentHouse = L.marker([lat,long]).addTo(map);
    });
})
    
