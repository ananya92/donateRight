var firstNameInput = $("input#firstName-input");
var lastNameInput =  $("input#lastName-input");
var phoneInput = $("input#phoneNumber-input");
var emailInput = $("input#email-input");

$(document).on("click", ".delete-user", handleDelete);

$.get("/api/user/id").then(function(data) {
    console.log(data);
    firstNameInput.val(data.firstName);
    lastNameInput.val(data.lastName);
    phoneInput.val(data.phoneNumber);
    emailInput.val(data.email);
});

//on click function for donation creation (ajax post)
$(document).on('submit', '.updateInfo', function(event){
    event.preventDefault();
    var userData = {
        firstName: firstNameInput.val().trim(),
        lastName: lastNameInput.val().trim(),
        phoneNumber: phoneInput.val().trim(),
        email: emailInput.val().trim()
    }
    console.log(userData);
    //ajax call and if successful returns the user to user settings
    updateUser(userData.firstName, userData.lastName, userData.phoneNumber, userData.email);    
});

function updateUser(firstName, lastName, phone, email) {
    $.ajax({
        url: "/api/user",
        type: "PUT",
        data: {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            email: email
        }
    })
    .then(function() {
        window.location.replace("/user");
    }) // If there's an error, log the error
    .catch(function(err) {
        console.log(err);
    });
}

// Function for handling what happens when the delete button is pressed
function handleDelete() {
    $.ajax({
      	method: "DELETE",
      	url: "/api/user/:id"
    })
    .then(window.location.replace("/logout"));
}