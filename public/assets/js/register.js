$(document).ready(function() {
	// Getting references to our form and input
	var uSignUpForm = $("form.signup-user");
	var cuSignUpForm = $("form.signup-charityuser");
	var cSignUpForm = $("form.signup-charity");

	//Reading inputs for registering a normal user
	var ufirstInput = $("input#u-firstName-input");
	var ulastInput = $("input#u-lastName-input");
	var uphoneInput = $("input#u-phoneNumber-input");
	var uemailInput = $("input#u-email-input");
	var upasswordInput = $("input#u-password-input");

	//Reading inputs for registering a charity user
	var cufirstInput = $("input#cu-firstName-input");
	var culastInput = $("input#cu-lastName-input");
	var cuphoneInput = $("input#cu-phoneNumber-input");
	var cuemailInput = $("input#cu-email-input");
	var cupasswordInput = $("input#cu-password-input");
	var uCharitykeyInput =  $("input#u-charitykey-input");

	//Reading inputs for registering a charity
	var cNameInput = $("input#charityName-input");
	var cPhoneInput = $("input#c-phoneNumber-input");
	var cEmailInput = $("input#c-email-input");
	var charitykeyInput = $("input#charitykey-input");
	var descriptionInput =  $("textarea#c-description-input");

	// When the signup button is clicked, we validate the email and password are not blank
  	uSignUpForm.on("submit", function(event) {
    	event.preventDefault();
    	var userData = {
			firstName: ufirstInput.val().trim(),
			lastName: ulastInput.val().trim(),
			phoneNumber: uphoneInput.val().trim(),
			email: uemailInput.val().trim(),
			password: upasswordInput.val().trim(),
			charityKey: null
    	};
		if (!userData.firstName || !userData.lastName || !userData.phoneNumber || !userData.email || !userData.password) {
			return;
		}
		// If we have an email and password, run the signUpUser function
		signUpUser(userData.firstName, userData.lastName, userData.phoneNumber, userData.email, userData.password, userData.charityKey);
		ufirstInput.val("");
		ulastInput.val("");
		uphoneInput.val("");
		uemailInput.val("");
		upasswordInput.val("");
  	});
  
  	// charity user registration submit button is clicked
  	cuSignUpForm.on("submit", function(event) {
    	event.preventDefault();
    	$.get("/api/charity").then(function(data) {
      		var isKeyValid = false;
      		var charityKey = uCharitykeyInput.val().trim();
        	for(var i=0; i<data.length; i++) {
            	if(data[i].charityKey === charityKey) {
              		isKeyValid = true;
              		break;
            	}
        	}
        	if(!isKeyValid) {
          		$(".verifyKeyMsg").text("Invalid charity key");
          		return;
        	}
        	var userData = {
				firstName: cufirstInput.val().trim(),
				lastName: culastInput.val().trim(),
				phoneNumber: cuphoneInput.val().trim(),
				email: cuemailInput.val().trim(),
				password: cupasswordInput.val().trim(),
				charityKey: uCharitykeyInput.val().trim()
        	};
        	if (!userData.firstName || !userData.lastName || !userData.phoneNumber || !userData.email || !userData.password || !userData.charityKey) {
          		return;
        	}
        	// If we have all required data, run the signUpUser function
        	signUpUser(userData.firstName, userData.lastName, userData.phoneNumber, userData.email, userData.password, userData.charityKey);
    	});
  	});

  	// charity registration submit button is clicked
  	cSignUpForm.on("submit", function(event) {
    	event.preventDefault();
    	var userData = {
      		name: cNameInput.val().trim(),
      		phoneNumber: cPhoneInput.val().trim(),
      		email: cEmailInput.val().trim(),
      		charityKey: charitykeyInput.val().trim(),
      		description: descriptionInput.val()
    	};
    	if (!userData.name || !userData.phoneNumber || !userData.email || !userData.charityKey || !userData.description) {
      		return;
    	}
		// If we have an email and password, run the signUpUser function
		registerCharity(userData.name, userData.phoneNumber, userData.email, userData.charityKey, userData.description);
  	});

	// Does a post to the signup route. If successful, we are redirected to the user's home page
	// Otherwise we log any errors
	function signUpUser(firstName, lastName, phoneNumber, email, password, charityKey) {
		var data = {
			firstName: firstName,
			lastName: lastName,
			phoneNumber: phoneNumber,
			email: email,
			password: password,
			charityKey: charityKey
		};
    	console.log(data);
    	$.post("/api/register", data).then(function(data) {
        	window.location.replace("/login");
    	}) // If there's an error, handle it by throwing up a bootstrap alert
    	.catch(handleLoginErr);     
  	}

  	function registerCharity(name, phoneNumber, email, charityKey, description) {
    	var data = {
			name: name,
			phoneNumber: phoneNumber,
			email: email,
			charityKey: charityKey,
			description: description
    	};
    	console.log(data);
    	$.post("/api/registerCharity", data).then(function(data) {
        	window.location.replace("/register");
    	}) // If there's an error, handle it by throwing up a bootstrap alert
    	.catch(handleLoginErr); 
  	}

  	function handleLoginErr(err) {
    	$("#alert .msg").text(err.responseJSON);
    	$("#alert").fadeIn(500);
  	}
});

var charityUser;

function updateUser() {
  	switch(document.getElementById("userType").selectedIndex) {
    	case 0:
			$("#uRegistration").addClass("is-hidden");
			$("#cuRegistration").addClass("is-hidden");
			$("#cRegistration").addClass("is-hidden");
			break;
    	case 1:
			// Register normal user
			$("#uRegistration").removeClass("is-hidden");
			$("#cuRegistration").addClass("is-hidden");
			$("#cRegistration").addClass("is-hidden");
			break;
    	case 2:
			// Register user belonging to a registered charity
			$("#cuRegistration").removeClass("is-hidden");
			$("#uRegistration").addClass("is-hidden");
			$("#cRegistration").addClass("is-hidden");
			break;
    	case 3:
			// Register new charity
			$("#cuRegistration").addClass("is-hidden");
			$("#uRegistration").addClass("is-hidden");
			$("#cRegistration").removeClass("is-hidden");
			break;
		default: 
			break;
  	}
}