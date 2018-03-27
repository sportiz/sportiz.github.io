var authKey;
var verifyCode;
var baseUrl = "https://sportiz.herokuapp.com/";

function handleUserAuthKey() {
	if (authKey) {
		$('#loginBtn').css('display', 'none');
		$('#postBtn').css('display', 'inline-block');
		$('#userDetails').css('display', 'inline-block');
	} else {
		$('#loginBtn').css('display', 'inline-block');
		$('#postBtn').css('display', 'none');
		$('#userDetails').css('display', 'none');
	}
}

handleUserAuthKey();

function addKeyListners() {
	authKey = null;
	$("#signup-email").focusout(
			function(e) {
				if (!validEmailId(e.target.value)) {
					$("#signuperrmsg").html("Please enter valid email id")
							.fadeIn().delay(1000).fadeOut("slow");
				}
			});

	$("#signupErrorMsg").addClass("hide");
	$('#signup-email').val(null);
	$('#signup-password').val(null);
	$('#signup-cpassword').val(null);
	$('#signup-verifycode').val(null);
	$('#signup-tnc').prop("checked", false);

	$('#login-username').val(null);
	$('#login-password').val(null);

	$('#signup-email').attr("disabled", false);
	$('#signup-password').attr("disabled", false);
	$('#cpassword-div').removeClass("hide");
	$('#verifycode-div').addClass("hide");
	$('#sendVerificationBtn').removeClass("hide");
	$('#signupBtn').addClass("hide");
	$('#signup-tnc-div').removeClass("hide");
}

function validEmailId(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function signupUser() {
	var emailId = $('#signup-email').val();
	var password = $('#signup-password').val();
	var providedVerificationCode = $('#signup-verifycode').val();

	if (providedVerificationCode == verifyCode) {
		var obj = new Object();
		obj.username = emailId;
		obj.password = password;
		$
				.ajax({
					type : "POST",
					url : baseUrl + "users/signup/",
					data : JSON.stringify(obj),
					contentType : "application/json; charset=utf-8",
					dataType : "json"
				})
				.done(function(data) {
					if (data.status == "SUCCESS") {
						login(emailId, password, "Account created successfully. But failed to login. Try again.");
					} else {
						$('#signupErrorMsg span').text(data.message);
						$("#signupErrorMsg").removeClass("hide");
						return;
					}
				}).fail(function(err) {
					$('#signupErrorMsg span').text(	"Not able to verify account. Please try after some time");
					$("#signupErrorMsg").removeClass("hide");
					return;
				});
	} else {
		$('#signupErrorMsg span').text("Verification code is not valid.");
		$("#signupErrorMsg").removeClass("hide");
		return;
	}
}

function verifyUser() {
	$("#signupErrorMsg").addClass("hide");

	var email = $('#signup-email').val();
	var password = $('#signup-password').val();
	var cpassword = $('#signup-cpassword').val();
	var isCheck = $('#signup-tnc').is(":checked");

	if (!validEmailId(email)) {
		$('#signupErrorMsg span').text("Please enter valid email id.");
		$("#signupErrorMsg").removeClass("hide");
		return;
	}

	if (!(password == cpassword)) {
		$('#signupErrorMsg span').text("Passwords are not matching.");
		$("#signupErrorMsg").removeClass("hide");
		return;
	}

	if (!isCheck) {
		$('#signupErrorMsg span').text(
				"Please read and select Term and Conditions");
		$("#signupErrorMsg").removeClass("hide");
		return;
	}

	$.ajax({
		type : "POST",
		url : baseUrl + "users/sendcode/",
		data : jQuery.param({
			emailId : email
		}),
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
	}).done(function(data) {
		if (data.status == "SUCCESS") {
			verifyCode = data.message;
			$('#signup-email').attr("disabled", true);
			$('#signup-password').attr("disabled", true);
			$('#cpassword-div').addClass("hide");
			$('#verifycode-div').removeClass("hide");
			$('#sendVerificationBtn').addClass("hide");
			$('#signupBtn').removeClass("hide");
			$('#signup-tnc-div').addClass("hide");
		} else {
			$('#signupErrorMsg span').text("Please try after sometime");
			$("#signupErrorMsg").removeClass("hide");
			return;
		}
	}).fail(function(err) {
		$('#signupErrorMsg span').text("Please try after sometime");
		$("#signupErrorMsg").removeClass("hide");
		return;
	});
}

function loginUser() {
	var emailId = $('#login-username').val();
	var password = $('#login-password').val();

	if (!validEmailId(emailId)) {
		$("#signupErrorMsg").removeClass("hide");
		return;
	}
	login(emailId, password, "Failed to login. Try again.");
}

function login(emailId, password, errmsg) {
	var obj = new Object();
	obj.username = emailId;
	obj.password = password;

	$.ajax({
		type : "POST",
		url : baseUrl + "login",
		data : JSON.stringify(obj),
		contentType : "application/json; charset=utf-8",
		dataType : "json"
	}).done(function(data, textStatus, xhr) {
		authKey = xhr.getResponseHeader('Authorization');
		$('#loginBtn').css('display', 'none');
		$('#postBtn').css('display', 'inline-block');
		$('#userDetails').css('display', 'inline-block');
		$('#loginUser').text(emailId);
		$("#loginModal").modal('hide');
	}).fail(function(err) {
		$("#loginModal").modal('hide');
		alert(errmsg);
	});
}

function signoutUser(){

	$.ajax({
		type : "POST",
		url : baseUrl + "logout"
	}).done(function(data) {
		authKey = null;
		$('#loginBtn').css('display', 'inline-block');
		$('#postBtn').css('display', 'none');
		$('#userDetails').css('display', 'none');
	}).fail(function(err) {
		authKey = null;
		$('#loginBtn').css('display', 'inline-block');
		$('#postBtn').css('display', 'none');
		$('#userDetails').css('display', 'none');
	});
}

function updatePassword(){
	$("#changePwdError").addClass("hide");

	var oldPassword = $('#oldPassword').val();
	var newPassword = $('#newPassword').val();
	var cnewPassword = $('#cnewPassword').val();

	if (oldPassword ==null) {
		$('#changePwdError span').text("Invalid Old Password");
		$("#changePwdError").removeClass("hide");
		return;
	}

	if (newPassword ==null) {
		$('#changePwdError span').text("Invalid New Password");
		$("#changePwdError").removeClass("hide");
		return;
	}
	
	if (!(newPassword == cnewPassword)) {
		$('#changePwdError span').text("New Password and Confirm Password not matching.");
		$("#changePwdError").removeClass("hide");
		return;
	}

	var emailId = $('#loginUser').text();
	
	var obj = new Object();
	obj.username = emailId;
	obj.password = newPassword;
	obj.oldPassword = oldPassword;
	$
			.ajax({
				type : "POST",
				url : baseUrl + "users/changepassword/",
				data : JSON.stringify(obj),
				contentType : "application/json; charset=utf-8",
				dataType : "json"
			})
			.done(function(data) {
				if (data.status == "SUCCESS") {
					alert("Password updated successfully.");
					$("#changePwdModal").modal('hide');
				} else {
					$('#changePwdError span').text(data.message);
					$("#changePwdError").removeClass("hide");
					return;
				}
			}).fail(function(err) {
				$('#changePwdError span').text("Not able to change password. Please try again.");
				$("#changePwdError").removeClass("hide");
				return;
			});
}