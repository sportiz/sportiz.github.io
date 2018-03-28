var selectedSport;

function submitRequest() {
	var name = document.getElementById("name").value;
	var cellNumber = document.getElementById("mobilenumber").value;
	var note = document.getElementById("note").value;
	var emailId = $('#loginUser').text();
	
	if(name == "" || cellNumber =="" || note == "") {
		$("#loginErrorMsg").removeClass("hide");
	} else {
		var requestParam = {
				'name' : name,
				'mobileNubmer' : cellNumber,
				'message' : note,
				'sport' : selectedSport,
				'latitude' : requestCenter.lat(),
				'longitude' : requestCenter.lng(),
				'creatorEmailId' : emailId
		};

		$.ajax({
			type : "POST",
			url : "https://sportiz.herokuapp.com/requests/",
			data: requestParam,
			headers: {
				Authorization : authKey
			},
			dataType : "json"
		}).done(
				function(data) {
					var createdMarker = new google.maps.Marker({
						position : requestCenter,
						map : map,
						icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
					});
					markers.push(createdMarker);
					$("#myModal").modal('hide');
				}).fail(function(err) {
					$("#loginErrorMsg").removeClass("hide");
		});
	};

}

function resetNewRequestPageElement(){
	document.getElementById("name").value = null;
	document.getElementById("mobilenumber").value = null;
	document.getElementById("note").value = null;
	$("#loginErrorMsg").addClass("hide");
}
