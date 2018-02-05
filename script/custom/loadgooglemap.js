var markers = [];
var map;
var myCenter;
var requestCenter;
$(function() {
	$('#myModal').on('hide.bs.modal', function (e) {
		//location.reload();
    });
	$
			.ajax({
				type : "GET",
				url : "requests.json",
				dataType : "text"
			})
			.done(
					function(data) {
						google.maps.event
								.addDomListener(
										window,
										'load',
										function() {
											if (navigator.geolocation) {
												navigator.geolocation
														.getCurrentPosition(
																function(p) {
																	myCenter = new google.maps.LatLng(
																			p.coords.latitude,
																			p.coords.longitude);
																	loadRequestMarkers(
																			myCenter,
																			data);
																},
																function(error) {
																	$
																			.getJSON(
																					'https://geoip-db.com/json/geoip.php?jsonp=?')
																			.done(
																					function(
																							location) {
																						myCenter = new google.maps.LatLng(
																								location.latitude,
																								location.longitude);
																						loadRequestMarkers(
																								myCenter,
																								data);
																					});
																});
											}

										});
					});
});

function loadRequestMarkers(myCenter, data) {
	var mapProp = {
		center : myCenter,
		zoom : 15,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	var locationsArr = JSON.parse(data);
	//markers = new Array();
	for (var i = 0; i < locationsArr.length; i++) {
		var marker = new google.maps.Marker({
			position : new google.maps.LatLng(locationsArr[i][0],
					locationsArr[i][1]),
			map : map,
		});
		markers.push(marker);
		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(prepareMessageWindow());
				infowindow.open(map, marker);
			};
		})(marker, i));
		if(i==0){
			new google.maps.event.trigger( marker, 'click' );
		}
	}
	loadContextMenu();
}

function prepareMessageWindow(){
	return `<div><img src="images/avatar/48.jpg" class="img-responsive img-circle" style="float:left"/>&nbsp;<span`+
	`class="hidden-xs" style = "float:left"><h5><b>  Robert John</b></h5>  Need 4th player for tennis</span></div>`+
	`<a href="#"><font color="blue">Call</font></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color="blue">Chat</font>`;
}	

function deleteMarkers() {
    clearMarkers();
    markers = [];
};

//Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(sport) {
  setMapOnAll(null);
};

function updateMarkers(sport){
	clearMarkers(sport);
	$
	.ajax({
		type : "GET",
		url : "requests.json?sport="+sport,
		dataType : "text"
	})
	.done(function(data) {
		var locationsArr = JSON.parse(data);
		for (var i = 0; i < locationsArr.length; i++) {
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(locationsArr[i][0],
						locationsArr[i][1]),
				map : map,
			});
			markers.push(marker);
			var infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infowindow.setContent(prepareMessageWindow());
					infowindow.open(map, marker);
				};
			})(marker, i));
			if(i==0){
				new google.maps.event.trigger( marker, 'click' );
			}
		};
	});
};

function loadNewRequestMap(){
	resetNewRequestPageElement();
	
	requestCenter = myCenter;
	var mapProp = {
			center : myCenter,
			zoom : 15,
			draggable: true,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		var requestMap = new google.maps.Map(document.getElementById("requestMap"), mapProp);
		var marker = new google.maps.Marker({
				position : new google.maps.LatLng(myCenter.lat(),
						myCenter.lng()),
				draggable: true,						
				map : requestMap
			});
		google.maps.event.addListener(marker, 'dragend', function (evt) {
			requestCenter = evt.latLng;
		});
	map.checkResize();
};
