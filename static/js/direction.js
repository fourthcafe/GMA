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
	},
	{
		position: {
			lat: 37.4022778,
			lng: 127.1108385
		},
		title: "My Postion",
		content: "My Postion"
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

	// document.getElementById("currentPlace").addEventListener("click", currentPlace);

	// google.maps.event.addListener(map, "click", function(event) {
	map.addListener("click", function(event) {
		placeMarker(map, event.latLng);
	});
}

// 현재 위치 가져오기. 정상적 웹서비스에서만 작동 가능한 것 같음
function currentPlace() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position.coords.latitude);
			console.log(position.coords.longitude);
		});
	} else {
		alert("Can`t use geolocation");
	}
}


// 클릭한 곳에 마커 추가
function placeMarker(map, location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		title: "오른 클릭 시 닫기",
		icon: "http://i1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
		draggable: true
	});

	extractAddress(marker, location);
}

// 지도 클릭 시 인풋창 주소값 넣기
function extractAddress(marker, latlng) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				var address_nm = results[0].formatted_address;
				var infoWindow = new google.maps.InfoWindow({
					content: address_nm,
					size: new google.maps.Size(50,50)
				});

				marker.addListener('click', function() {
					infoWindow.open(map, marker);
				});

				marker.addListener("dragstart", function() {
					console.log("dragstart");
					infoWindow.close();
				});

				marker.addListener("rightclick", function() {
					marker.setMap(null);
				});

				console.log("extractAddress: " + address_nm);

				marker.addListener("dragend", function(event) {
					console.log("dragend");
					dragMarker(marker, infoWindow, event.latLng);
				});
			}
		} else {
			alert('주소 가져오기 오류!');
		}
	});
}

function dragMarker(marker, infoWindow, latlng) {
	console.log("call dragMarker");

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				var address_nm = results[0].formatted_address;
				infoWindow.setContent(address_nm);

				console.log("dragMarker: " + address_nm);

				marker.addListener("dragend", function(event) {
					dragMarker(marker, event.latLng);
				});
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
		map.setZoom(10);
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
