var storeInfo = [
	{
		position: {
			lat: -6.1114523,
			lng: 106.7423856
		},
		title: "Wooyoo",
		content: "위유"
	},
	{
		position: {
			lat: -6.5824936,
			lng: 106.7786711
		},
		title: "MM Cafe",
		content: "MM 카페"
	}
];

var map;
function initMap() {
	var mapCenter = {lat: -6.345078, lng: 106.750824};
	var mapOptions = {
		zoom: 11,
		center: mapCenter
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	storeInfo.map(function(store) {
		drawMarker(store);
	});
}


function drawMarker(store) {
	// 좌표
	var marker = new google.maps.Marker({
		position: store.position,
		map: map,
		title: store.title
	});
	// 마커
	var infoWindow = new google.maps.InfoWindow({
		content: store.content,
		maxWidth: "300"
	});

	// google.maps.event.addListener(marker, "click", function() {
	var markerClickEvent = function() {
		map.setCenter(store.position);
		map.setZoom(10);
		infoWindow.open(map, marker);
	}

	marker.addListener("click", markerClickEvent);
	$("[data-name='" + store.title + "']").on("click", markerClickEvent);
}
