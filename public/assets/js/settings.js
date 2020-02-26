var nameInput = $("input#charityName-input");
var phoneInput = $("input#phoneNumber-input");
var emailInput = $("input#email-input");
var descriptionInput =  $("textarea#description-input");

$(document).on("click", ".delete-charity", handleDelete);

// prefills the form with the current charity values, fields cannot be empty when form submitted
$.get("/api/active").then(function(data) {
    nameInput.val(data.name);
    phoneInput.val(data.phoneNumber);
    emailInput.val(data.email);
    descriptionInput.val(data.description);
});

//on click function for donation creation (ajax post)
$(document).on('submit', '.updateInfo', function(event){
    event.preventDefault();
    var charityData = {
        name: nameInput.val().trim(),
        phoneNumber: phoneInput.val().trim(),
        email: emailInput.val().trim(),
        description: descriptionInput.val().trim()
    }

    console.log(charityData);

    //ajax call and if successful returns the user to charity settings
    updateCharity(charityData.name, charityData.phoneNumber, charityData.email, charityData.description);    
});

// ajax to update a charity
function updateCharity(name, phone, email, description) {
    $.ajax({
        url: "/api/charity",
        type: "PUT",
        data: {
            name: name,
            phoneNumber: phone,
            email: email,
            description: description
        }
    })
    .then(function() {
        window.location.replace("/charity");
    }) // If there's an error, log the error
    .catch(function(err) {
        console.log(err);
    });
}

// Function for handling what happens when the delete button is pressed
//first ajax to remove all charity keys from users associated with charity
//second delete charity and linked all events 
function handleDelete() {
    $.ajax({
        method: "PUT",
        url: "/api/userkeys",
        data: null,
    })
    .then(
        $.ajax({
            method: "DELETE",
            url: "/api/charity/:id"
        })
        .then(window.location.replace("/logout"))
    );
}