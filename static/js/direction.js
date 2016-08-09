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

function initMap() {
	var mapCenter = {lat: -6.345078, lng: 106.750824};
	var mapOptions = {
		zoom: 11,
		center: mapCenter
	}
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	storeInfo.map(function(store) {
		drawMarker(map, store);
	});

	var directionsDisplay = new google.maps.DirectionsRenderer();
	document.getElementById("search").addEventListener("click", function() {
		calcRoute(map, directionsDisplay);
	});

	google.maps.event.addListener(map, "click", function(event) {
		placeMarker(map, event.latLng);
	});
}


// 클릭한 곳에 마커 추가
function placeMarker(map, location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		title: "클릭 추가"
	});

	extractAddress(marker, location);
}

// 추가한 마커 클릭 시 주소 노출
function attachMessage(marker, latlng) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				var address_nm = results[0].formatted_address;
				var infowindow = new google.maps.InfoWindow({
					content: address_nm,
					size: new google.maps.Size(50,50)
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map, marker);
				});
			}
		} else {
			alert('주소 가져오기 오류!');
		}
	});
}

// 지도 클릭 시 인풋창 주소값 넣기
function extractAddress(marker, latlng) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				var address_nm = results[0].formatted_address;
				$start = $("#start");
				$end = $("#end");
				if ($start.val() === "") {
					$start.val(address_nm);

				} else {
					$end.val(address_nm);
				}
			}
		} else {
			alert('주소 가져오기 오류!');
		}
	});
}

function drawMarker(map, store) {
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
		map.setZoom(18);
		infoWindow.open(map, marker);
	}

	marker.addListener("click", markerClickEvent);
	$("[data-name='" + store.title + "']").on("click", markerClickEvent);
}

function calcRoute(map, directionsDisplay) {
	directionsDisplay.setMap(map)
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));


	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;
	var mode = document.getElementById("transit").value;

	var request = {
		origin:start,
		destination:end,
		travelMode: mode
	};

	var directionsService = new google.maps.DirectionsService();
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);

		} else {
			if (status === "ZERO_RESULTS") {
				alert("결과값이 없습니다.");
			} else {
				alert(status);
			}
			console.log("===== directionStatus isn`t OK =====");
			console.log(result);
			console.log(status);
		}
	});
}
