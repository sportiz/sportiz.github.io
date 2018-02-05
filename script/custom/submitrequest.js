function submitRequest() {
	var name = document.getElementById("name").value;
	var cellNumber = document.getElementById("mobilenumber").value;
	var note = document.getElementById("note").value;

	$.ajax({
		type : "GET",
		url : "submitRequest?name="+name+"&cell="+cellNumber+"&note="+note+"&lat="+requestCenter.lat()+"&long="+requestCenter.lng(),
		dataType : "text"
	}).done(
			function(data) {
				new google.maps.Marker({
					position : requestCenter,
					map : map,
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
				});
			}).fail(function(err) {
				$("#loginErrorMsg").removeClass("hide");
	});

}

function resetNewRequestPageElement(){
	document.getElementById("name").value = null;
	document.getElementById("mobilenumber").value = null;
	document.getElementById("note").value = null;
	$("#loginErrorMsg").addClass("hide");
}