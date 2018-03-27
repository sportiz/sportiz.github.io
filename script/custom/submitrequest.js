var selectedSport;

function submitRequest() {
	var name = document.getElementById("name").value;
	var cellNumber = document.getElementById("mobilenumber").value;
	var note = document.getElementById("note").value;

	if(name == "" || cellNumber =="" || note == "") {
		$("#loginErrorMsg").removeClass("hide");
	} else {
		var requestParam = {
				'name' : name,
				'mobileNubmer' : cellNumber,
				'message' : note,
				'sport' : selectedSport,
				'latitude' : requestCenter.lat(),
				'longitude' : requestCenter.lng()
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
					new google.maps.Marker({
						position : requestCenter,
						map : map,
						icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
					});
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
