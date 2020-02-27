$(document).ready(function() {
    // Getting references to our form and inputs
    var loginForm = $("form.login");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var charityInput = $("input#charityKey-input");

    // When the form is submitted, we validate there's an email and password entered
    loginForm.on("submit", function(event) {
      	event.preventDefault();
      	$.get("/api/user").then(function(data) {
        	var charity = charityInput.val();
        	var pass = data.find(element => element.email == emailInput.val());
        	if(pass) {
          		// entered email ID is found in database
          		if(charity.length>0) { 
            		if(charity == pass.charityKey && emailInput.val() == pass.email) {
              			// Entered charity key matches with the charity key of user in database
              			var userData = {
                			email: emailInput.val().trim(),
                			password: passwordInput.val().trim(),
                			charityKey: charity
              			};
            		}	
            		else {
						// Entered charity key does not match with the charity key of user in database
						emailInput.val("");
						passwordInput.val("");
						charityInput.val("");
						$("#errorMsg").text("Invalid credentials! Try again!");
						return;
            		}
          		}
          		else {
            		// The user record in database does not have a charity key or a charity key was not entered so it is a regular user
            		userData = {
              			email: emailInput.val().trim(),
              			password: passwordInput.val().trim(),
            		};
          		}
        	}
        	else {
          		// entered email ID is not found in database
          		emailInput.val("");
         		passwordInput.val("");
          		charityInput.val("");
          		$("#errorMsg").text("Username does not exist!");
          		return;
        	}
        	if (!userData.email || !userData.password) {
          		return;
        	}
        	// If we have an email and password we run the loginUser function and clear the form
        	loginUser(userData.email, userData.password, userData.charityKey);
      	});
    });
  
    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(email, password, charityKey) {
      	$.post("/api/login", {
        	email: email,
        	password: password,
        	charityKey: charityKey
      	})
      	.then(function() {
          	window.location.replace("/user");
      	})// If there's an error, log the error
      	.catch(function(err) {
          	console.log(err);
      	});
    }
});