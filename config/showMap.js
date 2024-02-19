mapboxgl.accessToken = mapBoxToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/mapbox/dark-v10',
    center: JSON.parse(campgroundPoints),// starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({
    color: "#FFFFFF",
    draggable: true
    }).setLngLat(JSON.parse(campgroundPoints))
    .addTo(map);

const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(JSON.parse(campgroundPoints))
    .setHTML(`<h5>${JSON.parse(campgroundName)}<h5>`)
    .addTo(map);

