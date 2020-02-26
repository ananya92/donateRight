async function initMap() {
    var myLocation;
    var zoom;
    
    await getPosition()
    .then((position) => {
        myLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
        zoom = 10;
        // can add zoom later
        // sets lat&lng incase the user doesn't move the marker
        window.latInput = position.coords.latitude;
        window.lngInput = position.coords.longitude;
    })
    .catch((err) => {
        console.error(err.message);
        myLocation = {lat: -25.363, lng: 131.044};
        zoom = 4;
    });
    
    // console.log(myLocation);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: myLocation
    });

    var contentString = '<form class="donation">'+
            '<div class="form-group field">'+
            '<label class="label" for="Description">Description</label>'+
            '<textarea type="text" class="form-control textarea is-primary is-small" rows="4" id="description-input" placeholder="Eg. Blankets, books..."></textarea>'+
            '</div>'+
            '<div class="form-group field">'+
            '<label class="label" for="categories">Category</label>'+
            '<div class="control is-expanded">'+
            '<div class="select is-small">'+
            '<select id="categories" value="category"> <!--Drop down to what category the items are in-->'+
                '<option>Food</option>'+
                '<option>Clothes</option>'+
                '<option>Books</option>'+
                '<option>Homeware</option>'+
                '<option>Help</option>'+
            '</select>'+
            '</div>'+
            '</div>'+
            '</div>'+ //add another drop down for updating status, can be set 'available' as default
             //can also add another drop down to determine who can see it (add a model column to filter)
            '<button type="submit" class="donationCreation button is-primary">Create Donation</button>'+
        '</form>';

    var infowindow1 = new google.maps.InfoWindow({
        content: contentString
    });

    var infowindow2 = new google.maps.InfoWindow({
        content: "<p>Click to post new donation!</p>"
    });
  
    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        draggable: true,
        title: 'Donation location'
    });
    // Show default message to user to indicate how to post a new donation
    infowindow2.open(map, marker);

    marker.addListener('click', function() {
        infowindow2.close();
        infowindow1.open(map, marker);
    });

    //get marker position if user moves it
    google.maps.event.addListener(marker, 'dragend', function (evt) {
        window.latInput = evt.latLng.lat();
        window.lngInput = evt.latLng.lng();
    });
}

function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

//on click function for donation creation (ajax post)
$(document).on('submit', '.donation', function(event){
    var descriptionInput = $("textarea#description-input");

    event.preventDefault();
    var donationData = {
        description: descriptionInput.val().trim(),
        category: $("#categories").val(),
        lat: latInput,
        lng: lngInput
    }

    if(!donationData.description) {
        return;
    }

    console.log(donationData);

    //ajax call and if successful returns the user to home page
    createDonation(donationData.description, donationData.category, donationData.lat, donationData.lng); 
    createHistory(donationData.description, donationData.category);    
});
function createHistory(description, category) {
    $.post("/api/donationHistory", {
        description: description,
        category: category
    })
    .then(function() {
        console.log("redirecting place");
        window.location.replace("/user");    
    }) // If there's an error with ajax, log the error
    .catch(function(err) {
        console.log(err);
    })
}

function createDonation(description, category, lat, lng) {
    $.post("/api/donation", {
        description: description,
        category: category,
        lat: lat,
        lng: lng
    })
    .then(function() {
        console.log("success");
        window.location.replace("/user");   
    }) // If there's an error with ajax, log the error
    .catch(function(err) {
    console.log(err);
    });
}