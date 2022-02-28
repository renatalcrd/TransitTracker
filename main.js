/* 
    
    Assigment 3C - PROG4700
    Student: Renata Dantas - w0438289
    Date: February 28th 2022

*/
// IIFE
(() => {

    //create map in leaflet and tie it to the div called 'theMap'
    let map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);


    //Get data for the buses in Halifax

    const url = 'https://hrmbusapi.herokuapp.com/';
	
    const fetchWithRetry = (url) => {
        fetch(url)
            .then(response => response.json())
            .then(json => {
                const data = json.entity
                    .filter((item) => item.vehicle.trip.routeId >= 1 && 
                                        item.vehicle.trip.routeId <= 10 || 
                                        item.vehicle.trip.routeId == "6B" ||
                                        item.vehicle.trip.routeId == "6C" ||
                                        item.vehicle.trip.routeId == "7A" ||
                                        item.vehicle.trip.routeId == "7BA" ||
                                        item.vehicle.trip.routeId == "9A" ||
                                        item.vehicle.trip.routeId == "9B"
                                        ) 
                    .map(item_2 => ({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [item_2.vehicle.position.longitude, item_2.vehicle.position.latitude]
                        },
                        properties: {
                            route: item_2.vehicle.trip.routeId,
                            id: item_2.id,
                            startDate: item_2.vehicle.trip.startDate,
                            directionId: item_2.vehicle.trip.directionId,
                            bearing: item_2.vehicle.position.bearing,
                            tripId: item_2.vehicle.trip.tripId,
                            speed: String(item_2.vehicle.position.speed === undefined ? 0 : Math.round(item_2.vehicle.position.speed)),
                            vehicleId: item_2.vehicle.vehicle.id
                        } //closing properties
                    })); //closing map 

                var busIcon = L.icon({
                    iconUrl: 'bus.png',
                    iconSize: [20, 20]
                }); 
                busMarkers = data.map((item_3) => {
                    let busMarker = L.marker(
                        {
                            lon: item_3.geometry.coordinates[0],
                            lat: item_3.geometry.coordinates[1]
                        },
                        { icon: busIcon, rotationAngle: item_3.properties.bearing })
                        .bindPopup(
                            "ID: " + item_3.properties.id +
                            "<br/>Start Date: " + item_3.properties.startDate +
                            "<br/>Route: " + item_3.properties.route +
                            "<br/>Direction: " + item_3.properties.directionId +
                            "<br/>Vehicle ID: " + item_3.properties.vehicleId +
                            "<br/>Speed: " + item_3.properties.speed + ' km/h' +
                            "<br/>Bearing: " + item_3.properties.bearing + '&#176'
                        ).addTo(map);
                        return busMarker;
                });

                const removeMarkers = () => {
                        busMarkers.map(item => {
                         map.removeLayer(item)
                    });
                };

                setTimeout(()=> {
                removeMarkers();
                fetchWithRetry(url)}, 7000);

            }); //closing second then            
        }//closing fecthWithRetry

    fetchWithRetry(url);

})() //closing IIFE

