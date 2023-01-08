mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // 'streets-v12' is just a version
    center: [122.283970, 12.014066], // starting position [lng, lat]
    zoom: 5, // starting zoom
});

if(campgrounds && campgrounds.length === 1){ 
    // map.center = campgrounds[0].geolocation.coordinates; XX set the properties of the obj, not the ref
    // map.dragPan = false;

    map.setCenter(campgrounds[0].geolocation.coordinates);
    map.setZoom(8);
    map.dragPan.disable();

    const marker = new mapboxgl.Marker({ color: 'blue', scale:0.6});
    marker
        .setLngLat(campgrounds[0].geolocation.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(campgrounds[0].properties.popUpMarkup)) // add popup
        .addTo(map);

} else {
    for(let campground of campgrounds){
        const marker = new mapboxgl.Marker()
        .setLngLat(campground.geolocation.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(campground.properties.popUpMarkup))
        .addTo(map);
    }
}

